"use strict";

const MUD_COMPANION_CONFIG = Object.freeze({
  id: 'mud-companion',
  name: '小泥人',
  color: 0x17141a,
  pickupScale: 0.92,
  seatedScale: 0.68,
  carriedScale: 0.68,
  headOffsetX: 0,
  headOffsetY: -24,
  carriedOffsetX: 0,
  carriedOffsetY: -24,
  maxLeanAngle: 4,
  dialogue: Object.freeze([
    { speaker: 'mud', text: '我们……不迷路了。' },
    { speaker: 'player', text: '那就叫你小泥人吧。上来，顺路带你走。' }
  ])
});

function createMudCompanionFigure(scene, x, y, scale = 1, pose = 'standing') {
  const figure = scene.add.container(x, y)
    .setScale(scale)
    .setDepth(THEME.depths.actor - 1);
  const drawing = scene.add.graphics();
  drawing.fillStyle(MUD_COMPANION_CONFIG.color, 1);
  drawing.lineStyle(3, MUD_COMPANION_CONFIG.color, 1);
  if (pose === 'seated') {
    drawing.fillCircle(0, -14, 6)
      .lineBetween(0, -8, 0, 2)
      .lineBetween(0, -5, -8, 1)
      .lineBetween(0, -5, 8, 1)
      .lineBetween(0, 2, -7, 7)
      .lineBetween(-7, 7, -11, 3)
      .lineBetween(0, 2, 7, 7)
      .lineBetween(7, 7, 11, 3);
  } else {
    drawing.fillCircle(0, -22, 6)
      .lineBetween(0, -16, 0, 2)
      .lineBetween(0, -10, -10, -1)
      .lineBetween(0, -10, 10, -1)
      .lineBetween(0, 2, -8, 16)
      .lineBetween(0, 2, 8, 16);
  }
  figure.add(drawing);
  figure.setData('pose', pose);
  return figure;
}

function startMudCompanionPickupSway(scene) {
  if (!mudCompanionPickupVisual?.active || reducedMotion) return;
  scene.tweens.killTweensOf(mudCompanionPickupVisual);
  scene.tweens.add({
    targets: mudCompanionPickupVisual,
    y: LEVEL_13_TRANSITION_CONFIG.mudPickupY - 3,
    angle: 3,
    duration: 760,
    ease: 'Sine.InOut',
    yoyo: true,
    repeat: -1
  });
}

function createMudCompanionEncounter(scene, x, y, forceEncounter = false) {
  destroyMudCompanion(scene);
  const owned = collectedItems.has(MUD_COMPANION_CONFIG.id);
  mudCompanionEncounterResolved = owned && !forceEncounter;
  if (mudCompanionEncounterResolved) {
    attachMudCompanion(scene, true);
    return;
  }

  mudCompanionPickupVisual = createMudCompanionFigure(
    scene,
    x,
    y,
    MUD_COMPANION_CONFIG.pickupScale,
    'standing'
  );
  startMudCompanionPickupSway(scene);
  mudCompanionPickupZone = scene.physics.add.staticImage(x, y - 18, 'ground')
    .setDisplaySize(64, 76)
    .setVisible(false);
  mudCompanionPickupZone.refreshBody();
}

function attachMudCompanion(scene, snapToPlayer = false, followMode = 'head') {
  if (
    mudCompanionFollower?.active
    && mudCompanionFollower.getData('followMode') !== followMode
  ) {
    scene.tweens.killTweensOf(mudCompanionFollower);
    mudCompanionFollower.destroy();
    mudCompanionFollower = null;
  }
  if (!mudCompanionFollower?.active) {
    mudCompanionFollower = createMudCompanionFigure(
      scene,
      player.x + MUD_COMPANION_CONFIG.headOffsetX,
      player.y + MUD_COMPANION_CONFIG.headOffsetY,
      followMode === 'carried'
        ? MUD_COMPANION_CONFIG.carriedScale
        : MUD_COMPANION_CONFIG.seatedScale,
      'seated'
    );
  }
  mudCompanionFollower.setData('followMode', followMode);
  if (snapToPlayer) {
    const offsetX = followMode === 'carried'
      ? -facing * MUD_COMPANION_CONFIG.carriedOffsetX
      : MUD_COMPANION_CONFIG.headOffsetX;
    const offsetY = followMode === 'carried'
      ? MUD_COMPANION_CONFIG.carriedOffsetY
      : MUD_COMPANION_CONFIG.headOffsetY;
    mudCompanionFollower.setPosition(
      player.x + offsetX,
      player.y + offsetY
    );
  }
}

function carryMudCompanion(scene, snapToPlayer = true) {
  cancelMudCompanionDialogue(scene);
  mudCompanionEncounterResolved = true;
  mudCompanionPickupZone?.disableBody(true, true);
  mudCompanionPickupVisual?.setVisible(false);
  attachMudCompanion(scene, snapToPlayer, 'carried');
}

function setDownMudCompanion(scene, x, y, duration, onComplete) {
  if (!mudCompanionFollower?.active) {
    showStandingMudCompanion(scene, x, y);
    onComplete?.();
    return;
  }
  scene.tweens.killTweensOf(mudCompanionFollower);
  mudCompanionFollower.setData('followMode', 'placed');
  scene.tweens.add({
    targets: mudCompanionFollower,
    x,
    y,
    angle: 0,
    scaleX: MUD_COMPANION_CONFIG.pickupScale,
    scaleY: MUD_COMPANION_CONFIG.pickupScale,
    duration: reducedMotion ? 1 : duration,
    ease: 'Sine.InOut',
    onComplete: () => {
      showStandingMudCompanion(scene, x, y);
      onComplete?.();
    }
  });
}

function showStandingMudCompanion(scene, x, y) {
  if (mudCompanionFollower?.active) {
    scene.tweens.killTweensOf(mudCompanionFollower);
    mudCompanionFollower.destroy();
  }
  mudCompanionFollower = createMudCompanionFigure(
    scene,
    x,
    y,
    MUD_COMPANION_CONFIG.pickupScale,
    'standing'
  );
  mudCompanionFollower.setData('followMode', 'placed');
}

function placeMudCompanion(scene, x, y) {
  showStandingMudCompanion(scene, x, y);
}

function hideMudCompanionFollower(scene) {
  if (!mudCompanionFollower) return;
  scene?.tweens?.killTweensOf(mudCompanionFollower);
  mudCompanionFollower.destroy();
  mudCompanionFollower = null;
}

function collectMudCompanion(hitPlayer, pickupZone) {
  if (
    currentLevel !== 13
    || isDead
    || isCleared
    || mudCompanionEncounterResolved
    || mudCompanionDialogueTimer
  ) return;

  pickupZone.disableBody(true, true);
  this.tweens.killTweensOf(mudCompanionPickupVisual);
  mudCompanionPickupVisual?.setAngle(0);

  mudCompanionDialogue = showStoryDialogue(
    this,
    MUD_COMPANION_CONFIG.dialogue,
    () => {
      mudCompanionDialogue = null;
      mudCompanionPickupVisual?.setVisible(false);
      mudCompanionEncounterResolved = true;
      collectedItems.add(MUD_COMPANION_CONFIG.id);
      saveProgress();
      attachMudCompanion(this, true);
    },
    'mud-pickup'
  );
}

function restoreMudCompanionEncounter(scene) {
  mudCompanionFollower?.destroy();
  mudCompanionFollower = null;
  mudCompanionPickupZone?.enableBody(
    false,
    LEVEL_13_TRANSITION_CONFIG.mudPickupX,
    LEVEL_13_TRANSITION_CONFIG.mudPickupY - 18,
    true,
    false
  );
  if (mudCompanionPickupVisual) {
    mudCompanionPickupVisual
      .setPosition(
        LEVEL_13_TRANSITION_CONFIG.mudPickupX,
        LEVEL_13_TRANSITION_CONFIG.mudPickupY
      )
      .setAngle(0)
      .setVisible(true);
    startMudCompanionPickupSway(scene);
  }
}

function cancelMudCompanionDialogue(scene) {
  mudCompanionDialogueTimer?.remove(false);
  mudCompanionDialogueTimer = null;
  closeStoryDialogue(scene, false, 'mud-pickup');
  mudCompanionDialogue = null;
}

function resetMudCompanion(scene, restartEncounter = false) {
  cancelMudCompanionDialogue(scene);
  if (restartEncounter) mudCompanionEncounterResolved = false;

  if (mudCompanionEncounterResolved) {
    mudCompanionPickupZone?.disableBody(true, true);
    mudCompanionPickupVisual?.setVisible(false);
    attachMudCompanion(scene, true);
    return;
  }

  restoreMudCompanionEncounter(scene);
}

function destroyMudCompanion(scene) {
  cancelMudCompanionDialogue(scene);
  [
    mudCompanionPickupVisual,
    mudCompanionFollower
  ].forEach((object) => {
    if (!object) return;
    scene?.tweens?.killTweensOf(object);
    object.destroy();
  });
  mudCompanionPickupZone?.destroy();
  mudCompanionPickupZone = null;
  mudCompanionPickupVisual = null;
  mudCompanionFollower = null;
  mudCompanionEncounterResolved = false;
}

function updateMudCompanion() {
  if (!mudCompanionFollower?.active || !player?.active) return;
  const followMode = mudCompanionFollower.getData('followMode') || 'head';
  if (followMode === 'placed') return;
  const carried = followMode === 'carried';
  const scale = carried
    ? MUD_COMPANION_CONFIG.carriedScale
    : MUD_COMPANION_CONFIG.seatedScale;
  const offsetX = carried
    ? -facing * MUD_COMPANION_CONFIG.carriedOffsetX
    : MUD_COMPANION_CONFIG.headOffsetX;
  const offsetY = carried
    ? MUD_COMPANION_CONFIG.carriedOffsetY
    : MUD_COMPANION_CONFIG.headOffsetY;
  mudCompanionFollower.setPosition(
    player.x + offsetX,
    player.y + offsetY
  );
  mudCompanionFollower.setAngle(
    reducedMotion
      ? 0
      : Phaser.Math.Clamp(
        player.body.velocity.x / 225 * MUD_COMPANION_CONFIG.maxLeanAngle,
        -MUD_COMPANION_CONFIG.maxLeanAngle,
        MUD_COMPANION_CONFIG.maxLeanAngle
      )
  );
  mudCompanionFollower.setScale(
    facing < 0 ? -scale : scale,
    scale
  );
}
