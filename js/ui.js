"use strict";

const GAMEPLAY_HINT_DURATION_MS = 3000;
const LEVEL_TITLE_DURATION_MS = 3000;

function showLevelTitle(scene, text) {
  levelTitleTimer?.remove(false);
  levelTitleTimer = null;
  if (worldTransitionOverlay) {
    scene.tweens.killTweensOf(worldTransitionOverlay);
    worldTransitionOverlay.destroy();
  }

  const title = scene.add.text(WIDTH / 2, 150, localizeText(text), {
    fontFamily: THEME.typography.display,
    fontSize: '30px',
    color: THEME.colors.ink,
    backgroundColor: THEME.colors.surfaceFaint,
    padding: { x: 18, y: 10 },
    align: 'center'
  })
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(THEME.depths.guidance)
    .setAlpha(reducedMotion ? 1 : 0);
  worldTransitionOverlay = title;

  if (!reducedMotion) {
    scene.tweens.add({
      targets: title,
      alpha: 1,
      duration: 250,
      ease: 'Sine.Out'
    });
  }
  levelTitleTimer = scene.time.delayedCall(LEVEL_TITLE_DURATION_MS, () => {
    levelTitleTimer = null;
    if (worldTransitionOverlay !== title) return;
    const destroyTitle = () => {
      title.destroy();
      if (worldTransitionOverlay === title) worldTransitionOverlay = null;
    };
    if (reducedMotion) destroyTitle();
    else scene.tweens.add({
      targets: title,
      alpha: 0,
      duration: 250,
      ease: 'Sine.In',
      onComplete: destroyTitle
    });
  });
  return title;
}

function showGameplayHint(scene, text, duration = GAMEPLAY_HINT_DURATION_MS) {
  gameplayHintTimer?.remove(false);
  gameplayHintTimer = null;
  gameplayHintBanner?.destroy(true);

  const banner = scene.add.container(WIDTH / 2, 104)
    .setDepth(THEME.depths.modal - 1)
    .setScrollFactor(0);
  const background = scene.add.graphics();
  background.fillStyle(THEME.gameplay.cloud, 0.96)
    .fillRoundedRect(-310, -30, 620, 60, 12);
  background.lineStyle(2, THEME.gameplay.ink, 0.82)
    .strokeRoundedRect(-309, -29, 618, 58, 11);
  const label = scene.add.text(0, 0, localizeText(text), {
    fontFamily: THEME.typography.display,
    fontSize: '17px',
    color: THEME.colors.ink,
    align: 'center',
    wordWrap: { width: 570 }
  }).setOrigin(0.5);
  banner.add([background, label]);
  gameplayHintBanner = banner;

  if (!reducedMotion) {
    banner.setAlpha(0).setY(94);
    scene.tweens.add({
      targets: banner,
      alpha: 1,
      y: 104,
      duration: 160,
      ease: 'Sine.Out'
    });
  }

  gameplayHintTimer = scene.time.delayedCall(duration, () => {
    gameplayHintTimer = null;
    if (gameplayHintBanner !== banner) return;
    const finish = () => {
      banner.destroy(true);
      if (gameplayHintBanner === banner) gameplayHintBanner = null;
    };
    if (reducedMotion) finish();
    else scene.tweens.add({
      targets: banner,
      alpha: 0,
      y: 94,
      duration: 220,
      ease: 'Sine.In',
      onComplete: finish
    });
  });
  return banner;
}

function createGameplayHintTrigger(scene, x, text, width = 260, y = HEIGHT / 2) {
  const zone = scene.add.zone(x, y, width, HEIGHT)
    .setOrigin(0.5);
  scene.physics.add.existing(zone, true);
  const collider = scene.physics.add.overlap(player, zone, () => {
    if (!zone.active || isDead || isCleared || storyDialogue) return;
    zone.body.enable = false;
    showGameplayHint(scene, text);
  });
  activeColliders.push(collider);
  gameplayHintZones.push(zone);
  return zone;
}

function createStoryDialogueTrigger(scene, x, lines, width = 220, id = 'story-trigger') {
  const zone = scene.add.zone(x, HEIGHT / 2, width, HEIGHT).setOrigin(0.5);
  scene.physics.add.existing(zone, true);
  const collider = scene.physics.add.overlap(player, zone, () => {
    if (!zone.active || isDead || isCleared || storyDialogue) return;
    zone.body.enable = false;
    showStoryDialogue(scene, lines, null, id);
  });
  activeColliders.push(collider);
  gameplayHintZones.push(zone);
  return zone;
}

function clearGameplayPresentation(scene) {
  levelTitleTimer?.remove(false);
  levelTitleTimer = null;
  gameplayHintTimer?.remove(false);
  gameplayHintTimer = null;
  if (gameplayHintBanner) {
    scene?.tweens?.killTweensOf(gameplayHintBanner);
    gameplayHintBanner.destroy(true);
    gameplayHintBanner = null;
  }
  gameplayHintZones.forEach((zone) => zone?.destroy());
  gameplayHintZones = [];
  closeStoryDialogue(scene, false);
}

function createDialoguePortraits(scene, layer) {
  const playerPlate = scene.add.graphics();
  playerPlate.fillStyle(THEME.gameplay.mint, 0.95).fillCircle(76, 448, 52);
  playerPlate.lineStyle(3, THEME.gameplay.ink, 0.9).strokeCircle(76, 448, 52);
  const playerPortrait = scene.add.sprite(76, 454, 'player', 0).setScale(2.05);

  const mudPlate = scene.add.graphics();
  mudPlate.fillStyle(THEME.gameplay.lavender, 0.95).fillCircle(884, 448, 52);
  mudPlate.lineStyle(3, THEME.gameplay.ink, 0.9).strokeCircle(884, 448, 52);
  const mudPortrait = createMudCompanionFigure(scene, 884, 466, 2.15, 'standing');
  layer.add([playerPlate, mudPlate, playerPortrait, mudPortrait]);
  return { playerPlate, playerPortrait, mudPlate, mudPortrait };
}

function showStoryDialogue(scene, lines, onComplete, id = 'story') {
  closeStoryDialogue(scene, false);
  const entries = lines.filter((line) => line?.text);
  if (entries.length === 0) {
    onComplete?.();
    return null;
  }

  player?.setVelocity(0).setAcceleration(0);
  const layer = scene.add.container(0, 0)
    .setDepth(THEME.depths.modal + 2)
    .setScrollFactor(0)
    .setAlpha(0)
    .setY(16);
  const shade = scene.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x121018, 0.2);
  const panel = scene.add.graphics();
  panel.fillStyle(THEME.gameplay.cloud, 0.98)
    .fillRoundedRect(142, 382, 676, 142, 14);
  panel.lineStyle(3, THEME.gameplay.ink, 0.95)
    .strokeRoundedRect(143, 383, 674, 140, 13);
  layer.add([shade, panel]);
  const portraits = createDialoguePortraits(scene, layer);
  const speaker = scene.add.text(174, 397, '', {
    fontFamily: THEME.typography.display,
    fontSize: '18px',
    color: THEME.colors.pink
  });
  const body = scene.add.text(174, 430, '', {
    fontFamily: THEME.typography.body,
    fontSize: '20px',
    color: THEME.colors.ink,
    wordWrap: { width: 612 },
    lineSpacing: 6
  });
  const continueLabel = scene.add.text(790, 500, textFor('dialogue.continue'), {
    fontFamily: THEME.typography.display,
    fontSize: '13px',
    color: THEME.colors.inkSoft
  }).setOrigin(1, 0.5);
  layer.add([speaker, body, continueLabel]);

  storyDialogue = {
    id,
    scene,
    layer,
    lines: entries,
    index: 0,
    onComplete,
    speaker,
    body,
    portraits,
    pointerHandler: null
  };
  updateTouchControlsVisibility?.();
  const renderLine = () => {
    const line = storyDialogue?.lines[storyDialogue.index];
    if (!line) return;
    const mudSpeaking = line.speaker === 'mud';
    storyDialogue.speaker.setText(localizeText(line.name) || textFor(mudSpeaking ? 'speaker.mud' : 'speaker.player'));
    storyDialogue.body.setText(localizeText(line.text));
    portraits.playerPlate.setAlpha(mudSpeaking ? 0.32 : 1);
    portraits.playerPortrait.setAlpha(mudSpeaking ? 0.38 : 1).setScale(mudSpeaking ? 1.85 : 2.05);
    portraits.mudPlate.setAlpha(mudSpeaking ? 1 : 0.32);
    portraits.mudPortrait.setAlpha(mudSpeaking ? 1 : 0.38).setScale(mudSpeaking ? 2.15 : 1.9);
  };
  storyDialogue.pointerHandler = () => {
    if (!storyDialogue || storyDialogue.id !== id) return;
    if (storyDialogue.index < storyDialogue.lines.length - 1) {
      storyDialogue.index += 1;
      renderLine();
      return;
    }
    const active = storyDialogue;
    active.scene?.input?.off('pointerdown', active.pointerHandler);
    scene.tweens.add({
      targets: active.layer,
      alpha: 0,
      y: 16,
      duration: reducedMotion ? 100 : 260,
      ease: 'Sine.In',
      onComplete: () => {
        if (storyDialogue === active) closeStoryDialogue(scene, true);
      }
    });
  };
  scene.input.on('pointerdown', storyDialogue.pointerHandler);
  renderLine();
  scene.tweens.add({
    targets: layer,
    alpha: 1,
    y: 0,
    duration: reducedMotion ? 100 : 260,
    ease: 'Sine.Out'
  });
  return layer;
}

function closeStoryDialogue(scene, complete = false, id = null) {
  if (!storyDialogue || (id && storyDialogue.id !== id)) return;
  const active = storyDialogue;
  storyDialogue = null;
  active.scene?.input?.off('pointerdown', active.pointerHandler);
  active.scene?.tweens?.killTweensOf(active.layer);
  active.layer?.destroy(true);
  if (complete) active.onComplete?.();
  updateTouchControlsVisibility?.();
}

function setEndingHudVisible(visible) {
  [
    hudGraphics, attemptsText, deathsText, controlsText, levelLabel
  ].forEach((object) => object?.setVisible(visible));
  hudProgressDots.forEach((dot) => dot?.setVisible(visible));
}

function drawEndingJourney(scene, track) {
  const worldWidth = WIDTH + ENDING_CINEMATIC_CONFIG.worldPanDistance;
  const world1 = drawBackdrop(scene, worldWidth, 1).setPosition(0, 0);
  const world2 = drawBackdrop(scene, worldWidth, 8).setPosition(worldWidth, 0);
  const world3 = drawBackdrop(scene, worldWidth, 14).setPosition(worldWidth * 2, 0);
  createWorld3GardenPresentation(scene, world3, worldWidth, '', false);

  const world2Style = THEME.worlds.world2;
  const farFog = scene.add.graphics();
  const nearFog = scene.add.graphics();
  farFog.fillStyle(world2Style.fog.blue, world2Style.fog.alphaFar);
  nearFog.fillStyle(world2Style.fog.white, world2Style.fog.alphaNear);
  for (let x = -180; x < worldWidth + 240; x += 310) {
    const farY = 170 + ((x / 310) % 3) * 28;
    farFog.fillRect(x, farY, 190, 34).fillRect(x + 38, farY - 20, 112, 20);
    const nearY = 286 + ((x / 310) % 2) * 42;
    nearFog.fillRect(x + 86, nearY, 240, 42).fillRect(x + 126, nearY - 24, 152, 24);
  }
  world2.add([farFog, nearFog]);

  const ambientTargets = [];
  if (!reducedMotion) {
    ambientTargets.push(farFog, nearFog);
    scene.tweens.add({
      targets: farFog,
      x: world2Style.fog.driftFar,
      duration: world2Style.fog.durationFarMs,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1
    });
    scene.tweens.add({
      targets: nearFog,
      x: -world2Style.fog.driftNear,
      duration: world2Style.fog.durationNearMs,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1
    });
  }

  track.add([world1, world2, world3]);
  const groundTop = 470;
  const groundHeight = HEIGHT - groundTop;
  const groundTextures = [
    'ground',
    THEME.worlds.world2.terrain.textureKey,
    THEME.worlds.world3.terrain.textureKey
  ];
  const groundLayers = groundTextures.map((textureKey, index) => (
    scene.add.tileSprite(
      index * worldWidth,
      groundTop,
      worldWidth,
      groundHeight,
      textureKey
    ).setOrigin(0, 0)
  ));
  track.add(groundLayers);

  const labels = ['世界一 · 焦糖原野', '世界二 · 棉花糖迷雾', '世界三 · 焦糖镜花园'].map((text, index) => (
    scene.add.text(index * worldWidth + worldWidth / 2, 62, localizeText(text), {
      fontFamily: THEME.typography.display,
      fontSize: '24px',
      color: THEME.colors.ink
    }).setOrigin(0.5).setAlpha(0.72)
  ));
  track.add(labels);
  track.setData('endingWorldWidth', worldWidth);
  track.setData('endingWorld3Targets', [world3, groundLayers[2], labels[2]]);
  track.setData('endingAmbientTargets', ambientTargets);
}

function destroyEndingCinematic(scene) {
  if (!endingCinematicState) return;
  const active = endingCinematicState;
  endingCinematicState = null;
  closeStoryDialogue(scene, false, 'ending-farewell');
  active.timers.forEach((timer) => timer?.remove(false));
  active.targets.forEach((target) => scene?.tweens?.killTweensOf(target));
  active.layer?.destroy(true);
  if (player?.active) player.setVisible(true);
  setEndingHudVisible(true);
  updateTouchControlsVisibility?.();
}

function beginEndingCinematic(scene, onComplete) {
  destroyEndingCinematic(scene);
  clearGameplayPresentation(scene);
  clearPanel.setVisible(false);
  hideClearActions();
  setEndingHudVisible(false);
  if (player?.active) player.setVisible(false).setVelocity(0).setAcceleration(0);

  const layer = scene.add.container(0, 0)
    .setDepth(THEME.depths.modal)
    .setScrollFactor(0)
    .setAlpha(0);
  const base = scene.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, THEME.levelBackdrops[14].sky);
  const track = scene.add.container(0, 0);
  drawEndingJourney(scene, track);
  const actor = scene.add.sprite(
    ENDING_CINEMATIC_CONFIG.playerX,
    ENDING_CINEMATIC_CONFIG.walkY,
    'player',
    0
  ).setOrigin(0.5, 1).setScale(1.18);
  const companion = createMudCompanionFigure(
    scene,
    ENDING_CINEMATIC_CONFIG.companionX,
    ENDING_CINEMATIC_CONFIG.companionY,
    1.12,
    'standing'
  );
  const actors = scene.add.container(0, 0);
  actors.add([companion, actor]);
  const endingTitle = scene.add.text(WIDTH / 2, 172, textFor('ending.title'), {
    fontFamily: THEME.typography.display,
    fontSize: '48px',
    color: THEME.colors.ink
  }).setOrigin(0.5).setAlpha(0);
  const endingThanks = scene.add.text(WIDTH / 2, 236, textFor('ending.thanks'), {
    fontFamily: THEME.typography.body,
    fontSize: '22px',
    color: THEME.colors.inkSoft
  }).setOrigin(0.5).setAlpha(0);
  layer.add([base, track, actors, endingTitle, endingThanks]);

  endingCinematicState = {
    layer,
    track,
    actors,
    actor,
    companion,
    endingTitle,
    endingThanks,
    timers: [],
    targets: [
      layer, track, actors, actor, companion, endingTitle, endingThanks,
      ...(track.getData('endingAmbientTargets') || [])
    ],
    onComplete
  };
  updateTouchControlsVisibility?.();

  const duration = (normal, reduced = 700) => reducedMotion ? reduced : normal;
  const playWalk = () => {
    if (scene.anims.exists('danzai-run')) {
      actor.play('danzai-run', true);
      actor.anims.timeScale = ENDING_CINEMATIC_CONFIG.actorAnimationSpeed;
    }
  };
  let actorTravelTween = null;
  let companionWalkTween = null;
  const pauseWalk = () => {
    actorTravelTween?.pause();
    companionWalkTween?.pause();
    actor.stop().setFrame(0);
    companion.setY(ENDING_CINEMATIC_CONFIG.companionY).setAngle(0);
  };
  const resumeWalk = () => {
    playWalk();
    actorTravelTween?.resume();
    companionWalkTween?.resume();
  };
  const queueEndingStep = (delayMs, callback, reducedDelayMs = 650) => {
    if (!endingCinematicState) return;
    const timer = scene.time.delayedCall(
      duration(delayMs, reducedDelayMs),
      callback
    );
    endingCinematicState.timers.push(timer);
  };
  const finish = () => {
    if (!endingCinematicState) return;
    pauseWalk();
    scene.tweens.add({
      targets: track.getData('endingWorld3Targets') || [],
      alpha: 0,
      duration: duration(700, 180),
      ease: 'Sine.Out'
    });
    scene.tweens.add({
      targets: [track, actors],
      y: '+=250',
      duration: duration(ENDING_CINEMATIC_CONFIG.cameraLiftMs, 500),
      ease: 'Sine.InOut'
    });
    scene.tweens.add({
      targets: [endingTitle, endingThanks],
      alpha: 1,
      duration: duration(900, 250),
      delay: duration(700, 100),
      ease: 'Sine.Out',
      onComplete: () => {
        if (!endingCinematicState) return;
        const timer = scene.time.delayedCall(
          reducedMotion ? 1200 : ENDING_CINEMATIC_CONFIG.endingHoldMs,
          () => endingCinematicState?.onComplete?.()
        );
        endingCinematicState.timers.push(timer);
      }
    });
  };
  let dialogueComplete = false;
  let backgroundComplete = false;
  const finishWhenReady = () => {
    if (!endingCinematicState || !dialogueComplete || !backgroundComplete) return;
    finish();
  };
  const continueJourney = () => {
    if (!endingCinematicState) return;
    resumeWalk();
    dialogueComplete = true;
    finishWhenReady();
  };
  const beginFarewell = () => {
    if (!endingCinematicState) return;
    pauseWalk();
    showStoryDialogue(
      scene,
      ENDING_CINEMATIC_CONFIG.dialogue,
      continueJourney,
      'ending-farewell'
    );
  };
  const worldWidth = track.getData('endingWorldWidth');
  const panDistance = ENDING_CINEMATIC_CONFIG.worldPanDistance;
  const panWorld3 = () => {
    if (!endingCinematicState) return;
    scene.tweens.add({
      targets: track,
      x: -worldWidth * 2 - panDistance,
      duration: duration(ENDING_CINEMATIC_CONFIG.worldPanMs, 1200),
      ease: 'Linear',
      onComplete: () => {
        backgroundComplete = true;
        finishWhenReady();
      }
    });
  };
  const slideToWorld3 = () => {
    if (!endingCinematicState) return;
    scene.tweens.add({
      targets: track,
      x: -worldWidth * 2,
      duration: duration(ENDING_CINEMATIC_CONFIG.worldSlideMs, 300),
      ease: 'Cubic.Out',
      onComplete: panWorld3
    });
  };
  const panWorld2 = () => {
    if (!endingCinematicState) return;
    scene.tweens.add({
      targets: track,
      x: -worldWidth - panDistance,
      duration: duration(ENDING_CINEMATIC_CONFIG.worldPanMs, 1200),
      ease: 'Linear',
      onComplete: slideToWorld3
    });
  };
  const slideToWorld2 = () => {
    if (!endingCinematicState) return;
    scene.tweens.add({
      targets: track,
      x: -worldWidth,
      duration: duration(ENDING_CINEMATIC_CONFIG.worldSlideMs, 300),
      ease: 'Cubic.Out',
      onComplete: () => {
        panWorld2();
        queueEndingStep(ENDING_CINEMATIC_CONFIG.dialogueLeadMs, beginFarewell, 500);
      }
    });
  };
  const panWorld1 = () => {
    if (!endingCinematicState) return;
    scene.tweens.add({
      targets: track,
      x: -panDistance,
      duration: duration(ENDING_CINEMATIC_CONFIG.worldPanMs, 1200),
      ease: 'Linear',
      onComplete: slideToWorld2
    });
  };
  playWalk();
  actorTravelTween = scene.tweens.add({
    targets: actors,
    x: ENDING_CINEMATIC_CONFIG.actorTravelDistance,
    duration: duration(ENDING_CINEMATIC_CONFIG.actorTravelMs, 4000),
    ease: 'Linear'
  });
  companionWalkTween = scene.tweens.add({
    targets: companion,
    y: ENDING_CINEMATIC_CONFIG.companionY - 4,
    angle: -2,
    duration: duration(ENDING_CINEMATIC_CONFIG.companionStepMs, 350),
    ease: 'Sine.InOut',
    yoyo: true,
    repeat: -1
  });
  scene.tweens.add({ targets: layer, alpha: 1, duration: duration(500, 150), ease: 'Linear' });
  panWorld1();
}

function createHud(scene) {
  hudGraphics = scene.add.graphics().setDepth(THEME.depths.hud).setScrollFactor(0);
  hudGraphics.fillStyle(THEME.gameplay.cloud);
  hudGraphics.fillRect(848, 14, 96, 50);
  hudGraphics.lineStyle(2, THEME.gameplay.ink);
  hudGraphics.strokeRect(849, 15, 94, 48);

  attemptsText = scene.add.text(34, 28, textFor('hud.attempt', { count: 1 }), {
    fontFamily: THEME.typography.display,
    fontSize: '18px',
    color: THEME.colors.ink
  }).setDepth(THEME.depths.hud + 1).setScrollFactor(0).setVisible(false);
  deathsText = scene.add.text(35, 55, textFor('hud.deaths', { count: 0 }), {
    fontFamily: THEME.typography.body,
    fontSize: '13px',
    color: THEME.colors.inkSoft
  }).setDepth(THEME.depths.hud + 1).setScrollFactor(0).setVisible(false);
  levelLabel = scene.add.text(922, 29, textFor('hud.level', { level: 1 }), {
    fontFamily: THEME.typography.display,
    fontSize: '16px',
    color: THEME.colors.ink
  }).setOrigin(1, 0).setDepth(THEME.depths.hud + 1).setScrollFactor(0);
  controlsText = scene.add.text(480, 29, textFor('hud.controls'), {
    fontFamily: THEME.typography.body,
    fontSize: '13px',
    color: THEME.colors.ink,
    backgroundColor: THEME.colors.surfaceFaint,
    padding: { x: 14, y: 8 }
  }).setOrigin(0.5, 0).setDepth(THEME.depths.hud + 1).setScrollFactor(0);

  hudProgressDots = [];
}

function updateHudLevel(level) {
  levelLabel.setText(textFor('hud.level', { level }));
  controlsText?.setVisible(level === 1);
}

function createClearPanel(scene) {
  const panel = scene.add.container(WIDTH / 2, HEIGHT / 2)
    .setDepth(THEME.depths.modal).setVisible(false).setScrollFactor(0);
  const bg = scene.add.graphics();
  bg.fillStyle(THEME.gameplay.cloud).fillRect(-230, -118, 460, 236);
  bg.lineStyle(2, THEME.gameplay.ink).strokeRect(-229, -117, 458, 234);
  bg.fillStyle(THEME.gameplay.blush).fillRect(-202, -92, 28, 28);
  bg.fillStyle(THEME.gameplay.mint).fillRect(178, -82, 24, 24);
  bg.fillStyle(THEME.gameplay.lavender).fillRect(-210, 64, 20, 20);
  const title = scene.add.text(0, -55, textFor('clear.level'), {
    fontFamily: THEME.typography.display,
    fontSize: '40px',
    color: THEME.colors.ink
  }).setOrigin(0.5);
  const detail = scene.add.text(0, 5, textFor('clear.detail', { level: 1 }), {
    fontFamily: THEME.typography.body,
    fontSize: '17px',
    color: THEME.colors.inkSoft
  }).setOrigin(0.5);
  panel.add([bg, title, detail]);
  panel.setData('title', title);
  panel.setData('detail', detail);
  return panel;
}

function configureClearPanel(level) {
  const title = clearPanel.getData('title');
  const detail = clearPanel.getData('detail');
  const allClear = level === TOTAL_LEVELS;
  title.setText(textFor(allClear ? 'clear.all' : 'clear.level')).setFontSize(allClear ? 38 : 40);
  detail.setText(allClear
    ? textFor('clear.allDetail', { total: TOTAL_LEVELS })
    : textFor('clear.detail', { level }));
}

function createWorld2VerticalPresentation(scene, worldWidth, worldTop, worldBottom) {
  const style = THEME.worlds.world2;
  const colors = THEME.levelBackdrops[9];
  const height = worldBottom - worldTop;
  const layer = scene.add.container(0, 0).setDepth(THEME.depths.background);
  const sky = scene.add.graphics();
  const towerSilhouettes = scene.add.graphics();

  sky.fillStyle(colors.sky).fillRect(0, worldTop, worldWidth, height);
  towerSilhouettes.fillStyle(colors.horizon, 0.58);
  for (let y = worldTop; y < worldBottom; y += 360) {
    const offset = Math.abs(Math.floor(y / 360)) % 2;
    towerSilhouettes
      .fillRect(70 + offset * 36, y + 80, 150, 260)
      .fillRect(740 - offset * 42, y + 20, 130, 320)
      .fillRect(112 + offset * 36, y + 48, 66, 32)
      .fillRect(772 - offset * 42, y - 12, 66, 32);
  }
  layer.add([sky, towerSilhouettes]);

  const farFog = scene.add.graphics()
    .setDepth(THEME.depths.background + 1)
    .setScrollFactor(0.2, 0.22);
  const nearFog = scene.add.graphics()
    .setDepth(THEME.depths.background + 2)
    .setScrollFactor(0.48, 0.52);
  farFog.fillStyle(style.fog.blue, style.fog.alphaFar);
  nearFog.fillStyle(style.fog.white, style.fog.alphaNear);
  for (let y = worldTop - 260; y < worldBottom + 360; y += 250) {
    const row = Math.abs(Math.floor(y / 250));
    const farX = row % 2 === 0 ? 70 : 500;
    const nearX = row % 3 === 0 ? 520 : 150;
    const farY = Math.round(y * 0.22);
    const nearY = Math.round(y * 0.52);
    farFog
      .fillRect(farX, farY + 52, 330, 38)
      .fillRect(farX + 58, farY + 28, 190, 24);
    nearFog
      .fillRect(nearX, nearY + 142, 300, 46)
      .fillRect(nearX + 52, nearY + 114, 190, 28);
  }

  const ambientTweens = [];
  if (!reducedMotion) {
    ambientTweens.push(scene.tweens.add({
      targets: farFog,
      x: style.fog.driftFar,
      duration: style.fog.durationFarMs,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1
    }));
    ambientTweens.push(scene.tweens.add({
      targets: nearFog,
      x: -style.fog.driftNear,
      duration: style.fog.durationNearMs,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1
    }));
  }
  layer.setData('ambientTweens', ambientTweens);
  layer.setData('detachedLayers', [farFog, nearFog]);
  return layer;
}

function createWorld2Presentation(
  scene,
  backdropLayer,
  worldWidth,
  introText = 'World 2：棉花糖迷雾',
  introY = 150
) {
  const style = THEME.worlds.world2;
  const farFog = scene.add.graphics();
  const nearFog = scene.add.graphics();

  farFog.fillStyle(style.fog.blue, style.fog.alphaFar);
  nearFog.fillStyle(style.fog.white, style.fog.alphaNear);
  for (let x = -180; x < worldWidth + 240; x += 310) {
    const farY = 170 + ((x / 310) % 3) * 28;
    farFog.fillRect(x, farY, 190, 34);
    farFog.fillRect(x + 38, farY - 20, 112, 20);

    const nearY = 286 + ((x / 310) % 2) * 42;
    nearFog.fillRect(x + 86, nearY, 240, 42);
    nearFog.fillRect(x + 126, nearY - 24, 152, 24);
  }
  backdropLayer.add([farFog, nearFog]);

  const ambientTweens = [];
  if (!reducedMotion) {
    ambientTweens.push(scene.tweens.add({
      targets: farFog,
      x: style.fog.driftFar,
      duration: style.fog.durationFarMs,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1
    }));
    ambientTweens.push(scene.tweens.add({
      targets: nearFog,
      x: -style.fog.driftNear,
      duration: style.fog.durationNearMs,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1
    }));
  }
  backdropLayer.setData('ambientTweens', ambientTweens);

  worldTransitionOverlay = scene.add.rectangle(
    WIDTH / 2,
    HEIGHT / 2,
    WIDTH,
    HEIGHT,
    style.transitionFrom,
    1
  ).setScrollFactor(0).setDepth(THEME.depths.scenery - 1);
  scene.tweens.add({
    targets: worldTransitionOverlay,
    alpha: 0,
    duration: reducedMotion ? 1 : 900,
    ease: 'Sine.InOut',
    onComplete: () => {
      worldTransitionOverlay?.destroy();
      worldTransitionOverlay = null;
    }
  });

  eighthLevelIntro = scene.add.text(WIDTH / 2, introY, localizeText(introText), {
    fontFamily: THEME.typography.display,
    fontSize: '32px',
    color: THEME.colors.ink,
    backgroundColor: THEME.colors.surfaceFaint,
    padding: { x: 18, y: 10 }
  }).setOrigin(0.5).setAlpha(0).setScrollFactor(0).setDepth(THEME.depths.guidance);
  scene.tweens.add({
    targets: eighthLevelIntro,
    alpha: 1,
    duration: reducedMotion ? 1 : 350,
    hold: 2300,
    yoyo: true,
    ease: 'Sine.InOut',
    onComplete: () => {
      eighthLevelIntro?.destroy();
      eighthLevelIntro = null;
    }
  });
}

function createWorld2GraduationPresentation(scene, backdropLayer) {
  const parallax = scene.add.graphics()
    .setDepth(THEME.depths.background + 2)
    .setScrollFactor(0.78, 1);
  const scaleX = 0.78;
  const towerX = 6780 * scaleX;
  const bossX = 7060 * scaleX;
  const mirrorX = 7240 * scaleX;

  // Level 9 recap: a stepped vertical tower silhouette behind the final breathing lane.
  parallax.fillStyle(THEME.worlds.world2.backdrop.structures, 0.16)
    .fillRect(towerX, 178, 64, 292)
    .fillRect(towerX - 38, 238, 140, 34)
    .fillRect(towerX - 22, 328, 108, 30)
    .fillRect(towerX - 8, 122, 80, 56);

  // Level 10 recap: the boss is represented only as a soft block silhouette.
  parallax.fillStyle(THEME.worlds.world2.fog.blue, 0.18)
    .fillCircle(bossX, 340, 56)
    .fillCircle(bossX + 46, 354, 42)
    .fillRect(bossX - 42, 352, 126, 64);
  parallax.fillStyle(THEME.gameplay.ink, 0.12)
    .fillRect(bossX - 17, 348, 7, 9)
    .fillRect(bossX + 28, 348, 7, 9);

  // World 3 foreshadowing: extremely faint, flat mirror-color strips at far depth.
  parallax.fillStyle(THEME.gameplay.blush, 0.08)
    .fillRect(mirrorX, 108, 18, 344)
    .fillRect(mirrorX + 64, 154, 12, 298);
  parallax.fillStyle(THEME.gameplay.lavender, 0.07)
    .fillRect(mirrorX + 24, 128, 10, 320)
    .fillRect(mirrorX + 88, 196, 16, 252);

  backdropLayer.setData('detachedLayers', [
    ...(backdropLayer.getData('detachedLayers') || []),
    parallax
  ]);
  return parallax;
}

function createLevel13TransitionPresentation(scene, backdropLayer) {
  const world2 = THEME.worlds.world2;
  const world3 = THEME.worlds.world3Preview;
  const farFog = scene.add.graphics();
  const nearFog = scene.add.graphics();

  farFog.fillStyle(world2.fog.blue, world2.fog.alphaFar);
  nearFog.fillStyle(world2.fog.white, world2.fog.alphaNear);
  for (let x = -160; x < LEVEL_13_TRANSITION_CONFIG.endX + 460; x += 300) {
    const farY = 165 + (Math.abs(Math.floor(x / 300)) % 3) * 34;
    const nearY = 300 + (Math.abs(Math.floor(x / 300)) % 2) * 38;
    farFog.fillRect(x, farY, 210, 32);
    farFog.fillRect(x + 45, farY - 18, 120, 18);
    nearFog.fillRect(x + 70, nearY, 250, 40);
    nearFog.fillRect(x + 116, nearY - 22, 158, 22);
  }

  const mirrorGlints = [];
  const mirrorColors = [
    world3.mirror.roseGold,
    world3.mirror.silver,
    world3.mirror.paleRose
  ];
  for (
    let x = LEVEL_13_TRANSITION_CONFIG.mirrorStartX;
    x <= LEVEL_13_TRANSITION_CONFIG.mirrorEndX;
    x += 190
  ) {
    const index = Math.round((x - LEVEL_13_TRANSITION_CONFIG.mirrorStartX) / 190);
    const glint = scene.add.rectangle(
      x,
      115 + (index % 4) * 78,
      index % 2 === 0 ? 8 : 5,
      44 + (index % 3) * 18,
      mirrorColors[index % mirrorColors.length],
      1
    )
      .setAngle(index % 2 === 0 ? 28 : -24)
      .setAlpha(0);
    mirrorGlints.push(glint);
  }

  backdropLayer.add([farFog, nearFog, ...mirrorGlints]);
  const ambientTweens = backdropLayer.getData('ambientTweens') || [];
  if (!reducedMotion) {
    ambientTweens.push(scene.tweens.add({
      targets: farFog,
      x: world2.fog.driftFar,
      duration: world2.fog.durationFarMs,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1
    }));
    ambientTweens.push(scene.tweens.add({
      targets: nearFog,
      x: -world2.fog.driftNear,
      duration: world2.fog.durationNearMs,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1
    }));
  }
  backdropLayer.setData('ambientTweens', ambientTweens);

  level13TransitionState = {
    farFog,
    nearFog,
    mirrorGlints,
    musicSwitched: false,
    progress: 0
  };
  setLevel13TransitionProgress(0, 0);
}

function setLevel13TransitionProgress(progress, time) {
  if (!level13TransitionState) return;
  const config = LEVEL_13_TRANSITION_CONFIG;
  const clamped = Phaser.Math.Clamp(progress, 0, 1);
  level13TransitionState.progress = clamped;
  const fogAlpha = Phaser.Math.Linear(1, config.fogEndAlpha, clamped);
  level13TransitionState.farFog.setAlpha(fogAlpha);
  level13TransitionState.nearFog.setAlpha(Math.max(config.fogEndAlpha, fogAlpha * 0.9));
  level13TransitionState.mirrorGlints.forEach((glint, index) => {
    const pulse = reducedMotion
      ? 0.82
      : 0.58 + Math.sin(time * 0.004 + index * 1.7) * 0.28;
    glint.setAlpha(config.glintMaxAlpha * clamped * Math.max(0.2, pulse));
  });
}

function updateLevel13TransitionPresentation(scene, time, playerX) {
  if (!level13TransitionState) return;
  const config = LEVEL_13_TRANSITION_CONFIG;
  const progress = Phaser.Math.Clamp(
    (playerX - config.startX) / (config.endX - config.startX),
    0,
    1
  );
  setLevel13TransitionProgress(progress, time);
  if (!level13TransitionState.musicSwitched && playerX >= config.musicSwitchX) {
    level13TransitionState.musicSwitched = true;
    audioManager.playMusic('transitionAmbience');
  }
}

function resetLevel13TransitionPresentation(spawnX) {
  if (!level13TransitionState) return;
  const config = LEVEL_13_TRANSITION_CONFIG;
  const progress = Phaser.Math.Clamp(
    (spawnX - config.startX) / (config.endX - config.startX),
    0,
    1
  );
  setLevel13TransitionProgress(progress, 0);
  level13TransitionState.musicSwitched = spawnX >= config.musicSwitchX;
  audioManager.playMusic(
    level13TransitionState.musicSwitched ? 'transitionAmbience' : 'world2Music'
  );
}

function destroyLevel13TransitionPresentation(scene) {
  if (!level13TransitionState) return;
  [
    level13TransitionState.farFog,
    level13TransitionState.nearFog,
    ...level13TransitionState.mirrorGlints
  ].forEach((object) => {
    scene?.tweens?.killTweensOf(object);
    object?.destroy();
  });
  level13TransitionState = null;
}

function createWorld3GardenPresentation(
  scene,
  backdropLayer,
  worldWidth,
  introText = 'World 3：焦糖镜花园',
  showTitle = true
) {
  const style = THEME.worlds.world3;
  const geometry = scene.add.graphics();
  const highlights = scene.add.graphics();

  for (let x = 120; x < worldWidth; x += 640) {
    const centerX = x + 320;
    geometry.fillStyle(style.backdrop.structures, 0.38)
      .fillRoundedRect(x + 38, 260, 46, 154, 22)
      .fillRoundedRect(x + 556, 260, 46, 154, 22);
    geometry.fillStyle(style.mirror.roseGold, 0.34)
      .fillRoundedRect(centerX - 78, 282, 156, 116, 38);
    geometry.fillStyle(style.mirror.paleRose, 0.36)
      .fillEllipse(centerX - 72, 390, 118, 58)
      .fillEllipse(centerX, 374, 146, 76)
      .fillEllipse(centerX + 72, 390, 118, 58);
    highlights.lineStyle(2, style.mirror.silver, 0.82)
      .lineBetween(x + 49, 346, x + 72, 302)
      .lineBetween(x + 567, 346, x + 590, 302)
      .lineBetween(centerX - 30, 357, centerX + 6, 304)
      .lineBetween(centerX + 18, 376, centerX + 51, 326);
    highlights.lineStyle(3, style.mirror.outline, 0.5)
      .strokeRoundedRect(centerX - 78, 282, 156, 116, 38);
  }
  backdropLayer.add([geometry, highlights]);

  if (showTitle) showLevelTitle(scene, introText);
}

function extendWorld3PresentationVertically(scene, backdropLayer, worldWidth, worldTop) {
  if (worldTop >= 0) return;
  const style = THEME.worlds.world3;
  const extension = scene.add.graphics();
  extension.fillStyle(THEME.levelBackdrops[14].sky)
    .fillRect(0, worldTop, worldWidth, -worldTop);

  for (let bandY = worldTop + 90; bandY < 0; bandY += 230) {
    extension.fillStyle(style.backdrop.structures, 0.22);
    for (let x = 140; x < worldWidth; x += 720) {
      extension
        .fillRoundedRect(x, bandY, 42, 132, 20)
        .fillRoundedRect(x + 520, bandY, 42, 132, 20);
    }
    extension.lineStyle(2, style.mirror.silver, 0.38);
    for (let x = 210; x < worldWidth; x += 720) {
      extension
        .lineBetween(x, bandY + 104, x + 52, bandY + 32)
        .lineBetween(x + 300, bandY + 28, x + 342, bandY + 92);
    }
  }

  backdropLayer.addAt(extension, 0);
}

function createCompanionCaptureRack(scene, x, captureY, startY) {
  const style = THEME.worlds.world3.mirror;
  const container = scene.add.container(x, startY)
    .setDepth(THEME.depths.actor + 2)
    .setVisible(false);
  const frame = scene.add.graphics();
  frame.fillStyle(style.roseGold, 0.86)
    .fillRoundedRect(-4, -126, 8, 56, 4)
    .fillRoundedRect(-57, -76, 114, 15, 7)
    .fillRoundedRect(-51, -65, 12, 84, 6)
    .fillRoundedRect(39, -65, 12, 84, 6);
  frame.fillStyle(style.silver, 0.94)
    .fillEllipse(0, -128, 22, 14)
    .fillRoundedRect(-48, 12, 24, 12, 6)
    .fillRoundedRect(24, 12, 24, 12, 6);
  frame.lineStyle(2, style.outline, 0.86)
    .strokeRoundedRect(-57, -76, 114, 15, 7)
    .strokeRoundedRect(-51, -65, 12, 84, 6)
    .strokeRoundedRect(39, -65, 12, 84, 6);
  frame.lineStyle(2, style.silver, 0.95)
    .lineBetween(-45, -37, -42, -57)
    .lineBetween(42, -4, 45, -25)
    .lineBetween(-30, -70, -5, -65);

  const clamp = scene.add.graphics().setAlpha(0.16);
  clamp.fillStyle(style.roseGold, 0.9)
    .fillRoundedRect(-37, -1, 32, 9, 4)
    .fillRoundedRect(5, -1, 32, 9, 4);

  const impactRing = scene.add.ellipse(
    0,
    21,
    118,
    22,
    style.silver,
    0
  )
    .setStrokeStyle(2, style.roseGold, 0.72)
    .setVisible(false);

  container.add([frame, clamp, impactRing]);
  return {
    container,
    clamp,
    impactRing,
    x,
    captureY,
    startY
  };
}

function setCompanionCaptureRackClosed(scene, rack, closed, animate = true) {
  if (!rack) return;
  scene.tweens.killTweensOf(rack.clamp);
  if (!animate || reducedMotion) {
    rack.clamp.setAlpha(closed ? 1 : 0.16);
    return;
  }
  scene.tweens.add({
    targets: rack.clamp,
    alpha: closed ? 1 : 0.16,
    duration: 180,
    ease: 'Sine.InOut'
  });
}

function resetCompanionCaptureRack(scene, rack) {
  if (!rack) return;
  scene.tweens.killTweensOf(rack.container);
  scene.tweens.killTweensOf(rack.clamp);
  scene.tweens.killTweensOf(rack.impactRing);
  rack.container
    .setPosition(rack.x, rack.startY)
    .setAlpha(1)
    .setVisible(false);
  rack.clamp.setAlpha(0.16);
  rack.impactRing.setVisible(false).setAlpha(0).setScale(1);
}

function dropCompanionCaptureRack(scene, rack, duration, onComplete) {
  if (!rack) {
    onComplete?.();
    return;
  }
  resetCompanionCaptureRack(scene, rack);
  rack.container.setVisible(true);
  scene.tweens.add({
    targets: rack.container,
    y: rack.captureY,
    duration: reducedMotion ? 1 : duration,
    ease: 'Back.Out',
    onComplete: () => {
      rack.impactRing.setVisible(true).setAlpha(0.72).setScale(0.86);
      scene.tweens.add({
        targets: rack.impactRing,
        alpha: 0,
        scaleX: 1.24,
        scaleY: 1.24,
        duration: reducedMotion ? 1 : 260,
        ease: 'Sine.Out',
        onComplete: () => rack.impactRing?.setVisible(false)
      });
      onComplete?.();
    }
  });
}

function liftCompanionCaptureRack(
  scene,
  rack,
  companionVisual,
  exitY,
  duration,
  onComplete
) {
  if (!rack) {
    onComplete?.();
    return;
  }
  scene.tweens.killTweensOf(rack.container);
  if (companionVisual?.active) scene.tweens.killTweensOf(companionVisual);
  const targets = companionVisual?.active
    ? [rack.container, companionVisual]
    : [rack.container];
  scene.tweens.add({
    targets,
    y: exitY,
    duration: reducedMotion ? 1 : duration,
    ease: 'Sine.In',
    onComplete: () => {
      rack.container.setVisible(false);
      onComplete?.();
    }
  });
}

function destroyCompanionCaptureRack(scene, rack) {
  if (!rack) return;
  resetCompanionCaptureRack(scene, rack);
  rack.container?.destroy(true);
}

function createLevel14MirrorPool(scene, x, surfaceY) {
  const style = THEME.worlds.world3;
  const container = scene.add.container(x, surfaceY)
    .setDepth(THEME.depths.scenery + 1);
  const frame = scene.add.graphics();
  frame.fillStyle(style.mirror.outline, 0.9)
    .fillEllipse(0, 0, 196, 48);
  frame.fillStyle(style.mirror.roseGold, 0.78)
    .fillRoundedRect(-118, -38, 22, 46, 11)
    .fillRoundedRect(96, -38, 22, 46, 11);
  frame.fillStyle(style.mirror.silver, 0.92)
    .fillEllipse(-107, -37, 16, 12)
    .fillEllipse(107, -37, 16, 12);
  frame.fillStyle(style.mirror.silver, 1)
    .fillEllipse(0, -2, 174, 34);
  frame.lineStyle(2, style.mirror.silver, 0.96)
    .lineBetween(-112, -12, -101, -28)
    .lineBetween(101, -12, 112, -28);
  const surface = scene.add.graphics();
  surface.fillStyle(style.mirror.paleRose, 0.78)
    .fillEllipse(0, -3, 148, 22);
  surface.fillStyle(style.mirror.roseGold, 0.7)
    .fillRect(-42, -7, 84, 4);
  const silhouette = scene.add.graphics()
    .setVisible(false)
    .setAlpha(0);
  silhouette.fillStyle(0x786c75, 1)
    .fillCircle(0, -13, 8)
    .fillEllipse(0, 2, 38, 16);
  container.add([frame, surface, silhouette]);
  return { container, surface, silhouette };
}

function playLevel14MirrorHint(scene, landmark) {
  if (!landmark) return;
  scene.tweens.killTweensOf(landmark.surface);
  scene.tweens.killTweensOf(landmark.silhouette);
  landmark.silhouette.setVisible(true).setAlpha(0);
  scene.tweens.add({
    targets: landmark.surface,
    alpha: 0.48,
    duration: reducedMotion ? 1 : LEVEL_14_MIRROR_POOL_CONFIG.silhouetteMs / 2,
    yoyo: true,
    ease: 'Sine.InOut'
  });
  scene.tweens.add({
    targets: landmark.silhouette,
    alpha: 0.34,
    duration: reducedMotion ? 1 : LEVEL_14_MIRROR_POOL_CONFIG.silhouetteMs / 2,
    yoyo: true,
    ease: 'Sine.InOut',
    onComplete: () => landmark.silhouette?.setVisible(false).setAlpha(0)
  });
}

function resetLevel14MirrorPool(scene, landmark) {
  if (!landmark) return;
  scene.tweens.killTweensOf(landmark.surface);
  scene.tweens.killTweensOf(landmark.silhouette);
  landmark.surface.setAlpha(1);
  landmark.silhouette.setVisible(false).setAlpha(0);
}

function destroyLevel14MirrorPool(scene, landmark) {
  if (!landmark) return;
  resetLevel14MirrorPool(scene, landmark);
  landmark.container?.destroy(true);
}

function playDeathFeedback(scene, hitPlayer, onComplete) {
  const colors = [THEME.gameplay.blush, THEME.gameplay.mint, THEME.gameplay.lavender];
  colors.forEach((color, index) => {
    const size = 16 - index * 2;
    const drop = scene.add.rectangle(hitPlayer.x, hitPlayer.y, size, size, color, 0.9)
      .setDepth(THEME.depths.feedback);
    scene.tweens.add({
      targets: drop,
      x: hitPlayer.x + (index - 1) * 34,
      y: hitPlayer.y - 28 - index * 10,
      scale: 1.5,
      alpha: 0,
      duration: reducedMotion ? 1 : THEME.motion.deathOutMs,
      ease: 'Sine.Out',
      onComplete: () => drop.destroy()
    });
  });
  scene.cameras.main.shake(reducedMotion ? 1 : 160, reducedMotion ? 0 : 0.005);
  if (reducedMotion) {
    hitPlayer.setAlpha(0);
    scene.time.delayedCall(THEME.motion.deathOutMs, onComplete);
  } else {
    scene.tweens.add({
      targets: hitPlayer,
      alpha: 0,
      duration: THEME.motion.deathOutMs,
      ease: 'Sine.In',
      onComplete
    });
  }
}

function playRespawnFeedback(scene, target) {
  target.setAlpha(reducedMotion ? 1 : 0).setTint(THEME.gameplay.mint);
  scene.tweens.add({
    targets: target,
    alpha: 1,
    duration: reducedMotion ? 1 : THEME.motion.respawnInMs,
    ease: 'Sine.Out',
    onComplete: () => target.clearTint()
  });
}

function showClearCelebration(scene) {
  clearCelebration(scene);
  celebrationLayer = scene.add.container(WIDTH / 2, HEIGHT / 2)
    .setDepth(THEME.depths.celebration).setScrollFactor(0);
  const colors = [
    THEME.gameplay.blush,
    THEME.gameplay.mint,
    THEME.gameplay.lavender,
    THEME.gameplay.butter,
    THEME.gameplay.skyStrong
  ];
  const count = reducedMotion ? 5 : 14;
  for (let index = 0; index < count; index += 1) {
    const angle = (Math.PI * 2 * index) / count;
    const distance = 170 + (index % 3) * 34;
    const size = 8 + (index % 3) * 4;
    const dot = scene.add.rectangle(0, 0, size, size, colors[index % colors.length], 1);
    celebrationLayer.add(dot);
    scene.tweens.add({
      targets: dot,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance * 0.72,
      scale: 1,
      alpha: reducedMotion ? 0.55 : 0,
      delay: reducedMotion ? 0 : index * 18,
      duration: reducedMotion ? 1 : THEME.motion.celebrationMs,
      ease: 'Cubic.Out'
    });
  }
}

function clearCelebration(scene) {
  if (!celebrationLayer) return;
  celebrationLayer.list.forEach((dot) => scene.tweens.killTweensOf(dot));
  celebrationLayer.destroy(true);
  celebrationLayer = null;
}
