"use strict";

function addPlatform(scene, x, y, width, height) {
  const textureKey = currentLevel >= 14
    ? THEME.worlds.world3.terrain.textureKey
    : currentLevel >= 8
      ? THEME.worlds.world2.terrain.textureKey
      : 'ground';
  const body = platforms.create(x, y, textureKey).setDepth(THEME.depths.terrain);
  body.setDisplaySize(width, height).refreshBody();
  return body;
}

function removeActiveColliders(scene) {
  activeColliders.forEach((collider) => scene.physics.world.removeCollider(collider));
  activeColliders = [];
}

function cleanupCurrentLevel(scene) {
  audioManager.stopLevelLoops();
  clearCelebration(scene);
  clearGameplayPresentation(scene);
  destroyEndingCinematic(scene);
  removeActiveColliders(scene);
  clearBoxRespawnTimers();
  clearFallingPlatformCycles(scene);
  destroyMistBoss(scene);
  destroyMobilityTools(scene);
  destroyFireballSystem();
  destroyMudCompanion(scene);
  destroyLateWorldMechanisms(scene);
  clearLateWorldStoryPresentation(scene);
  level14EndingTimer?.remove(false);
  level14EndingTimer = null;
  destroyLevel14MirrorPool(scene, level14MirrorLandmark);
  level14MirrorLandmark = null;
  level14EndingState = 'idle';
  level15SeparationZone?.destroy();
  level15SeparationZone = null;
  clearLevel15SeparationPresentation(scene);
  destroyCompanionCaptureRack(scene, level15CaptureRack);
  level15CaptureRack = null;
  level15SeparationState = 'carried';
  level18ReunionZone?.destroy();
  level18ReunionZone = null;
  level18ReunionState = 'waiting';
  level20RoutePhase = 'start';
  lateWorld3Decorations.forEach((object) => object?.destroy());
  lateWorld3Decorations = [];
  if (typeof destroyLevel13TransitionPresentation === 'function') {
    destroyLevel13TransitionPresentation(scene);
  }
  if (typeof destroyAlternatingSpikeSystem === 'function') destroyAlternatingSpikeSystem();
  backdrop?.getData('ambientTweens')?.forEach((tween) => tween.stop());
  backdrop?.getData('detachedLayers')?.forEach((layer) => layer.destroy());
  level11RouteFog?.getData('fogTweens')?.forEach((tween) => tween.stop());
  jumpGuide?.getData('guideTweens')?.forEach((tween) => tween.stop());
  [
    player, clearPanel, startHint, pushHint, door, thirdLevelIntro, fourthLevelIntro,
    fifthLevelIntro, sixthLevelIntro, seventhLevelIntro, eighthLevelIntro,
    worldTransitionOverlay, movingPlatform, goal, level11Collectible, level11RouteFog,
    level12Collectible
  ]
    .forEach((object) => {
      if (object) scene.tweens.killTweensOf(object);
    });
  [
    platforms, spikes, boxes, fallingPlatforms, movingPlatforms,
    alternatingSpikes, checkpoints, ladders, smallSprings, recoveryZones,
    level12BranchZones
  ].forEach((group) => group?.clear(true, true));
  [
    movingPlatform, goal, jumpGuide, movingGuide, startHint, backdrop,
    doorLink, pressureButton, door, pushHint, thirdLevelIntro, fourthLevelIntro,
    timedSwitchMeter, fifthLevelIntro, sixthLevelIntro, seventhLevelIntro,
    eighthLevelIntro, worldTransitionOverlay, level11Collectible, level11RouteFog,
    level12Collectible, level12ReviewBubble
  ].forEach((object) => {
    if (object?.scene) object.destroy();
  });
  platforms = null;
  spikes = null;
  boxes = null;
  fallingPlatforms = null;
  movingPlatforms = null;
  ladders = null;
  smallSprings = null;
  recoveryZones = null;
  alternatingSpikes = null;
  alternatingSpikeControllers = [];
  movingPlatformSpikes = [];
  checkpoints = null;
  checkpointSpawns = [];
  activeCheckpointIndex = -1;
  movingPlatform = null;
  goal = null;
  level11Collectible = null;
  level11CollectibleCollected = false;
  level11RouteFog = null;
  level12Collectible = null;
  level12BranchZones = null;
  level12ReviewBubble = null;
  level13TransitionState = null;
  pressureButton = null;
  door = null;
  doorLink = null;
  pushHint = null;
  jumpGuide = null;
  movingGuide = null;
  startHint = null;
  thirdLevelIntro = null;
  fourthLevelIntro = null;
  fifthLevelIntro = null;
  sixthLevelIntro = null;
  seventhLevelIntro = null;
  eighthLevelIntro = null;
  worldTransitionOverlay = null;
  timedTriggerPlatform = null;
  timedSwitchMeter = null;
  timedSwitchActive = false;
  timedSwitchEndsAt = 0;
  timedSwitchArmed = true;
  timedSwitchDurationMs = TIMED_SWITCH_DURATION_MS;
  timedSwitchWarningMs = TIMED_SWITCH_WARNING_MS;
  backdrop = null;
  previousBoxPositions.clear();
}

function startLevel2() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('levelMusic');

  currentLevel = 2;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(2);
  backdrop = drawBackdrop(this, LEVEL_2_WIDTH, 2);
  platforms = this.physics.add.staticGroup();
  addPlatform(this, 700, 505, 1400, 70);
  addPlatform(this, 1412.5, 410, 25, 120);
  addPlatform(this, 1560, 365, 270, 30);
  addPlatform(this, 2110, 365, 350, 30);

  doorLink = this.add.graphics().setDepth(THEME.depths.link);
  doorLink.lineStyle(2, THEME.gameplay.goal, 0.72);
  doorLink.lineBetween(600, 454, 920, 454);
  doorLink.fillStyle(THEME.gameplay.goal, 0.9)
    .fillRect(593, 447, 14, 14).fillRect(913, 447, 14, 14);

  doorClosedX = 920;
  doorClosedY = 360;
  doorOpenY = 145;
  doorSafetyZone = new Phaser.Geom.Rectangle(892, 242, 56, 232);

  pressureButton = this.physics.add.staticImage(600, 464, 'button').setDepth(THEME.depths.mechanism);
  pressureButton.body.setSize(54, 16).setOffset(0, -4);
  pressureButton.refreshBody();

  door = this.physics.add.staticImage(920, 360, 'door').setDepth(THEME.depths.mechanism);
  door.body.setSize(42, 220);
  door.refreshBody();

  boxes = this.physics.add.group({ allowGravity: true });
  boxSpawns = [{ x: 250, y: 420 }, { x: 1120, y: 420 }];
  boxSpawns.forEach((spawn) => createBox(this, spawn.x, spawn.y));

  spikes = this.physics.add.staticGroup();
  const highSpike = spikes.create(1605, 329, 'spike').setDepth(THEME.depths.terrain - 1);
  highSpike.body.setSize(42, 25).setOffset(3, 17);
  highSpike.refreshBody();

  movingPlatform = this.physics.add.image(1755, 361, 'moving-platform')
    .setDepth(THEME.depths.mechanism);
  movingPlatform.setImmovable(true);
  movingPlatform.body.allowGravity = false;
  movingPlatform.setFrictionX(1);
  movingPlatform.body.setVelocityX(82);
  movingPlatform.body.setSize(112, 18).setOffset(0, 2);

  goal = this.physics.add.staticImage(2200, 309, 'goal').setDepth(THEME.depths.mechanism);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(this.physics.add.collider(boxes, platforms));
  activeColliders.push(this.physics.add.collider(player, boxes));
  activeColliders.push(this.physics.add.collider(player, movingPlatform));
  activeColliders.push(this.physics.add.collider(boxes, movingPlatform));
  activeColliders.push(this.physics.add.collider(player, door));
  activeColliders.push(this.physics.add.collider(boxes, door));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(player, goal, clearLevel, null, this));

  pushHint = null;
  showGameplayHint(this, LEVEL_NARRATIVE_HINTS[2]);

  this.physics.world.setBounds(0, 0, LEVEL_2_WIDTH, HEIGHT + 100);
  this.cameras.main.setBounds(0, 0, LEVEL_2_WIDTH, HEIGHT);
  resetLevel2.call(this);
}

function startLevel3() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('levelMusic');

  currentLevel = 3;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(3);

  backdrop = drawBackdrop(this, LEVEL_3_WIDTH, 3);
  platforms = this.physics.add.staticGroup();
  addPlatform(this, 210, 505, 420, 70);
  addPlatform(this, 630, 505, 340, 70);
  addPlatform(this, 1453, 505, 714, 70);
  addPlatform(this, 2170, 405, 130, 26);
  addPlatform(this, 2535, 405, 280, 32);

  doorClosedX = 1360;
  doorClosedY = 360;
  doorOpenY = 145;
  doorSafetyZone = new Phaser.Geom.Rectangle(1332, 242, 56, 232);

  doorLink = this.add.graphics().setDepth(THEME.depths.link);
  doorLink.lineStyle(2, THEME.gameplay.goal, 0.72);
  doorLink.lineBetween(1150, 454, doorClosedX, 454);
  doorLink.fillStyle(THEME.gameplay.goal, 0.9)
    .fillRect(1143, 447, 14, 14)
    .fillRect(doorClosedX - 7, 447, 14, 14);

  pressureButton = this.physics.add.staticImage(1150, 464, 'button').setDepth(THEME.depths.mechanism);
  pressureButton.body.setSize(54, 16).setOffset(0, -4);
  pressureButton.refreshBody();

  door = this.physics.add.staticImage(doorClosedX, doorClosedY, 'door')
    .setDepth(THEME.depths.mechanism);
  door.body.setSize(42, 220);
  door.refreshBody();

  boxes = this.physics.add.group({ allowGravity: true });
  boxSpawns = [{ x: 650, y: 420 }];
  boxSpawns.forEach((spawn) => createBox(this, spawn.x, spawn.y));

  // Align the physical top exactly with both shores so crates unload without catching a 2px ledge.
  movingPlatform = this.physics.add.image(level3MovingMin, 479, 'moving-platform')
    .setDepth(THEME.depths.mechanism);
  movingPlatform.setDisplaySize(144, 22);
  movingPlatform.setImmovable(true);
  movingPlatform.body.allowGravity = false;
  movingPlatform.setFrictionX(1);
  movingPlatform.body.setVelocityX(82);
  movingPlatform.body.setSize(144, 18).setOffset(0, 2);

  fallingPlatforms = this.physics.add.group({ allowGravity: false });
  // Safe introduction: flush with the floor so the player naturally triggers it,
  // while the gray ground underneath prevents a death during the demonstration.
  createFallingPlatform(this, 1650, 479);
  createFallingPlatform(this, 1875, 455);
  createFallingPlatform(this, 2015, 425);
  createFallingPlatform(this, 2315, 385);

  spikes = this.physics.add.staticGroup();
  const finalSpike = spikes.create(2485, 368, 'spike').setDepth(THEME.depths.terrain - 1);
  finalSpike.body.setSize(42, 25).setOffset(3, 17);
  finalSpike.refreshBody();

  goal = this.physics.add.staticImage(2620, 348, 'goal').setDepth(THEME.depths.mechanism);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(this.physics.add.collider(boxes, platforms));
  activeColliders.push(this.physics.add.collider(player, boxes));
  activeColliders.push(this.physics.add.collider(player, movingPlatform));
  activeColliders.push(this.physics.add.collider(
    boxes,
    movingPlatform,
    markMovingPlatformContact,
    null,
    this
  ));
  activeColliders.push(this.physics.add.collider(player, door));
  activeColliders.push(this.physics.add.collider(boxes, door));
  activeColliders.push(this.physics.add.collider(player, fallingPlatforms));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(player, goal, clearLevel, null, this));

  thirdLevelIntro = null;
  showGameplayHint(this, LEVEL_NARRATIVE_HINTS[3]);

  this.physics.world.setBounds(0, 0, LEVEL_3_WIDTH, HEIGHT + 100);
  this.cameras.main.setBounds(0, 0, LEVEL_3_WIDTH, HEIGHT);
  resetLevel3.call(this);
}

function startLevel4() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('levelMusic');

  currentLevel = 4;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(4);

  backdrop = drawBackdrop(this, LEVEL_4_WIDTH, 4);
  platforms = this.physics.add.staticGroup();
  addPlatform(this, 310, 505, 620, 70);
  addPlatform(this, 1135, 505, 690, 70);
  addPlatform(this, 1480, 375, 280, 30);
  addPlatform(this, 2185, 455, 110, 26);
  addPlatform(this, 2900, 505, 600, 70);

  doorClosedX = 2820;
  doorClosedY = 360;
  doorOpenY = 145;
  doorSafetyZone = new Phaser.Geom.Rectangle(2792, 242, 56, 232);

  doorLink = this.add.graphics().setDepth(THEME.depths.link);
  doorLink.lineStyle(2, THEME.gameplay.goal, 0.72);
  doorLink.lineBetween(1740, 344, doorClosedX, 344);
  for (let x = 1840; x < doorClosedX; x += 180) {
    doorLink.fillStyle(THEME.gameplay.goal, 0.9).fillRect(x, 338, 12, 12);
  }
  doorLink.fillStyle(THEME.gameplay.goal, 0.9)
    .fillRect(1733, 337, 14, 14)
    .fillRect(doorClosedX - 7, 337, 14, 14);

  pressureButton = null;
  timedSwitchMeter = createTimedSwitchMeter(this, 1635, 294, 210);
  fourthLevelIntro = null;
  createGameplayHintTrigger(this, 1450, LEVEL_NARRATIVE_HINTS[4], 300);

  door = this.physics.add.staticImage(doorClosedX, doorClosedY, 'door')
    .setDepth(THEME.depths.mechanism);
  door.body.setSize(42, 220);
  door.refreshBody();

  boxes = this.physics.add.group({ allowGravity: true });
  boxSpawns = [{ x: 500, y: 420 }];
  boxSpawns.forEach((spawn) => createBox(this, spawn.x, spawn.y));

  movingPlatform = this.physics.add.image(level4MovingMin, 479, 'moving-platform')
    .setDepth(THEME.depths.mechanism);
  movingPlatform.setDisplaySize(80, 22);
  movingPlatform.setImmovable(true);
  movingPlatform.body.allowGravity = false;
  movingPlatform.setFrictionX(1);
  movingPlatform.body.setVelocityX(82);
  // Keep the visual and collision widths identical so the platform edges stay readable.
  movingPlatform.body.setSize(80, 18).setOffset(0, 2);

  fallingPlatforms = this.physics.add.group({ allowGravity: false });
  timedTriggerPlatform = createFallingPlatform(this, 1740, 385);
  createFallingPlatform(this, 1890, 415);
  createFallingPlatform(this, 2040, 440);
  createFallingPlatform(this, 2330, 430);
  createFallingPlatform(this, 2480, 400);

  spikes = this.physics.add.staticGroup();
  [2670, 2990].forEach((x) => {
    const spike = spikes.create(x, 466, 'spike').setDepth(THEME.depths.terrain - 1);
    spike.body.setSize(42, 25).setOffset(3, 17);
    spike.refreshBody();
  });

  goal = this.physics.add.staticImage(3110, 437, 'goal').setDepth(THEME.depths.mechanism);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(this.physics.add.collider(boxes, platforms));
  activeColliders.push(this.physics.add.collider(player, boxes));
  activeColliders.push(this.physics.add.collider(player, movingPlatform));
  activeColliders.push(this.physics.add.collider(
    boxes,
    movingPlatform,
    markMovingPlatformContact,
    null,
    this
  ));
  activeColliders.push(this.physics.add.collider(player, door));
  activeColliders.push(this.physics.add.collider(boxes, door));
  activeColliders.push(this.physics.add.collider(player, fallingPlatforms));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(player, goal, clearLevel, null, this));

  this.physics.world.setBounds(0, 0, LEVEL_4_WIDTH, HEIGHT + 100);
  this.cameras.main.setBounds(0, 0, LEVEL_4_WIDTH, HEIGHT);
  resetLevel4.call(this);
}

function resetLevel2() {
  if (currentLevel !== 2) return;
  clearCelebration(this);
  audioManager.stopLevelLoops();
  this.tweens.killTweensOf(player);
  this.tweens.killTweensOf(door);
  player.body.checkCollision.none = false;
  player.clearTint().setAlpha(1).setPosition(LEVEL_2_START.x, LEVEL_2_START.y)
    .setVelocity(0).setAcceleration(0);
  player.body.reset(LEVEL_2_START.x, LEVEL_2_START.y);

  resetAllBoxes();

  buttonReleaseUntil = 0;
  buttonPressed = true;
  setButtonPressed(false);
  doorIsOpen = false;
  doorAnimating = false;
  door.setPosition(doorClosedX, doorClosedY).setAlpha(1).clearTint();
  door.body.enable = true;
  door.refreshBody();
  movingPlatform.setPosition(1755, 361).setVelocityX(82);

  isDead = false;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  coyoteUntil = 0;
  jumpBufferUntil = 0;
  jumpsUsed = 0;
  wasGrounded = true;
  this.cameras.main.stopFollow();
  this.cameras.main.setScroll(0, 0);
  this.cameras.main.startFollow(player, true, 0.12, 0.12);
}

function resetLevel3() {
  if (currentLevel !== 3) return;
  clearCelebration(this);
  audioManager.stopLevelLoops();
  this.tweens.killTweensOf(player);
  this.tweens.killTweensOf(door);
  player.body.checkCollision.none = false;
  player.clearTint().setAlpha(1).setPosition(LEVEL_3_START.x, LEVEL_3_START.y)
    .setVelocity(0).setAcceleration(0);
  player.body.reset(LEVEL_3_START.x, LEVEL_3_START.y);

  previousBoxPositions.clear();
  resetAllBoxes();

  buttonReleaseUntil = 0;
  buttonPressed = true;
  setButtonPressed(false);
  doorIsOpen = false;
  doorAnimating = false;
  door.setPosition(doorClosedX, doorClosedY).setAlpha(1).clearTint();
  door.body.enable = true;
  door.refreshBody();
  movingPlatform.setPosition(level3MovingMin, 479).setVelocityX(82);
  previousMovingPlatformX = level3MovingMin;
  resetAllFallingPlatforms(this);

  isDead = false;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  coyoteUntil = 0;
  jumpBufferUntil = 0;
  jumpsUsed = 0;
  wasGrounded = true;
  this.cameras.main.stopFollow();
  this.cameras.main.setScroll(0, 0);
  this.cameras.main.startFollow(player, true, 0.12, 0.12);
}

function resetLevel4() {
  if (currentLevel !== 4) return;
  clearCelebration(this);
  audioManager.stopLevelLoops();
  this.tweens.killTweensOf(player);
  this.tweens.killTweensOf(door);
  player.body.checkCollision.none = false;
  player.clearTint().setAlpha(1).setPosition(LEVEL_4_START.x, LEVEL_4_START.y)
    .setVelocity(0).setAcceleration(0);
  player.body.reset(LEVEL_4_START.x, LEVEL_4_START.y);

  previousBoxPositions.clear();
  resetAllBoxes();
  resetTimedSwitch();

  doorIsOpen = false;
  doorAnimating = false;
  door.setPosition(doorClosedX, doorClosedY).setAlpha(1).clearTint();
  door.body.enable = true;
  door.refreshBody();
  movingPlatform.setPosition(level4MovingMin, 479).setVelocityX(82);
  previousMovingPlatformX = level4MovingMin;
  resetAllFallingPlatforms(this);

  isDead = false;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  coyoteUntil = 0;
  jumpBufferUntil = 0;
  jumpsUsed = 0;
  wasGrounded = true;
  this.cameras.main.stopFollow();
  this.cameras.main.setScroll(0, 0);
  this.cameras.main.startFollow(player, true, 0.12, 0.12);
}

function createStandardSpike(scene, x, y = 466) {
  const spike = spikes.create(x, y, 'spike').setDepth(THEME.depths.terrain - 1);
  spike.body.setSize(42, 25).setOffset(3, 17);
  spike.refreshBody();
  return spike;
}

function startLevel5() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('levelMusic');

  currentLevel = 5;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(5);

  backdrop = drawBackdrop(this, LEVEL_5_WIDTH, 5);
  platforms = this.physics.add.staticGroup();
  addPlatform(this, 1750, 505, 3500, 70);
  addPlatform(this, 3900, 505, 160, 70);
  addPlatform(this, 4550, 505, 300, 70);
  addPlatform(this, 5070, 505, 140, 70);
  addPlatform(this, 5975, 505, 1250, 70);

  // Safe demonstration: the projectile crosses above the player and visibly stops at this wall.
  addPlatform(this, 920, 340, 32, 120);
  // Low cover blocks the torso-height fireballs while remaining easy to jump over.
  [1370, 1670, 1970].forEach((x) => addPlatform(this, x, 435, 38, 70));

  boxes = this.physics.add.group({ allowGravity: true });
  boxSpawns = [{ x: 2540, y: 420 }];
  boxSpawns.forEach((spawn) => createBox(this, spawn.x, spawn.y));

  movingPlatforms = this.physics.add.group({ allowGravity: false });
  createPatrolPlatform(this, {
    x: 3570, y: 479, minX: 3570, maxX: 3750, speed: 78, width: 140
  });
  createPatrolPlatform(this, {
    x: 4050, y: 479, minX: 4050, maxX: 4330, speed: 82, width: 140
  });

  fallingPlatforms = this.physics.add.group({ allowGravity: false });
  [4780, 4920, 5220, 5320].forEach((x, index) => {
    createFallingPlatform(this, x, index % 2 === 0 ? 455 : 425);
  });

  spikes = this.physics.add.staticGroup();
  [4610, 5580, 5800, 6020, 6240].forEach((x) => createStandardSpike(this, x));

  initializeFireballSystem(this);
  [
    { x: 450, y: 340, direction: 'right', interval: 2600, phaseOffset: 900, speed: 190 },
    { x: 1120, y: 430, direction: 'right', interval: 2400, phaseOffset: 800, speed: 205 },
    { x: 2260, y: 430, direction: 'left', interval: 2800, phaseOffset: 1500, speed: 205 },
    { x: 3300, y: 430, direction: 'left', interval: 2600, phaseOffset: 1100, speed: 195 },
    { x: 4490, y: 410, direction: 'left', interval: 3000, phaseOffset: 1700, speed: 190 },
    { x: 5400, y: 430, direction: 'right', interval: 2300, phaseOffset: 900, speed: 215 },
    { x: 6460, y: 390, direction: 'left', interval: 2700, phaseOffset: 1800, speed: 210 }
  ].forEach((config) => createFireCannon(this, {
    ...config,
    warningMs: 650,
    maxInstances: 2,
    blockedByWalls: true,
    blockedByBoxes: true
  }));

  checkpoints = this.physics.add.staticGroup();
  createCheckpoint(this, 3360, 437, 3360, 425);

  goal = this.physics.add.staticImage(6530, 437, 'goal').setDepth(THEME.depths.mechanism);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(this.physics.add.collider(boxes, platforms));
  activeColliders.push(this.physics.add.collider(player, boxes));
  activeColliders.push(createPlayerPatrolPlatformCollider(this));
  activeColliders.push(this.physics.add.collider(boxes, movingPlatforms));
  activeColliders.push(this.physics.add.collider(player, fallingPlatforms));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(player, fireballs, fireballHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(fireballs, platforms, fireballHitsPlatform));
  activeColliders.push(this.physics.add.overlap(fireballs, boxes, fireballHitsBox));
  activeColliders.push(this.physics.add.overlap(player, checkpoints, activateCheckpoint));
  activeColliders.push(this.physics.add.overlap(player, goal, clearLevel, null, this));

  fifthLevelIntro = null;
  showGameplayHint(this, LEVEL_NARRATIVE_HINTS[5]);

  this.physics.world.setBounds(0, 0, LEVEL_5_WIDTH, HEIGHT + 100);
  this.cameras.main.setBounds(0, 0, LEVEL_5_WIDTH, HEIGHT);
  resetLevel5.call(this, false);
}

function updateLevel5(time) {
  updateBoxes.call(this, time, LEVEL_5_WIDTH);
  updatePatrolPlatforms();
  updateFallingPlatforms.call(this);
  updateFireCannons(this, time);
}

function resetLevel5(preserveCheckpoint = false) {
  if (currentLevel !== 5) return;
  clearCelebration(this);
  audioManager.stopLevelLoops();
  this.tweens.killTweensOf(player);
  if (!preserveCheckpoint) resetCheckpointProgress();
  const spawn = getCurrentRespawn(LEVEL_5_START);

  player.body.checkCollision.none = false;
  player.clearTint().setAlpha(1).setPosition(spawn.x, spawn.y)
    .setVelocity(0).setAcceleration(0);
  player.body.reset(spawn.x, spawn.y);

  previousBoxPositions.clear();
  resetAllBoxes();
  resetPatrolPlatforms();
  resetAllFallingPlatforms(this);
  resetFireballSystem(this);

  isDead = false;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  coyoteUntil = 0;
  jumpBufferUntil = 0;
  jumpsUsed = 0;
  wasGrounded = true;
  this.cameras.main.stopFollow();
  this.cameras.main.centerOn(spawn.x, HEIGHT / 2);
  this.cameras.main.startFollow(player, true, 0.12, 0.12);
}

function startLevel6() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('levelMusic');

  currentLevel = 6;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(6);

  backdrop = drawBackdrop(this, LEVEL_6_WIDTH, 6);
  platforms = this.physics.add.staticGroup();
  addPlatform(this, 2650, 505, 5300, 70);
  addPlatform(this, 5800, 505, 180, 70);
  addPlatform(this, 6550, 505, 300, 70);
  addPlatform(this, 6900, 455, 140, 24);
  addPlatform(this, 7180, 425, 140, 24);
  addPlatform(this, 7470, 505, 260, 70);

  // Match the complete 64 px visual housing so its upper face is never non-solid.
  [
    [800, 334], [1200, 334], [2200, 334], [3350, 334],
    [4850, 334], [6150, 334], [6690, 334]
  ].forEach(([x, bottom]) => addPlatform(this, x, bottom - 32, 120, 64));

  // A short elevation lesson; the camera reveals both takeoff and landing.
  addPlatform(this, 1850, 430, 180, 26);
  addPlatform(this, 2070, 385, 180, 26);
  addPlatform(this, 2290, 430, 180, 26);

  boxes = this.physics.add.group({ allowGravity: true });
  boxSpawns = [{ x: 4410, y: 420 }];
  boxSpawns.forEach((spawn) => createBox(this, spawn.x, spawn.y));

  movingPlatforms = this.physics.add.group({ allowGravity: false });
  createPatrolPlatform(this, {
    x: 5370, y: 479, minX: 5370, maxX: 5640, speed: 72, width: 140
  });
  createPatrolPlatform(this, {
    x: 5960, y: 479, minX: 5960, maxX: 6330, speed: 76, width: 140
  });

  fallingPlatforms = this.physics.add.group({ allowGravity: false });
  createFallingPlatform(this, 6760, 455);
  createFallingPlatform(this, 7040, 425);
  createFallingPlatform(this, 7300, 395);

  spikes = this.physics.add.staticGroup();
  [2500, 4000].forEach((x) => createStandardSpike(this, x));

  initializeAlternatingSpikeSystem(this);
  [
    { floorX: 650, ceilingX: 800, phaseOffset: 0, ceilingSurfaceY: 334 },
    { floorX: 1050, ceilingX: 1200, phaseOffset: 700, ceilingSurfaceY: 334 },
    { floorX: 2050, ceilingX: 2200, phaseOffset: 1200, ceilingSurfaceY: 334 },
    { floorX: 3200, ceilingX: 3350, phaseOffset: 500, ceilingSurfaceY: 334 },
    { floorX: 4700, ceilingX: 4850, phaseOffset: 950, ceilingSurfaceY: 334 },
    { floorX: 6000, ceilingX: 6150, phaseOffset: 1450, ceilingSurfaceY: 334 },
    { floorX: 6560, ceilingX: 6690, phaseOffset: 1900, ceilingSurfaceY: 334 }
  ].forEach((config) => createAlternatingSpikePair(this, {
    ...config,
    warningMs: 600,
    holdMs: 1200,
    transitionMs: 280
  }));

  initializeFireballSystem(this);
  [
    { x: 2740, y: 430, direction: 'right', interval: 2800, phaseOffset: 1000, speed: 195 },
    { x: 3770, y: 400, direction: 'left', interval: 3000, phaseOffset: 1900, speed: 205 },
    { x: 5220, y: 430, direction: 'left', interval: 2700, phaseOffset: 1200, speed: 190 },
    { x: 6450, y: 410, direction: 'left', interval: 3100, phaseOffset: 2100, speed: 185 },
    { x: 7420, y: 350, direction: 'left', interval: 2600, phaseOffset: 1400, speed: 210 }
  ].forEach((config) => createFireCannon(this, {
    ...config,
    warningMs: 650,
    maxInstances: 2,
    blockedByWalls: true,
    blockedByBoxes: true
  }));

  checkpoints = this.physics.add.staticGroup();
  createCheckpoint(this, 2600, 437, 2600, 425);
  createCheckpoint(this, 4300, 437, 4300, 425);

  goal = this.physics.add.staticImage(7510, 437, 'goal').setDepth(THEME.depths.mechanism);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(this.physics.add.collider(boxes, platforms));
  activeColliders.push(this.physics.add.collider(player, boxes));
  activeColliders.push(createPlayerPatrolPlatformCollider(this));
  activeColliders.push(this.physics.add.collider(boxes, movingPlatforms));
  activeColliders.push(this.physics.add.collider(player, fallingPlatforms));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(
    player,
    alternatingSpikes,
    alternatingSpikeHitsPlayer,
    null,
    this
  ));
  activeColliders.push(this.physics.add.overlap(player, fireballs, fireballHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(fireballs, platforms, fireballHitsPlatform));
  activeColliders.push(this.physics.add.overlap(fireballs, boxes, fireballHitsBox));
  activeColliders.push(this.physics.add.overlap(player, checkpoints, activateCheckpoint));
  activeColliders.push(this.physics.add.overlap(player, goal, clearLevel, null, this));

  sixthLevelIntro = null;
  showGameplayHint(this, LEVEL_NARRATIVE_HINTS[6]);

  this.physics.world.setBounds(0, 0, LEVEL_6_WIDTH, HEIGHT + 100);
  this.cameras.main.setBounds(0, 0, LEVEL_6_WIDTH, HEIGHT);
  resetLevel6.call(this, false);
}

function updateLevel6(time) {
  updateBoxes.call(this, time, LEVEL_6_WIDTH);
  updatePatrolPlatforms();
  updateFallingPlatforms.call(this);
  updateFireCannons(this, time);
  updateAlternatingSpikes(this, time);
}

function resetLevel6(preserveCheckpoint = false) {
  if (currentLevel !== 6) return;
  clearCelebration(this);
  audioManager.stopLevelLoops();
  this.tweens.killTweensOf(player);
  if (!preserveCheckpoint) resetCheckpointProgress();
  const spawn = getCurrentRespawn(LEVEL_6_START);

  player.body.checkCollision.none = false;
  player.clearTint().setAlpha(1).setPosition(spawn.x, spawn.y)
    .setVelocity(0).setAcceleration(0);
  player.body.reset(spawn.x, spawn.y);

  previousBoxPositions.clear();
  resetAllBoxes();
  resetPatrolPlatforms();
  resetAllFallingPlatforms(this);
  resetFireballSystem(this);
  resetAlternatingSpikeSystem(this);

  isDead = false;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  coyoteUntil = 0;
  jumpBufferUntil = 0;
  jumpsUsed = 0;
  wasGrounded = true;
  this.cameras.main.stopFollow();
  this.cameras.main.centerOn(spawn.x, HEIGHT / 2);
  this.cameras.main.startFollow(player, true, 0.12, 0.12);
}

function recoverLevel7Fall(hitPlayer) {
  if (currentLevel !== 7 || isDead || isCleared || isTransitioning) return;
  resetLevel7.call(this, true);
  playRespawnFeedback(this, hitPlayer);
}

function startLevel7() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('levelMusic');

  currentLevel = 7;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(7);

  backdrop = drawBackdrop(this, LEVEL_7_WIDTH, 7);
  const liftTracks = this.add.graphics();
  liftTracks.fillStyle(THEME.gameplay.movingDark, 0.45);
  LEVEL_7_PLATFORM_CONFIGS
    .filter((config) => config.axis === 'y')
    .forEach((config) => {
      const endY = config.y + config.direction * config.distance;
      const top = Math.min(config.y, endY) - 11;
      const height = Math.abs(config.y - endY) + 22;
      liftTracks.fillRect(config.x - 3, top, 6, height);
    });
  backdrop.add(liftTracks);

  platforms = this.physics.add.staticGroup();
  addPlatform(this, 350, 505, 700, 70);
  addPlatform(this, 1270, 505, 220, 70);
  addPlatform(this, 2610, 505, 1540, 70);
  addPlatform(this, 2290, 335, 300, 30);
  addPlatform(this, 2850, 315, 340, 30);
  addPlatform(this, 3220, 395, 320, 30);
  addPlatform(this, 4020, 395, 240, 30);
  addPlatform(this, 4110, 275, 280, 30);
  addPlatform(this, 4790, 410, 32, 190);
  addPlatform(this, 5065, 505, 470, 70);
  addPlatform(this, 5150, 345, 300, 30);
  addPlatform(this, 5575, 330, 250, 30);
  addPlatform(this, 6145, 407, 32, 196);
  addPlatform(this, 6270, 330, 220, 30);
  addPlatform(this, 6320, 235, 240, 30);
  addPlatform(this, 6800, 505, 400, 70);

  movingPlatforms = this.physics.add.group({ allowGravity: false });
  const level7PlatformsById = new Map();
  LEVEL_7_PLATFORM_CONFIGS.forEach((config) => {
    level7PlatformsById.set(config.id, createPatrolPlatform(this, config));
  });

  ladders = this.physics.add.staticGroup();
  LEVEL_7_LADDER_CONFIGS.forEach((config) => createLadder(this, config));

  smallSprings = this.physics.add.staticGroup();
  LEVEL_7_SPRING_CONFIGS.forEach((config) => createSmallSpring(this, {
    ...config,
    carrier: config.carrierId ? level7PlatformsById.get(config.carrierId) : null
  }));
  initializeFireballSystem(this);
  LEVEL_7_CANNON_CONFIGS.forEach((config) => createFireCannon(this, {
    ...config,
    blockedByWalls: true,
    blockedByBoxes: true
  }));

  spikes = this.physics.add.staticGroup();
  LEVEL_7_SPIKE_POSITIONS.forEach((x) => createStandardSpike(this, x));
  LEVEL_7_MOVING_SPIKE_CONFIGS.forEach((config) => {
    createMovingPlatformSpike(this, level7PlatformsById.get(config.carrierId), config);
  });

  [
    { x: 2250, y: 292, text: '↑  ↓' },
    { x: 3460, y: 325, text: '站稳再弹。' }
  ].forEach(({ x, y, text }) => {
    backdrop.add(this.add.text(x, y, localizeText(text), {
      fontFamily: THEME.typography.display,
      fontSize: '15px',
      color: THEME.colors.ink
    }).setOrigin(0.5));
  });

  recoveryZones = this.physics.add.staticGroup();
  const recoveryStrip = recoveryZones.create(LEVEL_7_WIDTH / 2, 530, 'ground')
    .setDisplaySize(LEVEL_7_WIDTH, 20)
    .setVisible(false);
  recoveryStrip.refreshBody();

  checkpoints = this.physics.add.staticGroup();
  createCheckpoint(this, 5575, 282, 5575, 270);

  goal = this.physics.add.staticImage(6890, 437, 'goal').setDepth(THEME.depths.mechanism);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(createPlayerPatrolPlatformCollider(this));
  activeColliders.push(this.physics.add.collider(player, smallSprings, smallSpringHitsPlayer));
  activeColliders.push(this.physics.add.overlap(player, fireballs, fireballHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(fireballs, platforms, fireballHitsPlatform));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(player, recoveryZones, recoverLevel7Fall, null, this));
  activeColliders.push(this.physics.add.overlap(player, checkpoints, activateCheckpoint));
  activeColliders.push(this.physics.add.overlap(player, goal, clearLevel, null, this));

  seventhLevelIntro = null;
  showGameplayHint(this, LEVEL_NARRATIVE_HINTS[7]);

  this.physics.world.setBounds(0, 0, LEVEL_7_WIDTH, HEIGHT + 100);
  this.cameras.main.setBounds(0, 0, LEVEL_7_WIDTH, HEIGHT);
  resetLevel7.call(this, false);
}

function updateLevel7(time) {
  updatePatrolPlatforms();
  updateMovingPlatformSpikes();
  updateFireCannons(this, time);
}

function resetLevel7(preserveCheckpoint = false) {
  if (currentLevel !== 7) return;
  clearCelebration(this);
  audioManager.stopLevelLoops();
  this.tweens.killTweensOf(player);
  if (!preserveCheckpoint) resetCheckpointProgress();
  const spawn = getCurrentRespawn(LEVEL_7_START);

  player.body.checkCollision.none = false;
  player.clearTint().setAlpha(1).setPosition(spawn.x, spawn.y)
    .setVelocity(0).setAcceleration(0);
  player.body.reset(spawn.x, spawn.y);
  resetPatrolPlatforms();
  updateMovingPlatformSpikes();
  resetMobilityTools(this);
  resetFireballSystem(this);
  isDead = false;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  coyoteUntil = 0;
  jumpBufferUntil = 0;
  jumpsUsed = 0;
  wasGrounded = true;
  this.cameras.main.stopFollow();
  this.cameras.main.centerOn(spawn.x, HEIGHT / 2);
  this.cameras.main.startFollow(player, true, 0.12, 0.12);
}

function startLevel8() {
  cleanupCurrentLevel(this);

  currentLevel = 8;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(8);

  backdrop = drawBackdrop(this, LEVEL_8_WIDTH, 8);
  createWorld2Presentation(this, backdrop, LEVEL_8_WIDTH);
  const world2LiftTracks = this.add.graphics();
  world2LiftTracks.fillStyle(THEME.mechanismSkins.world2.movingPlatform.outline, 0.38);
  LEVEL_8_PLATFORM_CONFIGS
    .filter((config) => config.axis === 'y')
    .forEach((config) => {
      const endY = config.y + config.direction * config.distance;
      world2LiftTracks.fillRect(
        config.x - 3,
        Math.min(config.y, endY) - 11,
        6,
        Math.abs(config.y - endY) + 22
      );
    });
  backdrop.add(world2LiftTracks);

  platforms = this.physics.add.staticGroup();
  addPlatform(this, 310, 505, 620, 70);
  addPlatform(this, 1290, 505, 420, 70);
  addPlatform(this, 1375, 345, 450, 30);
  addPlatform(this, 1700, 505, 400, 70);
  addPlatform(this, 1975, 330, 550, 30);
  addPlatform(this, 2775, 505, 1050, 70);
  addPlatform(this, 2850, 435, 38, 70);
  addPlatform(this, 3000, 435, 38, 70);
  addPlatform(this, 4180, 505, 640, 70);
  addPlatform(this, 4460, 345, 320, 30);
  addPlatform(this, 4560, 415, 32, 110);
  addPlatform(this, 4980, 330, 440, 30);
  addPlatform(this, 5400, 505, 400, 70);
  addPlatform(this, 5425, 345, 350, 30);
  addPlatform(this, 6250, 345, 180, 30);
  addPlatform(this, 7030, 345, 220, 30);
  addPlatform(this, 7370, 505, 460, 70);
  addPlatform(this, 7400, 355, 400, 30);
  addPlatform(this, 7820, 330, 160, 30);
  addPlatform(this, 8430, 505, 140, 70);

  movingPlatforms = this.physics.add.group({ allowGravity: false });
  const world2Skin = THEME.mechanismSkins.world2;
  const level8PlatformsById = new Map();
  LEVEL_8_PLATFORM_CONFIGS.forEach((config) => {
    level8PlatformsById.set(config.id, createPatrolPlatform(this, {
      ...config,
      textureKey: world2Skin.movingPlatform.textureKey
    }));
  });

  ladders = this.physics.add.staticGroup();
  LEVEL_8_LADDER_CONFIGS.forEach((config) => createLadder(this, {
    ...config,
    skin: world2Skin.ladder
  }));

  smallSprings = this.physics.add.staticGroup();
  LEVEL_8_SPRING_CONFIGS.forEach((config) => createSmallSpring(this, {
    ...config,
    skin: world2Skin.spring
  }));
  fallingPlatforms = this.physics.add.group({ allowGravity: false });
  LEVEL_8_RAINBOW_CLOUD_CONFIGS.forEach(({ x, y }) => {
    createFallingPlatform(this, x, y, 'rainbow-cloud-platform');
  });
  spikes = this.physics.add.staticGroup();
  LEVEL_8_SPIKE_POSITIONS.forEach((x) => createStandardSpike(this, x));
  LEVEL_8_MOVING_SPIKE_CONFIGS.forEach((config) => {
    createMovingPlatformSpike(this, level8PlatformsById.get(config.carrierId), config);
  });

  initializeFireballSystem(this, world2Skin.fireball.textureKey);
  LEVEL_8_CANNON_CONFIGS.forEach((config) => createFireCannon(this, {
    ...config,
    textureKey: world2Skin.fireCannon.textureKey,
    warningTint: world2Skin.fireCannon.warningTint,
    blockedByWalls: true,
    blockedByBoxes: true
  }));

  checkpoints = this.physics.add.staticGroup();
  createCheckpoint(this, 4250, 437, 4250, 425);
  createCheckpoint(this, 6970, 297, 6970, 285);

  goal = this.physics.add.staticImage(8440, 437, 'goal').setDepth(THEME.depths.mechanism);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(createPlayerPatrolPlatformCollider(this));
  activeColliders.push(this.physics.add.collider(player, smallSprings, smallSpringHitsPlayer));
  activeColliders.push(this.physics.add.collider(player, fallingPlatforms));
  activeColliders.push(this.physics.add.overlap(player, fireballs, fireballHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(fireballs, platforms, fireballHitsPlatform));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(player, checkpoints, activateCheckpoint));
  activeColliders.push(this.physics.add.overlap(player, goal, clearLevel, null, this));
  const segmentLabels = [
    { x: 1050, text: '先把动作想起来。' },
    { x: 2650, text: '只看炮口。' },
    { x: 3500, text: '下面看炮，云往上。' },
    { x: 4550, text: '先爬，再等。' },
    { x: 5850, text: '快慢都看清楚。' },
    { x: 7450, text: '眼前这一拍就好。' }
  ];
  segmentLabels.forEach(({ x, text }) => {
    createGameplayHintTrigger(this, x, text, 260);
  });
  createGameplayHintTrigger(this, 360, LEVEL_NARRATIVE_HINTS[8], 260);

  this.physics.world.setBounds(0, 0, LEVEL_8_WIDTH, HEIGHT + 100);
  this.cameras.main.setBounds(0, 0, LEVEL_8_WIDTH, HEIGHT);
  resetLevel8.call(this, false);
}

function updateLevel8(time) {
  updatePatrolPlatforms();
  updateMovingPlatformSpikes();
  updateFallingPlatforms.call(this);
  updateFireCannons(this, time);
}

function resetLevel8(preserveCheckpoint = false) {
  if (currentLevel !== 8) return;
  clearCelebration(this);
  audioManager.stopLevelLoops();
  this.tweens.killTweensOf(player);
  if (!preserveCheckpoint) resetCheckpointProgress();
  const spawn = getCurrentRespawn(LEVEL_8_START);

  player.body.checkCollision.none = false;
  player.clearTint().setAlpha(1).setPosition(spawn.x, spawn.y)
    .setVelocity(0).setAcceleration(0);
  player.body.reset(spawn.x, spawn.y);
  resetPatrolPlatforms();
  updateMovingPlatformSpikes();
  resetMobilityTools(this);
  resetAllFallingPlatforms(this);
  resetFireballSystem(this);
  isDead = false;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  coyoteUntil = 0;
  jumpBufferUntil = 0;
  jumpsUsed = 0;
  wasGrounded = true;
  this.cameras.main.stopFollow();
  this.cameras.main.centerOn(spawn.x, HEIGHT / 2);
  this.cameras.main.startFollow(player, true, 0.12, 0.12);
}

function startLevel9() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('world2Music');

  currentLevel = 9;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(9);
  showGameplayHint(this, LEVEL_NARRATIVE_HINTS[9]);

  backdrop = createWorld2VerticalPresentation(
    this,
    LEVEL_9_WIDTH,
    LEVEL_9_WORLD_TOP,
    LEVEL_9_WORLD_BOTTOM
  );
  const world2Skin = THEME.mechanismSkins.world2;
  const liftTracks = this.add.graphics();
  liftTracks.fillStyle(world2Skin.movingPlatform.outline, 0.42);
  LEVEL_9_PLATFORM_CONFIGS
    .filter((config) => config.axis === 'y')
    .forEach((config) => {
      const endY = config.y + config.direction * config.distance;
      liftTracks.fillRect(
        config.x - 3,
        Math.min(config.y, endY) - 11,
        6,
        Math.abs(config.y - endY) + 22
      );
    });
  backdrop.add(liftTracks);

  platforms = this.physics.add.staticGroup();
  // Floor 1: ladder-to-carrier transfer.
  addPlatform(this, 170, 505, 300, 70);
  addPlatform(this, 680, 15, 140, 30);
  // Floor 2: spring direction control and spike landing.
  addPlatform(this, 520, -130, 190, 30);
  addPlatform(this, 455, -435, 140, 30);
  // Floor 3: synchronized lift lane.
  addPlatform(this, 300, -610, 32, 350);
  addPlatform(this, 850, -610, 32, 350);
  addPlatform(this, 455, -885, 140, 30);
  // Floor 4: narrow lift-and-cannon shaft.
  addPlatform(this, 380, -1060, 30, 360);
  addPlatform(this, 650, -1060, 30, 360);
  addPlatform(this, 520, -1335, 140, 30);
  // Floor 5: ladder, spring, moving transfer, and short goal buffer.
  addPlatform(this, 520, -1525, 130, 30);
  addPlatform(this, 665, -1665, 170, 30);
  addPlatform(this, 390, -1905, 220, 30);

  movingPlatforms = this.physics.add.group({ allowGravity: false });
  LEVEL_9_PLATFORM_CONFIGS.forEach((config) => createPatrolPlatform(this, {
    ...config,
    textureKey: world2Skin.movingPlatform.textureKey
  }));

  ladders = this.physics.add.staticGroup();
  LEVEL_9_LADDER_CONFIGS.forEach((config) => createLadder(this, {
    ...config,
    skin: world2Skin.ladder
  }));

  smallSprings = this.physics.add.staticGroup();
  LEVEL_9_SPRING_CONFIGS.forEach((config) => createSmallSpring(this, {
    ...config,
    skin: world2Skin.spring
  }));

  spikes = this.physics.add.staticGroup();
  LEVEL_9_SPIKE_CONFIGS.forEach((config) => {
    const spike = createStandardSpike(this, config.x, config.y);
    spike.setData('level9Id', config.id);
  });

  initializeFireballSystem(this, world2Skin.fireball.textureKey);
  LEVEL_9_CANNON_CONFIGS.forEach((config) => createFireCannon(this, {
    ...config,
    textureKey: world2Skin.fireCannon.textureKey,
    warningTint: world2Skin.fireCannon.warningTint,
    blockedByWalls: true,
    blockedByBoxes: true
  }));

  checkpoints = this.physics.add.staticGroup();
  LEVEL_9_CHECKPOINT_CONFIGS.forEach((config) => {
    createCheckpoint(this, config.x, config.y, config.spawnX, config.spawnY);
  });

  goal = this.physics.add.staticImage(450, -1953, 'goal').setDepth(THEME.depths.mechanism);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(createPlayerPatrolPlatformCollider(this));
  activeColliders.push(this.physics.add.collider(player, smallSprings, smallSpringHitsPlayer));
  activeColliders.push(this.physics.add.overlap(player, fireballs, fireballHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(fireballs, platforms, fireballHitsPlatform));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(player, checkpoints, activateCheckpoint));
  activeColliders.push(this.physics.add.overlap(player, goal, clearLevel, null, this));

  this.physics.world.setBounds(
    0,
    LEVEL_9_WORLD_TOP,
    LEVEL_9_WIDTH,
    LEVEL_9_WORLD_BOTTOM - LEVEL_9_WORLD_TOP
  );
  this.cameras.main.setBounds(
    0,
    LEVEL_9_WORLD_TOP,
    LEVEL_9_WIDTH,
    HEIGHT - LEVEL_9_WORLD_TOP
  );
  resetLevel9.call(this, false);
}

function updateLevel9(time) {
  updatePatrolPlatforms();
  updateFireCannons(this, time);
}

function resetLevel9(preserveCheckpoint = false) {
  if (currentLevel !== 9) return;
  clearCelebration(this);
  audioManager.stopLevelLoops();
  this.tweens.killTweensOf(player);
  if (!preserveCheckpoint) resetCheckpointProgress();
  const spawn = getCurrentRespawn(LEVEL_9_START);

  player.body.checkCollision.none = false;
  player.clearTint().setAlpha(1).setPosition(spawn.x, spawn.y)
    .setVelocity(0).setAcceleration(0);
  player.body.reset(spawn.x, spawn.y);
  resetPatrolPlatforms();
  resetMobilityTools(this);
  resetFireballSystem(this);

  isDead = false;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  coyoteUntil = 0;
  jumpBufferUntil = 0;
  jumpsUsed = 0;
  wasGrounded = true;
  this.cameras.main.stopFollow();
  this.cameras.main.centerOn(spawn.x, spawn.y);
  this.cameras.main.startFollow(player, true, 0.12, 0.24);
}

function createLevel10SpikeWall(scene, x, side) {
  return LEVEL_10_ARENA_CONFIG.wallYs.map((y) => {
    const spike = createStandardSpike(scene, x, y)
      .setAngle(side === 'left' ? 90 : -90)
      .setDepth(THEME.depths.mechanism + 1);
    spike.body.setSize(36, 36).setOffset(6, 3);
    spike.refreshBody();
    spike.setData({ level10WallSide: side });
    return spike;
  });
}

function startLevel10() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('world2Music');

  currentLevel = 10;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(10);

  backdrop = drawBackdrop(this, LEVEL_10_WIDTH, 8);
  createWorld2Presentation(
    this,
    backdrop,
    LEVEL_10_WIDTH,
    'World 2 Boss：棉花糖雾灵',
    205
  );
  const arenaFrame = this.add.graphics().setDepth(THEME.depths.scenery);
  arenaFrame.fillStyle(THEME.worlds.world2.terrain.line, 0.42)
    .fillRect(42, 250, 28, 220)
    .fillRect(900, 250, 28, 220);
  arenaFrame.fillStyle(THEME.worlds.world2.fog.white, 0.55)
    .fillRect(54, 272, 12, 176)
    .fillRect(904, 272, 12, 176);
  backdrop.add(arenaFrame);

  const lurePads = LEVEL_10_ARENA_CONFIG.lurePadXs.map((x) => {
    const pad = this.add.rectangle(
      x,
      475,
      82,
      10,
      THEME.gameplay.butter,
      0.78
    )
      .setStrokeStyle(2, THEME.gameplay.blush, 0.95)
      .setDepth(THEME.depths.guidance);
    const label = this.add.text(x, 452, localizeText('引诱点'), {
      fontFamily: THEME.typography.display,
      fontSize: '13px',
      color: THEME.colors.ink,
      backgroundColor: THEME.colors.surfaceFaint,
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(THEME.depths.guidance);
    pad.setData('label', label);
    backdrop.add([pad, label]);
    return pad;
  });
  lurePads.forEach((pad, index) => {
    this.tweens.add({
      targets: pad,
      alpha: 0.32,
      duration: 520 + index * 90,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut'
    });
  });

  platforms = this.physics.add.staticGroup();
  addPlatform(this, 218, 505, 436, 70);
  const trapFloor = addPlatform(
    this,
    LEVEL_10_ARENA_CONFIG.trapX,
    505,
    LEVEL_10_ARENA_CONFIG.trapWidth,
    70
  );
  addPlatform(this, 822, 505, 596, 70);

  spikes = this.physics.add.staticGroup();
  const spikeWalls = {
    left: createLevel10SpikeWall(this, LEVEL_10_ARENA_CONFIG.leftWallX, 'left'),
    right: createLevel10SpikeWall(this, LEVEL_10_ARENA_CONFIG.rightWallX, 'right')
  };

  pressureButton = this.physics.add.staticImage(
    LEVEL_10_ARENA_CONFIG.trapX,
    464,
    'button'
  ).setDepth(THEME.depths.mechanism);
  pressureButton.body.setSize(54, 16).setOffset(0, -4);
  pressureButton.setData('restY', 464);
  pressureButton.refreshBody();

  boxes = this.physics.add.group({ allowGravity: true });
  boxSpawns = [{
    x: LEVEL_10_ARENA_CONFIG.boxX,
    y: LEVEL_10_ARENA_CONFIG.boxY
  }];
  const trapBox = createBox(
    this,
    LEVEL_10_ARENA_CONFIG.boxX,
    LEVEL_10_ARENA_CONFIG.boxY
  );

  doorClosedX = LEVEL_10_ARENA_CONFIG.exitDoorX;
  doorClosedY = 360;
  doorOpenY = 145;
  doorSafetyZone = new Phaser.Geom.Rectangle(doorClosedX - 28, 242, 56, 232);
  door = this.physics.add.staticImage(doorClosedX, doorClosedY, 'door')
    .setDepth(THEME.depths.mechanism);
  door.body.setSize(42, 220);
  door.refreshBody();

  checkpoints = this.physics.add.staticGroup();
  createCheckpoint(this, 300, 437, LEVEL_10_START.x, LEVEL_10_START.y);

  goal = this.physics.add.staticImage(
    LEVEL_10_ARENA_CONFIG.goalX,
    437,
    'goal'
  ).setDepth(THEME.depths.mechanism).setVisible(false);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();
  goal.body.enable = false;

  createMistBoss(this, {
    bossX: LEVEL_10_ARENA_CONFIG.bossX,
    bossY: LEVEL_10_ARENA_CONFIG.bossY,
    trapFloor,
    trapBox,
    lurePads,
    spikeWalls
  });

  showGameplayHint(this, LEVEL_NARRATIVE_HINTS[10]);

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(this.physics.add.collider(boxes, platforms));
  activeColliders.push(this.physics.add.collider(player, boxes));
  activeColliders.push(this.physics.add.collider(player, door));
  activeColliders.push(this.physics.add.collider(boxes, door));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(
    level10Boss,
    spikes,
    mistBossHitsSpike,
    null,
    this
  ));
  activeColliders.push(this.physics.add.overlap(
    level10Boss,
    boxes,
    mistBossHitsTrapBox,
    null,
    this
  ));
  activeColliders.push(this.physics.add.overlap(
    player,
    level10Boss,
    mistBossHitsPlayer,
    null,
    this
  ));
  activeColliders.push(this.physics.add.overlap(player, checkpoints, activateCheckpoint));
  activeColliders.push(this.physics.add.overlap(player, goal, clearLevel, null, this));

  this.physics.world.setBounds(0, 0, LEVEL_10_WIDTH, HEIGHT + 180);
  this.cameras.main.setBounds(0, 0, LEVEL_10_WIDTH, HEIGHT);
  resetLevel10.call(this, false);
}

function updateLevel10(time) {
  updateLevel10TrapPlate(this, time);
  updateMistBoss(this, time);
}

function resetLevel10(preserveCheckpoint = false) {
  if (currentLevel !== 10) return;
  clearCelebration(this);
  audioManager.stopLevelLoops();
  this.tweens.killTweensOf(player);
  this.tweens.killTweensOf(door);
  if (!preserveCheckpoint) resetCheckpointProgress();
  const spawn = getCurrentRespawn(LEVEL_10_START);

  player.body.checkCollision.none = false;
  player.clearTint().setAlpha(1).setPosition(spawn.x, spawn.y)
    .setVelocity(0).setAcceleration(0);
  player.body.reset(spawn.x, spawn.y);
  player.body.checkCollision.up = true;
  previousBoxPositions.clear();
  resetAllBoxes();

  buttonReleaseUntil = 0;
  buttonPressed = true;
  setButtonPressed(false);
  doorIsOpen = false;
  doorAnimating = false;
  door.setPosition(doorClosedX, doorClosedY).setAlpha(1).clearTint();
  door.body.enable = true;
  door.refreshBody();
  goal.setVisible(false);
  goal.body.enable = false;
  resetMistBoss(this);

  isDead = false;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  coyoteUntil = 0;
  jumpBufferUntil = 0;
  jumpsUsed = 0;
  wasGrounded = true;
  this.cameras.main.stopFollow();
  this.cameras.main.centerOn(spawn.x, HEIGHT / 2);
  this.cameras.main.startFollow(player, true, 0.12, 0.12);
}

function createLevel11BranchFog(scene) {
  const config = LEVEL_11_FOG_CONFIG;
  const style = THEME.worlds.world2;
  level11RouteFog = scene.add.container(0, 0).setDepth(THEME.depths.foreground);
  const farFog = scene.add.graphics();
  const nearFog = scene.add.graphics();
  for (let x = config.startX; x <= config.endX; x += 185) {
    const offset = ((x - config.startX) / 185) % 2 === 0 ? 0 : 24;
    const farY = config.topY + 28 + offset;
    const nearY = config.topY + 78 - offset;
    farFog.fillStyle(style.fog.blue, config.alpha * 0.68)
      .fillRect(x - 72, farY, 240, Math.min(54, config.bottomY - farY))
      .fillRect(x - 28, config.topY + 2 + offset, 142, 28);
    nearFog.fillStyle(style.fog.white, config.alpha)
      .fillRect(x - 24, nearY, 276, Math.min(68, config.bottomY - nearY))
      .fillRect(x + 24, config.topY + 48 - offset, 176, 32);
  }
  level11RouteFog.add([farFog, nearFog]);
  const fogTweens = [];
  if (!reducedMotion) {
    fogTweens.push(scene.tweens.add({
      targets: farFog,
      x: config.driftX,
      duration: config.driftDurationMs,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1
    }));
    fogTweens.push(scene.tweens.add({
      targets: nearFog,
      x: -config.driftX,
      duration: Math.round(config.driftDurationMs * 0.82),
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1
    }));
  }
  level11RouteFog.setData('fogTweens', fogTweens);
  return level11RouteFog;
}

function handleLevel11RouteZone(hitPlayer, zone) {
  if (currentLevel !== 11 || isDead || isCleared) return;
  const kind = zone.getData('level11ZoneKind');
  if (kind === 'shortcut-entry') {
    hitPlayer.setData('level11ShortcutActive', true);
    return;
  }
  if (kind !== 'shortcut-recovery' || !hitPlayer.getData('level11ShortcutActive')) return;
  resetLevel11.call(this, true);
  playRespawnFeedback(this, hitPlayer);
}

function collectLevel11MistToken(hitPlayer, token) {
  if (level11CollectibleCollected || token !== level11Collectible) return;
  level11CollectibleCollected = true;
  token.body.enable = false;
  token.setVisible(false);
  audioManager.play('button');
  const feedback = this.add.text(hitPlayer.x, hitPlayer.y - 58, localizeText('额外雾糖 +1'), {
    fontFamily: THEME.typography.display,
    fontSize: '18px',
    color: THEME.colors.ink,
    backgroundColor: THEME.colors.surfaceFaint,
    padding: { x: 10, y: 5 }
  }).setOrigin(0.5).setDepth(THEME.depths.feedback);
  this.tweens.add({
    targets: feedback,
    y: feedback.y - 34,
    alpha: 0,
    duration: reducedMotion ? 1 : 900,
    ease: 'Sine.Out',
    onComplete: () => feedback.destroy()
  });
}

function startLevel11() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('world2Music');

  currentLevel = 11;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(11);
  createGameplayHintTrigger(this, 360, LEVEL_NARRATIVE_HINTS[11], 260);

  backdrop = drawBackdrop(this, LEVEL_11_WIDTH, 8);
  createWorld2Presentation(
    this,
    backdrop,
    LEVEL_11_WIDTH,
    'World 2：雾潮分岔站',
    155
  );
  const world2Skin = THEME.mechanismSkins.world2;
  const mechanismGuides = this.add.graphics();
  mechanismGuides.fillStyle(world2Skin.movingPlatform.outline, 0.4);
  LEVEL_11_PLATFORM_CONFIGS.forEach((config) => {
    const endX = config.x + (config.axis === 'x' ? config.direction * config.distance : 0);
    const endY = config.y + (config.axis === 'y' ? config.direction * config.distance : 0);
    if (config.axis === 'y') {
      mechanismGuides.fillRect(
        config.x - 3,
        Math.min(config.y, endY) - 11,
        6,
        Math.abs(config.y - endY) + 22
      );
    } else {
      mechanismGuides.fillRect(
        Math.min(config.x, endX) - 11,
        config.y - 3,
        Math.abs(config.x - endX) + 22,
        6
      );
    }
  });
  mechanismGuides.fillStyle(world2Skin.fireCannon.outline, 0.32);
  LEVEL_11_CANNON_CONFIGS
    .filter((config) => config.segment === 'constrained-sync')
    .forEach((config) => {
      mechanismGuides.fillRect(config.x - 4, 276, 8, Math.max(18, config.y - 292));
    });
  backdrop.add(mechanismGuides);

  platforms = this.physics.add.staticGroup();
  addPlatform(this, 230, 505, 460, 70);
  addPlatform(this, 1030, LEVEL_11_CONSTRAINED_CEILING_Y, 1250, 30);
  addPlatform(this, 1580, 338, 32, 156);
  addPlatform(this, 1850, 505, 720, 70);

  // Safe branch: right, back left, then right again. It is cannon-free but deliberately longer.
  addPlatform(this, 2880, 505, 1340, 70);
  addPlatform(this, 3150, 220, 700, 30);
  addPlatform(this, 3725, 80, 1850, 30);
  addPlatform(this, 5050, 505, 1100, 70);

  // Shortcut branch: two synchronized moving-platform/cannon combinations inside the fog.
  addPlatform(this, 3650, 320, 900, 30);
  addPlatform(this, 4350, 400, 400, 30);
  addPlatform(this, 2470, 326, 32, 148);

  movingPlatforms = this.physics.add.group({ allowGravity: false });
  LEVEL_11_PLATFORM_CONFIGS.forEach((config) => createPatrolPlatform(this, {
    ...config,
    textureKey: world2Skin.movingPlatform.textureKey
  }));

  ladders = this.physics.add.staticGroup();
  [
    { id: 'safe-rise-a', x: 3500, y: 337.5, height: 265 },
    { id: 'safe-rise-b', x: 2800, y: 135, height: 140 },
    { id: 'safe-descent', x: 4620, y: 267.5, height: 405 }
  ].forEach((config) => createLadder(this, { ...config, skin: world2Skin.ladder }));

  initializeFireballSystem(this, world2Skin.fireball.textureKey);
  LEVEL_11_CANNON_CONFIGS.forEach((config) => createFireCannon(this, {
    ...config,
    textureKey: world2Skin.fireCannon.textureKey,
    warningTint: world2Skin.fireCannon.warningTint,
    blockedByWalls: true,
    blockedByBoxes: true
  }));

  checkpoints = this.physics.add.staticGroup();
  createCheckpoint(
    this,
    LEVEL_11_BRANCH_CONFIG.checkpointX,
    LEVEL_11_BRANCH_CONFIG.checkpointY,
    LEVEL_11_BRANCH_CONFIG.checkpointSpawnX,
    LEVEL_11_BRANCH_CONFIG.checkpointSpawnY
  );

  recoveryZones = this.physics.add.staticGroup();
  const shortcutEntry = recoveryZones.create(
    LEVEL_11_BRANCH_CONFIG.shortcutEntryX,
    330,
    'ground'
  ).setDisplaySize(86, 86).setVisible(false);
  shortcutEntry.setData('level11ZoneKind', 'shortcut-entry').refreshBody();
  const recoveryWidth = LEVEL_11_BRANCH_CONFIG.shortcutRecoveryRight
    - LEVEL_11_BRANCH_CONFIG.shortcutRecoveryLeft;
  const shortcutRecovery = recoveryZones.create(
    LEVEL_11_BRANCH_CONFIG.shortcutRecoveryLeft + recoveryWidth / 2,
    461,
    'ground'
  ).setDisplaySize(recoveryWidth, 16).setVisible(false);
  shortcutRecovery.setData('level11ZoneKind', 'shortcut-recovery').refreshBody();

  level11Collectible = this.physics.add.staticImage(
    LEVEL_11_BRANCH_CONFIG.collectibleX,
    LEVEL_11_BRANCH_CONFIG.collectibleY,
    'mist-token'
  ).setDepth(THEME.depths.mechanism + 1);
  level11Collectible.body.setSize(38, 38).setOffset(5, 5);
  level11Collectible.refreshBody();
  this.tweens.add({
    targets: level11Collectible,
    y: level11Collectible.y - 10,
    angle: 8,
    duration: reducedMotion ? 1 : 720,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.InOut',
    onUpdate: () => level11Collectible?.refreshBody()
  });

  goal = this.physics.add.staticImage(5480, 437, 'goal').setDepth(THEME.depths.mechanism);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();

  createStoryDialogueTrigger(
    this,
    1880,
    [{ speaker: 'player', text: '……嗯，选哪边都行吧。' }],
    220,
    'level11-branch-thought'
  );
  const forkLabels = [
    { x: 2200, y: 438, text: '绕远路 →' },
    { x: 2290, y: 300, text: '看不清的近路 ↗' },
    { x: 3790, y: 204, text: '额外雾糖' }
  ];
  forkLabels.forEach(({ x, y, text }) => {
    backdrop.add(this.add.text(x, y, localizeText(text), {
      fontFamily: THEME.typography.display,
      fontSize: '15px',
      color: THEME.colors.ink,
      backgroundColor: THEME.colors.surfaceFaint,
      padding: { x: 7, y: 4 }
    }).setOrigin(0.5).setDepth(THEME.depths.guidance));
  });

  createLevel11BranchFog(this);

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(createPlayerPatrolPlatformCollider(this));
  activeColliders.push(this.physics.add.overlap(player, fireballs, fireballHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(fireballs, platforms, fireballHitsPlatform));
  activeColliders.push(this.physics.add.overlap(player, checkpoints, activateCheckpoint));
  activeColliders.push(this.physics.add.overlap(
    player,
    recoveryZones,
    handleLevel11RouteZone,
    null,
    this
  ));
  activeColliders.push(this.physics.add.overlap(
    player,
    level11Collectible,
    collectLevel11MistToken,
    null,
    this
  ));
  activeColliders.push(this.physics.add.overlap(player, goal, clearLevel, null, this));

  this.physics.world.setBounds(0, 0, LEVEL_11_WIDTH, HEIGHT + 120);
  this.cameras.main.setBounds(0, 0, LEVEL_11_WIDTH, HEIGHT);
  resetLevel11.call(this, false);
}

function updateLevel11(time) {
  updatePatrolPlatforms();
  updateFireCannons(this, time);
}

function resetLevel11(preserveCheckpoint = false) {
  if (currentLevel !== 11) return;
  clearCelebration(this);
  audioManager.stopLevelLoops();
  this.tweens.killTweensOf(player);
  if (!preserveCheckpoint) {
    resetCheckpointProgress();
    level11CollectibleCollected = false;
  }
  const spawn = getCurrentRespawn(LEVEL_11_START);

  player.body.checkCollision.none = false;
  player.clearTint().setAlpha(1).setPosition(spawn.x, spawn.y)
    .setVelocity(0).setAcceleration(0);
  player.body.reset(spawn.x, spawn.y);
  player.body.checkCollision.up = true;
  player.setData('patrolPlatformJumpDetachUntil', 0);
  player.setData('level11ShortcutActive', false);
  resetPatrolPlatforms();
  resetMobilityTools(this);
  resetFireballSystem(this);

  if (level11Collectible) {
    level11Collectible.setVisible(!level11CollectibleCollected);
    level11Collectible.body.enable = !level11CollectibleCollected;
    if (!level11CollectibleCollected) level11Collectible.refreshBody();
  }

  isDead = false;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  coyoteUntil = 0;
  jumpBufferUntil = 0;
  jumpsUsed = 0;
  wasGrounded = true;
  this.cameras.main.stopFollow();
  this.cameras.main.centerOn(spawn.x, HEIGHT / 2);
  this.cameras.main.startFollow(player, true, 0.12, 0.12);
}

function handleLevel12BranchZone(hitPlayer, zone) {
  if (currentLevel !== 12 || isDead || isCleared) return;
  if (zone.getData('level12ZoneKind') === 'shortcut-entry') {
    hitPlayer.setData('level12ShortcutActive', true);
  }
}

function collectLevel12Keepsake(hitPlayer, collectible) {
  if (
    collectible !== level12Collectible
    || !hitPlayer.getData('level12ShortcutActive')
    || collectedItems.has(LEVEL_12_COLLECTIBLE_ID)
  ) return;
  collectedItems.add(LEVEL_12_COLLECTIBLE_ID);
  this.tweens.killTweensOf(collectible);
  collectible.body.enable = false;
  collectible.setVisible(false);
  saveProgress();
  const feedback = this.add.text(
    hitPlayer.x,
    hitPlayer.y - 58,
    localizeText('World 2 的最后一小片空闲。'),
    {
      fontFamily: THEME.typography.display,
      fontSize: '17px',
      color: THEME.colors.ink,
      backgroundColor: THEME.colors.surfaceFaint,
      padding: { x: 10, y: 5 }
    }
  ).setOrigin(0.5).setDepth(THEME.depths.feedback);
  this.tweens.add({
    targets: feedback,
    y: feedback.y - 30,
    alpha: 0,
    duration: reducedMotion ? 1 : 900,
    ease: 'Sine.Out',
    onComplete: () => feedback.destroy()
  });
}

function updateLevel12Gate(time) {
  const boxOnButton = updateBoxes.call(this, time, LEVEL_12_WIDTH);
  const playerOnButton = this.physics.overlap(pressureButton, player);
  if (playerOnButton || boxOnButton) buttonReleaseUntil = time + 110;
  const pressureActive = playerOnButton || boxOnButton || time < buttonReleaseUntil;
  setButtonPressed(pressureActive);

  const playerOnTrigger = isStandingOn(player, timedTriggerPlatform);
  if (!playerOnTrigger) timedSwitchArmed = true;
  if (playerOnTrigger && timedSwitchArmed && !timedSwitchActive) {
    activateTimedSwitch.call(this, time);
  }
  if (timedSwitchActive) {
    const remaining = Math.max(0, timedSwitchEndsAt - time);
    drawTimedSwitchMeter(
      remaining / timedSwitchDurationMs,
      remaining <= timedSwitchWarningMs
    );
    if (remaining <= 0) {
      timedSwitchActive = false;
      timedSwitchEndsAt = 0;
      timedSwitchMeter.setVisible(false);
    }
  }

  const shouldOpen = pressureActive || timedSwitchActive;
  if (shouldOpen && !doorIsOpen) {
    openDoor.call(this);
  } else if (!shouldOpen && doorIsOpen && !isDoorwayOccupied()) {
    closeDoor.call(this);
  }
}

function startLevel12() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('world2Music');

  currentLevel = 12;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(12);
  createGameplayHintTrigger(this, 360, LEVEL_NARRATIVE_HINTS[12], 260);

  backdrop = drawBackdrop(this, LEVEL_12_WIDTH, 8);
  createWorld2Presentation(
    this,
    backdrop,
    LEVEL_12_WIDTH,
    'World 2：棉花糖迷雾·毕业测验',
    145
  );
  createWorld2GraduationPresentation(this, backdrop);
  const world2Skin = THEME.mechanismSkins.world2;
  const mechanismGuides = this.add.graphics();
  mechanismGuides.fillStyle(world2Skin.movingPlatform.outline, 0.38);
  LEVEL_12_PLATFORM_CONFIGS.forEach((config) => {
    const endX = config.x + (config.axis === 'x' ? config.direction * config.distance : 0);
    const endY = config.y + (config.axis === 'y' ? config.direction * config.distance : 0);
    if (config.axis === 'y') {
      mechanismGuides.fillRect(
        config.x - 3,
        Math.min(config.y, endY) - 11,
        6,
        Math.abs(config.y - endY) + 22
      );
    } else {
      mechanismGuides.fillRect(
        Math.min(config.x, endX) - 11,
        config.y - 3,
        Math.abs(config.x - endX) + 22,
        6
      );
    }
  });
  backdrop.add(mechanismGuides);

  platforms = this.physics.add.staticGroup();
  // Segment 1: four-direction carrier sequence with ladder/spring transfers.
  addPlatform(this, 170, 505, 340, 70);
  addPlatform(this, 740, 405, 140, 30);
  addPlatform(this, 980, 310, 120, 30);
  addPlatform(this, 1390, 405, 110, 30);
  addPlatform(this, 1710, 505, 260, 70);
  // Segment 2: shared-clock carrier/cannon lane and alternating-spike rhythm.
  addPlatform(this, 1870, 505, 220, 70);
  addPlatform(this, 2470, 505, 120, 70);
  addPlatform(this, 3000, 315, 120, 30);
  addPlatform(this, 3560, 505, 180, 70);
  // Segment 3: narrow box-cover corridor.
  addPlatform(this, 3800, 505, 300, 70);
  addPlatform(this, 4480, 505, 360, 70);
  addPlatform(this, 5100, 505, 420, 70);
  addPlatform(this, 4370, 292, 1120, 30);
  // Segment 4: lower safe route, upper all-combination shortcut, and merge.
  addPlatform(this, 5430, 505, 220, 70);
  addPlatform(this, 6030, 505, 260, 70);
  addPlatform(this, 6680, 505, 360, 70);
  addPlatform(this, 5710, 210, 220, 30);
  addPlatform(this, 6340, 170, 260, 30);
  addPlatform(this, 6810, 210, 180, 30);
  addPlatform(this, 7350, 505, 500, 70);

  movingPlatforms = this.physics.add.group({ allowGravity: false });
  const level12PlatformsById = new Map();
  LEVEL_12_PLATFORM_CONFIGS.forEach((config) => {
    level12PlatformsById.set(config.id, createPatrolPlatform(this, {
      ...config,
      textureKey: world2Skin.movingPlatform.textureKey
    }));
  });

  ladders = this.physics.add.staticGroup();
  [
    { id: 'narrow-ladder', x: 4930, y: 397.5, height: 155 },
    { id: 'safe-ladder', x: 6480, y: 342.5, height: 255 }
  ].forEach((config) => createLadder(this, { ...config, skin: world2Skin.ladder }));

  smallSprings = this.physics.add.staticGroup();
  createSmallSpring(this, {
    id: 'sequence-spring',
    x: 980,
    y: 286,
    launchVelocity: 640,
    cooldownMs: 230,
    skin: world2Skin.spring
  });
  createSmallSpring(this, {
    id: 'shortcut-entry-spring',
    x: 5430,
    y: 456,
    launchVelocity: 675,
    cooldownMs: 230,
    skin: world2Skin.spring
  });

  fallingPlatforms = this.physics.add.group({ allowGravity: false });
  createFallingPlatform(this, 3340, 365);
  createFallingPlatform(this, 3460, 410);
  createFallingPlatform(this, 5890, 410);
  createFallingPlatform(this, 6180, 360);
  timedTriggerPlatform = createFallingPlatform(
    this,
    LEVEL_12_TIMED_GATE_CONFIG.triggerX,
    LEVEL_12_TIMED_GATE_CONFIG.triggerY
  );
  spikes = this.physics.add.staticGroup();
  createStandardSpike(this, 4590, 466).setData('level12Role', 'narrow-rhythm-marker');
  createMovingPlatformSpike(
    this,
    level12PlatformsById.get('sequence-slide-c'),
    { offsetX: 34, offsetY: -13 }
  );
  createMovingPlatformSpike(
    this,
    level12PlatformsById.get('shortcut-slide-b'),
    { offsetX: -30, offsetY: -13 }
  );

  initializeAlternatingSpikeSystem(this);
  LEVEL_12_ALTERNATING_SPIKE_CONFIGS.forEach((config) => {
    createAlternatingSpikePair(this, config);
  });

  initializeFireballSystem(this, world2Skin.fireball.textureKey);
  LEVEL_12_CANNON_CONFIGS.forEach((config) => createFireCannon(this, {
    ...config,
    textureKey: world2Skin.fireCannon.textureKey,
    warningTint: world2Skin.fireCannon.warningTint,
    blockedByWalls: true,
    blockedByBoxes: true
  }));

  boxes = this.physics.add.group({ allowGravity: true });
  boxSpawns = [
    { x: 3740, y: 420 },
    { x: 6560, y: 420 }
  ];
  boxSpawns.forEach((spawn) => createBox(this, spawn.x, spawn.y));

  pressureButton = this.physics.add.staticImage(6760, 464, 'button')
    .setDepth(THEME.depths.mechanism);
  pressureButton.body.setSize(54, 16).setOffset(0, -4);
  pressureButton.setData('restY', 464);
  pressureButton.refreshBody();

  doorClosedX = LEVEL_12_TIMED_GATE_CONFIG.doorX;
  doorClosedY = LEVEL_12_TIMED_GATE_CONFIG.doorClosedY;
  doorOpenY = LEVEL_12_TIMED_GATE_CONFIG.doorOpenY;
  doorSafetyZone = new Phaser.Geom.Rectangle(doorClosedX - 28, -30, 56, 500);
  door = this.physics.add.staticImage(doorClosedX, doorClosedY, 'door')
    .setDepth(THEME.depths.mechanism);
  door.setDisplaySize(48, 500);
  door.body.setSize(42, 500);
  door.refreshBody();
  timedSwitchDurationMs = LEVEL_12_TIMED_GATE_CONFIG.durationMs;
  timedSwitchWarningMs = LEVEL_12_TIMED_GATE_CONFIG.warningMs;
  timedSwitchMeter = createTimedSwitchMeter(this, 6385, 112, 210);

  doorLink = this.add.graphics().setDepth(THEME.depths.link);
  doorLink.lineStyle(2, THEME.gameplay.goal, 0.58)
    .lineBetween(6760, 454, doorClosedX, 454)
    .lineBetween(6480, 145, doorClosedX, 145);
  doorLink.fillStyle(THEME.gameplay.goal, 0.82)
    .fillRect(6753, 447, 14, 14)
    .fillRect(6473, 138, 14, 14)
    .fillRect(doorClosedX - 7, 447, 14, 14);

  checkpoints = this.physics.add.staticGroup();
  LEVEL_12_CHECKPOINT_CONFIGS.forEach((config) => {
    createCheckpoint(this, config.x, config.y, config.spawnX, config.spawnY);
  });

  level12BranchZones = this.physics.add.staticGroup();
  const shortcutEntry = level12BranchZones.create(5480, 280, 'ground')
    .setDisplaySize(130, 100)
    .setVisible(false);
  shortcutEntry.setData('level12ZoneKind', 'shortcut-entry').refreshBody();

  level12Collectible = this.physics.add.staticImage(6810, 156, 'mist-token')
    .setDepth(THEME.depths.mechanism + 1);
  level12Collectible.body.setSize(38, 38).setOffset(5, 5);
  level12Collectible.refreshBody();
  const alreadyCollected = collectedItems.has(LEVEL_12_COLLECTIBLE_ID);
  level12Collectible.setVisible(!alreadyCollected);
  level12Collectible.body.enable = !alreadyCollected;
  if (!alreadyCollected) {
    this.tweens.add({
      targets: level12Collectible,
      y: level12Collectible.y - 8,
      angle: -8,
      duration: reducedMotion ? 1 : 680,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
      onUpdate: () => level12Collectible?.refreshBody()
    });
  }

  goal = this.physics.add.staticImage(7480, 437, 'goal')
    .setDepth(THEME.depths.mechanism);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();

  level12ReviewBubble = null;
  createStoryDialogueTrigger(
    this,
    7270,
    [{ speaker: 'player', text: '……哦，好像这个世界的功课做完了。' }],
    220,
    'level12-world-review'
  );

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(createPlayerPatrolPlatformCollider(this));
  activeColliders.push(this.physics.add.collider(player, fallingPlatforms));
  activeColliders.push(this.physics.add.collider(player, smallSprings, smallSpringHitsPlayer));
  activeColliders.push(this.physics.add.collider(player, boxes));
  activeColliders.push(this.physics.add.collider(boxes, platforms));
  activeColliders.push(this.physics.add.collider(player, door));
  activeColliders.push(this.physics.add.collider(boxes, door));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(
    player,
    alternatingSpikes,
    alternatingSpikeHitsPlayer,
    null,
    this
  ));
  activeColliders.push(this.physics.add.overlap(player, fireballs, fireballHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(fireballs, platforms, fireballHitsPlatform));
  activeColliders.push(this.physics.add.overlap(fireballs, boxes, fireballHitsBox));
  activeColliders.push(this.physics.add.overlap(player, checkpoints, activateCheckpoint));
  activeColliders.push(this.physics.add.overlap(
    player,
    level12BranchZones,
    handleLevel12BranchZone,
    null,
    this
  ));
  activeColliders.push(this.physics.add.overlap(
    player,
    level12Collectible,
    collectLevel12Keepsake,
    null,
    this
  ));
  activeColliders.push(this.physics.add.overlap(player, goal, clearLevel, null, this));
  this.physics.world.setBounds(0, 0, LEVEL_12_WIDTH, HEIGHT + 140);
  this.cameras.main.setBounds(0, 0, LEVEL_12_WIDTH, HEIGHT);
  resetLevel12.call(this, false);
}

function updateLevel12(time) {
  updatePatrolPlatforms();
  updateMovingPlatformSpikes();
  updateFallingPlatforms.call(this);
  updateAlternatingSpikes(this, time);
  updateFireCannons(this, time);
  updateLevel12Gate.call(this, time);
}

function resetLevel12(preserveCheckpoint = false) {
  if (currentLevel !== 12) return;
  clearCelebration(this);
  audioManager.stopLevelLoops();
  this.tweens.killTweensOf(player);
  this.tweens.killTweensOf(door);
  if (!preserveCheckpoint) resetCheckpointProgress();
  const spawn = getCurrentRespawn(LEVEL_12_START);

  player.body.checkCollision.none = false;
  player.clearTint().setAlpha(1).setPosition(spawn.x, spawn.y)
    .setVelocity(0).setAcceleration(0);
  player.body.reset(spawn.x, spawn.y);
  player.body.checkCollision.up = true;
  player.setData('level12ShortcutActive', false);

  resetPatrolPlatforms();
  updateMovingPlatformSpikes();
  resetMobilityTools(this);
  resetAllFallingPlatforms(this);
  resetAlternatingSpikeSystem(this);
  resetFireballSystem(this);
  previousBoxPositions.clear();
  resetAllBoxes();

  buttonReleaseUntil = 0;
  buttonPressed = true;
  setButtonPressed(false);
  resetTimedSwitch();
  doorIsOpen = false;
  doorAnimating = false;
  door.setPosition(doorClosedX, doorClosedY).setAlpha(1).clearTint();
  door.body.enable = true;
  door.refreshBody();

  const collected = collectedItems.has(LEVEL_12_COLLECTIBLE_ID);
  level12Collectible?.setVisible(!collected);
  if (level12Collectible?.body) {
    level12Collectible.body.enable = !collected;
    if (!collected) level12Collectible.refreshBody();
  }

  isDead = false;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  coyoteUntil = 0;
  jumpBufferUntil = 0;
  jumpsUsed = 0;
  wasGrounded = true;
  this.cameras.main.stopFollow();
  this.cameras.main.centerOn(spawn.x, HEIGHT / 2);
  this.cameras.main.startFollow(player, true, 0.12, 0.12);
}

function completeLevel13() {
  if (!mudCompanionEncounterResolved) return;
  clearLevel.call(this);
}

function startLevel13() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('world2Music');

  currentLevel = 13;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(13);

  backdrop = drawBackdrop(this, LEVEL_13_WIDTH, 13);
  createLevel13TransitionPresentation(this, backdrop);
  const world2Skin = THEME.mechanismSkins.world2;
  initializeLateWorldMechanisms(this);

  platforms = this.physics.add.staticGroup();
  addPlatform(this, 300, 505, 600, 70);
  addPlatform(this, 1400, 505, 900, 70);
  addPlatform(this, 2500, 505, 600, 70);
  addPlatform(this, 3300, 505, 800, 70);
  addPlatform(this, 4200, 505, 900, 70);
  addPlatform(this, 5150, 505, 1000, 70);
  addPlatform(this, 6025, 505, 750, 70);

  movingPlatforms = this.physics.add.group({ allowGravity: false });
  LEVEL_13_PLATFORM_CONFIGS.forEach((platformConfig) => createPatrolPlatform(this, {
    ...platformConfig,
    textureKey: world2Skin.movingPlatform.textureKey
  }));

  spikes = this.physics.add.staticGroup();
  createStandardSpike(this, 1720);

  initializeFireballSystem(this, world2Skin.fireball.textureKey);
  LEVEL_13_CANNON_CONFIGS.forEach((cannonConfig) => createFireCannon(this, {
    ...cannonConfig,
    textureKey: world2Skin.fireCannon.textureKey,
    warningTint: world2Skin.fireCannon.warningTint,
    blockedByWalls: true,
    blockedByBoxes: true
  }));
  LEVEL_13_WIND_VORTEX_CONFIGS.forEach((config) => createWindVortex(this, config));

  checkpoints = this.physics.add.staticGroup();
  LEVEL_13_CHECKPOINT_CONFIGS.forEach((checkpoint) => {
    createCheckpoint(
      this,
      checkpoint.x,
      checkpoint.y,
      checkpoint.spawnX,
      checkpoint.spawnY
    );
  });

  createMudCompanionEncounter(
    this,
    LEVEL_13_TRANSITION_CONFIG.mudPickupX,
    LEVEL_13_TRANSITION_CONFIG.mudPickupY,
    true
  );

  goal = this.physics.add.staticImage(
    LEVEL_13_TRANSITION_CONFIG.goalX,
    437,
    'goal'
  ).setDepth(THEME.depths.mechanism);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(createPlayerPatrolPlatformCollider(this));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(player, fireballs, fireballHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(fireballs, platforms, fireballHitsPlatform));
  activeColliders.push(this.physics.add.overlap(player, checkpoints, activateCheckpoint));
  if (mudCompanionPickupZone?.body?.enable) {
    activeColliders.push(this.physics.add.overlap(
      player,
      mudCompanionPickupZone,
      collectMudCompanion,
      null,
      this
    ));
  }
  activeColliders.push(this.physics.add.overlap(player, goal, completeLevel13, null, this));
  registerLateWorldMechanismColliders(this);
  addLateWorldHint(this, 3300, '风会一直推。轻轻反着走就好。');

  this.physics.world.setBounds(0, 0, LEVEL_13_WIDTH, HEIGHT + 120);
  this.cameras.main.setBounds(0, 0, LEVEL_13_WIDTH, HEIGHT);
  resetLevel13.call(this, false);
}

function updateLevel13(time) {
  updatePatrolPlatforms();
  updateFireCannons(this, time);
  updateLevel13TransitionPresentation(this, time, player.x);
  updateWindVortices(this);
  updateMudCompanion();
}

function resetLevel13(preserveCheckpoint = false) {
  if (currentLevel !== 13) return;
  clearCelebration(this);
  audioManager.stopLevelLoops();
  this.tweens.killTweensOf(player);
  if (!preserveCheckpoint) resetCheckpointProgress();
  const spawn = getCurrentRespawn(LEVEL_13_START);

  player.body.checkCollision.none = false;
  player.clearTint().setAlpha(1).setPosition(spawn.x, spawn.y)
    .setVelocity(0).setAcceleration(0);
  player.body.reset(spawn.x, spawn.y);
  player.body.checkCollision.up = true;

  resetPatrolPlatforms();
  resetFireballSystem(this);
  resetLateWorldMechanisms(this);
  resetLevel13TransitionPresentation(spawn.x);
  resetMudCompanion(this, !preserveCheckpoint);

  isDead = false;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  coyoteUntil = 0;
  jumpBufferUntil = 0;
  jumpsUsed = 0;
  wasGrounded = true;
  this.cameras.main.stopFollow();
  this.cameras.main.centerOn(spawn.x, HEIGHT / 2);
  this.cameras.main.startFollow(player, true, 0.12, 0.12);
}

function beginLevel14MirrorEnding() {
  if (level14EndingState !== 'idle' || isDead || isCleared) return;
  level14EndingState = 'playing';
  goal.body.enable = false;
  player.setVelocity(0).setAcceleration(0);

  setDownMudCompanion(
    this,
    LEVEL_14_MIRROR_POOL_CONFIG.companionRestX,
    LEVEL_14_MIRROR_POOL_CONFIG.companionRestY,
    LEVEL_14_MIRROR_POOL_CONFIG.setDownMs,
    () => {
      playLevel14MirrorHint(this, level14MirrorLandmark);
      level14EndingTimer = this.time.delayedCall(
        reducedMotion ? 120 : LEVEL_14_MIRROR_POOL_CONFIG.silhouetteMs,
        () => {
          level14EndingTimer = null;
          level14EndingState = 'resolved';
          clearLevel.call(this);
        }
      );
    }
  );
}

function startLevel14() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('world3Music');

  currentLevel = 14;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(14);

  backdrop = drawBackdrop(this, LEVEL_14_WIDTH, 14);
  createWorld3GardenPresentation(this, backdrop, LEVEL_14_WIDTH, 'World 3：镜子花园');
  initializeLateWorldMechanisms(this);

  platforms = this.physics.add.staticGroup();
  LEVEL_14_PLATFORM_CONFIGS.forEach((config) => {
    addPlatform(this, config.x, config.y, config.width, config.height);
  });

  spikes = this.physics.add.staticGroup();
  LEVEL_14_SPIKE_POSITIONS.forEach((x) => createStandardSpike(this, x));
  LEVEL_14_TELEPORT_JAR_PAIRS.forEach(({ first, second }) => {
    createTeleportJarPair(this, first, second);
  });

  checkpoints = this.physics.add.staticGroup();
  createCheckpoint(
    this,
    LEVEL_14_CHECKPOINT_CONFIG.x,
    LEVEL_14_CHECKPOINT_CONFIG.y,
    LEVEL_14_CHECKPOINT_CONFIG.spawnX,
    LEVEL_14_CHECKPOINT_CONFIG.spawnY
  );

  carryMudCompanion(this, true);
  level14MirrorLandmark = createLevel14MirrorPool(
    this,
    LEVEL_14_MIRROR_POOL_CONFIG.x,
    LEVEL_14_MIRROR_POOL_CONFIG.surfaceY
  );

  goal = this.physics.add.staticImage(
    LEVEL_14_MIRROR_POOL_CONFIG.x,
    LEVEL_14_MIRROR_POOL_CONFIG.surfaceY - 42,
    'ground'
  )
    .setDisplaySize(
      LEVEL_14_MIRROR_POOL_CONFIG.triggerWidth,
      LEVEL_14_MIRROR_POOL_CONFIG.triggerHeight
    )
    .setVisible(false);
  goal.refreshBody();

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(player, checkpoints, activateCheckpoint));
  activeColliders.push(this.physics.add.overlap(
    player,
    goal,
    beginLevel14MirrorEnding,
    null,
    this
  ));
  registerLateWorldMechanismColliders(this);
  addLateWorldHint(this, 1580, '两个糖罐，是同一条路。');

  this.physics.world.setBounds(0, 0, LEVEL_14_WIDTH, HEIGHT + 100);
  this.cameras.main.setBounds(0, 0, LEVEL_14_WIDTH, HEIGHT);
  resetLevel14.call(this, false);
}

function updateLevel14(time) {
  updateWindVortices(this);
  updateMudCompanion();
}

function resetLevel14(preserveCheckpoint = false) {
  if (currentLevel !== 14) return;
  clearCelebration(this);
  audioManager.stopLevelLoops();
  this.tweens.killTweensOf(player);
  level14EndingTimer?.remove(false);
  level14EndingTimer = null;
  level14EndingState = 'idle';
  if (!preserveCheckpoint) resetCheckpointProgress();
  const spawn = getCurrentRespawn(LEVEL_14_START);

  player.body.checkCollision.none = false;
  player.clearTint().setAlpha(1).setPosition(spawn.x, spawn.y)
    .setVelocity(0).setAcceleration(0);
  player.body.reset(spawn.x, spawn.y);
  player.body.checkCollision.up = true;

  carryMudCompanion(this, true);
  resetLateWorldMechanisms(this);
  resetLevel14MirrorPool(this, level14MirrorLandmark);
  goal.body.enable = true;
  goal.refreshBody();

  isDead = false;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  coyoteUntil = 0;
  jumpBufferUntil = 0;
  jumpsUsed = 0;
  wasGrounded = true;
  this.cameras.main.stopFollow();
  this.cameras.main.centerOn(spawn.x, HEIGHT / 2);
  this.cameras.main.startFollow(player, true, 0.12, 0.12);
}

function beginLevel15Separation() {
  if (level15SeparationState !== 'carried' || isDead || isCleared) return;
  clearLevel15SeparationPresentation(this);
  level15SeparationState = 'playing';
  level15SeparationZone?.disableBody(true, true);
  player.setVelocity(0).setAcceleration(0);
  facing = -1;
  player.setFlipX(true);

  dropCompanionCaptureRack(
    this,
    level15CaptureRack,
    LEVEL_15_SEPARATION_CONFIG.rackDropMs
  );

  setDownMudCompanion(
    this,
    LEVEL_15_SEPARATION_CONFIG.captureX,
    LEVEL_15_SEPARATION_CONFIG.captureY,
    LEVEL_15_SEPARATION_CONFIG.setDownMs,
    () => {
      setCompanionCaptureRackClosed(this, level15CaptureRack, true);
      level15SeparationTimer = this.time.delayedCall(
        reducedMotion ? 1 : LEVEL_15_SEPARATION_CONFIG.clampHoldMs,
        () => {
          level15SeparationTimer = null;
          liftCompanionCaptureRack(
            this,
            level15CaptureRack,
            mudCompanionFollower,
            LEVEL_15_SEPARATION_CONFIG.rackExitY,
            LEVEL_15_SEPARATION_CONFIG.rackLiftMs,
            () => {
              hideMudCompanionFollower(this);
              showLevel15CompanionQuestion.call(this);
            }
          );
        }
      );
    }
  );
}

function clearLevel15SeparationPresentation(scene) {
  level15SeparationTimer?.remove(false);
  level15SeparationTimer = null;
  closeStoryDialogue(scene, false, 'level15-separation');
  level15QuestionBubble = null;
  if (player?.active) {
    player.setAngle(0);
  }
  resetCompanionCaptureRack(scene, level15CaptureRack);
}

function showLevel15CompanionQuestion() {
  if (currentLevel !== 15 || isDead || isCleared) return;
  this.tweens.add({
    targets: player,
    angle: -4,
    duration: reducedMotion ? 1 : 120,
    yoyo: true,
    repeat: reducedMotion ? 0 : 1,
    ease: 'Sine.InOut'
  });

  level15QuestionBubble = showStoryDialogue(
    this,
    [{ speaker: 'player', text: '我的小人？' }],
    () => {
      level15QuestionBubble = null;
      player.setAngle(0);
      level15SeparationState = 'separated';
      collectedItems.add(MUD_COMPANION_SEPARATED_ID);
      saveProgress();
    },
    'level15-separation'
  );
}

function createWorld3ChallengeDoor(scene, buttonX, doorX) {
  pressureButton = scene.physics.add.staticImage(buttonX, 464, 'button-world3')
    .setDepth(THEME.depths.mechanism);
  pressureButton.body.setSize(54, 16).setOffset(0, -4);
  pressureButton.setData('restY', 464);
  pressureButton.refreshBody();

  doorClosedX = doorX;
  doorClosedY = 360;
  doorOpenY = 145;
  doorSafetyZone = new Phaser.Geom.Rectangle(doorX - 28, 242, 56, 232);
  door = scene.physics.add.staticImage(doorX, doorClosedY, 'door-world3')
    .setDepth(THEME.depths.mechanism);
  door.body.setSize(42, 220);
  door.refreshBody();
}

function startLevel15() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('world3Music');
  currentLevel = 15;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(15);

  backdrop = drawBackdrop(this, LEVEL_15_WIDTH, 14);
  createWorld3GardenPresentation(this, backdrop, LEVEL_15_WIDTH, 'World 3：小泥人被抓走了');
  const skin = THEME.mechanismSkins.world3;

  platforms = this.physics.add.staticGroup();
  [
    [300, 505, 600, 70], [1100, 505, 300, 70], [1700, 505, 600, 70],
    [2400, 505, 600, 70], [3100, 505, 800, 70], [3800, 505, 300, 70],
    [4550, 505, 600, 70], [5250, 505, 600, 70], [5900, 505, 500, 70],
    [6350, 505, 300, 70], [3970, 300, 700, 26], [4720, 285, 360, 26]
  ].forEach(([x, y, width, height]) => addPlatform(this, x, y, width, height));

  movingPlatforms = this.physics.add.group({ allowGravity: false });
  LEVEL_15_PLATFORM_CONFIGS.forEach((config) => createPatrolPlatform(this, {
    ...config,
    textureKey: skin.movingPlatform.textureKey
  }));

  fallingPlatforms = this.physics.add.group({ allowGravity: false });
  [2040, 4200, 4320].forEach((x, index) => {
    createFallingPlatform(this, x, index === 0 ? 430 : 390 + index * 24);
  });

  spikes = this.physics.add.staticGroup();
  [1320, 3700, 5050].forEach((x) => createStandardSpike(this, x));

  initializeAlternatingSpikeSystem(this);
  LEVEL_15_ALTERNATING_SPIKES.forEach((config) => createAlternatingSpikePair(this, config));

  initializeFireballSystem(this, skin.fireball.textureKey);
  LEVEL_15_CANNON_CONFIGS.forEach((config) => createFireCannon(this, {
    ...config,
    textureKey: skin.fireCannon.textureKey,
    warningTint: skin.fireCannon.warningTint,
    blockedByWalls: true,
    blockedByBoxes: true
  }));

  boxes = this.physics.add.group({ allowGravity: true });
  boxSpawns = [{ x: 5350, y: 420 }];
  createBox(this, 5350, 420);
  createWorld3ChallengeDoor(this, 5700, 6100);

  checkpoints = this.physics.add.staticGroup();
  LEVEL_15_CHECKPOINTS.forEach((config) => {
    createCheckpoint(this, config.x, config.y, config.spawnX, config.spawnY);
  });

  carryMudCompanion(this, true);
  level15CaptureRack = createCompanionCaptureRack(
    this,
    LEVEL_15_SEPARATION_CONFIG.captureX,
    LEVEL_15_SEPARATION_CONFIG.captureY,
    LEVEL_15_SEPARATION_CONFIG.rackStartY
  );
  level15SeparationZone = this.physics.add.staticImage(
    LEVEL_15_SEPARATION_CONFIG.triggerX,
    LEVEL_15_SEPARATION_CONFIG.triggerY,
    'ground'
  ).setDisplaySize(96, HEIGHT).setVisible(false);
  level15SeparationZone.refreshBody();

  goal = this.physics.add.staticImage(6400, 437, 'goal-world3').setDepth(THEME.depths.mechanism);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(createPlayerPatrolPlatformCollider(this));
  activeColliders.push(this.physics.add.collider(player, fallingPlatforms));
  activeColliders.push(this.physics.add.collider(player, boxes));
  activeColliders.push(this.physics.add.collider(boxes, platforms));
  activeColliders.push(this.physics.add.collider(boxes, movingPlatforms));
  activeColliders.push(this.physics.add.collider(player, door));
  activeColliders.push(this.physics.add.collider(boxes, door));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(player, alternatingSpikes, alternatingSpikeHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(player, fireballs, fireballHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(fireballs, platforms, fireballHitsPlatform));
  activeColliders.push(this.physics.add.overlap(fireballs, boxes, fireballHitsBox));
  activeColliders.push(this.physics.add.overlap(player, checkpoints, activateCheckpoint));
  activeColliders.push(this.physics.add.overlap(player, level15SeparationZone, beginLevel15Separation, null, this));
  activeColliders.push(this.physics.add.overlap(player, goal, clearLevel, null, this));

  this.physics.world.setBounds(0, 0, LEVEL_15_WIDTH, HEIGHT + 130);
  this.cameras.main.setBounds(0, 0, LEVEL_15_WIDTH, HEIGHT);
  resetLevel15.call(this, false);
}

function updateLevel15(time) {
  updatePatrolPlatforms();
  updateFallingPlatforms.call(this);
  updateAlternatingSpikes(this, time);
  updateFireCannons(this, time);
  updatePuzzleMechanisms.call(this, time, LEVEL_15_WIDTH);
  updateMudCompanion();
}

function resetLevel15(preserveCheckpoint = false) {
  if (currentLevel !== 15) return;
  clearCelebration(this);
  audioManager.stopLevelLoops();
  this.tweens.killTweensOf(player);
  this.tweens.killTweensOf(door);
  clearLevel15SeparationPresentation(this);
  const retainSeparation = preserveCheckpoint && level15SeparationState === 'separated';
  if (!preserveCheckpoint) resetCheckpointProgress();
  const spawn = getCurrentRespawn(LEVEL_15_START);

  player.body.checkCollision.none = false;
  player.clearTint().setAlpha(1).setAngle(0).setPosition(spawn.x, spawn.y)
    .setVelocity(0).setAcceleration(0);
  player.body.reset(spawn.x, spawn.y);
  player.body.checkCollision.up = true;

  resetPatrolPlatforms();
  resetAllFallingPlatforms(this);
  resetAlternatingSpikeSystem(this);
  resetFireballSystem(this);
  previousBoxPositions.clear();
  resetAllBoxes();
  buttonReleaseUntil = 0;
  buttonPressed = true;
  setButtonPressed(false);
  doorIsOpen = false;
  doorAnimating = false;
  door.setPosition(doorClosedX, doorClosedY).setAlpha(1).clearTint();
  door.body.enable = true;
  door.refreshBody();

  if (retainSeparation) {
    level15SeparationState = 'separated';
    level15SeparationZone?.disableBody(true, true);
    hideMudCompanionFollower(this);
    resetCompanionCaptureRack(this, level15CaptureRack);
  } else {
    level15SeparationState = 'carried';
    level15SeparationZone?.enableBody(
      false,
      LEVEL_15_SEPARATION_CONFIG.triggerX,
      LEVEL_15_SEPARATION_CONFIG.triggerY,
      true,
      false
    );
    carryMudCompanion(this, true);
    resetCompanionCaptureRack(this, level15CaptureRack);
  }

  isDead = false;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  coyoteUntil = 0;
  jumpBufferUntil = 0;
  jumpsUsed = 0;
  wasGrounded = true;
  this.cameras.main.stopFollow();
  this.cameras.main.centerOn(spawn.x, HEIGHT / 2);
  this.cameras.main.startFollow(player, true, 0.12, 0.12);
}

function startLevel16() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('world3Music');
  currentLevel = 16;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(16);

  backdrop = drawBackdrop(this, LEVEL_16_WIDTH, 14);
  createWorld3GardenPresentation(this, backdrop, LEVEL_16_WIDTH, 'World 3：一个人的机关路');
  extendWorld3PresentationVertically(this, backdrop, LEVEL_16_WIDTH, LEVEL_16_WORLD_TOP);
  const skin = THEME.mechanismSkins.world3;
  initializeLateWorldMechanisms(this);

  platforms = this.physics.add.staticGroup();
  [
    [260, 505, 520, 70], [990, 505, 240, 70], [1600, 505, 360, 70],
    [2180, 505, 260, 70], [2920, 505, 360, 70], [3560, 505, 420, 70],
    [4250, 505, 340, 70], [4920, 505, 300, 70], [5550, 505, 360, 70],
    [6200, 505, 500, 70], [6890, 505, 620, 70], [1360, 285, 560, 26],
    [2520, 365, 200, 26], [3290, 280, 160, 26], [4600, 265, 620, 26],
    [5190, 390, 180, 26], [5790, 270, 140, 26]
  ].forEach(([x, y, width, height]) => addPlatform(this, x, y, width, height));

  movingPlatforms = this.physics.add.group({ allowGravity: false });
  LEVEL_16_PLATFORM_CONFIGS.forEach((config) => createPatrolPlatform(this, {
    ...config,
    textureKey: skin.movingPlatform.textureKey
  }));
  ladders = this.physics.add.staticGroup();
  smallSprings = this.physics.add.staticGroup();
  createWorld3VerticalTrial(this, LEVEL_16_VERTICAL_TRIAL, skin);

  fallingPlatforms = this.physics.add.group({ allowGravity: false });
  [[1900, 400], [2020, 360], [3820, 410], [3940, 370]].forEach(([x, y]) => {
    createFallingPlatform(this, x, y);
  });

  spikes = this.physics.add.staticGroup();
  // Keep the final crate ferry clear so the box can be pushed onto it and carried to the door button.
  [1860, 3660, 4860].forEach((x) => createStandardSpike(this, x));

  initializeAlternatingSpikeSystem(this);
  LEVEL_16_ALTERNATING_SPIKES.forEach((config) => createAlternatingSpikePair(this, config));

  initializeFireballSystem(this, skin.fireball.textureKey);
  LEVEL_16_CANNON_CONFIGS.forEach((config) => createFireCannon(this, {
    ...config,
    textureKey: skin.fireCannon.textureKey,
    warningTint: skin.fireCannon.warningTint,
    blockedByWalls: true,
    blockedByBoxes: true
  }));
  LEVEL_16_TELEPORT_JAR_PAIRS.forEach(({ first, second }) => {
    createTeleportJarPair(this, first, second);
  });
  LEVEL_16_WIND_VORTEX_CONFIGS.forEach((config) => createWindVortex(this, config));

  boxes = this.physics.add.group({ allowGravity: true });
  boxSpawns = [{ x: 6260, y: 420 }];
  createBox(this, 6260, 420);
  createWorld3ChallengeDoor(this, 6660, 6950);

  checkpoints = this.physics.add.staticGroup();
  LEVEL_16_CHECKPOINTS.forEach((config) => {
    createCheckpoint(this, config.x, config.y, config.spawnX, config.spawnY);
  });

  goal = this.physics.add.staticImage(7100, 437, 'goal-world3').setDepth(THEME.depths.mechanism);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(createPlayerPatrolPlatformCollider(this));
  activeColliders.push(this.physics.add.collider(player, fallingPlatforms));
  activeColliders.push(this.physics.add.collider(player, boxes));
  activeColliders.push(this.physics.add.collider(boxes, platforms));
  activeColliders.push(this.physics.add.collider(boxes, movingPlatforms));
  activeColliders.push(this.physics.add.collider(player, door));
  activeColliders.push(this.physics.add.collider(boxes, door));
  activeColliders.push(this.physics.add.collider(player, smallSprings, smallSpringHitsPlayer));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(player, alternatingSpikes, alternatingSpikeHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(player, fireballs, fireballHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(fireballs, platforms, fireballHitsPlatform));
  activeColliders.push(this.physics.add.overlap(fireballs, boxes, fireballHitsBox));
  activeColliders.push(this.physics.add.overlap(player, checkpoints, activateCheckpoint));
  activeColliders.push(this.physics.add.overlap(player, goal, clearLevel, null, this));
  registerLateWorldMechanismColliders(this);
  addLateWorldHint(this, 5200, '糖罐换位置，风再把路线推歪一点。');

  this.physics.world.setBounds(
    0,
    LEVEL_16_WORLD_TOP,
    LEVEL_16_WIDTH,
    HEIGHT + 140 - LEVEL_16_WORLD_TOP
  );
  this.cameras.main.setBounds(
    0,
    LEVEL_16_WORLD_TOP,
    LEVEL_16_WIDTH,
    HEIGHT - LEVEL_16_WORLD_TOP
  );
  resetLevel16.call(this, false);
}

function updateLevel16(time) {
  updatePatrolPlatforms();
  updateFallingPlatforms.call(this);
  updateAlternatingSpikes(this, time);
  updateFireCannons(this, time);
  updateWindVortices(this);
  updatePuzzleMechanisms.call(this, time, LEVEL_16_WIDTH);
}

function resetLevel16(preserveCheckpoint = false) {
  if (currentLevel !== 16) return;
  clearCelebration(this);
  audioManager.stopLevelLoops();
  this.tweens.killTweensOf(player);
  this.tweens.killTweensOf(door);
  if (!preserveCheckpoint) resetCheckpointProgress();
  const spawn = getCurrentRespawn(LEVEL_16_START);

  player.body.checkCollision.none = false;
  player.clearTint().setAlpha(1).setPosition(spawn.x, spawn.y)
    .setVelocity(0).setAcceleration(0);
  player.body.reset(spawn.x, spawn.y);
  player.body.checkCollision.up = true;

  resetPatrolPlatforms();
  resetMobilityTools(this);
  resetAllFallingPlatforms(this);
  resetAlternatingSpikeSystem(this);
  resetFireballSystem(this);
  resetLateWorldMechanisms(this);
  previousBoxPositions.clear();
  resetAllBoxes();
  buttonReleaseUntil = 0;
  buttonPressed = true;
  setButtonPressed(false);
  doorIsOpen = false;
  doorAnimating = false;
  door.setPosition(doorClosedX, doorClosedY).setAlpha(1).clearTint();
  door.body.enable = true;
  door.refreshBody();

  isDead = false;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  coyoteUntil = 0;
  jumpBufferUntil = 0;
  jumpsUsed = 0;
  wasGrounded = true;
  this.cameras.main.stopFollow();
  this.cameras.main.centerOn(spawn.x, HEIGHT / 2);
  this.cameras.main.startFollow(player, true, 0.12, 0.12);
}

function addLateWorldHint(scene, x, text) {
  return createGameplayHintTrigger(scene, x, text, 280);
}

function createWorld3VerticalTrial(scene, config, skin) {
  const mobilitySkin = THEME.mechanismSkins.world3;
  config.fixedPlatforms?.forEach(([x, y, width, height]) => {
    addPlatform(scene, x, y, width, height);
  });
  config.ladders?.forEach((ladderConfig) => {
    createLadder(scene, { ...ladderConfig, skin: skin.ladder || mobilitySkin.ladder });
  });
  config.springs?.forEach((springConfig) => {
    createSmallSpring(scene, { ...springConfig, skin: skin.spring || mobilitySkin.spring });
  });
  config.movingPlatforms?.forEach((platformConfig) => {
    createPatrolPlatform(scene, {
      ...platformConfig,
      textureKey: skin.movingPlatform.textureKey
    });
  });

  const guides = scene.add.graphics();
  guides.fillStyle(skin.movingPlatform.outline, 0.3);
  config.movingPlatforms
    ?.filter((platformConfig) => platformConfig.axis === 'y')
    .forEach((platformConfig) => {
      const endY = platformConfig.y
        + (platformConfig.direction || 1) * platformConfig.distance;
      guides.fillRect(
        platformConfig.x - 3,
        Math.min(platformConfig.y, endY),
        6,
        Math.abs(platformConfig.y - endY)
      );
    });
  backdrop?.add(guides);
}

function addMudTrail(scene, x, y = 458) {
  const trail = scene.add.graphics().setDepth(THEME.depths.scenery + 2);
  trail.fillStyle(MUD_COMPANION_CONFIG.color, 0.72)
    .fillEllipse(x - 8, y, 7, 4)
    .fillEllipse(x + 7, y - 4, 6, 4)
    .fillEllipse(x + 18, y, 7, 4);
  lateWorld3Decorations.push(trail);
  return trail;
}

function registerLateWorldMechanismColliders(scene) {
  if (teleportJars) {
    activeColliders.push(scene.physics.add.overlap(
      player,
      teleportJars,
      teleportPlayer,
      null,
      scene
    ));
  }
}

function updateLateWorldLevel(scene, time, width, options = {}) {
  updatePatrolPlatforms();
  updateFallingPlatforms.call(scene);
  updateAlternatingSpikes(scene, time);
  updateFireCannons(scene, time);
  updateWindVortices(scene);
  if (options.puzzleDoor) updatePuzzleMechanisms.call(scene, time, width);
  else if (boxes) updateBoxes.call(scene, time, width, true);
  updateMudCompanion();
}

function resetLateWorldLevel(scene, defaultSpawn, preserveCheckpoint, options = {}) {
  clearCelebration(scene);
  audioManager.stopLevelLoops();
  scene.tweens.killTweensOf(player);
  scene.tweens.killTweensOf(door);
  if (!preserveCheckpoint) resetCheckpointProgress();
  const spawn = getCurrentRespawn(defaultSpawn);

  player.body.checkCollision.none = false;
  player.body.allowGravity = true;
  player.clearTint().setAlpha(1).setAngle(0).setPosition(spawn.x, spawn.y)
    .setVelocity(0).setAcceleration(0);
  player.body.reset(spawn.x, spawn.y);
  player.body.checkCollision.up = true;

  resetPatrolPlatforms();
  resetAllFallingPlatforms(scene);
  resetAlternatingSpikeSystem(scene);
  resetFireballSystem(scene);
  resetLateWorldMechanisms(scene);
  resetMobilityTools(scene);
  previousBoxPositions.clear();
  if (boxes) resetAllBoxes();
  if (options.puzzleDoor && door) {
    buttonReleaseUntil = 0;
    buttonPressed = true;
    setButtonPressed(false);
    doorIsOpen = false;
    doorAnimating = false;
    door.setPosition(doorClosedX, doorClosedY).setAlpha(1).clearTint();
    door.body.enable = true;
    door.refreshBody();
  }

  isDead = false;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  coyoteUntil = 0;
  jumpBufferUntil = 0;
  jumpsUsed = 0;
  wasGrounded = true;
  scene.cameras.main.stopFollow();
  scene.cameras.main.centerOn(spawn.x, spawn.y);
  scene.cameras.main.startFollow(player, true, 0.12, 0.12);
}

function startLevel17() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('world3Music');
  currentLevel = 17;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(17);

  backdrop = drawBackdrop(this, LEVEL_17_WIDTH, 14);
  createWorld3GardenPresentation(this, backdrop, LEVEL_17_WIDTH, 'World 3：寻找小泥人');
  extendWorld3PresentationVertically(this, backdrop, LEVEL_17_WIDTH, LEVEL_17_WORLD_TOP);
  platforms = this.physics.add.staticGroup();
  [
    [300, 505, 600, 70], [1720, 505, 520, 70], [3540, 505, 500, 70],
    [4300, 505, 420, 70], [5100, 505, 600, 70], [2050, 320, 260, 26],
    [3920, 300, 300, 26], [4420, 430, 100, 26]
  ].forEach(([x, y, width, height]) => addPlatform(this, x, y, width, height));

  smallSprings = this.physics.add.staticGroup();
  ladders = this.physics.add.staticGroup();
  createSmallSpring(this, {
    ...LEVEL_17_SPRING_CONFIG,
    skin: THEME.mechanismSkins.world3.spring
  });

  movingPlatforms = this.physics.add.group({ allowGravity: false });
  createWorld3VerticalTrial(
    this,
    LEVEL_17_VERTICAL_TRIAL,
    THEME.mechanismSkins.world3
  );
  createPatrolPlatform(this, {
    id: 'trail-ferry', axis: 'x', x: 3690, y: -250,
    distance: 380, speed: 104, width: 140,
    textureKey: THEME.mechanismSkins.world3.movingPlatform.textureKey
  });
  initializeFireballSystem(this, THEME.mechanismSkins.world3.fireball.textureKey);
  createFireCannon(this, {
    ...LEVEL_17_CANNON_CONFIG,
    y: -315,
    textureKey: THEME.mechanismSkins.world3.fireCannon.textureKey,
    warningTint: THEME.mechanismSkins.world3.fireCannon.warningTint,
    blockedByWalls: true
  });
  fallingPlatforms = this.physics.add.group({ allowGravity: false });
  [720, 860, 1010, 1170, 1340].forEach((x, index) => {
    createFallingPlatform(this, x, 430 - (index % 2) * 42);
  });
  LEVEL_17_FALLING_PLATFORM_CONFIGS.forEach(({ x, y }) => {
    createFallingPlatform(this, x, y);
  });
  [[4560, -245], [4690, -285], [4820, -245]].forEach(([x, y]) => {
    createFallingPlatform(this, x, y);
  });
  spikes = this.physics.add.staticGroup();
  [1880, 4900].forEach((x) => createStandardSpike(this, x));
  boxes = this.physics.add.group({ allowGravity: true });
  checkpoints = this.physics.add.staticGroup();
  createCheckpoint(this, 1770, 437, 1770, 425);
  createCheckpoint(this, 4240, -331, 4240, -343);
  goal = this.physics.add.staticImage(5260, -291, 'goal-world3')
    .setDepth(THEME.depths.mechanism);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();

  createStoryDialogueTrigger(
    this,
    245,
    [{ speaker: 'player', text: '那些黑点……不是我的鞋印吧。' }],
    220,
    'level17-footprints-thought'
  );
  addMudTrail(this, 1520);
  addMudTrail(this, 3380, -301);
  addMudTrail(this, 4940, -261);

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(createPlayerPatrolPlatformCollider(this));
  activeColliders.push(this.physics.add.collider(player, smallSprings, smallSpringHitsPlayer));
  activeColliders.push(this.physics.add.collider(player, fallingPlatforms));
  activeColliders.push(this.physics.add.overlap(player, fireballs, fireballHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(fireballs, platforms, fireballHitsPlatform));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(player, checkpoints, activateCheckpoint));
  activeColliders.push(this.physics.add.overlap(player, goal, clearLevel, null, this));

  this.physics.world.setBounds(
    0,
    LEVEL_17_WORLD_TOP,
    LEVEL_17_WIDTH,
    HEIGHT + 140 - LEVEL_17_WORLD_TOP
  );
  this.cameras.main.setBounds(
    0,
    LEVEL_17_WORLD_TOP,
    LEVEL_17_WIDTH,
    HEIGHT - LEVEL_17_WORLD_TOP
  );
  resetLevel17.call(this, false);
}

function updateLevel17(time) {
  updateLateWorldLevel(this, time, LEVEL_17_WIDTH);
}

function resetLevel17(preserveCheckpoint = false) {
  if (currentLevel !== 17) return;
  hideMudCompanionFollower(this);
  resetLateWorldLevel(this, LEVEL_17_START, preserveCheckpoint);
}

function beginLevel18Reunion() {
  if (level18ReunionState !== 'waiting' || isDead || isCleared) return;
  level18ReunionState = 'playing';
  level18ReunionZone?.disableBody(true, true);
  player.setVelocity(0).setAcceleration(0);
  levelStoryBubble = showStoryDialogue(
    this,
    [
      { speaker: 'mud', text: '我以为你走掉了。' },
      { speaker: 'player', text: '我只是绕了点路。上来吧。' }
    ],
    () => {
      levelStoryBubble = null;
      carryMudCompanion(this, true);
      level18ReunionState = 'reunited';
      collectedItems.add(MUD_COMPANION_REUNITED_ID);
      goal.body.enable = true;
      goal.refreshBody();
      saveProgress();
    },
    'level18-reunion'
  );
}

function startLevel18() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('world3Music');
  currentLevel = 18;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(18);

  backdrop = drawBackdrop(this, LEVEL_18_WIDTH, 14);
  createWorld3GardenPresentation(this, backdrop, LEVEL_18_WIDTH, 'World 3：小泥人回来了');
  extendWorld3PresentationVertically(this, backdrop, LEVEL_18_WIDTH, LEVEL_18_WORLD_TOP);
  initializeLateWorldMechanisms(this);

  const skin = THEME.mechanismSkins.world3;
  const mobilitySkin = THEME.mechanismSkins.world3;
  platforms = this.physics.add.staticGroup();
  LEVEL_18_FIXED_PLATFORM_CONFIGS.forEach(([x, y, width, height]) => {
    addPlatform(this, x, y, width, height);
  });

  LEVEL_18_TELEPORT_JAR_PAIRS.forEach(([first, second]) => {
    createTeleportJarPair(this, first, second);
  });

  movingPlatforms = this.physics.add.group({ allowGravity: false });
  const level18PlatformsById = new Map();
  LEVEL_18_PLATFORM_CONFIGS.forEach((config) => {
    level18PlatformsById.set(config.id, createPatrolPlatform(this, {
      ...config,
      textureKey: skin.movingPlatform.textureKey
    }));
  });

  const liftTracks = this.add.graphics();
  liftTracks.fillStyle(skin.movingPlatform.outline, 0.35);
  LEVEL_18_PLATFORM_CONFIGS
    .filter((config) => config.axis === 'y')
    .forEach((config) => {
      const endY = config.y + config.direction * config.distance;
      liftTracks.fillRect(
        config.x - 3,
        Math.min(config.y, endY) - 11,
        6,
        Math.abs(config.y - endY) + 22
      );
    });
  backdrop.add(liftTracks);

  ladders = this.physics.add.staticGroup();
  LEVEL_18_LADDER_CONFIGS.forEach((config) => {
    createLadder(this, { ...config, skin: mobilitySkin.ladder });
  });

  smallSprings = this.physics.add.staticGroup();
  LEVEL_18_SPRING_CONFIGS.forEach((config) => {
    createSmallSpring(this, { ...config, skin: mobilitySkin.spring });
  });

  LEVEL_18_WIND_VORTEX_CONFIGS.forEach((config) => {
    createWindVortex(this, config);
  });

  fallingPlatforms = this.physics.add.group({ allowGravity: false });
  LEVEL_18_CLOUD_CONFIGS.forEach(({ x, y }) => {
    createFallingPlatform(this, x, y);
  });

  spikes = this.physics.add.staticGroup();
  LEVEL_18_SPIKE_CONFIGS.forEach((config) => {
    const spike = createStandardSpike(this, config.x, config.y);
    spike.setData('level18Id', config.id);
  });
  LEVEL_18_MOVING_SPIKE_CONFIGS.forEach((config) => {
    createMovingPlatformSpike(this, level18PlatformsById.get(config.carrierId), config);
  });

  initializeAlternatingSpikeSystem(this);
  LEVEL_18_ALTERNATING_SPIKE_CONFIGS.forEach((config) => {
    createAlternatingSpikePair(this, config);
  });

  initializeFireballSystem(this, skin.fireball.textureKey);
  LEVEL_18_CANNON_CONFIGS.forEach((config) => {
    createFireCannon(this, {
      ...config,
      textureKey: skin.fireCannon.textureKey,
      warningTint: skin.fireCannon.warningTint,
      blockedByWalls: true
    });
  });

  checkpoints = this.physics.add.staticGroup();
  LEVEL_18_CHECKPOINT_CONFIGS.forEach((config) => {
    createCheckpoint(this, config.x, config.y, config.spawnX, config.spawnY);
  });

  placeMudCompanion(
    this,
    LEVEL_18_REUNION_CONFIG.companionX,
    LEVEL_18_REUNION_CONFIG.companionY
  );
  level18ReunionZone = this.physics.add.staticImage(
    LEVEL_18_REUNION_CONFIG.zoneX,
    LEVEL_18_REUNION_CONFIG.zoneY,
    'ground'
  )
    .setDisplaySize(220, 130)
    .setVisible(false);
  level18ReunionZone.refreshBody();
  goal = this.physics.add.staticImage(
    LEVEL_18_REUNION_CONFIG.goalX,
    LEVEL_18_REUNION_CONFIG.goalY,
    'goal-world3'
  )
    .setDepth(THEME.depths.mechanism);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();
  goal.body.enable = false;
  createStoryDialogueTrigger(
    this,
    230,
    [{ speaker: 'player', text: '往上走。罐子应该不会把我倒着吐出来吧。' }],
    220,
    'level18-jar-thought'
  );
  // Continue Level 17's search trail through the vertical route. The marks
  // become more frequent near the reunion, distinguishing this ascent from
  // Level 9 without adding collision, guidance text, or route changes.
  [
    [560, -157],
    [760, -462],
    [840, -1387],
    [430, -1932],
    [520, -2472],
    [590, -2472]
  ].forEach(([x, y]) => addMudTrail(this, x, y));

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(createPlayerPatrolPlatformCollider(this));
  activeColliders.push(this.physics.add.collider(player, fallingPlatforms));
  activeColliders.push(this.physics.add.collider(player, smallSprings, smallSpringHitsPlayer));
  activeColliders.push(this.physics.add.overlap(player, fireballs, fireballHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(fireballs, platforms, fireballHitsPlatform));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(
    player,
    alternatingSpikes,
    alternatingSpikeHitsPlayer,
    null,
    this
  ));
  activeColliders.push(this.physics.add.overlap(player, checkpoints, activateCheckpoint));
  activeColliders.push(this.physics.add.overlap(player, level18ReunionZone, beginLevel18Reunion, null, this));
  activeColliders.push(this.physics.add.overlap(player, goal, clearLevel, null, this));
  registerLateWorldMechanismColliders(this);

  this.physics.world.setBounds(
    0,
    LEVEL_18_WORLD_TOP,
    LEVEL_18_WIDTH,
    HEIGHT + 140 - LEVEL_18_WORLD_TOP
  );
  this.cameras.main.setBounds(
    0,
    LEVEL_18_WORLD_TOP,
    LEVEL_18_WIDTH,
    HEIGHT - LEVEL_18_WORLD_TOP
  );
  resetLevel18.call(this, false);
}

function updateLevel18(time) {
  updateMovingPlatformSpikes();
  updateLateWorldLevel(this, time, LEVEL_18_WIDTH);
}

function resetLevel18(preserveCheckpoint = false) {
  if (currentLevel !== 18) return;
  const retainReunion = preserveCheckpoint && level18ReunionState === 'reunited';
  clearLateWorldStoryPresentation(this);
  resetLateWorldLevel(this, LEVEL_18_START, preserveCheckpoint);
  if (retainReunion) {
    level18ReunionState = 'reunited';
    level18ReunionZone?.disableBody(true, true);
    carryMudCompanion(this, true);
    goal.body.enable = true;
    goal.refreshBody();
  } else {
    level18ReunionState = 'waiting';
    hideMudCompanionFollower(this);
    placeMudCompanion(
      this,
      LEVEL_18_REUNION_CONFIG.companionX,
      LEVEL_18_REUNION_CONFIG.companionY
    );
    level18ReunionZone?.enableBody(
      false,
      LEVEL_18_REUNION_CONFIG.zoneX,
      LEVEL_18_REUNION_CONFIG.zoneY,
      true,
      false
    );
    goal.body.enable = false;
  }
  updateMovingPlatformSpikes();
}

function startLevel19() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('world3Music');
  currentLevel = 19;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(19);

  const skin = THEME.mechanismSkins.world3;
  const mobilitySkin = THEME.mechanismSkins.world3;
  backdrop = drawBackdrop(this, LEVEL_19_WIDTH, 14);
  createWorld3GardenPresentation(this, backdrop, LEVEL_19_WIDTH, 'World 3：风中的两条路');
  extendWorld3PresentationVertically(this, backdrop, LEVEL_19_WIDTH, LEVEL_19_WORLD_TOP);
  initializeLateWorldMechanisms(this);

  platforms = this.physics.add.staticGroup();
  LEVEL_19_FIXED_PLATFORM_CONFIGS.forEach(([x, y, width, height]) => {
    addPlatform(this, x, y, width, height);
  });

  LEVEL_19_TELEPORT_JAR_PAIRS.forEach(([first, second]) => {
    createTeleportJarPair(this, first, second);
  });
  LEVEL_19_WIND_VORTEX_CONFIGS.forEach((config) => createWindVortex(this, config));

  movingPlatforms = this.physics.add.group({ allowGravity: false });
  const level19PlatformsById = new Map();
  LEVEL_19_PLATFORM_CONFIGS.forEach((config) => {
    level19PlatformsById.set(config.id, createPatrolPlatform(this, {
      ...config,
      textureKey: skin.movingPlatform.textureKey
    }));
  });

  ladders = this.physics.add.staticGroup();
  smallSprings = this.physics.add.staticGroup();
  LEVEL_19_SPRING_CONFIGS.forEach((config) => {
    createSmallSpring(this, { ...config, skin: mobilitySkin.spring });
  });

  fallingPlatforms = this.physics.add.group({ allowGravity: false });
  LEVEL_19_CLOUD_CONFIGS.forEach(({ x, y }) => createFallingPlatform(this, x, y));

  spikes = this.physics.add.staticGroup();
  LEVEL_19_SPIKE_CONFIGS.forEach((config) => {
    const spike = createStandardSpike(this, config.x, config.y);
    spike.setData('level19Id', config.id);
  });
  LEVEL_19_MOVING_SPIKE_CONFIGS.forEach((config) => {
    createMovingPlatformSpike(this, level19PlatformsById.get(config.carrierId), config);
  });

  initializeAlternatingSpikeSystem(this);
  LEVEL_19_ALTERNATING_SPIKE_CONFIGS.forEach((config) => {
    createAlternatingSpikePair(this, config);
  });
  initializeFireballSystem(this, skin.fireball.textureKey);
  LEVEL_19_CANNON_CONFIGS.forEach((config) => createFireCannon(this, {
    ...config,
    textureKey: skin.fireCannon.textureKey,
    warningTint: skin.fireCannon.warningTint,
    blockedByWalls: true
  }));

  boxes = this.physics.add.group({ allowGravity: true });
  checkpoints = this.physics.add.staticGroup();
  LEVEL_19_CHECKPOINT_CONFIGS.forEach((config) => {
    createCheckpoint(this, config.x, config.y, config.spawnX, config.spawnY);
  });
  goal = this.physics.add.staticImage(
    LEVEL_19_GOAL_CONFIG.x,
    LEVEL_19_GOAL_CONFIG.y,
    'goal-world3'
  ).setDepth(THEME.depths.mechanism);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();

  addLateWorldHint(this, 210, '先弹上去。分路以后，左边稳一点。');
  const shortcutReward = this.add.text(820, -735, '◇', {
    fontFamily: THEME.typography.display,
    fontSize: '36px',
    color: THEME.colors.white
  }).setOrigin(0.5).setDepth(THEME.depths.feedback);
  lateWorld3Decorations.push(shortcutReward);

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(createPlayerPatrolPlatformCollider(this));
  activeColliders.push(this.physics.add.collider(player, fallingPlatforms));
  activeColliders.push(this.physics.add.collider(player, smallSprings, smallSpringHitsPlayer));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(player, alternatingSpikes, alternatingSpikeHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(player, fireballs, fireballHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(fireballs, platforms, fireballHitsPlatform));
  activeColliders.push(this.physics.add.overlap(player, checkpoints, activateCheckpoint));
  activeColliders.push(this.physics.add.overlap(player, goal, clearLevel, null, this));
  registerLateWorldMechanismColliders(this);
  carryMudCompanion(this, true);

  this.physics.world.setBounds(
    0,
    LEVEL_19_WORLD_TOP,
    LEVEL_19_WIDTH,
    HEIGHT + 140 - LEVEL_19_WORLD_TOP
  );
  this.cameras.main.setBounds(
    0,
    LEVEL_19_WORLD_TOP,
    LEVEL_19_WIDTH,
    HEIGHT - LEVEL_19_WORLD_TOP
  );
  resetLevel19.call(this, false);
}

function updateLevel19(time) {
  updateMovingPlatformSpikes();
  updateLateWorldLevel(this, time, LEVEL_19_WIDTH);
}

function resetLevel19(preserveCheckpoint = false) {
  if (currentLevel !== 19) return;
  resetLateWorldLevel(this, LEVEL_19_START, preserveCheckpoint);
  carryMudCompanion(this, true);
  updateMovingPlatformSpikes();
}

function getLevel20PhaseForCheckpoint(index) {
  if (index >= 3) return 'returned';
  if (index === 2) return 'returning';
  if (index === 1) return 'upper-route';
  if (index === 0) return 'door-cleared';
  return 'start';
}

function activateLevel20Checkpoint(hitPlayer, marker) {
  if (currentLevel !== 20 || isDead || isCleared) return;
  const index = marker.getData('checkpointIndex');
  if (!Number.isInteger(index) || index !== activeCheckpointIndex + 1) return;
  if (index === 2 && level20RoutePhase !== 'teleported') return;
  if (index === 3 && level20RoutePhase !== 'returning') return;

  activateCheckpoint(hitPlayer, marker);
  level20RoutePhase = getLevel20PhaseForCheckpoint(index);
  if (level20RoutePhase === 'returned') {
    goal.setVisible(true);
    goal.body.enable = true;
    goal.refreshBody();
  }
}

function markLevel20OutboundTeleportComplete() {
  if (currentLevel === 20 && level20RoutePhase === 'upper-route') {
    level20RoutePhase = 'teleported';
  }
}

function recoverLevel20UpperFall() {
  if (
    currentLevel !== 20
    || level20RoutePhase !== 'upper-route'
    || isDead
    || isCleared
  ) return;
  resetLevel20.call(this, true);
  playRespawnFeedback(this, player);
}

function completeLevel20() {
  if (level20RoutePhase !== 'returned') return;
  clearLevel.call(this);
}

function clearLateWorldStoryPresentation(scene) {
  level18ReunionTimer?.remove(false);
  level18ReunionTimer = null;
  closeStoryDialogue(scene, false, 'level18-reunion');
  levelStoryBubble = null;
  if (player?.active) player.setAngle(0);
}

function startLevel20() {
  cleanupCurrentLevel(this);
  audioManager.playMusic('world3Music');
  currentLevel = 20;
  isCleared = false;
  clearPanel.setVisible(false);
  hideClearActions();
  updateHudLevel(20);

  const skin = THEME.mechanismSkins.world3;
  const mobilitySkin = THEME.mechanismSkins.world3;
  backdrop = drawBackdrop(this, LEVEL_20_WIDTH, 14);
  createWorld3GardenPresentation(this, backdrop, LEVEL_20_WIDTH, '最终关：糖果大考验');
  extendWorld3PresentationVertically(this, backdrop, LEVEL_20_WIDTH, LEVEL_20_WORLD_TOP);
  initializeLateWorldMechanisms(this);

  platforms = this.physics.add.staticGroup();
  LEVEL_20_FIXED_PLATFORM_CONFIGS.forEach(([x, y, width, height]) => {
    addPlatform(this, x, y, width, height);
  });
  LEVEL_20_WALL_CONFIGS.forEach(([x, y, width, height]) => {
    addPlatform(this, x, y, width, height);
  });

  movingPlatforms = this.physics.add.group({ allowGravity: false });
  const level20PlatformsById = new Map();
  LEVEL_20_PLATFORM_CONFIGS.forEach((config) => {
    level20PlatformsById.set(config.id, createPatrolPlatform(this, {
      ...config,
      textureKey: skin.movingPlatform.textureKey
    }));
  });

  fallingPlatforms = this.physics.add.group({ allowGravity: false });
  LEVEL_20_EARLY_FALLING_PLATFORM_CONFIGS.forEach(({ x, y }) => {
    createFallingPlatform(this, x, y);
  });
  LEVEL_20_CLOUD_CONFIGS.forEach(({ x, y }) => createFallingPlatform(this, x, y));
  ladders = this.physics.add.staticGroup();
  smallSprings = this.physics.add.staticGroup();
  recoveryZones = this.physics.add.staticGroup();
  LEVEL_20_SPRING_CONFIGS.forEach((config) => {
    createSmallSpring(this, { ...config, skin: mobilitySkin.spring });
  });
  LEVEL_20_LADDER_CONFIGS.forEach((config) => {
    createLadder(this, { ...config, skin: mobilitySkin.ladder });
  });

  spikes = this.physics.add.staticGroup();
  LEVEL_20_SPIKE_CONFIGS.forEach(({ x, y }) => createStandardSpike(this, x, y));
  LEVEL_20_MOVING_SPIKE_CONFIGS.forEach((config) => {
    createMovingPlatformSpike(this, level20PlatformsById.get(config.carrierId), config);
  });
  initializeAlternatingSpikeSystem(this);
  LEVEL_20_ALTERNATING_SPIKE_CONFIGS.forEach((config) => {
    createAlternatingSpikePair(this, config);
  });
  initializeFireballSystem(this, skin.fireball.textureKey);
  LEVEL_20_CANNON_CONFIGS.forEach((config) => createFireCannon(this, {
    ...config,
    textureKey: skin.fireCannon.textureKey,
    warningTint: skin.fireCannon.warningTint,
    blockedByWalls: true,
    blockedByBoxes: true
  }));

  const [level20UpperJar] = createTeleportJarPair(
    this,
    LEVEL_20_TELEPORT_JAR_PAIR[0],
    LEVEL_20_TELEPORT_JAR_PAIR[1]
  );
  level20UpperJar.setData('onTeleportComplete', markLevel20OutboundTeleportComplete);
  LEVEL_20_WIND_VORTEX_CONFIGS.forEach((config) => createWindVortex(this, config));

  boxes = this.physics.add.group({ allowGravity: true });
  boxSpawns = [{ x: LEVEL_20_PUZZLE_CONFIG.boxX, y: LEVEL_20_PUZZLE_CONFIG.boxY }];
  createBox(this, LEVEL_20_PUZZLE_CONFIG.boxX, LEVEL_20_PUZZLE_CONFIG.boxY);
  createWorld3ChallengeDoor(
    this,
    LEVEL_20_PUZZLE_CONFIG.buttonX,
    LEVEL_20_PUZZLE_CONFIG.doorX
  );
  checkpoints = this.physics.add.staticGroup();
  LEVEL_20_CHECKPOINT_CONFIGS.forEach((config) => {
    createCheckpoint(this, config.x, config.y, config.spawnX, config.spawnY);
  });
  const upperFallRecovery = recoveryZones.create(3350, 0, 'ground')
    .setDisplaySize(2100, 500)
    .setVisible(false);
  upperFallRecovery.refreshBody();

  goal = this.physics.add.staticImage(
    LEVEL_20_FINAL_APPROACH_CONFIG.goalX,
    LEVEL_20_FINAL_APPROACH_CONFIG.goalY,
    'goal-world3'
  )
    .setDepth(THEME.depths.mechanism);
  goal.body.setSize(32, 68).setOffset(0, 14);
  goal.refreshBody();
  goal.setVisible(false);
  goal.body.enable = false;
  addLateWorldHint(this, 340, '先往右走。最后，还要回来。');

  activeColliders.push(this.physics.add.collider(player, platforms));
  activeColliders.push(createPlayerPatrolPlatformCollider(this));
  activeColliders.push(this.physics.add.collider(player, fallingPlatforms));
  activeColliders.push(this.physics.add.collider(player, boxes));
  activeColliders.push(this.physics.add.collider(boxes, platforms));
  activeColliders.push(this.physics.add.collider(boxes, movingPlatforms));
  activeColliders.push(this.physics.add.collider(player, door));
  activeColliders.push(this.physics.add.collider(boxes, door));
  activeColliders.push(this.physics.add.overlap(player, smallSprings, smallSpringHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(player, spikes, die, null, this));
  activeColliders.push(this.physics.add.overlap(player, alternatingSpikes, alternatingSpikeHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(player, fireballs, fireballHitsPlayer, null, this));
  activeColliders.push(this.physics.add.overlap(fireballs, platforms, fireballHitsPlatform));
  activeColliders.push(this.physics.add.overlap(fireballs, boxes, fireballHitsBox));
  activeColliders.push(this.physics.add.overlap(
    player,
    checkpoints,
    activateLevel20Checkpoint,
    null,
    this
  ));
  activeColliders.push(this.physics.add.overlap(
    player,
    upperFallRecovery,
    recoverLevel20UpperFall,
    null,
    this
  ));
  activeColliders.push(this.physics.add.overlap(player, goal, completeLevel20, null, this));
  registerLateWorldMechanismColliders(this);
  carryMudCompanion(this, true);

  this.physics.world.setBounds(
    0,
    LEVEL_20_WORLD_TOP,
    LEVEL_20_WIDTH,
    HEIGHT + 140 - LEVEL_20_WORLD_TOP
  );
  this.cameras.main.setBounds(
    0,
    LEVEL_20_WORLD_TOP,
    LEVEL_20_WIDTH,
    HEIGHT - LEVEL_20_WORLD_TOP
  );
  resetLevel20.call(this, false);
}

function updateLevel20(time) {
  updateMovingPlatformSpikes();
  updateLateWorldLevel(this, time, LEVEL_20_WIDTH, { puzzleDoor: true });
}

function resetLevel20(preserveCheckpoint = false) {
  if (currentLevel !== 20) return;
  clearLateWorldStoryPresentation(this);
  resetLateWorldLevel(this, LEVEL_20_START, preserveCheckpoint, { puzzleDoor: true });
  level20RoutePhase = getLevel20PhaseForCheckpoint(activeCheckpointIndex);
  carryMudCompanion(this, true);
  const finalApproachReady = level20RoutePhase === 'returned';
  goal.setVisible(finalApproachReady);
  goal.body.enable = finalApproachReady;
  if (finalApproachReady) goal.refreshBody();
  updateMovingPlatformSpikes();
}
