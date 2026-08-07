"use strict";

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: THEME.colors.sky,
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1450 },
      debug: false
    }
  },
  scene: { preload, create, update }
};

new Phaser.Game(config);

function usesTouchControls() {
  return (navigator.maxTouchPoints || 0) > 0
    || window.matchMedia?.('(pointer: coarse)').matches === true;
}

function isControlDown(action) {
  const keyboardKey = action === 'left' ? cursors?.left
    : action === 'right' ? cursors?.right
      : action === 'up' ? cursors?.up
        : action === 'down' ? cursors?.down
          : null;
  return keyboardKey?.isDown === true || touchInput[action] === true;
}

function consumeJumpJustDown(includeKeyboardUp = true) {
  const keyboardJump = jumpKey ? Phaser.Input.Keyboard.JustDown(jumpKey) : false;
  const keyboardUp = includeKeyboardUp && cursors?.up
    ? Phaser.Input.Keyboard.JustDown(cursors.up)
    : false;
  const touchJump = touchInput.jumpJustDown;
  touchInput.jumpJustDown = false;
  return keyboardJump || keyboardUp || touchJump;
}

function isJumpHeld() {
  return jumpKey?.isDown === true || cursors?.up?.isDown === true || touchInput.jump;
}

function clearTouchInput() {
  Object.keys(touchInput).forEach((key) => { touchInput[key] = false; });
  document.querySelectorAll('[data-touch-input].is-pressed').forEach((button) => {
    button.classList.remove('is-pressed');
  });
}

function preload() {
  this.load.spritesheet('player', 'assets/characters/danzai-spritesheet.png', {
    frameWidth: 35,
    frameHeight: 42,
    endFrame: 12
  });
  audioManager.preload(this);
}

function create() {
  audioManager.initialize(this);
  createTextures(this);
  createPlayerAnimations(this);

  player = this.physics.add.sprite(START.x, START.y, 'player').setDepth(THEME.depths.actor);
  player.setCollideWorldBounds(false);
  player.setMaxVelocity(225, 760);
  player.setDragX(3200);
  player.body.setSize(27, 38).setOffset(4, 4);

  this.cameras.main.setDeadzone(250, 170);

  cursors = this.input.keyboard.createCursorKeys();
  jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  this.input.keyboard.addCapture([
    Phaser.Input.Keyboard.KeyCodes.LEFT,
    Phaser.Input.Keyboard.KeyCodes.RIGHT,
    Phaser.Input.Keyboard.KeyCodes.UP,
    Phaser.Input.Keyboard.KeyCodes.SPACE
  ]);

  this.input.keyboard.on('keydown-R', () => {
    if (isPaused || isTransitioning || storyDialogue) return;
    if (currentLevel === 20) {
      resetLevel20.call(this, false);
    } else if (currentLevel === 19) {
      resetLevel19.call(this, false);
    } else if (currentLevel === 18) {
      resetLevel18.call(this, false);
    } else if (currentLevel === 17) {
      resetLevel17.call(this, false);
    } else if (currentLevel === 16) {
      resetLevel16.call(this, false);
    } else if (currentLevel === 15) {
      resetLevel15.call(this, false);
    } else if (currentLevel === 14) {
      resetLevel14.call(this, false);
    } else if (currentLevel === 13) {
      resetLevel13.call(this, false);
    } else if (currentLevel === 12) {
      resetLevel12.call(this, false);
    } else if (currentLevel === 11) {
      resetLevel11.call(this, false);
    } else if (currentLevel === 10) {
      resetLevel10.call(this, false);
    } else if (currentLevel === 9) {
      resetLevel9.call(this, false);
    } else if (currentLevel === 8) {
      resetLevel8.call(this, false);
    } else if (currentLevel === 7) {
      resetLevel7.call(this, false);
    } else if (currentLevel === 6) {
      resetLevel6.call(this, false);
    } else if (currentLevel === 5) {
      resetLevel5.call(this, false);
    } else if (currentLevel === 4) {
      resetLevel4.call(this);
    } else if (currentLevel === 3) {
      resetLevel3.call(this);
    } else if (currentLevel === 2) {
      resetLevel2.call(this);
    } else if (isCleared) {
      restartLevel.call(this);
    }
  });
  enterKey.on('down', () => {
    if (currentLevel === 1 && isCleared) transitionToLevel(this, 2);
    else if (currentLevel === 2 && isCleared) transitionToLevel(this, 3);
    else if (currentLevel === 3 && isCleared) transitionToLevel(this, 4);
    else if (currentLevel === 4 && isCleared) transitionToLevel(this, 5);
    else if (currentLevel === 5 && isCleared) transitionToLevel(this, 6);
    else if (currentLevel === 6 && isCleared) transitionToLevel(this, 7);
    else if (currentLevel === 7 && isCleared) transitionToLevel(this, 8);
    else if (currentLevel === 8 && isCleared) transitionToLevel(this, 9);
    else if (currentLevel === 9 && isCleared) transitionToLevel(this, 10);
    else if (currentLevel === 10 && isCleared) transitionToLevel(this, 11);
    else if (currentLevel === 11 && isCleared) transitionToLevel(this, 12);
    else if (currentLevel === 12 && isCleared) transitionToLevel(this, 13);
    else if (currentLevel === 13 && isCleared) transitionToLevel(this, 14);
    else if (currentLevel === 14 && isCleared) transitionToLevel(this, 15);
    else if (currentLevel === 15 && isCleared) transitionToLevel(this, 16);
    else if (currentLevel === 16 && isCleared) transitionToLevel(this, 17);
    else if (currentLevel === 17 && isCleared) transitionToLevel(this, 18);
    else if (currentLevel === 18 && isCleared) transitionToLevel(this, 19);
    else if (currentLevel === 19 && isCleared) transitionToLevel(this, 20);
  });

  createHud(this);
  clearPanel = createClearPanel(this);
  startLevel1.call(this);
  setupClearActions(this);
  setupShell(this);
}

function startLevel1() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('levelMusic');
  currentLevel = 1;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(1);

  backdrop = drawBackdrop(this, WORLD_WIDTH, 1);
  platforms = this.physics.add.staticGroup();
  addPlatform(this, 140, 505, 280, 70);
  addPlatform(this, 455, 442, 245, 28);
  addPlatform(this, 1165, 505, 270, 70);

  movingPlatform = this.physics.add.image(
    LEVEL_1_MOVING_PLATFORM_START.x,
    LEVEL_1_MOVING_PLATFORM_START.y,
    'moving-platform'
  ).setDepth(THEME.depths.mechanism);
  movingPlatform.setImmovable(true);
  movingPlatform.body.allowGravity = false;
  movingPlatform.setFrictionX(1);
  movingPlatform.body.setVelocityX(LEVEL_1_MOVING_PLATFORM_SPEED);
  movingPlatform.body.setSize(112, 18).setOffset(0, 2);

  spikes = this.physics.add.staticGroup();
  const spike = spikes.create(236, 466, 'spike').setDepth(THEME.depths.terrain - 1);
  spike.body.setSize(42, 25).setOffset(3, 17);
  spike.refreshBody();

  goal = this.physics.add.staticImage(1250, 437, 'goal').setDepth(THEME.depths.mechanism);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(this.physics.add.collider(player, movingPlatform));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(player, goal, clearLevel, null, this));

  startHint = null;
  showGameplayHint(this, LEVEL_NARRATIVE_HINTS[1]);

  jumpGuide = createJumpGuide(this);
  movingGuide = this.add.text(600, 380, localizeText('WAIT, THEN STEP ON'), {
    fontFamily: THEME.typography.display,
    fontSize: '16px',
    color: THEME.colors.ink,
    backgroundColor: THEME.colors.mint,
    padding: { x: 12, y: 7 }
  }).setOrigin(0.5).setDepth(THEME.depths.guidance).setVisible(false);

  this.physics.world.setBounds(0, 0, WORLD_WIDTH, HEIGHT + 100);
  this.cameras.main.setBounds(0, 0, WORLD_WIDTH, HEIGHT);
  resetLevel1.call(this);
}

function resetLevel1() {
  if (currentLevel !== 1) return;
  clearCelebration(this);
  this.tweens.killTweensOf(player);
  player.body.checkCollision.none = false;
  player.clearTint().setAlpha(1).setPosition(START.x, START.y).setVelocity(0).setAcceleration(0);
  player.body.reset(START.x, START.y);
  movingPlatform.body.reset(
    LEVEL_1_MOVING_PLATFORM_START.x,
    LEVEL_1_MOVING_PLATFORM_START.y
  );
  movingPlatform.setVelocityX(LEVEL_1_MOVING_PLATFORM_SPEED);
  isDead = false;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  coyoteUntil = 0;
  jumpBufferUntil = 0;
  jumpsUsed = 0;
  jumpGuideDismissed = false;
  movingGuideDismissed = false;
  jumpGuide?.getData('hideTimer')?.remove(false);
  jumpGuide?.setData('shown', false).setData('hideTimer', null).setVisible(false);
  movingGuide?.getData('hideTimer')?.remove(false);
  movingGuide?.setData('shown', false).setData('hideTimer', null).setVisible(false);
  wasGrounded = true;
  this.cameras.main.stopFollow();
  this.cameras.main.setScroll(0, 0);
  this.cameras.main.startFollow(player, true, 0.12, 0.12);
}

function update(time) {
  if (
    !player
    || isDead
    || isCleared
    || isPaused
    || isTransitioning
    || storyDialogue
    || (currentLevel === 14 && level14EndingState === 'playing')
    || (currentLevel === 15 && level15SeparationState === 'playing')
    || (currentLevel === 18 && level18ReunionState === 'playing')
  ) return;

  if (currentLevel === 1) {
    if (movingPlatform.x <= LEVEL_1_MOVING_PLATFORM_START.x) {
      movingPlatform.setVelocityX(LEVEL_1_MOVING_PLATFORM_SPEED);
    }
    if (movingPlatform.x >= LEVEL_1_MOVING_PLATFORM_MAX_X) {
      movingPlatform.setVelocityX(-LEVEL_1_MOVING_PLATFORM_SPEED);
    }

    if (!jumpGuideDismissed && !jumpGuide.getData('shown') && player.x > 105 && player.x < 275) {
      jumpGuide.setData('shown', true).setVisible(true);
      const guide = jumpGuide;
      guide.setData('hideTimer', this.time.delayedCall(GAMEPLAY_HINT_DURATION_MS, () => {
        if (!guide.active) return;
        guide.setVisible(false).setData('hideTimer', null);
        jumpGuideDismissed = true;
      }));
    }
    if (!movingGuideDismissed && !movingGuide.getData('shown') && player.x > 390 && player.x < 660) {
      movingGuide.setData('shown', true).setVisible(true);
      const guide = movingGuide;
      guide.setData('hideTimer', this.time.delayedCall(GAMEPLAY_HINT_DURATION_MS, () => {
        if (!guide.active) return;
        guide.setVisible(false).setData('hideTimer', null);
        movingGuideDismissed = true;
      }));
    }
    if (player.x > 290 && !jumpGuide.getData('hideTimer')) jumpGuideDismissed = true;
    if (player.x > 740 && !movingGuide.getData('hideTimer')) movingGuideDismissed = true;
  } else if (currentLevel === 2) {
    updateLevel2.call(this, time);
  } else if (currentLevel === 3) {
    updateLevel3.call(this, time);
  } else if (currentLevel === 4) {
    updateLevel4.call(this, time);
  } else if (currentLevel === 5) {
    updateLevel5.call(this, time);
  } else if (currentLevel === 6) {
    updateLevel6.call(this, time);
  } else if (currentLevel === 7) {
    updateLevel7.call(this, time);
  } else if (currentLevel === 8) {
    updateLevel8.call(this, time);
  } else if (currentLevel === 9) {
    updateLevel9.call(this, time);
  } else if (currentLevel === 10) {
    updateLevel10.call(this, time);
  } else if (currentLevel === 11) {
    updateLevel11.call(this, time);
  } else if (currentLevel === 12) {
    updateLevel12.call(this, time);
  } else if (currentLevel === 13) {
    updateLevel13.call(this, time);
  } else if (currentLevel === 14) {
    updateLevel14.call(this, time);
  } else if (currentLevel === 15) {
    updateLevel15.call(this, time);
  } else if (currentLevel === 16) {
    updateLevel16.call(this, time);
  } else if (currentLevel === 17) {
    updateLevel17.call(this, time);
  } else if (currentLevel === 18) {
    updateLevel18.call(this, time);
  } else if (currentLevel === 19) {
    updateLevel19.call(this, time);
  } else {
    updateLevel20.call(this, time);
  }

  updateSmallSprings();
  if (teleportSequenceState) return;
  if (updateLadderInteraction(this, time)) {
    if (player.y > HEIGHT + 55) die.call(this, player);
    return;
  }

  const patrolPlatformGrounded = isPlayerSupportedByPatrolPlatform(player, time);
  const grounded = player.body.blocked.down
    || player.body.touching.down
    || patrolPlatformGrounded;
  const stableGrounded = grounded
    && (player.body.velocity.y >= 0 || patrolPlatformGrounded);
  if (stableGrounded && !wasGrounded) audioManager.play('land');
  wasGrounded = grounded;
  if (stableGrounded) {
    player.setData('springLaunchActive', false);
    player.setData('springPassThroughActive', false);
    player.body.checkCollision.up = true;
    coyoteUntil = time + PLAYER_COYOTE_MS;
    jumpsUsed = 0;
  }
  if (
    player.getData('springPassThroughActive') === true
    && player.body.velocity.y >= 0
  ) {
    player.setData('springPassThroughActive', false);
    player.body.checkCollision.up = true;
  }
  if (
    player.getData('springLaunchActive') === true
    && player.body.velocity.y >= PLAYER_SHORT_JUMP_CUTOFF
  ) {
    player.setData('springLaunchActive', false);
  }

  if (consumeJumpJustDown(true)) {
    jumpBufferUntil = time + PLAYER_JUMP_BUFFER_MS;
  }

  if (isControlDown('left')) {
    player.setAccelerationX(-1900);
    facing = -1;
  } else if (isControlDown('right')) {
    player.setAccelerationX(1900);
    facing = 1;
  } else {
    player.setAccelerationX(0);
  }
  player.setFlipX(facing < 0);

  const canUseFirstJump = !springLaunchPending
    && jumpBufferUntil > time && coyoteUntil > time && jumpsUsed === 0;
  const canUseSecondJump = jumpBufferUntil > time && !grounded && !canUseFirstJump
    && !springLaunchPending && jumpsUsed < PLAYER_MAX_JUMPS;
  if (canUseFirstJump || canUseSecondJump) {
    player.setData('springLaunchActive', false);
    player.setVelocityY(
      canUseFirstJump ? PLAYER_FIRST_JUMP_VELOCITY : PLAYER_SECOND_JUMP_VELOCITY
    );
    player.setData('patrolPlatformJumpDetachUntil', time + 180);
    audioManager.play('jump');
    wasGrounded = false;
    jumpBufferUntil = 0;
    coyoteUntil = 0;
    jumpsUsed = canUseFirstJump ? 1 : PLAYER_MAX_JUMPS;
  }

  const jumpHeld = isJumpHeld();
  if (
    !jumpHeld
    && player.getData('springLaunchActive') !== true
    && player.body.velocity.y < PLAYER_SHORT_JUMP_CUTOFF
  ) {
    player.setVelocityY(PLAYER_SHORT_JUMP_CUTOFF);
  }

  updatePlayerAnimation(stableGrounded);

  if (player.y > HEIGHT + 55) die.call(this, player);
}

function createTextures(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });

  if (!scene.textures.exists('player')) {
    g.fillStyle(THEME.gameplay.player).fillRect(0, 0, 35, 36);
    g.fillStyle(THEME.gameplay.playerDark).fillRect(4, 36, 10, 6).fillRect(21, 36, 10, 6);
    g.lineStyle(2, THEME.gameplay.ink);
    g.strokeRect(1, 1, 33, 34);
    g.strokeRect(5, 35, 8, 6).strokeRect(22, 35, 8, 6);
    g.fillStyle(THEME.gameplay.white).fillRect(21, 11, 8, 8);
    g.fillStyle(THEME.gameplay.ink).fillRect(25, 13, 3, 4).fillRect(10, 24, 12, 2);
    g.generateTexture('player', 35, 42);
    g.clear();
  }

  g.fillStyle(THEME.gameplay.ground).fillRect(0, 0, 64, 32);
  g.lineStyle(2, THEME.gameplay.groundLine).strokeRect(1, 1, 62, 30);
  g.lineBetween(16, 2, 16, 30).lineBetween(48, 2, 48, 30);
  g.generateTexture('ground', 64, 32);
  g.clear();

  const world2Terrain = THEME.worlds.world2.terrain;
  g.fillStyle(world2Terrain.fill).fillRect(0, 0, 64, 32);
  g.lineStyle(2, world2Terrain.line).strokeRect(1, 1, 62, 30);
  g.lineBetween(16, 2, 16, 30).lineBetween(48, 2, 48, 30);
  g.generateTexture(world2Terrain.textureKey, 64, 32);
  g.clear();

  const world3Terrain = THEME.worlds.world3.terrain;
  g.fillStyle(world3Terrain.fill).fillRect(0, 0, 64, 32);
  g.fillStyle(world3Terrain.accent).fillRect(0, 0, 64, 6);
  g.lineStyle(2, world3Terrain.line).strokeRect(1, 1, 62, 30);
  g.lineStyle(1, world3Terrain.line, 0.62).lineBetween(1, 7, 63, 7);
  g.generateTexture(world3Terrain.textureKey, 64, 32);
  g.clear();

  g.fillStyle(THEME.gameplay.moving).fillRect(0, 0, 112, 22);
  g.lineStyle(2, THEME.gameplay.movingDark).strokeRect(1, 1, 110, 20);
  g.fillStyle(THEME.gameplay.movingDark)
    .fillRect(18, 9, 12, 4).fillRect(42, 9, 12, 4)
    .fillRect(66, 9, 12, 4).fillRect(90, 9, 12, 4);
  g.generateTexture('moving-platform', 112, 22);
  g.clear();

  const world2Platform = THEME.mechanismSkins.world2.movingPlatform;
  g.fillStyle(world2Platform.fill).fillRect(0, 0, 112, 22);
  g.fillStyle(world2Platform.accent)
    .fillRect(12, 5, 18, 5).fillRect(40, 11, 22, 5).fillRect(74, 5, 24, 5);
  g.lineStyle(2, world2Platform.outline).strokeRect(1, 1, 110, 20);
  g.generateTexture(world2Platform.textureKey, 112, 22);
  g.clear();

  const world3Platform = THEME.mechanismSkins.world3.movingPlatform;
  g.fillStyle(world3Platform.fill).fillRoundedRect(0, 0, 112, 22, 9);
  g.lineStyle(2, world3Platform.outline).strokeRoundedRect(1, 1, 110, 20, 8);
  g.lineStyle(2, world3Platform.accent, 0.94)
    .lineBetween(18, 15, 34, 5)
    .lineBetween(70, 16, 88, 5);
  g.generateTexture(world3Platform.textureKey, 112, 22);
  g.clear();

  const world2CloudPlatform = THEME.mechanismSkins.world2.movingPlatform;
  g.fillStyle(THEME.worlds.world2.fog.blue, 0.94)
    .fillRoundedRect(2, 9, 116, 13, 7);
  g.fillStyle(THEME.worlds.world2.fog.white, 0.98)
    .fillCircle(25, 11, 10)
    .fillCircle(59, 8, 14)
    .fillCircle(95, 11, 10)
    .fillRoundedRect(8, 10, 104, 10, 5);
  g.fillStyle(THEME.gameplay.lavender, 0.72).fillRoundedRect(16, 18, 28, 3, 1);
  g.fillStyle(THEME.gameplay.mint, 0.72).fillRoundedRect(46, 18, 28, 3, 1);
  g.fillStyle(THEME.gameplay.butter, 0.72).fillRoundedRect(76, 18, 28, 3, 1);
  g.lineStyle(2, world2CloudPlatform.outline, 0.78)
    .strokeRoundedRect(2, 9, 116, 13, 7);
  g.generateTexture('rainbow-cloud-platform', 120, 24);
  g.clear();

  const world3JarMirror = THEME.worlds.world3.mirror;
  g.fillStyle(world3JarMirror.roseGold, 0.96)
    .fillRoundedRect(7, 18, 48, 52, 14);
  g.fillStyle(world3JarMirror.silver, 0.98)
    .fillRoundedRect(2, 8, 58, 20, 10);
  g.fillStyle(world3JarMirror.paleRose, 0.9)
    .fillEllipse(31, 17, 42, 12);
  g.lineStyle(2, world3JarMirror.silver, 0.92)
    .strokeRoundedRect(8, 19, 46, 50, 13)
    .lineBetween(18, 56, 32, 31);
  g.generateTexture('teleport-jar', 62, 76);
  g.clear();

  const drawLadderTexture = (skin) => {
    g.fillStyle(skin.rail).fillRect(5, 0, 8, 160).fillRect(35, 0, 8, 160);
    g.fillStyle(skin.rung);
    for (let y = 10; y < 154; y += 24) g.fillRect(13, y, 22, 6);
    g.lineStyle(2, skin.outline)
      .strokeRect(5, 0, 8, 160)
      .strokeRect(35, 0, 8, 160);
    g.generateTexture(skin.textureKey, 48, 160);
    g.clear();
  };
  const drawSpringTextures = (skin) => {
    g.fillStyle(skin.base).fillRect(2, 20, 44, 8);
    g.fillStyle(skin.coil)
      .fillRect(8, 15, 32, 5)
      .fillRect(13, 9, 22, 6)
      .fillRect(8, 4, 32, 5);
    g.lineStyle(2, skin.outline).strokeRect(2, 20, 44, 7).strokeRect(8, 4, 32, 16);
    g.generateTexture(skin.textureKey, 48, 28);
    g.clear();

    g.fillStyle(skin.base).fillRect(2, 20, 44, 8);
    g.fillStyle(skin.coil).fillRect(8, 14, 32, 6).fillRect(12, 10, 24, 4);
    g.lineStyle(2, skin.outline).strokeRect(2, 20, 44, 7).strokeRect(8, 10, 32, 10);
    g.generateTexture(skin.compressedTextureKey, 48, 28);
    g.clear();
  };
  drawLadderTexture(THEME.mechanismSkins.world1.ladder);
  drawSpringTextures(THEME.mechanismSkins.world1.spring);
  drawLadderTexture(THEME.mechanismSkins.world2.ladder);
  drawSpringTextures(THEME.mechanismSkins.world2.spring);
  drawLadderTexture(THEME.mechanismSkins.world3.ladder);
  drawSpringTextures(THEME.mechanismSkins.world3.spring);

  g.fillStyle(THEME.gameplay.hazard);
  g.fillTriangle(0, 42, 24, 4, 48, 42);
  g.lineStyle(2, THEME.gameplay.hazardDark)
    .lineBetween(0, 42, 24, 4).lineBetween(24, 4, 48, 42);
  g.generateTexture('spike', 48, 42);
  g.clear();

  g.fillStyle(THEME.gameplay.goalPole).fillRect(4, 6, 6, 76);
  g.fillStyle(THEME.gameplay.goal).fillRect(10, 10, 28, 20);
  g.lineStyle(2, THEME.gameplay.ink).strokeRect(11, 11, 26, 18);
  g.fillStyle(THEME.gameplay.goalLight).fillRect(40, 16, 8, 8);
  g.generateTexture('goal', 50, 82);
  g.clear();

  const world3Mirror = THEME.worlds.world3.mirror;
  g.fillStyle(world3Mirror.roseGold).fillRoundedRect(3, 5, 8, 77, 4);
  g.fillStyle(world3Mirror.paleRose).fillRoundedRect(9, 9, 32, 23, 10);
  g.lineStyle(2, world3Mirror.outline).strokeRoundedRect(10, 10, 30, 21, 9);
  g.lineStyle(2, world3Mirror.silver, 0.96).lineBetween(17, 26, 31, 14);
  g.fillStyle(world3Mirror.silver).fillCircle(44, 19, 4);
  g.generateTexture('goal-world3', 50, 82);
  g.clear();

  g.fillStyle(THEME.gameplay.box).fillRect(0, 0, 48, 48);
  g.lineStyle(2, THEME.gameplay.boxLine).strokeRect(1, 1, 46, 46);
  g.lineBetween(5, 5, 43, 43).lineBetween(43, 5, 5, 43);
  g.generateTexture('box', 48, 48);
  g.clear();

  g.fillStyle(THEME.gameplay.box).fillRoundedRect(0, 0, 48, 48, 9);
  g.lineStyle(2, THEME.gameplay.boxLine).strokeRoundedRect(1, 1, 46, 46, 8);
  g.lineStyle(2, world3Mirror.silver, 0.9)
    .lineBetween(10, 33, 25, 17)
    .lineBetween(27, 20, 38, 9);
  g.generateTexture('box-world3', 48, 48);
  g.clear();

  g.fillStyle(THEME.gameplay.button).fillRect(0, 0, 54, 12);
  g.lineStyle(2, THEME.gameplay.buttonLine).strokeRect(1, 1, 52, 10);
  g.generateTexture('button', 54, 12);
  g.clear();

  g.fillStyle(THEME.gameplay.button).fillRoundedRect(0, 0, 54, 12, 6);
  g.lineStyle(2, THEME.gameplay.buttonLine).strokeRoundedRect(1, 1, 52, 10, 5);
  g.lineStyle(1, world3Mirror.silver, 0.96).lineBetween(17, 9, 27, 3);
  g.generateTexture('button-world3', 54, 12);
  g.clear();

  g.fillStyle(THEME.gameplay.door).fillRect(0, 0, 42, 220);
  g.lineStyle(2, THEME.gameplay.doorLine).strokeRect(1, 1, 40, 218);
  g.fillStyle(THEME.gameplay.doorLine).fillRect(6, 6, 6, 208).fillRect(30, 6, 6, 208);
  g.fillStyle(THEME.gameplay.goal).fillRect(18, 14, 6, 192);
  g.generateTexture('door', 42, 220);
  g.clear();

  g.fillStyle(THEME.gameplay.door).fillRoundedRect(0, 0, 42, 220, 14);
  g.lineStyle(2, THEME.gameplay.doorLine).strokeRoundedRect(1, 1, 40, 218, 13);
  g.fillStyle(THEME.gameplay.doorLine)
    .fillRoundedRect(6, 7, 6, 206, 3)
    .fillRoundedRect(30, 7, 6, 206, 3);
  g.lineStyle(2, world3Mirror.silver, 0.9)
    .lineBetween(15, 66, 26, 44)
    .lineBetween(15, 166, 27, 142);
  g.generateTexture('door-world3', 42, 220);
  g.clear();

  g.fillStyle(THEME.gameplay.falling).fillRect(0, 0, 120, 22);
  g.lineStyle(2, THEME.gameplay.fallingLine).strokeRect(1, 1, 118, 20);
  g.lineBetween(20, 4, 28, 10).lineBetween(28, 10, 22, 17);
  g.lineBetween(78, 4, 84, 10).lineBetween(84, 10, 76, 17);
  g.generateTexture('fall-platform', 120, 22);
  g.clear();

  g.fillStyle(THEME.worlds.world3.mirror.silver, 0.5)
    .fillCircle(17, 26, 16)
    .fillCircle(44, 22, 22)
    .fillCircle(75, 25, 18)
    .fillCircle(98, 27, 13);
  g.fillStyle(THEME.worlds.world2.fog.white, 0.82)
    .fillCircle(17, 24, 14)
    .fillCircle(44, 20, 20)
    .fillCircle(75, 23, 16)
    .fillCircle(98, 25, 11);
  g.generateTexture('memory-cloud', 112, 48);
  g.clear();

  g.fillStyle(THEME.gameplay.cannon).fillRect(0, 6, 52, 30);
  g.fillStyle(THEME.gameplay.ink).fillRect(38, 13, 20, 16);
  g.lineStyle(2, THEME.gameplay.ink).strokeRect(1, 7, 50, 28);
  g.generateTexture('fire-cannon', 58, 42);
  g.clear();

  const world2Cannon = THEME.mechanismSkins.world2.fireCannon;
  g.fillStyle(world2Cannon.fill).fillRect(0, 6, 52, 30);
  g.fillStyle(world2Cannon.frosting)
    .fillRect(4, 8, 12, 6).fillRect(20, 8, 12, 6).fillRect(36, 8, 12, 6);
  g.fillStyle(world2Cannon.outline).fillRect(38, 13, 20, 16);
  g.lineStyle(2, world2Cannon.outline).strokeRect(1, 7, 50, 28);
  g.generateTexture(world2Cannon.textureKey, 58, 42);
  g.clear();

  const world3Cannon = THEME.mechanismSkins.world3.fireCannon;
  g.fillStyle(world3Cannon.fill).fillRoundedRect(0, 6, 52, 30, 11);
  g.lineStyle(2, world3Cannon.outline).strokeRoundedRect(1, 7, 50, 28, 10);
  g.fillStyle(world3Cannon.outline).fillRoundedRect(36, 13, 22, 16, 7);
  g.lineStyle(2, world3Cannon.frosting, 0.95)
    .lineBetween(10, 27, 21, 12)
    .lineBetween(25, 28, 36, 13);
  g.generateTexture(world3Cannon.textureKey, 58, 42);
  g.clear();

  g.fillStyle(THEME.gameplay.fireball).fillRect(3, 3, 18, 18);
  g.lineStyle(2, THEME.gameplay.hazardDark).strokeRect(4, 4, 16, 16);
  g.generateTexture('fireball', 24, 24);
  g.clear();

  const world2Fireball = THEME.mechanismSkins.world2.fireball;
  g.fillStyle(world2Fireball.fill).fillRect(3, 3, 18, 18);
  g.fillStyle(world2Fireball.core).fillRect(8, 8, 8, 8);
  g.lineStyle(2, world2Fireball.outline).strokeRect(4, 4, 16, 16);
  g.generateTexture(world2Fireball.textureKey, 24, 24);
  g.clear();

  const world3Fireball = THEME.mechanismSkins.world3.fireball;
  g.fillStyle(world3Fireball.fill).fillCircle(12, 12, 10);
  g.lineStyle(2, world3Fireball.outline).strokeCircle(12, 12, 9);
  g.lineStyle(2, world3Fireball.core, 0.96)
    .lineBetween(7, 14, 12, 7)
    .lineBetween(13, 8, 16, 5);
  g.generateTexture(world3Fireball.textureKey, 24, 24);
  g.clear();

  g.fillStyle(THEME.gameplay.checkpoint).fillRect(4, 2, 6, 62);
  g.fillStyle(THEME.gameplay.mint).fillRect(10, 5, 22, 22);
  g.lineStyle(2, THEME.gameplay.ink).strokeRect(11, 6, 20, 20);
  g.generateTexture('checkpoint', 34, 66);
  g.clear();

  const world3Checkpoint = THEME.mechanismSkins.world3.checkpoint;
  g.fillStyle(world3Checkpoint.pole).fillRoundedRect(4, 2, 7, 62, 4);
  g.fillStyle(world3Checkpoint.flag).fillEllipse(21, 17, 24, 26);
  g.lineStyle(2, world3Checkpoint.outline).strokeEllipse(21, 17, 22, 24);
  g.lineStyle(2, world3Checkpoint.highlight, 0.96).lineBetween(17, 23, 24, 12);
  g.generateTexture(world3Checkpoint.textureKey, 34, 66);
  g.clear();

  g.fillStyle(THEME.gameplay.goalLight, 0.92)
    .fillTriangle(24, 2, 46, 24, 24, 46)
    .fillTriangle(24, 2, 2, 24, 24, 46);
  g.fillStyle(THEME.gameplay.mint, 0.82).fillCircle(24, 24, 10);
  g.lineStyle(3, THEME.gameplay.ink, 0.78)
    .lineBetween(24, 2, 46, 24)
    .lineBetween(46, 24, 24, 46)
    .lineBetween(24, 46, 2, 24)
    .lineBetween(2, 24, 24, 2);
  g.generateTexture('mist-token', 48, 48);
  g.clear();

  g.fillStyle(THEME.worlds.world2.fog.white, 0.72)
    .fillCircle(32, 54, 29)
    .fillCircle(62, 36, 34)
    .fillCircle(96, 52, 31)
    .fillCircle(66, 67, 38);
  g.fillStyle(THEME.worlds.world2.fog.blue, 0.58)
    .fillCircle(44, 66, 23)
    .fillCircle(86, 66, 25);
  g.lineStyle(3, THEME.mechanismSkins.world2.fireCannon.outline, 0.72)
    .strokeCircle(62, 36, 33)
    .strokeCircle(66, 67, 37);
  g.fillStyle(THEME.gameplay.ink, 0.82)
    .fillRect(45, 48, 8, 11)
    .fillRect(80, 48, 8, 11)
    .fillRect(58, 70, 18, 5);
  g.generateTexture('mist-boss', 130, 104);
  g.clear();

  g.fillStyle(THEME.gameplay.hazard);
  g.fillTriangle(2, 56, 16, 8, 30, 56);
  g.fillRect(2, 56, 28, 8);
  g.lineStyle(2, THEME.gameplay.hazardDark)
    .lineBetween(2, 56, 16, 8).lineBetween(16, 8, 30, 56)
    .strokeRect(3, 56, 26, 7);
  g.generateTexture('alt-spike', 32, 64);
  g.destroy();
}

function createPlayerAnimations(scene) {
  if (scene.textures.get('player').frameTotal < 13) return;

  scene.anims.create({
    key: 'danzai-idle',
    frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
    frameRate: 3,
    repeat: -1
  });
  scene.anims.create({
    key: 'danzai-run',
    frames: scene.anims.generateFrameNumbers('player', { start: 3, end: 8 }),
    frameRate: 16,
    repeat: -1
  });
  scene.anims.create({
    key: 'danzai-jump',
    frames: scene.anims.generateFrameNumbers('player', { start: 9, end: 10 }),
    frameRate: 6,
    repeat: 0
  });
  scene.anims.create({
    key: 'danzai-fall',
    frames: scene.anims.generateFrameNumbers('player', { start: 11, end: 12 }),
    frameRate: 6,
    repeat: 0
  });
}

function updatePlayerAnimation(grounded) {
  if (!player.scene.anims.exists('danzai-idle')) return;

  let animationKey = 'danzai-idle';
  if (!grounded) animationKey = player.body.velocity.y < 0 ? 'danzai-jump' : 'danzai-fall';
  else if (Math.abs(player.body.velocity.x) > 12) animationKey = 'danzai-run';

  if (!player.anims.currentAnim || player.anims.currentAnim.key !== animationKey) {
    player.play(animationKey, true);
  }
  player.anims.timeScale = animationKey === 'danzai-run'
    ? Phaser.Math.Clamp(Math.abs(player.body.velocity.x) / 225, 0.55, 1)
    : 1;
}

function drawBackdrop(scene, worldWidth, level) {
  const colors = THEME.levelBackdrops[level];
  const layer = scene.add.container(0, 0).setDepth(THEME.depths.background);
  const sky = scene.add.graphics();
  const distant = scene.add.graphics();
  const scenery = scene.add.graphics();

  sky.fillStyle(colors.sky).fillRect(0, 0, worldWidth, HEIGHT);
  sky.fillStyle(THEME.gameplay.cloud);
  for (let x = 96; x < worldWidth; x += 360) {
    sky.fillRect(x, 116 + ((x / 360) % 2) * 34, 74, 14);
    sky.fillRect(x + 18, 102 + ((x / 360) % 2) * 34, 38, 14);
  }

  if (level <= 7) drawWorld1DistantSilhouettes(distant, worldWidth, colors);
  else if (level <= 13) drawWorld2DistantSilhouettes(distant, worldWidth, colors);
  else drawWorld3DistantSilhouettes(distant, worldWidth, colors);

  scenery.fillStyle(colors.structures);
  drawLevelScenery(scenery, worldWidth, level);
  if (level <= 7) drawWorld1ToffeeMotifs(scenery, worldWidth, level);
  drawSyrupRiver(scenery, worldWidth, level, colors);
  layer.add([sky, distant, scenery]);
  return layer;
}

function drawWorld1DistantSilhouettes(graphics, worldWidth, colors) {
  graphics.fillStyle(colors.horizon);
  for (let x = 0; x < worldWidth; x += 430) {
    const stagger = (x / 430) % 2 * 18;
    graphics.fillRect(x + 22, 290 + stagger, 54, 122 - stagger)
      .fillRect(x, 276 + stagger, 98, 20)
      .fillRect(x + 14, 256 + stagger, 70, 20)
      .fillRect(x + 188, 318 - stagger, 126, 94 + stagger)
      .fillRect(x + 222, 274 - stagger, 58, 44)
      .fillRect(x + 238, 246 - stagger, 26, 28);
  }
}

function drawWorld2DistantSilhouettes(graphics, worldWidth, colors) {
  graphics.fillStyle(colors.horizon, 0.72);
  for (let x = -120; x < worldWidth + 220; x += 520) {
    const row = Math.abs(Math.floor(x / 520)) % 3;
    const y = 250 + row * 30;
    graphics.fillRect(x, y + 62, 286, 42)
      .fillRect(x + 48, y + 34, 190, 28)
      .fillRect(x + 92, y + 12, 104, 22)
      .fillRect(x + 344, y + 100, 122, 24)
      .fillRect(x + 378, y + 78, 58, 22);
  }
}

function drawWorld3DistantSilhouettes(graphics, worldWidth, colors) {
  graphics.fillStyle(colors.horizon);
  for (let x = 0; x < worldWidth; x += 320) {
    const offset = (x / 320) % 3;
    graphics.fillRect(x, 300 - offset * 12, 136, 112 + offset * 12)
      .fillRect(x + 30, 260 - offset * 12, 76, 40)
      .fillRect(x + 52, 232 - offset * 12, 32, 28)
      .fillRect(x + 176, 326 + offset * 8, 112, 86 - offset * 8);
  }
}

function drawWorld1ToffeeMotifs(graphics, worldWidth, level) {
  const motifs = THEME.worlds.world1.motifs;
  const lateWorld = level >= 6;
  const treeSpacing = lateWorld ? 820 : 620;
  const chapelSpacing = lateWorld ? 1900 : 1500;
  const treeAlpha = lateWorld ? 0.32 : 0.48;
  const chapelAlpha = lateWorld ? 0.28 : 0.42;

  for (let x = 180; x < worldWidth; x += treeSpacing) {
    const stagger = ((x / treeSpacing) % 2) * 18;
    graphics.fillStyle(motifs.trunk, treeAlpha)
      .fillRect(x, 274 + stagger, 24, 136 - stagger);
    graphics.fillStyle(motifs.canopy, treeAlpha)
      .fillRect(x - 24, 270 + stagger, 72, 18)
      .fillRect(x - 12, 252 + stagger, 48, 18);
    graphics.fillStyle(motifs.drip, treeAlpha)
      .fillRect(x - 12, 288 + stagger, 14, 30)
      .fillRect(x + 28, 288 + stagger, 12, 22);
  }

  for (let x = 760; x < worldWidth; x += chapelSpacing) {
    graphics.fillStyle(motifs.chapel, chapelAlpha)
      .fillRect(x, 310, 116, 100)
      .fillRect(x + 38, 270, 40, 40)
      .fillRect(x + 48, 244, 20, 26);
    graphics.fillStyle(motifs.chapelDark, chapelAlpha)
      .fillRect(x + 20, 352, 24, 58)
      .fillRect(x + 72, 352, 24, 58);
    graphics.fillStyle(motifs.amberWindow, lateWorld ? 0.36 : 0.58)
      .fillRect(x + 50, 282, 16, 18)
      .fillRect(x + 50, 326, 16, 20);
  }
}

function drawLevelScenery(graphics, worldWidth, level) {
  if (level >= 8 && level <= 13) {
    const colors = THEME.levelBackdrops[level];
    for (let x = 180; x < worldWidth; x += 760) {
      const stagger = (x / 760) % 2 * 36;
      graphics.fillStyle(colors.structures, 0.46)
        .fillRect(x, 292 + stagger, 210, 32)
        .fillRect(x + 38, 266 + stagger, 132, 26)
        .fillRect(x + 286, 348 - stagger, 128, 24)
        .fillRect(x + 318, 326 - stagger, 64, 22);
    }
    return;
  }
  if (level === 1) {
    for (let x = 260; x < worldWidth; x += 520) {
      graphics.fillRect(x, 338, 88, 72).fillRect(x + 18, 318, 52, 20);
      graphics.fillStyle(THEME.gameplay.route)
        .fillRect(x + 102, 350, 48, 24).fillRect(x + 150, 356, 12, 12);
      graphics.fillStyle(THEME.levelBackdrops[1].structures);
    }
    return;
  }

  if (level === 2) {
    for (let x = 300; x < worldWidth; x += 620) {
      graphics.fillRect(x, 278, 100, 132).fillRect(x + 20, 252, 60, 26);
      graphics.fillRect(x + 116, 334, 148, 18).fillRect(x + 238, 300, 26, 52);
      graphics.fillStyle(THEME.gameplay.pipeDark)
        .fillRect(x + 16, 300, 68, 8).fillRect(x + 16, 324, 42, 8);
      graphics.fillStyle(THEME.levelBackdrops[2].structures);
    }
    return;
  }

  const structures = THEME.levelBackdrops[level].structures;
  for (let x = 250; x < worldWidth; x += 700) {
    graphics.fillRect(x, 324, 122, 86).fillRect(x + 22, 294, 78, 30);
    graphics.fillRect(x + 154, 354, 90, 16).fillRect(x + 232, 326, 22, 44);
    graphics.fillStyle(THEME.gameplay.backdropInk)
      .fillRect(x + 174, 350, 14, 24).fillRect(x + 204, 342, 14, 32);
    graphics.fillStyle(THEME.gameplay.route)
      .fillRect(x + 286, 320, 54, 26).fillRect(x + 340, 327, 14, 12);
    if (level === 4) {
      graphics.fillStyle(THEME.gameplay.pipeDark)
        .fillRect(x + 390, 286, 12, 76)
        .fillRect(x + 414, 304, 12, 58)
        .fillRect(x + 438, 326, 12, 36);
    }
    graphics.fillStyle(structures);
  }
}

function drawSyrupRiver(graphics, worldWidth, level, colors) {
  const riverTop = level === 1 ? 410 : level === 2 ? 438 : 458;
  graphics.fillStyle(THEME.gameplay.dryBank).fillRect(0, 404, worldWidth, 66);
  if (level < 3) {
    graphics.fillStyle(colors.syrup).fillRect(0, riverTop, worldWidth, 470 - riverTop);
    graphics.fillStyle(colors.syrupDark);
    for (let x = 42; x < worldWidth; x += 168) {
      graphics.fillRect(x, riverTop + 14, level === 1 ? 74 : 48, 6);
    }
    return;
  }

  graphics.fillStyle(colors.syrup);
  for (let x = 36; x < worldWidth; x += 330) {
    graphics.fillRect(x, riverTop, 156, 12);
  }
  graphics.fillStyle(colors.syrupDark);
  for (let x = 72; x < worldWidth; x += 330) {
    graphics.fillRect(x, riverTop + 4, 70, 4);
  }
}

function createJumpGuide(scene) {
  const guide = scene.add.container(232, 404).setDepth(THEME.depths.guidance).setVisible(false);
  const labelBg = scene.add.rectangle(0, -66, 210, 38, THEME.gameplay.cloud, 0.9)
    .setStrokeStyle(2, THEME.gameplay.skyStrong);
  const label = scene.add.text(0, -66, textFor('guide.jump'), {
    fontFamily: THEME.typography.display,
    fontSize: '15px',
    color: THEME.colors.ink
  }).setOrigin(0.5);
  const ghost = scene.add.image(-62, 19, 'player').setAlpha(0.62).setScale(0.78);
  const arrow = scene.add.text(0, -20, '↗', {
    fontFamily: THEME.typography.display,
    fontSize: '26px',
    color: THEME.colors.pink
  }).setOrigin(0.5);
  guide.add([labelBg, label, arrow, ghost]);

  const jumpMotion = { progress: 0 };
  const motionTween = scene.tweens.add({
    targets: jumpMotion,
    progress: 1,
    duration: 760,
    repeat: -1,
    repeatDelay: 360,
    onUpdate: () => {
      ghost.x = Phaser.Math.Linear(-62, 64, jumpMotion.progress);
      ghost.y = 19 - Math.sin(Math.PI * jumpMotion.progress) * 62;
    }
  });
  const arrowTween = scene.tweens.add({
    targets: arrow,
    alpha: 0.25,
    yoyo: true,
    repeat: -1,
    duration: 380
  });
  guide.setData('guideTweens', [motionTween, arrowTween]);
  return guide;
}

function die(hitPlayer) {
  if (isDead || isCleared) return;
  isDead = true;
  deaths += 1;
  saveProgress();
  audioManager.play('death');
  attemptsText.setText(textFor('hud.attempt', { count: deaths + 1 }));
  deathsText.setText(textFor('hud.deaths', { count: deaths }));
  hitPlayer.setTint(THEME.gameplay.hazard);
  hitPlayer.setVelocity(0, -180);
  hitPlayer.setAccelerationX(0);
  hitPlayer.body.checkCollision.none = true;
  playDeathFeedback(this, hitPlayer, () => respawn.call(this));
}

function respawn() {
  if (currentLevel === 20) {
    resetLevel20.call(this, true);
    playRespawnFeedback(this, player);
    return;
  }
  if (currentLevel === 19) {
    resetLevel19.call(this, true);
    playRespawnFeedback(this, player);
    return;
  }
  if (currentLevel === 18) {
    resetLevel18.call(this, true);
    playRespawnFeedback(this, player);
    return;
  }
  if (currentLevel === 17) {
    resetLevel17.call(this, true);
    playRespawnFeedback(this, player);
    return;
  }
  if (currentLevel === 16) {
    resetLevel16.call(this, true);
    playRespawnFeedback(this, player);
    return;
  }
  if (currentLevel === 15) {
    resetLevel15.call(this, true);
    playRespawnFeedback(this, player);
    return;
  }
  if (currentLevel === 14) {
    resetLevel14.call(this, true);
    playRespawnFeedback(this, player);
    return;
  }
  if (currentLevel === 13) {
    resetLevel13.call(this, true);
    playRespawnFeedback(this, player);
    return;
  }
  if (currentLevel === 12) {
    resetLevel12.call(this, true);
    playRespawnFeedback(this, player);
    return;
  }
  if (currentLevel === 11) {
    resetLevel11.call(this, true);
    playRespawnFeedback(this, player);
    return;
  }
  if (currentLevel === 10) {
    resetLevel10.call(this, false);
    playRespawnFeedback(this, player);
    return;
  }
  if (currentLevel === 9) {
    resetLevel9.call(this, true);
    playRespawnFeedback(this, player);
    return;
  }
  if (currentLevel === 8) {
    resetLevel8.call(this, true);
    playRespawnFeedback(this, player);
    return;
  }
  if (currentLevel === 7) {
    resetLevel7.call(this, true);
    playRespawnFeedback(this, player);
    return;
  }
  if (currentLevel === 6) {
    resetLevel6.call(this, true);
    playRespawnFeedback(this, player);
    return;
  }
  if (currentLevel === 5) {
    resetLevel5.call(this, true);
    playRespawnFeedback(this, player);
    return;
  }
  if (currentLevel === 4) {
    resetLevel4.call(this);
    playRespawnFeedback(this, player);
    return;
  }
  if (currentLevel === 3) {
    resetLevel3.call(this);
    playRespawnFeedback(this, player);
    return;
  }
  if (currentLevel === 2) {
    resetLevel2.call(this);
    playRespawnFeedback(this, player);
    return;
  }
  resetLevel1.call(this);
  playRespawnFeedback(this, player);
}

function clearLevel() {
  if (isDead || isCleared) return;
  isCleared = true;
  audioManager.stopLevelLoops();
  audioManager.play('levelClear');
  completedLevels.add(currentLevel);
  unlockLevel(Math.min(currentLevel + 1, TOTAL_LEVELS));
  saveProgress();
  player.setAccelerationX(0).setVelocityX(0);
  if (currentLevel >= 5 && currentLevel <= TOTAL_LEVELS) {
    stopFireballSystem();
    if (typeof stopAlternatingSpikeSystem === 'function') stopAlternatingSpikeSystem();
    movingPlatforms?.children.each((platform) => platform.setVelocity(0));
  }
  if (currentLevel === 3 || currentLevel === 4) {
    movingPlatform.setVelocityX(0);
    clearFallingPlatformCycles(this);
    fallingPlatforms.children.each((platform) => {
      platform.body.allowGravity = false;
      platform.setVelocity(0);
    });
  }
  if (currentLevel === TOTAL_LEVELS) {
    beginEndingCinematic(this, () => returnToTitleAfterEnding(this));
    return;
  }
  configureClearPanel(currentLevel);
  showClearCelebration(this);
  showClearActions(currentLevel);
  clearPanel.setVisible(true).setAlpha(0).setScale(1);
  this.tweens.add({
    targets: clearPanel,
    alpha: 1,
    ease: 'Linear',
    duration: reducedMotion ? 1 : THEME.motion.clearPanelMs
  });
}

function setupClearActions(scene) {
  document.querySelector('#next-level-button').addEventListener('click', () => {
    if (currentLevel === 1 && isCleared) transitionToLevel(scene, 2);
    else if (currentLevel === 2 && isCleared) transitionToLevel(scene, 3);
    else if (currentLevel === 3 && isCleared) transitionToLevel(scene, 4);
    else if (currentLevel === 4 && isCleared) transitionToLevel(scene, 5);
    else if (currentLevel === 5 && isCleared) transitionToLevel(scene, 6);
    else if (currentLevel === 6 && isCleared) transitionToLevel(scene, 7);
    else if (currentLevel === 7 && isCleared) transitionToLevel(scene, 8);
    else if (currentLevel === 8 && isCleared) transitionToLevel(scene, 9);
    else if (currentLevel === 9 && isCleared) transitionToLevel(scene, 10);
    else if (currentLevel === 10 && isCleared) transitionToLevel(scene, 11);
    else if (currentLevel === 11 && isCleared) transitionToLevel(scene, 12);
    else if (currentLevel === 12 && isCleared) transitionToLevel(scene, 13);
    else if (currentLevel === 13 && isCleared) transitionToLevel(scene, 14);
    else if (currentLevel === 14 && isCleared) transitionToLevel(scene, 15);
    else if (currentLevel === 15 && isCleared) transitionToLevel(scene, 16);
    else if (currentLevel === 16 && isCleared) transitionToLevel(scene, 17);
    else if (currentLevel === 17 && isCleared) transitionToLevel(scene, 18);
    else if (currentLevel === 18 && isCleared) transitionToLevel(scene, 19);
    else if (currentLevel === 19 && isCleared) transitionToLevel(scene, 20);
  });
  document.querySelector('#replay-button').addEventListener('click', () => {
    if (!isCleared) return;
    if (currentLevel === 1) restartLevel.call(scene);
    else if (currentLevel === 2) resetLevel2.call(scene);
    else if (currentLevel === 3) resetLevel3.call(scene);
    else if (currentLevel === 4) resetLevel4.call(scene);
    else if (currentLevel === 5) resetLevel5.call(scene, false);
    else if (currentLevel === 6) resetLevel6.call(scene, false);
    else if (currentLevel === 7) resetLevel7.call(scene, false);
    else if (currentLevel === 8) resetLevel8.call(scene, false);
    else if (currentLevel === 9) resetLevel9.call(scene, false);
    else if (currentLevel === 10) resetLevel10.call(scene, false);
    else if (currentLevel === 11) resetLevel11.call(scene, false);
    else if (currentLevel === 12) resetLevel12.call(scene, false);
    else if (currentLevel === 13) resetLevel13.call(scene, false);
    else if (currentLevel === 14) resetLevel14.call(scene, false);
    else if (currentLevel === 15) resetLevel15.call(scene, false);
    else if (currentLevel === 16) resetLevel16.call(scene, false);
    else if (currentLevel === 17) resetLevel17.call(scene, false);
    else if (currentLevel === 18) resetLevel18.call(scene, false);
    else if (currentLevel === 19) resetLevel19.call(scene, false);
    else resetLevel20.call(scene, false);
  });
  document.querySelector('#clear-level-select-button').addEventListener('click', () => {
    if (isCleared) showLevelSelect(scene, 'title-menu');
  });
}

function updateTouchControlsVisibility() {
  const controls = document.querySelector('#touch-controls');
  if (!controls) return;
  const hasOpenMenu = Boolean(document.querySelector('.menu-panel:not([hidden])'));
  const orientationBlocked = document.querySelector('#orientation-warning')?.hidden === false;
  const active = usesTouchControls()
    && !hasOpenMenu
    && !orientationBlocked
    && !isPaused
    && !isCleared
    && !storyDialogue
    && !endingCinematicState;
  if (controls) controls.hidden = !active;
  if (!active) clearTouchInput();
}

function setupTouchControls(scene) {
  document.querySelectorAll('[data-touch-input]').forEach((button) => {
    const action = button.dataset.touchInput;
    const press = (event) => {
      event.preventDefault();
      button.setPointerCapture?.(event.pointerId);
      touchInput[action] = true;
      button.classList.add('is-pressed');
      audioManager.unlock?.();
    };
    const release = (event) => {
      event.preventDefault();
      touchInput[action] = false;
      button.classList.remove('is-pressed');
    };
    button.addEventListener('pointerdown', press);
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
  });

  const gameSurface = document.querySelector('#game');
  const jumpPointers = new Set();
  gameSurface?.addEventListener('pointerdown', (event) => {
    if (!usesTouchControls() || event.clientX < window.innerWidth / 2) return;
    if (isTransitioning || storyDialogue || isDead || isCleared || isPaused || endingCinematicState) return;
    event.preventDefault();
    gameSurface.setPointerCapture?.(event.pointerId);
    if (!touchInput.jump) touchInput.jumpJustDown = true;
    jumpPointers.add(event.pointerId);
    touchInput.jump = true;
    audioManager.unlock?.();
  });
  const releaseJump = (event) => {
    if (!jumpPointers.delete(event.pointerId)) return;
    event.preventDefault();
    touchInput.jump = jumpPointers.size > 0;
  };
  gameSurface?.addEventListener('pointerup', releaseJump);
  gameSurface?.addEventListener('pointercancel', releaseJump);
  gameSurface?.addEventListener('lostpointercapture', releaseJump);

  document.querySelector('#touch-settings')?.addEventListener('click', (event) => {
    event.preventDefault();
    if (isTransitioning || storyDialogue || isDead || isCleared || isPaused) return;
    clearTouchInput();
    setGameplayPaused(scene, true);
    showMenu('pause-menu');
  });
  const clearAllTouchInput = () => {
    jumpPointers.clear();
    clearTouchInput();
  };
  window.addEventListener('pointercancel', clearAllTouchInput);
  window.addEventListener('blur', clearAllTouchInput);
  window.addEventListener('pagehide', clearAllTouchInput);
}

function setupMobileLifecycle(scene) {
  const portraitQuery = window.matchMedia('(orientation: portrait)');
  const updateOrientation = () => {
    const warning = document.querySelector('#orientation-warning');
    const mustRotate = usesTouchControls() && portraitQuery.matches;
    if (warning) warning.hidden = !mustRotate;
    const hasOpenMenu = Boolean(document.querySelector('.menu-panel:not([hidden])'));
    if (mustRotate && !isPaused && !hasOpenMenu && !isDead && !isCleared) {
      pausedByOrientation = true;
      setGameplayPaused(scene, true);
    } else if (!mustRotate && pausedByOrientation) {
      pausedByOrientation = false;
      if (!hasOpenMenu) setGameplayPaused(scene, false);
    }
    updateTouchControlsVisibility();
  };
  portraitQuery.addEventListener?.('change', updateOrientation);
  window.addEventListener('orientationchange', updateOrientation);
  window.addEventListener('resize', updateOrientation);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTouchInput();
      const hasOpenMenu = Boolean(document.querySelector('.menu-panel:not([hidden])'));
      if (!hasOpenMenu && !storyDialogue && !isDead && !isCleared && !isPaused) {
        setGameplayPaused(scene, true);
        showMenu('pause-menu');
      }
    }
  });
  updateOrientation();
}

function setupShell(scene) {
  const query = new URLSearchParams(window.location.search);
  developerModeActive = query.has('dev') || query.has('ending-preview');
  const endingPreviewButton = document.querySelector('#ending-preview-button');
  if (endingPreviewButton) endingPreviewButton.hidden = !developerModeActive;
  loadProgress();
  applyDomLanguage();
  refreshLocalizedGameUi();
  audioManager.setSettings({ masterVolume, musicVolume, sfxVolume, muted: audioMuted });
  updateProgressMenus();
  setGameplayPaused(scene, true, false);
  audioManager.playMusic('menuMusic');
  showMenu(currentLanguage ? 'title-menu' : 'language-menu');
  setupAudioControls();
  setupUiAudio();
  setupTouchControls(scene);
  setupMobileLifecycle(scene);

  if (query.has('ending-preview')) {
    showMenu(null);
    setGameplayPaused(scene, false);
    beginEndingCinematic(scene, () => returnToTitleAfterEnding(scene));
  }

  document.querySelector('#continue-button').addEventListener('click', () => {
    transitionToLevel(scene, highestUnlockedLevel);
  });
  document.querySelector('#open-level-select').addEventListener('click', () => {
    showLevelSelect(scene, 'title-menu');
  });
  document.querySelector('#open-settings').addEventListener('click', () => {
    updateMotionButton();
    showMenu('settings-menu');
  });
  const chooseLanguage = (language) => {
    currentLanguage = language;
    applyDomLanguage();
    refreshLocalizedGameUi();
    updateProgressMenus();
    updateMuteButtonLabel();
    updateMotionButton();
    saveProgress();
    showMenu('title-menu');
  };
  document.querySelector('#choose-chinese').addEventListener('click', () => chooseLanguage('zh'));
  document.querySelector('#choose-english').addEventListener('click', () => chooseLanguage('en'));
  document.querySelector('#open-language').addEventListener('click', () => showMenu('language-menu'));
  document.querySelector('#motion-toggle').addEventListener('click', () => {
    reducedMotion = !reducedMotion;
    applyMotionPreference();
    updateMotionButton();
    saveProgress();
  });
  document.querySelector('#settings-back').addEventListener('click', () => {
    showMenu('title-menu');
  });
  document.querySelector('#clear-save-button').addEventListener('click', clearAllProgress);
  document.querySelector('#level-select-back').addEventListener('click', () => {
    const returnTo = document.querySelector('#level-select-menu').dataset.returnTo || 'title-menu';
    showMenu(returnTo);
  });
  document.querySelectorAll('.level-select-button').forEach((button) => {
    button.addEventListener('click', () => {
      const level = Number(button.dataset.level);
      if (developerModeActive || level <= highestUnlockedLevel) transitionToLevel(scene, level);
    });
  });
  document.querySelector('#ending-preview-button').addEventListener('click', () => {
    showMenu(null);
    setGameplayPaused(scene, false);
    beginEndingCinematic(scene, () => returnToTitleAfterEnding(scene));
  });
  document.querySelector('#resume-button').addEventListener('click', () => resumeGame(scene));
  document.querySelector('#restart-button').addEventListener('click', () => {
    resetCurrentLevel(scene);
    resumeGame(scene);
  });
  document.querySelector('#pause-level-select').addEventListener('click', () => {
    showLevelSelect(scene, 'pause-menu');
  });
  document.querySelector('#return-title-button').addEventListener('click', () => {
    clearCelebration(scene);
    clearPanel.setVisible(false);
    hideClearActions();
    showMenu('title-menu');
    updateProgressMenus();
    setGameplayPaused(scene, true, false);
    audioManager.playMusic('menuMusic');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' && event.key.toLowerCase() !== 'p') return;
    if (isTransitioning || storyDialogue) return;
    event.preventDefault();
    const pauseMenu = document.querySelector('#pause-menu');
    const levelSelect = document.querySelector('#level-select-menu');
    const settingsMenu = document.querySelector('#settings-menu');
    const titleMenu = document.querySelector('#title-menu');
    const languageMenu = document.querySelector('#language-menu');
    if (!languageMenu.hidden) {
      if (currentLanguage) showMenu('title-menu');
    } else if (!settingsMenu.hidden) {
      showMenu('title-menu');
    } else if (!levelSelect.hidden) {
      showMenu(levelSelect.dataset.returnTo || 'title-menu');
    } else if (!pauseMenu.hidden) {
      resumeGame(scene);
    } else if (titleMenu.hidden && !isDead && !isCleared) {
      setGameplayPaused(scene, true);
      showMenu('pause-menu');
    }
  });
}

function showMenu(menuId) {
  ['language-menu', 'title-menu', 'level-select-menu', 'settings-menu', 'pause-menu'].forEach((id) => {
    document.querySelector(`#${id}`).hidden = id !== menuId;
  });
  if (menuId === 'pause-menu') refreshPauseStats();
  if (menuId) document.querySelector(`#${menuId} button:not(:disabled)`)?.focus();
  updateTouchControlsVisibility();
}

function refreshPauseStats() {
  const attempts = document.querySelector('#pause-attempts');
  const deathCount = document.querySelector('#pause-deaths');
  if (attempts) attempts.textContent = textFor('hud.attempt', { count: deaths + 1 });
  if (deathCount) deathCount.textContent = textFor('hud.deaths', { count: deaths });
}

function showLevelSelect(scene, returnTo) {
  setGameplayPaused(scene, true, returnTo !== 'title-menu');
  hideClearActions();
  clearPanel.setVisible(false);
  const menu = document.querySelector('#level-select-menu');
  menu.dataset.returnTo = returnTo;
  updateProgressMenus();
  showMenu('level-select-menu');
}

function setGameplayPaused(scene, paused, pauseAudio = paused) {
  isPaused = paused;
  scene.time.paused = paused;
  if (paused) {
    scene.physics.pause();
    scene.tweens.pauseAll();
    if (pauseAudio) audioManager.pauseAll();
    else audioManager.resumeAll();
  } else {
    scene.tweens.resumeAll();
    scene.physics.resume();
    audioManager.resumeAll();
  }
  updateTouchControlsVisibility();
}

function resumeGame(scene) {
  showMenu(null);
  setGameplayPaused(scene, false);
  document.querySelector('#game').focus();
}

function returnToTitleAfterEnding(scene) {
  destroyEndingCinematic(scene);
  clearCelebration(scene);
  clearPanel.setVisible(false);
  hideClearActions();
  updateProgressMenus();
  showMenu('title-menu');
  setGameplayPaused(scene, true, false);
  audioManager.playMusic('menuMusic');
}

function transitionToLevel(scene, level) {
  if (isTransitioning || level < 1 || (!developerModeActive && level > highestUnlockedLevel)) return;
  isTransitioning = true;
  setGameplayPaused(scene, true, false);
  audioManager.playMusic(
    level >= 14 ? 'transitionAmbience' : level >= 8 ? 'world2Music' : 'levelMusic'
  );
  showMenu(null);
  hideClearActions();
  const transition = document.querySelector('#screen-transition');
  transition.classList.add('is-visible');
  window.setTimeout(() => {
    if (level === 1) startLevel1.call(scene);
    else if (level === 2) startLevel2.call(scene);
    else if (level === 3) startLevel3.call(scene);
    else if (level === 4) startLevel4.call(scene);
    else if (level === 5) startLevel5.call(scene);
    else if (level === 6) startLevel6.call(scene);
    else if (level === 7) startLevel7.call(scene);
    else if (level === 8) startLevel8.call(scene);
    else if (level === 9) startLevel9.call(scene);
    else if (level === 10) startLevel10.call(scene);
    else if (level === 11) startLevel11.call(scene);
    else if (level === 12) startLevel12.call(scene);
    else if (level === 13) startLevel13.call(scene);
    else if (level === 14) startLevel14.call(scene);
    else if (level === 15) startLevel15.call(scene);
    else if (level === 16) startLevel16.call(scene);
    else if (level === 17) startLevel17.call(scene);
    else if (level === 18) startLevel18.call(scene);
    else if (level === 19) startLevel19.call(scene);
    else startLevel20.call(scene);
    window.setTimeout(() => {
      transition.classList.remove('is-visible');
      isTransitioning = false;
      setGameplayPaused(scene, false);
      document.querySelector('#game').focus();
    }, THEME.motion.transitionMs);
  }, THEME.motion.transitionMs);
}

function resetCurrentLevel(scene) {
  if (currentLevel === 1) resetLevel1.call(scene);
  else if (currentLevel === 2) resetLevel2.call(scene);
  else if (currentLevel === 3) resetLevel3.call(scene);
  else if (currentLevel === 4) resetLevel4.call(scene);
  else if (currentLevel === 5) resetLevel5.call(scene, false);
  else if (currentLevel === 6) resetLevel6.call(scene, false);
  else if (currentLevel === 7) resetLevel7.call(scene, false);
  else if (currentLevel === 8) resetLevel8.call(scene, false);
  else if (currentLevel === 9) resetLevel9.call(scene, false);
  else if (currentLevel === 10) resetLevel10.call(scene, false);
  else if (currentLevel === 11) resetLevel11.call(scene, false);
  else if (currentLevel === 12) resetLevel12.call(scene, false);
  else if (currentLevel === 13) resetLevel13.call(scene, false);
  else if (currentLevel === 14) resetLevel14.call(scene, false);
  else if (currentLevel === 15) resetLevel15.call(scene, false);
  else if (currentLevel === 16) resetLevel16.call(scene, false);
  else if (currentLevel === 17) resetLevel17.call(scene, false);
  else if (currentLevel === 18) resetLevel18.call(scene, false);
  else if (currentLevel === 19) resetLevel19.call(scene, false);
  else resetLevel20.call(scene, false);
}

function warnAboutStorage(message, error) {
  if (storageWarningIssued) return;
  storageWarningIssued = true;
  console.warn(`[Danzi Run save] ${message}`, error ?? '');
}

function resetProgressDefaults() {
  highestUnlockedLevel = 1;
  completedLevels = new Set();
  collectedItems = new Set();
  deaths = 0;
  currentLanguage = null;
  reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  masterVolume = AUDIO_CONFIG.defaults.masterVolume;
  musicVolume = AUDIO_CONFIG.defaults.musicVolume;
  sfxVolume = AUDIO_CONFIG.defaults.sfxVolume;
  audioMuted = AUDIO_CONFIG.defaults.muted;
  preservedSaveFields = {};
}

function normalizeProgressSave(rawSave) {
  if (!rawSave || typeof rawSave !== 'object' || Array.isArray(rawSave)) {
    throw new TypeError('Save data must be an object.');
  }
  const detectedVersion = rawSave.saveVersion ?? rawSave.version;
  if (!Number.isInteger(detectedVersion) || detectedVersion < 1) {
    throw new TypeError('Save version is missing or invalid.');
  }
  const settings = rawSave.settings && typeof rawSave.settings === 'object'
    ? rawSave.settings : rawSave;
  const unlockedCandidate = rawSave.unlockedLevel ?? rawSave.highestUnlockedLevel;
  const unlockedLevel = Number.isInteger(unlockedCandidate)
    ? Phaser.Math.Clamp(unlockedCandidate, 1, TOTAL_LEVELS) : 1;
  const completed = Array.isArray(rawSave.completedLevels)
    ? [...new Set(rawSave.completedLevels.filter((level) => (
      Number.isInteger(level) && level >= 1 && level <= TOTAL_LEVELS
    )))]
    : Array.from({ length: Math.max(0, unlockedLevel - 1) }, (_, index) => index + 1);
  const normalizedUnlocked = completed.reduce((level, completedLevel) => (
    completedLevel < TOTAL_LEVELS ? Math.max(level, completedLevel + 1) : level
  ), unlockedLevel);
  const normalizedItems = Array.isArray(rawSave.collectedItems)
    ? rawSave.collectedItems.filter((itemId) => (
      itemId === LEVEL_12_COLLECTIBLE_ID
      || itemId === MUD_COMPANION_CONFIG.id
      || itemId === MUD_COMPANION_SEPARATED_ID
      || itemId === MUD_COMPANION_REUNITED_ID
      || itemId === MUD_COMPANION_FAREWELL_ID
    )) : [];
  const clampVolume = (value, fallback) => Number.isFinite(value)
    ? Phaser.Math.Clamp(value, 0, 1) : fallback;
  return {
    source: { ...rawSave },
    unlockedLevel: normalizedUnlocked,
    completedLevels: [...new Set(completed)].sort((a, b) => a - b),
    collectedItems: [...new Set(normalizedItems)].sort(),
    totalDeaths: Number.isInteger(rawSave.totalDeaths) && rawSave.totalDeaths >= 0
      ? rawSave.totalDeaths : 0,
    reducedMotion: typeof rawSave.reducedMotion === 'boolean'
      ? rawSave.reducedMotion : reducedMotion,
    language: rawSave.language === 'zh' || rawSave.language === 'en'
      ? rawSave.language : null,
    masterVolume: clampVolume(settings.masterVolume, masterVolume),
    musicVolume: clampVolume(settings.musicVolume, musicVolume),
    sfxVolume: clampVolume(settings.sfxVolume ?? settings.soundVolume, sfxVolume),
    audioMuted: typeof (settings.audioMuted ?? settings.muted) === 'boolean'
      ? (settings.audioMuted ?? settings.muted) : audioMuted
  };
}

function loadProgress() {
  resetProgressDefaults();
  let rawSave = memoryProgressSave;
  try {
    const storedText = window.localStorage.getItem(SAVE_KEY);
    if (storedText !== null) rawSave = JSON.parse(storedText);
  } catch (error) {
    warnAboutStorage('Stored progress is unavailable or malformed; using safe defaults.', error);
  }
  if (rawSave) {
    try {
      const saved = normalizeProgressSave(rawSave);
      preservedSaveFields = saved.source;
      highestUnlockedLevel = saved.unlockedLevel;
      completedLevels = new Set(saved.completedLevels);
      collectedItems = new Set(saved.collectedItems);
      deaths = saved.totalDeaths;
      reducedMotion = saved.reducedMotion;
      currentLanguage = saved.language;
      masterVolume = saved.masterVolume;
      musicVolume = saved.musicVolume;
      sfxVolume = saved.sfxVolume;
      audioMuted = saved.audioMuted;
    } catch (error) {
      resetProgressDefaults();
      warnAboutStorage('Stored progress failed validation; using a new default save.', error);
    }
  }
  applyMotionPreference();
  updateMotionButton();
}

function buildProgressSave() {
  return {
    ...preservedSaveFields,
    version: SAVE_VERSION,
    saveVersion: SAVE_VERSION,
    highestUnlockedLevel,
    unlockedLevel: highestUnlockedLevel,
    completedLevels: [...completedLevels].sort((a, b) => a - b),
    totalDeaths: deaths,
    reducedMotion,
    masterVolume,
    musicVolume,
    sfxVolume,
    audioMuted,
    language: currentLanguage,
    collectedItems: [...collectedItems].sort(),
    settings: {
      masterVolume,
      musicVolume,
      soundVolume: sfxVolume,
      sfxVolume,
      muted: audioMuted
    }
  };
}

function saveProgress() {
  const saveData = buildProgressSave();
  memoryProgressSave = saveData;
  preservedSaveFields = { ...saveData };
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  } catch (error) {
    warnAboutStorage('localStorage is unavailable; progress will last for this tab only.', error);
  }
}

function clearAllProgress() {
  if (!window.confirm(textFor('settings.clearConfirm'))) return;
  if (!window.confirm(textFor('settings.clearConfirmAgain'))) return;
  memoryProgressSave = null;
  preservedSaveFields = {};
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch (error) {
    warnAboutStorage('localStorage could not be cleared; in-memory progress was reset.', error);
  }
  window.location.reload();
}

function setupAudioControls() {
  const controls = [
    ['master-volume', 'master-volume-value', 'masterVolume'],
    ['music-volume', 'music-volume-value', 'musicVolume'],
    ['sfx-volume', 'sfx-volume-value', 'sfxVolume']
  ];
  controls.forEach(([inputId, outputId, setting]) => {
    const input = document.querySelector(`#${inputId}`);
    const output = document.querySelector(`#${outputId}`);
    const value = setting === 'masterVolume' ? masterVolume
      : setting === 'musicVolume' ? musicVolume : sfxVolume;
    input.value = Math.round(value * 100);
    output.value = `${input.value}%`;
    input.addEventListener('input', () => {
      const nextValue = Number(input.value) / 100;
      if (setting === 'masterVolume') masterVolume = nextValue;
      else if (setting === 'musicVolume') musicVolume = nextValue;
      else sfxVolume = nextValue;
      output.value = `${input.value}%`;
      audioManager.setSettings({ masterVolume, musicVolume, sfxVolume, muted: audioMuted });
      saveProgress();
    });
  });
  const muteButton = document.querySelector('#mute-toggle');
  updateMuteButtonLabel();
  muteButton.addEventListener('click', () => {
    audioMuted = !audioMuted;
    audioManager.setSettings({ muted: audioMuted });
    updateMuteButtonLabel();
    saveProgress();
  });
}

function setupUiAudio() {
  document.querySelectorAll('.ui-button, #clear-actions button').forEach((button) => {
    button.addEventListener('pointerenter', () => {
      if (!button.disabled) audioManager.play('uiHover');
    });
    button.addEventListener('focus', () => {
      if (!button.disabled) audioManager.play('uiHover');
    });
    button.addEventListener('click', () => {
      if (!button.disabled) audioManager.play('uiSelect');
    });
  });
}

function unlockLevel(level) {
  const unlocked = Phaser.Math.Clamp(level, 1, TOTAL_LEVELS);
  if (unlocked <= highestUnlockedLevel) return;
  highestUnlockedLevel = unlocked;
  saveProgress();
  updateProgressMenus();
}

function updateProgressMenus() {
  const continueButton = document.querySelector('#continue-button');
  if (!continueButton) return;
  continueButton.textContent = highestUnlockedLevel === 1
    ? textFor('menu.start')
    : textFor('menu.continue', { level: highestUnlockedLevel });
  document.querySelectorAll('.level-select-button').forEach((button) => {
    const level = Number(button.dataset.level);
    const name = getLevelName(level);
    button.dataset.name = name;
    button.disabled = !developerModeActive && level > highestUnlockedLevel;
    button.textContent = String(level);
    const state = !developerModeActive && level > highestUnlockedLevel
      ? textFor('state.locked')
      : completedLevels.has(level) ? textFor('state.complete') : textFor('state.available');
    const description = currentLanguage === 'en'
      ? `Level ${level}${name ? ` · ${name}` : ''} · ${state}`
      : `第 ${level} 关${name ? ` · ${name}` : ''} · ${state}`;
    button.setAttribute('aria-label', description);
    button.title = description;
  });
}

function updateMotionButton() {
  const button = document.querySelector('#motion-toggle');
  if (button) button.textContent = textFor(reducedMotion ? 'settings.motionReduced' : 'settings.motionFull');
}

function updateMuteButtonLabel() {
  const button = document.querySelector('#mute-toggle');
  if (button) button.textContent = textFor(audioMuted ? 'settings.soundMuted' : 'settings.soundOn');
}

function refreshLocalizedGameUi() {
  attemptsText?.setText(textFor('hud.attempt', { count: deaths + 1 }));
  deathsText?.setText(textFor('hud.deaths', { count: deaths }));
  levelLabel?.setText(textFor('hud.level', { level: currentLevel }));
  controlsText?.setText(textFor(usesTouchControls() ? 'hud.controlsTouch' : 'hud.controls'));
  controlsText?.setVisible(currentLevel === 1);
  refreshPauseStats();
  if (clearPanel?.visible) configureClearPanel(currentLevel);
}

function showClearActions(level) {
  const actions = document.querySelector('#clear-actions');
  const nextButton = document.querySelector('#next-level-button');
  const replayButton = document.querySelector('#replay-button');
  actions.style.display = 'flex';
  nextButton.style.display = level < TOTAL_LEVELS ? 'inline-block' : 'none';
  replayButton.textContent = textFor(level === 1 ? 'clear.replay' : 'clear.replayLevel');
}

function hideClearActions() {
  document.querySelector('#clear-actions').style.display = 'none';
}

function restartLevel() {
  resetCurrentLevel(this);
}
