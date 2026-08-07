"use strict";

function createBox(scene, x, y) {
  const textureKey = currentLevel >= 14 ? 'box-world3' : 'box';
  const box = boxes.create(x, y, textureKey).setDepth(THEME.depths.actor);
  box.setBounce(0);
  box.setDragX(BOX_GROUND_DRAG);
  box.setMaxVelocity(BOX_PUSH_MAX_SPEED, 700);
  box.setMass(3.2);
  // Extend the horizontal body to the visible edges so the player never renders inside the crate.
  box.body.setSize(60, 48).setOffset(-6, 0);
  box.setData({
    spawnX: x,
    spawnY: y,
    respawning: false,
    respawnTimer: null,
    movingPlatformContactUntil: 0
  });
  return box;
}

function updateLevel2(time) {
  if (movingPlatform.x <= level2MovingMin) movingPlatform.setVelocityX(82);
  if (movingPlatform.x >= level2MovingMax) movingPlatform.setVelocityX(-82);

  updatePuzzleMechanisms.call(this, time, LEVEL_2_WIDTH);
}

function updatePuzzleMechanisms(time, worldWidth) {
  const boxOnButton = updateBoxes.call(this, time, worldWidth, currentLevel === 3);

  const playerOnButton = this.physics.overlap(pressureButton, player);
  if (playerOnButton || boxOnButton) buttonReleaseUntil = time + 110;
  const shouldPress = playerOnButton || boxOnButton || time < buttonReleaseUntil;
  setButtonPressed(shouldPress);

  if (shouldPress && !doorIsOpen) {
    openDoor.call(this);
  } else if (!shouldPress && doorIsOpen && !isDoorwayOccupied()) {
    closeDoor.call(this);
  }
}

function updateBoxes(time, worldWidth, canRideMovingPlatform = false) {
  let boxOnButton = false;
  boxes.children.each((box) => {
    if (box.getData('respawning') || !box.body.enable) return;
    const onMovingPlatform = canRideMovingPlatform && isBoxOnMovingPlatform(box, time);
    box.setDragX(onMovingPlatform ? BOX_MOVING_PLATFORM_DRAG : BOX_GROUND_DRAG);
    box.body.velocity.x = Phaser.Math.Clamp(
      box.body.velocity.x,
      -BOX_PUSH_MAX_SPEED,
      BOX_PUSH_MAX_SPEED
    );
    if ((box.body.blocked.down || box.body.touching.down) && Math.abs(box.body.velocity.x) < 7) {
      box.setVelocityX(0);
    }
    if (box.y > HEIGHT + 55 || box.x < -60 || box.x > worldWidth + 60) {
      scheduleBoxRespawn.call(this, box);
      return;
    }
    if (pressureButton && this.physics.overlap(pressureButton, box)) boxOnButton = true;
  });
  return boxOnButton;
}

function updateLevel3(time) {
  const platformDelta = movingPlatform.x - previousMovingPlatformX;
  if (movingPlatform.x <= level3MovingMin) movingPlatform.setVelocityX(82);
  if (movingPlatform.x >= level3MovingMax) movingPlatform.setVelocityX(-82);

  carryBoxesOnMovingPlatform(platformDelta, time);
  previousMovingPlatformX = movingPlatform.x;
  updateFallingPlatforms.call(this);
  updatePuzzleMechanisms.call(this, time, LEVEL_3_WIDTH);
}

function updateLevel4(time) {
  const platformDelta = movingPlatform.x - previousMovingPlatformX;
  if (movingPlatform.x <= level4MovingMin) movingPlatform.setVelocityX(82);
  if (movingPlatform.x >= level4MovingMax) movingPlatform.setVelocityX(-82);

  carryBoxesOnMovingPlatform(platformDelta, time);
  previousMovingPlatformX = movingPlatform.x;
  updateFallingPlatforms.call(this);
  updateBoxes.call(this, time, LEVEL_4_WIDTH, true);
  updateTimedSwitch.call(this, time);
}

function carryBoxesOnMovingPlatform(platformDelta, time) {
  if (!platformDelta || !boxes) return;
  boxes.children.each((box) => {
    if (box.getData('respawning') || !box.body.enable) return;
    const previousX = previousBoxPositions.get(box) ?? box.x;
    const naturalDelta = box.x - previousX;
    if (isBoxOnMovingPlatform(box, time)) {
      const desiredCarry = platformDelta * BOX_MOVING_PLATFORM_GRIP;
      const sameDirection = Math.sign(naturalDelta) === Math.sign(platformDelta);
      const passivelyRiding = Math.abs(box.body.velocity.x) < 7;
      const canCorrectCarry = !naturalDelta || sameDirection;
      const playerBesideBox = isPlayerBesideBox(box);
      if (
        !playerBesideBox
        && canCorrectCarry
        && (passivelyRiding || Math.abs(naturalDelta) < Math.abs(desiredCarry))
      ) {
        // Match passive movement to the configured platform grip. With grip 1 this
        // only corrects missed motion and leaves an already synchronized crate alone.
        // Do not correct while the player is pushing from the side: that would move
        // the crate back into the player's collision body.
        const carryCorrection = desiredCarry - naturalDelta;
        box.x += carryCorrection;
        box.body.x += carryCorrection;
      }
    }
    previousBoxPositions.set(box, box.x);
  });
}

function scheduleBoxRespawn(box) {
  if (box.getData('respawning')) return;
  box.setData('respawning', true);
  box.setVelocity(0).setAcceleration(0).setVisible(false);
  box.body.enable = false;
  box.setData('movingPlatformContactUntil', 0);
  previousBoxPositions.delete(box);
  const respawnTimer = this.time.delayedCall(TOOL_RESPAWN_MS, () => {
    box.setData('respawnTimer', null);
    restoreBox(box);
  });
  box.setData('respawnTimer', respawnTimer);
}

function clearBoxRespawnTimer(box) {
  box.getData('respawnTimer')?.remove(false);
  box.setData('respawnTimer', null);
}

function clearBoxRespawnTimers() {
  boxes?.children.each((box) => clearBoxRespawnTimer(box));
}

function restoreBox(box) {
  clearBoxRespawnTimer(box);
  const spawnX = box.getData('spawnX');
  const spawnY = box.getData('spawnY');
  box.body.enable = true;
  box.setVisible(true).setAlpha(1).setDragX(BOX_GROUND_DRAG)
    .setPosition(spawnX, spawnY).setVelocity(0).setAcceleration(0);
  box.body.reset(spawnX, spawnY);
  box.setData('respawning', false);
  box.setData('movingPlatformContactUntil', 0);
  previousBoxPositions.set(box, spawnX);
}

function resetAllBoxes() {
  boxes?.children.each((box) => restoreBox(box));
}

function markMovingPlatformContact(first, second) {
  const box = first.texture?.key === 'box' ? first : second;
  const support = first === box ? second : first;
  if ((currentLevel !== 3 && currentLevel !== 4) || box.getData('respawning')) return;
  const visibleHalfWidth = box.displayWidth * 0.5;
  const visibleOverlap = box.x + visibleHalfWidth > support.body.left + 2
    && box.x - visibleHalfWidth < support.body.right - 2;
  const topContact = Math.abs(box.body.bottom - support.body.top) <= 3;
  if (visibleOverlap && topContact && box.body.velocity.y >= -5) {
    box.setData('movingPlatformContactUntil', this.time.now + 50);
  }
}

function isBoxOnMovingPlatform(box, time) {
  if (!box?.body?.enable || !movingPlatform?.body?.enable) return false;
  const visibleHalfWidth = box.displayWidth * 0.5;
  const visibleOverlap = box.x + visibleHalfWidth > movingPlatform.body.left + 2
    && box.x - visibleHalfWidth < movingPlatform.body.right - 2;
  const topContact = Math.abs(box.body.bottom - movingPlatform.body.top) <= 3;
  return time <= box.getData('movingPlatformContactUntil')
    && visibleOverlap
    && topContact;
}

function isStandingOn(object, support) {
  if (!object?.body?.enable || !support?.body?.enable) return false;
  const horizontalOverlap = object.body.right > support.body.left + 4
    && object.body.left < support.body.right - 4;
  const feetDistance = Math.abs(object.body.bottom - support.body.top);
  const downwardContact = object.body.touching.down || object.body.blocked.down;
  return horizontalOverlap && feetDistance <= 3 && downwardContact && object.body.velocity.y >= -5;
}

function isPlayerBesideBox(box) {
  if (!player?.body?.enable || !box?.body?.enable) return false;
  const verticalOverlap = player.body.bottom > box.body.top + 3
    && player.body.top < box.body.bottom - 3;
  const horizontalGap = Math.max(
    box.body.left - player.body.right,
    player.body.left - box.body.right,
    0
  );
  return verticalOverlap && horizontalGap <= 6;
}

function createFallingPlatform(scene, x, y, requestedTextureKey = null) {
  const originalCloudTextureKey = THEME.mechanismSkins.world3.fallingPlatform.textureKey;
  const textureKey = requestedTextureKey
    || (currentLevel >= 14 ? originalCloudTextureKey : 'fall-platform');
  const usesOriginalCloudSkin = textureKey === originalCloudTextureKey;
  const platform = fallingPlatforms.create(x, y, textureKey)
    .setDepth(THEME.depths.mechanism);
  if (usesOriginalCloudSkin) platform.setDisplaySize(116, 48);
  platform.setImmovable(true);
  platform.body.allowGravity = false;
  if (usesOriginalCloudSkin) {
    // Match the original cloud presentation while preserving a 116 × 18 world-space foothold.
    platform.body.setSize(112, 18).setOffset(0, 14);
  } else {
    platform.body.setSize(116, 18).setOffset(2, 2);
  }
  platform.setData({
    state: 'idle',
    startX: x,
    startY: y,
    vanishInPlace: usesOriginalCloudSkin,
    requiresExit: false,
    warningTimer: null,
    resetTimer: null
  });
  return platform;
}

function updateFallingPlatforms() {
  fallingPlatforms?.children.each((platform) => {
    const state = platform.getData('state');
    if (state === 'idle') {
      const playerStanding = isStandingOn(player, platform);
      if (platform.getData('requiresExit')) {
        if (!playerStanding) platform.setData('requiresExit', false);
      } else if (playerStanding) {
        triggerFallingPlatform.call(this, platform);
      }
    } else if (state === 'falling' && platform.y > HEIGHT + 45) {
      platform.setData('state', 'resetting');
      platform.setVisible(false);
      platform.body.enable = false;
      const resetTimer = this.time.delayedCall(FALL_RESET_MS, () => {
        platform.setData('resetTimer', null);
        restoreFallingPlatform.call(this, platform, true);
      });
      platform.setData('resetTimer', resetTimer);
    }
  });
}

function triggerFallingPlatform(platform) {
  if (platform.getData('state') !== 'idle') return;
  platform.setData('state', 'warning');
  platform.setTint(THEME.gameplay.butter);
  this.tweens.add({
    targets: platform,
    alpha: 0.3,
    yoyo: true,
    repeat: 3,
    duration: FALL_WARNING_MS / 8
  });
  const warningTimer = this.time.delayedCall(FALL_WARNING_MS, () => {
    platform.setData('warningTimer', null);
    if (platform.getData('state') !== 'warning') return;
    this.tweens.killTweensOf(platform);
    platform.clearTint().setAlpha(1);
    if (platform.getData('vanishInPlace')) {
      beginVanishingPlatform.call(this, platform);
      return;
    }
    platform.setData('state', 'falling');
    platform.body.allowGravity = true;
    platform.setVelocityY(FALL_INITIAL_SPEED);
  });
  platform.setData('warningTimer', warningTimer);
}

function beginVanishingPlatform(platform) {
  platform.setData('state', 'vanishing');
  platform.body.enable = false;
  platform.body.allowGravity = false;
  platform.setVelocity(0);
  this.tweens.add({
    targets: platform,
    alpha: 0,
    duration: WORLD3_CLOUD_FADE_MS,
    ease: 'Sine.easeIn'
  });
  const fadeTimer = this.time.delayedCall(WORLD3_CLOUD_FADE_MS, () => {
    platform.setData('resetTimer', null);
    if (platform.getData('state') !== 'vanishing') return;
    platform.setData('state', 'resetting');
    platform.setVisible(false);
    const resetTimer = this.time.delayedCall(FALL_RESET_MS, () => {
      platform.setData('resetTimer', null);
      restoreFallingPlatform.call(this, platform, true);
    });
    platform.setData('resetTimer', resetTimer);
  });
  platform.setData('resetTimer', fadeTimer);
}

function clearFallingPlatformCycle(scene, platform) {
  const warningTimer = platform.getData('warningTimer');
  const resetTimer = platform.getData('resetTimer');
  if (warningTimer) warningTimer.remove(false);
  if (resetTimer) resetTimer.remove(false);
  platform.setData('warningTimer', null);
  platform.setData('resetTimer', null);
  scene.tweens.killTweensOf(platform);
}

function restoreFallingPlatform(platform, requiresExit = false) {
  clearFallingPlatformCycle(this, platform);
  platform.setData('state', 'resetting');
  platform.body.enable = true;
  platform.setVisible(true).setAlpha(1).clearTint();
  platform.setPosition(platform.getData('startX'), platform.getData('startY'));
  platform.body.reset(platform.getData('startX'), platform.getData('startY'));
  platform.body.allowGravity = false;
  platform.setVelocity(0);
  platform.setImmovable(true);
  platform.setData('requiresExit', requiresExit);
  platform.setData('state', 'idle');
}

function clearFallingPlatformCycles(scene) {
  fallingPlatforms?.children.each((platform) => {
    clearFallingPlatformCycle(scene, platform);
  });
}

function resetAllFallingPlatforms(scene) {
  fallingPlatforms?.children.each((platform) => {
    restoreFallingPlatform.call(scene, platform, false);
  });
}

function setButtonPressed(pressed) {
  if (buttonPressed === pressed) return;
  buttonPressed = pressed;
  if (pressed) audioManager.play('button');
  const restY = pressureButton.getData('restY') ?? 464;
  pressureButton.setScale(1, pressed ? 0.48 : 1);
  pressureButton.setY(pressed ? restY + 3 : restY);
  pressureButton.setTint(pressed ? THEME.gameplay.buttonLight : THEME.gameplay.white);
}

function createTimedSwitchMeter(scene, x, y, width = 210) {
  const meter = scene.add.graphics().setDepth(THEME.depths.guidance).setVisible(false);
  meter.setData({ x, y, width });
  drawTimedSwitchMeter(1, false);
  return meter;
}

function drawTimedSwitchMeter(ratio, warning) {
  if (!timedSwitchMeter) return;
  const x = timedSwitchMeter.getData('x');
  const y = timedSwitchMeter.getData('y');
  const width = timedSwitchMeter.getData('width');
  const innerWidth = Math.max(0, Math.round((width - 4) * Phaser.Math.Clamp(ratio, 0, 1)));
  timedSwitchMeter.clear();
  timedSwitchMeter.fillStyle(THEME.gameplay.cloud).fillRect(x, y, width, 18);
  timedSwitchMeter.fillStyle(warning ? THEME.gameplay.hazard : THEME.gameplay.goal)
    .fillRect(x + 2, y + 2, innerWidth, 14);
  timedSwitchMeter.lineStyle(2, THEME.gameplay.ink).strokeRect(x + 1, y + 1, width - 2, 16);
}

function activateTimedSwitch(time) {
  timedSwitchActive = true;
  timedSwitchEndsAt = time + timedSwitchDurationMs;
  timedSwitchArmed = false;
  timedSwitchMeter.setVisible(true);
  if (!doorIsOpen) openDoor.call(this);
  drawTimedSwitchMeter(1, false);
}

function updateTimedSwitch(time) {
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

  if (!timedSwitchActive && doorIsOpen && !isDoorwayOccupied()) {
    closeDoor.call(this);
  }
}

function resetTimedSwitch() {
  timedSwitchActive = false;
  timedSwitchEndsAt = 0;
  timedSwitchArmed = true;
  drawTimedSwitchMeter(1, false);
  timedSwitchMeter.setVisible(false);
}

function openDoor() {
  audioManager.play('door');
  doorIsOpen = true;
  doorAnimating = true;
  this.tweens.killTweensOf(door);
  door.body.enable = false;
  this.tweens.add({
    targets: door,
    y: doorOpenY,
    alpha: 0.38,
    duration: DOOR_ANIMATION_MS,
    ease: 'Sine.Out',
    onComplete: () => { doorAnimating = false; }
  });
}

function closeDoor() {
  if (isDoorwayOccupied()) return;
  doorIsOpen = false;
  doorAnimating = true;
  this.tweens.killTweensOf(door);
  door.body.enable = false;
  this.tweens.add({
    targets: door,
    y: doorClosedY,
    alpha: 1,
    duration: DOOR_ANIMATION_MS,
    ease: 'Sine.In',
    onComplete: () => {
      if (isDoorwayOccupied()) {
        doorAnimating = false;
        openDoor.call(this);
        return;
      }
      door.body.enable = true;
      door.refreshBody();
      doorAnimating = false;
    }
  });
}

function isDoorwayOccupied() {
  if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), doorSafetyZone)) return true;
  let occupied = false;
  boxes.children.each((box) => {
    if (Phaser.Geom.Intersects.RectangleToRectangle(box.getBounds(), doorSafetyZone)) occupied = true;
  });
  return occupied;
}

function createCheckpoint(scene, x, y, spawnX, spawnY) {
  if (!checkpoints) checkpoints = scene.physics.add.staticGroup();
  const index = checkpointSpawns.length;
  const textureKey = currentLevel >= 14 ? 'checkpoint-world3' : 'checkpoint';
  const marker = checkpoints.create(x, y, textureKey)
    .setDepth(THEME.depths.mechanism);
  marker.body.setSize(30, 58).setOffset(1, 4);
  marker.refreshBody();
  marker.setData('checkpointIndex', index);
  checkpointSpawns.push({ x: spawnX, y: spawnY, marker });
  return marker;
}

function activateCheckpoint(hitPlayer, marker) {
  if (isDead || isCleared) return;
  const index = marker.getData('checkpointIndex');
  if (!Number.isInteger(index) || index <= activeCheckpointIndex) return;
  activeCheckpointIndex = index;
  checkpointSpawns.forEach((entry, entryIndex) => {
    entry.marker.setTint(entryIndex <= index ? THEME.gameplay.checkpoint : THEME.gameplay.white);
  });
  audioManager.play('button');
}

function resetCheckpointProgress() {
  activeCheckpointIndex = -1;
  checkpointSpawns.forEach((entry) => entry.marker?.clearTint());
}

function getCurrentRespawn(defaultSpawn) {
  if (activeCheckpointIndex < 0) return defaultSpawn;
  return checkpointSpawns[activeCheckpointIndex] || defaultSpawn;
}

function createLadder(scene, config) {
  if (!ladders) ladders = scene.physics.add.staticGroup();
  const skin = config.skin || THEME.mechanismSkins.world1.ladder;
  const width = config.width || 48;
  const height = config.height || 160;
  const ladder = ladders.create(config.x, config.y, skin.textureKey)
    .setDepth(THEME.depths.mechanism);
  ladder.setDisplaySize(width, height).refreshBody();
  ladder.setData({
    id: config.id || null,
    width,
    height,
    startX: config.x,
    startY: config.y
  });
  return ladder;
}

function leaveLadder() {
  isClimbing = false;
  activeLadder = null;
  if (!player?.body) return;
  player.body.allowGravity = true;
  player.body.checkCollision.up = true;
}

function findOverlappingLadder() {
  if (!ladders || !player?.body) return null;
  let match = null;
  const playerRect = new Phaser.Geom.Rectangle(
    player.body.x - LADDER_ATTACH_PADDING_X,
    player.body.y - LADDER_ATTACH_PADDING_Y,
    player.body.width + LADDER_ATTACH_PADDING_X * 2,
    player.body.height + LADDER_ATTACH_PADDING_Y * 2
  );
  ladders.children.each((ladder) => {
    if (match || !ladder.active || !ladder.body?.enable) return;
    const ladderRect = new Phaser.Geom.Rectangle(
      ladder.body.x,
      ladder.body.y,
      ladder.body.width,
      ladder.body.height
    );
    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, ladderRect)) match = ladder;
  });
  return match;
}

function updateLadderInteraction(scene, time) {
  if (!player?.body || !ladders) {
    if (isClimbing) leaveLadder();
    return false;
  }

  if (!isClimbing) {
    const candidate = findOverlappingLadder();
    if (!candidate || (!isControlDown('up') && !isControlDown('down'))) return false;
    isClimbing = true;
    activeLadder = candidate;
    player.body.allowGravity = false;
    player.body.checkCollision.up = false;
    player.setAccelerationX(0).setVelocityY(0);
    coyoteUntil = 0;
    jumpBufferUntil = 0;
    wasGrounded = false;
  }

  const ladder = activeLadder;
  if (!ladder?.active || !ladder.body?.enable) {
    leaveLadder();
    return false;
  }

  if (consumeJumpJustDown(false)) {
    leaveLadder();
    player.setVelocityY(PLAYER_FIRST_JUMP_VELOCITY);
    jumpsUsed = 1;
    audioManager.play('jump');
    return true;
  }

  if (isControlDown('left') || isControlDown('right')) {
    leaveLadder();
    return false;
  }

  if (isControlDown('up') && player.body.bottom <= ladder.body.top + 8) {
    const topY = ladder.body.top - 21;
    leaveLadder();
    player.body.reset(player.x, topY);
    player.setVelocity(0);
    return true;
  }

  if (isControlDown('down') && player.body.top >= ladder.body.bottom - 6) {
    leaveLadder();
    return true;
  }

  const centerDelta = ladder.x - player.x;
  player.setAccelerationX(0);
  player.setVelocityX(Phaser.Math.Clamp(centerDelta * 7, -LADDER_SNAP_SPEED, LADDER_SNAP_SPEED));
  if (Math.abs(centerDelta) < 1) player.setVelocityX(0);
  if (isControlDown('up')) player.setVelocityY(-LADDER_CLIMB_SPEED);
  else if (isControlDown('down')) player.setVelocityY(LADDER_CLIMB_SPEED);
  else player.setVelocityY(0);

  player.anims.stop();
  player.setFrame(Math.abs(player.body.velocity.y) > 1 ? Math.floor(time / 170) % 2 : 0);
  return true;
}

function createSmallSpring(scene, config) {
  if (!smallSprings) smallSprings = scene.physics.add.staticGroup();
  const skin = config.skin || THEME.mechanismSkins.world1.spring;
  const spring = smallSprings.create(config.x, config.y, skin.textureKey)
    .setDepth(THEME.depths.mechanism);
  spring.body.setSize(44, 26).setOffset(2, 1);
  spring.refreshBody();
  spring.setData({
    id: config.id || null,
    direction: config.direction || 'up',
    launchVelocity: Math.abs(config.launchVelocity || SPRING_DEFAULT_VELOCITY),
    cooldownMs: Math.max(80, config.cooldownMs || SPRING_DEFAULT_COOLDOWN_MS),
    initialDelay: Math.max(0, config.initialDelay || 0),
    readyAt: scene.time.now + Math.max(0, config.initialDelay || 0),
    normalTexture: skin.textureKey,
    compressedTexture: skin.compressedTextureKey,
    releaseTimer: null,
    pending: false,
    movesWithPlatform: Boolean(config.movesWithPlatform && config.carrier),
    carrier: config.carrier || null,
    carrierOffsetX: config.carrier ? config.x - config.carrier.x : 0,
    carrierOffsetY: config.carrier ? config.y - config.carrier.y : 0,
    startX: config.x,
    startY: config.y,
    scene
  });
  return spring;
}

function playSpringFeedback(scene, spring) {
  const pulse = scene.add.rectangle(
    spring.x,
    spring.body.top,
    42,
    6,
    THEME.gameplay.mint,
    0.8
  ).setDepth(THEME.depths.feedback);
  scene.tweens.add({
    targets: pulse,
    y: pulse.y - 22,
    alpha: 0,
    duration: reducedMotion ? 1 : 180,
    ease: 'Sine.Out',
    onComplete: () => pulse.destroy()
  });
}

function smallSpringHitsPlayer(hitPlayer, spring) {
  const scene = spring?.getData('scene');
  if (!scene || isDead || isCleared || spring.getData('pending')) return;
  if (scene.time.now < spring.getData('readyAt')) return;
  const previousBottom = hitPlayer.body.prev.y + hitPlayer.body.height;
  const fromAbove = previousBottom <= spring.body.top + 7 && hitPlayer.body.velocity.y >= 0;
  if (!fromAbove) return;

  spring.setData('pending', true);
  springLaunchPending = true;
  spring.setTexture(spring.getData('compressedTexture'));
  hitPlayer.setVelocityY(0);
  const releaseTimer = scene.time.delayedCall(SPRING_COMPRESS_MS, () => {
    spring.setData('releaseTimer', null);
    spring.setData('pending', false);
    spring.setTexture(spring.getData('normalTexture'));
    spring.setData('readyAt', scene.time.now + spring.getData('cooldownMs'));
    springLaunchPending = false;
    if (!hitPlayer.active || isDead || isCleared) return;
    hitPlayer.setData('springLaunchActive', true);
    hitPlayer.setData('springPassThroughActive', true);
    hitPlayer.body.checkCollision.up = false;
    hitPlayer.setVelocityY(-spring.getData('launchVelocity'));
    jumpsUsed = 1;
    coyoteUntil = 0;
    wasGrounded = false;
    audioManager.play('spring');
    playSpringFeedback(scene, spring);
  });
  spring.setData('releaseTimer', releaseTimer);
}

function updateSmallSprings() {
  smallSprings?.children.each((spring) => {
    if (!spring.getData('movesWithPlatform')) return;
    const carrier = spring.getData('carrier');
    if (!carrier?.active) return;
    spring.setPosition(
      carrier.x + spring.getData('carrierOffsetX'),
      carrier.y + spring.getData('carrierOffsetY')
    );
    spring.refreshBody();
  });
}

function resetMobilityTools(scene) {
  leaveLadder();
  springLaunchPending = false;
  player?.setData('springLaunchActive', false);
  player?.setData('springPassThroughActive', false);
  smallSprings?.children.each((spring) => {
    spring.getData('releaseTimer')?.remove(false);
    spring.setData('releaseTimer', null);
    spring.setData('pending', false);
    spring.setTexture(spring.getData('normalTexture'));
    spring.setData('readyAt', scene.time.now + spring.getData('initialDelay'));
    if (spring.getData('movesWithPlatform')) {
      const carrier = spring.getData('carrier');
      if (carrier?.active) {
        spring.setPosition(
          carrier.x + spring.getData('carrierOffsetX'),
          carrier.y + spring.getData('carrierOffsetY')
        ).refreshBody();
      }
    } else {
      spring.setPosition(spring.getData('startX'), spring.getData('startY')).refreshBody();
    }
  });
}

function destroyMobilityTools(scene) {
  resetMobilityTools(scene);
  ladders?.clear(true, true);
  smallSprings?.clear(true, true);
  recoveryZones?.clear(true, true);
  ladders = null;
  smallSprings = null;
  recoveryZones = null;
}

function createPatrolPlatform(scene, config) {
  if (!movingPlatforms) movingPlatforms = scene.physics.add.group({ allowGravity: false });
  const platform = movingPlatforms.create(
    config.x,
    config.y,
    config.textureKey || 'moving-platform'
  )
    .setDepth(THEME.depths.mechanism);
  const axis = config.axis === 'y' ? 'y' : 'x';
  const initialDirection = config.direction === -1 ? -1 : 1;
  const distance = Math.max(0, config.distance || 0);
  const derivedEndX = config.x + initialDirection * distance;
  const derivedEndY = config.y + initialDirection * distance;
  const minX = Number.isFinite(config.minX) ? config.minX : Math.min(config.x, derivedEndX);
  const maxX = Number.isFinite(config.maxX) ? config.maxX : Math.max(config.x, derivedEndX);
  const minY = Number.isFinite(config.minY) ? config.minY : Math.min(config.y, derivedEndY);
  const maxY = Number.isFinite(config.maxY) ? config.maxY : Math.max(config.y, derivedEndY);
  const width = config.width || 140;
  platform.setDisplaySize(width, 22);
  platform.setImmovable(true);
  platform.body.allowGravity = false;
  platform.setFrictionX(1);
  if (axis === 'y') platform.setFrictionY(1);
  platform.body.setSize(112, 18).setOffset(0, 2);
  platform.setData({
    id: config.id || null,
    axis,
    startX: config.x,
    startY: config.y,
    minX,
    maxX,
    minY,
    maxY,
    speed: Math.abs(config.speed || 82),
    initialDirection,
    patrolDirection: initialDirection
  });
  if (axis === 'y') {
    platform.setVelocityY(platform.getData('speed') * initialDirection);
  } else {
    platform.setVelocityX(platform.getData('speed') * initialDirection);
  }
  return platform;
}

function updatePatrolPlatforms() {
  movingPlatforms?.children.each((platform) => {
    if (!platform.active) return;
    const axis = platform.getData('axis');
    const speed = platform.getData('speed');
    let direction = platform.getData('patrolDirection') || platform.getData('initialDirection');
    if (axis === 'y') {
      const minY = platform.getData('minY');
      const maxY = platform.getData('maxY');
      if (platform.y <= minY) {
        platform.setY(minY);
        direction = 1;
      } else if (platform.y >= maxY) {
        platform.setY(maxY);
        direction = -1;
      }
      platform.setData('patrolDirection', direction);
      platform.setVelocity(0, speed * direction);
      return;
    }
    const minX = platform.getData('minX');
    const maxX = platform.getData('maxX');
    if (platform.x <= minX) {
      platform.setX(minX);
      direction = 1;
    } else if (platform.x >= maxX) {
      platform.setX(maxX);
      direction = -1;
    }
    platform.setData('patrolDirection', direction);
    platform.setVelocity(speed * direction, 0);
  });
}

function resetPatrolPlatforms() {
  movingPlatforms?.children.each((platform) => {
    platform.setPosition(platform.getData('startX'), platform.getData('startY'));
    platform.body.reset(platform.getData('startX'), platform.getData('startY'));
    const initialDirection = platform.getData('initialDirection');
    platform.setData('patrolDirection', initialDirection);
    const speed = platform.getData('speed') * initialDirection;
    if (platform.getData('axis') === 'y') {
      platform.setVelocity(0, speed);
    } else {
      platform.setVelocity(speed, 0);
    }
  });
}

function allowPlayerToLeavePatrolPlatform(hitPlayer, platform) {
  if (!hitPlayer?.body || !platform?.body) return true;
  const jumpDetachActive = (hitPlayer.getData('patrolPlatformJumpDetachUntil') || 0)
    >= platform.scene.time.now;
  return !(jumpDetachActive && hitPlayer.body.velocity.y < 0);
}

function createPlayerPatrolPlatformCollider(scene) {
  return scene.physics.add.collider(
    player,
    movingPlatforms,
    null,
    allowPlayerToLeavePatrolPlatform,
    scene
  );
}

function isPlayerSupportedByPatrolPlatform(hitPlayer, time) {
  if (!hitPlayer?.body?.enable || !movingPlatforms) return false;
  if ((hitPlayer.getData('patrolPlatformJumpDetachUntil') || 0) >= time) return false;

  let supported = false;
  movingPlatforms.children.each((platform) => {
    if (supported || !platform?.active || !platform.body?.enable) return;
    const horizontalOverlap = hitPlayer.body.right > platform.body.left + 4
      && hitPlayer.body.left < platform.body.right - 4;
    const feetGap = platform.body.top - hitPlayer.body.bottom;
    supported = horizontalOverlap
      && feetGap >= -3
      && feetGap <= 8
      && hitPlayer.body.velocity.y > PLAYER_SHORT_JUMP_CUTOFF;
  });
  return supported;
}

function createMovingPlatformSpike(scene, carrier, config = {}) {
  if (!carrier || !spikes) return null;
  const spike = spikes.create(
    carrier.x + (config.offsetX || 0),
    carrier.y + (config.offsetY ?? -13),
    'spike'
  ).setDepth((carrier.depth ?? THEME.depths.mechanism) - 1);
  spike.body.setSize(42, 25).setOffset(3, 17);
  spike.refreshBody();
  spike.setData({
    carrier,
    offsetX: config.offsetX || 0,
    offsetY: config.offsetY ?? -13
  });
  movingPlatformSpikes.push(spike);
  return spike;
}

function updateMovingPlatformSpikes() {
  movingPlatformSpikes.forEach((spike) => {
    const carrier = spike?.getData('carrier');
    if (!spike?.active || !carrier?.active) return;
    spike.setPosition(
      Math.round(carrier.x + spike.getData('offsetX')),
      Math.round(carrier.y + spike.getData('offsetY'))
    );
    spike.refreshBody();
  });
}

function initializeLateWorldMechanisms(scene) {
  teleportJars = scene.physics.add.staticGroup();
  windVortices = [];
}

function createTeleportJarPair(scene, first, second) {
  const jarA = teleportJars.create(first.x, first.y, 'teleport-jar')
    .setDepth(THEME.depths.mechanism);
  const jarB = teleportJars.create(second.x, second.y, 'teleport-jar')
    .setDepth(THEME.depths.mechanism);
  [jarA, jarB].forEach((jar) => {
    jar.body.setSize(46, 64).setOffset(5, 6);
    jar.refreshBody();
  });
  jarA.setData({
    destination: jarB,
    exitDirection: second.direction === -1 ? -1 : 1
  });
  jarB.setData({
    destination: jarA,
    exitDirection: first.direction === -1 ? -1 : 1
  });
  return [jarA, jarB];
}

function teleportPlayer(hitPlayer, jar) {
  const now = jar.scene.time.now;
  if (teleportSequenceState || isDead || isCleared) return;
  if ((hitPlayer.getData('teleportReadyAt') || 0) > now) return;
  const destination = jar.getData('destination');
  if (!destination?.active) return;

  const scene = jar.scene;
  const direction = jar.getData('exitDirection') || 1;
  const exitX = destination.x + direction * 58;
  const exitY = destination.y - 54;
  const entryMs = reducedMotion ? 80 : TELEPORT_JAR_ENTRY_MS;
  const travelMs = reducedMotion ? 120 : TELEPORT_JAR_TRAVEL_MS;
  const exitMs = reducedMotion ? 80 : TELEPORT_JAR_EXIT_MS;
  const sequence = {
    scene,
    player: hitPlayer,
    source: jar,
    destination,
    playerDepth: hitPlayer.depth,
    timer: null
  };
  teleportSequenceState = sequence;
  hitPlayer.setData(
    'teleportReadyAt',
    now + entryMs + travelMs + exitMs + TELEPORT_JAR_COOLDOWN_MS
  );
  hitPlayer.setVelocity(0).setAcceleration(0);
  hitPlayer.body.enable = false;
  hitPlayer.anims?.pause();
  hitPlayer.setDepth(jar.depth - 1);

  scene.tweens.add({
    targets: jar,
    scaleX: 1.08,
    scaleY: 0.92,
    duration: entryMs / 2,
    yoyo: true,
    ease: 'Sine.InOut'
  });
  scene.tweens.add({
    targets: hitPlayer,
    x: jar.x,
    y: jar.y + 12,
    scaleX: 0.62,
    scaleY: 0.28,
    alpha: 0.05,
    duration: entryMs,
    ease: 'Sine.In',
    onComplete: () => {
      if (teleportSequenceState !== sequence) return;
      hitPlayer.setVisible(false);
      scene.cameras.main.stopFollow();
      scene.cameras.main.pan(exitX, exitY, travelMs, 'Sine.easeInOut', true);
      sequence.timer = scene.time.delayedCall(travelMs, () => {
        sequence.timer = null;
        if (teleportSequenceState !== sequence) return;
        if (!destination.active) {
          cancelTeleportSequence(scene);
          return;
        }
        hitPlayer
          .setPosition(destination.x, destination.y + 12)
          .setScale(0.62, 0.28)
          .setAlpha(0.05)
          .setVisible(true)
          .setDepth(destination.depth - 1);
        scene.tweens.add({
          targets: destination,
          scaleX: 1.12,
          scaleY: 0.9,
          duration: exitMs / 2,
          yoyo: true,
          ease: 'Sine.InOut'
        });
        scene.tweens.add({
          targets: hitPlayer,
          x: exitX,
          y: exitY,
          scaleX: 1,
          scaleY: 1,
          alpha: 1,
          duration: exitMs,
          ease: 'Back.Out',
          onComplete: () => {
            if (teleportSequenceState !== sequence) return;
            hitPlayer.setDepth(sequence.playerDepth).setAngle(0);
            hitPlayer.body.enable = true;
            hitPlayer.body.reset(exitX, exitY);
            hitPlayer.setVelocity(direction * 145, -120);
            hitPlayer.anims?.resume();
            facing = direction;
            hitPlayer.setFlipX(direction < 0);
            teleportSequenceState = null;
            sequence.source.getData('onTeleportComplete')?.(
              sequence.source,
              sequence.destination
            );
            scene.cameras.main.stopFollow();
            scene.cameras.main.startFollow(hitPlayer, true, 0.12, 0.12);
          }
        });
      });
    }
  });
}

function cancelTeleportSequence(scene) {
  const sequence = teleportSequenceState;
  if (!sequence) return;
  sequence.timer?.remove(false);
  scene.tweens.killTweensOf(sequence.player);
  scene.tweens.killTweensOf(sequence.source);
  scene.tweens.killTweensOf(sequence.destination);
  scene.cameras.main.stopFollow();
  if (sequence.player?.active) {
    sequence.player
      .setVisible(true)
      .setAlpha(1)
      .setScale(1)
      .setAngle(0)
      .setDepth(sequence.playerDepth);
    sequence.player.body.enable = true;
    sequence.player.anims?.resume();
    scene.cameras.main.startFollow(sequence.player, true, 0.12, 0.12);
  }
  teleportSequenceState = null;
}

function createWindVortex(scene, config) {
  const direction = config.direction === -1 ? -1 : 1;
  const zone = scene.physics.add.staticImage(
    config.x,
    config.y,
    'ground'
  ).setVisible(false);
  zone.setDisplaySize(config.width, config.height).refreshBody();
  const graphics = scene.add.graphics().setDepth(THEME.depths.scenery + 1);
  graphics.fillStyle(THEME.worlds.world2.fog.blue, 0.1)
    .fillRoundedRect(
      config.x - config.width / 2,
      config.y - config.height / 2,
      config.width,
      config.height,
      28
    );
  graphics.lineStyle(2, THEME.worlds.world2.fog.white, 0.65);
  for (let row = -2; row <= 2; row += 1) {
    const lineY = config.y + row * 34;
    const startX = config.x - direction * (config.width / 2 - 24);
    const endX = config.x + direction * (config.width / 2 - 24);
    graphics.lineBetween(startX, lineY, endX, lineY);
    graphics.lineBetween(endX, lineY, endX - direction * 12, lineY - 7);
    graphics.lineBetween(endX, lineY, endX - direction * 12, lineY + 7);
  }
  zone.setData({ direction, graphics });
  windVortices.push(zone);
  return zone;
}

function updateWindVortices(scene) {
  if (!player?.body?.enable) return;
  windVortices.forEach((zone) => {
    if (!zone?.active || !scene.physics.overlap(player, zone)) return;
    const direction = zone.getData('direction');
    player.setVelocityX(Phaser.Math.Clamp(
      player.body.velocity.x + direction * WIND_VORTEX_PUSH,
      -WIND_VORTEX_MAX_SPEED,
      WIND_VORTEX_MAX_SPEED
    ));
  });
}

function resetLateWorldMechanisms(scene) {
  cancelTeleportSequence(scene);
  player?.setData('teleportReadyAt', 0);
}

function destroyLateWorldMechanisms(scene) {
  resetLateWorldMechanisms(scene);
  windVortices.forEach((zone) => {
    zone?.getData('graphics')?.destroy();
    zone?.destroy();
  });
  windVortices = [];
  teleportJars?.clear(true, true);
  teleportJars = null;
}

function createMistBoss(scene, config) {
  level10Boss = scene.physics.add.image(config.bossX, config.bossY, 'mist-boss')
    .setDepth(THEME.depths.actor + 1)
    .setImmovable(true);
  level10Boss.body.allowGravity = false;
  level10Boss.body.setSize(104, 82).setOffset(13, 12);
  level10Boss.setData('isMistBoss', true);

  const warningHalo = scene.add.ellipse(
    config.bossX,
    config.bossY,
    150,
    118,
    THEME.gameplay.butter,
    0.18
  )
    .setStrokeStyle(4, THEME.gameplay.hazard, 0.85)
    .setDepth(THEME.depths.actor)
    .setVisible(false);
  const phaseText = scene.add.text(WIDTH / 2, 102, '', {
    fontFamily: THEME.typography.display,
    fontSize: '18px',
    color: THEME.colors.ink,
    backgroundColor: THEME.colors.surfaceFaint,
    padding: { x: 12, y: 6 }
  }).setOrigin(0.5).setScrollFactor(0).setDepth(THEME.depths.hud + 1);
  const healthPips = [0, 1, 2].map((index) => scene.add.rectangle(
    WIDTH / 2 - 48 + index * 48,
    137,
    34,
    12,
    THEME.gameplay.blush,
    1
  )
    .setStrokeStyle(2, THEME.gameplay.ink)
    .setScrollFactor(0)
    .setDepth(THEME.depths.hud + 1));

  level10BossState = {
    scene,
    state: 'idle',
    phase: 1,
    hits: 0,
    stateEnteredAt: scene.time.now,
    nextActionAt: scene.time.now + LEVEL_10_BOSS_TIMINGS.idleMs[1],
    chargeDirection: 1,
    chargeStartX: config.bossX,
    chargeEndX: config.bossX,
    chargesRemaining: 1,
    comboDodgeCount: 0,
    warningDuration: LEVEL_10_BOSS_TIMINGS.warningMs[1],
    recoveryPoseRestored: false,
    defeatResolved: false,
    trapArmed: false,
    trapOpen: false,
    trapFloor: config.trapFloor,
    trapBox: config.trapBox,
    warningHalo,
    phaseText,
    healthPips,
    lurePads: config.lurePads,
    spikeWalls: config.spikeWalls,
    leftWallX: LEVEL_10_ARENA_CONFIG.leftWallX,
    rightWallX: LEVEL_10_ARENA_CONFIG.rightWallX,
    effects: []
  };
  updateMistBossHud();
  return level10Boss;
}

function updateMistBossHud() {
  if (!level10BossState) return;
  level10BossState.phaseText?.setText(getMistBossHudText(
    level10BossState.phase,
    level10BossState.state,
    level10BossState.hits,
    level10BossState.trapArmed
  ));
  level10BossState.healthPips.forEach((pip, index) => {
    const remaining = index >= level10BossState.hits;
    pip.setFillStyle(
      remaining ? THEME.gameplay.blush : THEME.gameplay.mint,
      remaining ? 1 : 0.45
    );
  });
}

function beginMistBossWarning(scene, time, combo = false) {
  if (!level10BossState || !level10Boss?.body?.enable) return;
  const phase = level10BossState.phase;
  level10BossState.state = 'warning';
  level10BossState.stateEnteredAt = time;
  level10BossState.warningDuration = combo
    ? LEVEL_10_BOSS_TIMINGS.comboWarningMs
    : LEVEL_10_BOSS_TIMINGS.warningMs[phase];
  level10Boss.setVelocity(0);
  level10BossState.warningHalo
    .setPosition(level10Boss.x, level10Boss.y)
    .setScale(0.78)
    .setAlpha(0.2)
    .setVisible(true);
  scene.tweens.killTweensOf(level10Boss);
  scene.tweens.add({
    targets: level10Boss,
    scaleX: 1.16,
    scaleY: 0.84,
    yoyo: true,
    repeat: -1,
    duration: reducedMotion ? 1 : 170,
    ease: 'Sine.InOut'
  });
  audioManager.play('fireWarning');
  updateMistBossHud();
}

function startMistBossCharge(scene, time) {
  if (!level10BossState || !level10Boss?.body?.enable) return;
  const arenaMidX = (level10BossState.leftWallX + level10BossState.rightWallX) / 2;
  const direction = player.x < arenaMidX ? -1 : 1;
  level10BossState.state = 'charging';
  level10BossState.stateEnteredAt = time;
  level10BossState.chargeDirection = direction;
  level10BossState.chargeStartX = level10Boss.x;
  level10BossState.chargeEndX = direction < 0
    ? level10BossState.leftWallX + 12
    : level10BossState.rightWallX - 12;
  level10BossState.warningHalo.setVisible(false);
  scene.tweens.killTweensOf(level10Boss);
  level10Boss.setScale(1.08, 0.92).clearTint().setFlipX(direction < 0);
  level10Boss.setVelocityX(
    direction * LEVEL_10_BOSS_TIMINGS.chargeSpeed[level10BossState.phase]
  );
  updateMistBossHud();
}

function finishMistBossCharge(scene, time) {
  if (!level10BossState || level10BossState.state !== 'charging') return;
  level10Boss.setVelocity(0).setScale(1);
  if (level10BossState.phase === 3) level10BossState.comboDodgeCount += 1;
  if (level10BossState.phase === 3 && level10BossState.chargesRemaining > 1) {
    level10BossState.chargesRemaining -= 1;
    level10BossState.state = 'comboPause';
    level10BossState.stateEnteredAt = time;
  } else {
    level10BossState.state = 'idle';
    level10BossState.stateEnteredAt = time;
    level10BossState.nextActionAt = time + LEVEL_10_BOSS_TIMINGS.idleMs[level10BossState.phase];
  }
  updateMistBossHud();
}

function updateLevel10TrapPlate(scene, time) {
  if (!level10BossState || level10BossState.phase < 2 || level10BossState.trapOpen) {
    level10BossState && (level10BossState.trapArmed = false);
    return;
  }
  const boxOnPlate = updateBoxes.call(scene, time, LEVEL_10_WIDTH);
  level10BossState.trapArmed = boxOnPlate;
  setButtonPressed(boxOnPlate);
  if (level10BossState.state === 'idle') updateMistBossHud();
}

function openLevel10Trap() {
  if (!level10BossState || level10BossState.trapOpen) return;
  level10BossState.trapOpen = true;
  const floor = level10BossState.trapFloor;
  floor.body.enable = false;
  floor.setVisible(false);
  setButtonPressed(true);
}

function closeLevel10Trap() {
  if (!level10BossState) return;
  const floor = level10BossState.trapFloor;
  floor.body.enable = true;
  floor.setVisible(true).setAlpha(1);
  floor.refreshBody();
  level10BossState.trapOpen = false;
  level10BossState.trapArmed = false;
  setButtonPressed(false);
}

function setLevel10TrapAvailable(available) {
  if (!level10BossState || !pressureButton || !level10BossState.trapBox) return;
  pressureButton.setVisible(available);
  pressureButton.body.enable = available;
  const box = level10BossState.trapBox;
  clearBoxRespawnTimer(box);
  // The box is also the player's opening escape aid, so it must exist in
  // phase one. Only the pressure-button trap is unlocked after the first hit.
  restoreBox(box);
  setButtonPressed(false);
}

function moveLevel10SpikeWalls(scene, inset) {
  if (!level10BossState) return;
  level10BossState.leftWallX = LEVEL_10_ARENA_CONFIG.leftWallX + inset;
  level10BossState.rightWallX = LEVEL_10_ARENA_CONFIG.rightWallX - inset;
  ['left', 'right'].forEach((side) => {
    const targetX = side === 'left'
      ? level10BossState.leftWallX
      : level10BossState.rightWallX;
    level10BossState.spikeWalls[side].forEach((spike) => {
      scene.tweens.killTweensOf(spike);
      if (inset === 0 || reducedMotion) {
        spike.setX(targetX).refreshBody();
        return;
      }
      scene.tweens.add({
        targets: spike,
        x: targetX,
        duration: 620,
        ease: 'Sine.InOut',
        onUpdate: () => spike.refreshBody()
      });
    });
  });
  const lureOffset = LEVEL_10_ARENA_CONFIG.lurePadXs[0]
    - LEVEL_10_ARENA_CONFIG.leftWallX;
  level10BossState.lurePads?.forEach((pad, index) => {
    const targetX = index === 0
      ? level10BossState.leftWallX + lureOffset
      : level10BossState.rightWallX - lureOffset;
    scene.tweens.killTweensOf(pad);
    pad.setX(targetX);
    pad.getData('label')?.setX(targetX);
  });
}

function createMistBossHitDrops(scene) {
  const colors = [
    THEME.gameplay.blush,
    THEME.gameplay.mint,
    THEME.gameplay.lavender,
    THEME.gameplay.skyStrong
  ];
  colors.forEach((color, index) => {
    const drop = scene.add.circle(level10Boss.x, level10Boss.y, 8 + index, color, 0.9)
      .setDepth(THEME.depths.feedback);
    level10BossState.effects.push(drop);
    scene.tweens.add({
      targets: drop,
      x: level10Boss.x + (index - 1.5) * 48,
      y: level10Boss.y - 44 - (index % 2) * 24,
      alpha: 0,
      scale: 1.8,
      duration: reducedMotion ? 1 : 620,
      ease: 'Cubic.Out',
      onComplete: () => {
        drop.destroy();
        level10BossState?.effects.splice(level10BossState.effects.indexOf(drop), 1);
      }
    });
  });
}

function damageMistBoss(scene, source) {
  if (!level10BossState || level10BossState.state !== 'charging') return;
  level10BossState.hits += 1;
  const defeated = level10BossState.hits >= 3;
  level10BossState.phase = Math.min(3, level10BossState.hits + 1);
  level10BossState.state = defeated ? 'defeated' : 'recovery';
  level10BossState.stateEnteredAt = scene.time.now;
  level10BossState.recoveryPoseRestored = false;
  level10BossState.defeatResolved = false;
  level10BossState.warningHalo.setVisible(false);
  level10Boss.setVelocity(0).setVisible(true);
  level10Boss.body.enable = false;
  scene.tweens.killTweensOf(level10Boss);
  scene.cameras.main.shake(reducedMotion ? 1 : 240, reducedMotion ? 0 : 0.008);
  audioManager.play('button');
  createMistBossHitDrops(scene);

  if (defeated) {
    level10Boss.setTint(THEME.gameplay.blush);
    scene.tweens.add({
      targets: level10Boss,
      y: level10Boss.y - 50,
      scale: 1.55,
      alpha: 0,
      duration: reducedMotion ? 1 : LEVEL_10_BOSS_TIMINGS.defeatMs,
      ease: 'Sine.Out',
      onComplete: () => {
        if (level10BossState?.state === 'defeated') level10Boss.setVisible(false);
      }
    });
  } else if (source === 'trap') {
    scene.tweens.add({
      targets: level10Boss,
      y: LEVEL_10_ARENA_CONFIG.bossY + 82,
      angle: level10BossState.chargeDirection * 18,
      alpha: 1,
      scaleX: 1.22,
      scaleY: 0.72,
      duration: reducedMotion ? 1 : LEVEL_10_BOSS_TIMINGS.hitReactionMs,
      ease: 'Sine.In'
    });
  } else {
    level10Boss.setTint(THEME.gameplay.blush);
    scene.tweens.add({
      targets: level10Boss,
      x: level10Boss.x - level10BossState.chargeDirection * 38,
      angle: level10BossState.chargeDirection * -10,
      scaleX: 0.68,
      scaleY: 1.3,
      alpha: 1,
      duration: reducedMotion ? 1 : LEVEL_10_BOSS_TIMINGS.hitReactionMs,
      ease: 'Back.Out'
    });
  }

  if (level10BossState.hits === 1) setLevel10TrapAvailable(true);
  if (level10BossState.hits === 2) {
    moveLevel10SpikeWalls(scene, LEVEL_10_ARENA_CONFIG.phase3Inset);
  }
  updateMistBossHud();
}

function mistBossHitsSpike(hitBoss) {
  if (hitBoss !== level10Boss || !level10BossState) return;
  if (level10BossState.phase !== 1 && level10BossState.phase !== 3) return;
  if (level10BossState.phase === 3 && level10BossState.comboDodgeCount < 1) return;
  if (
    level10BossState.phase === 3
    && Math.abs(level10Boss.x - level10BossState.chargeStartX) < 90
  ) return;
  damageMistBoss(this, 'spike');
}

function mistBossHitsTrapBox(hitBoss, box) {
  if (hitBoss !== level10Boss || !level10BossState?.trapArmed) return;
  if (level10BossState.phase < 2 || level10BossState.state !== 'charging') return;
  if (level10BossState.phase === 3 && level10BossState.comboDodgeCount < 1) return;
  if (
    level10BossState.phase === 3
    && Math.abs(level10Boss.x - level10BossState.chargeStartX) < 90
  ) return;
  if (Math.abs(box.x - LEVEL_10_ARENA_CONFIG.trapX) > 46) return;
  box.setVelocityX(level10BossState.chargeDirection * 260);
  openLevel10Trap();
  damageMistBoss(this, 'trap');
}

function mistBossHitsPlayer(hitPlayer, hitBoss) {
  if (hitBoss !== level10Boss || !level10BossState) return;
  if (level10BossState.state === 'recovery' || level10BossState.state === 'defeated') return;
  die.call(this, hitPlayer);
}

function finishMistBossRecovery(scene, time) {
  closeLevel10Trap();
  setLevel10TrapAvailable(level10BossState.phase >= 2);
  level10Boss
    .setPosition(LEVEL_10_ARENA_CONFIG.bossX, LEVEL_10_ARENA_CONFIG.bossY)
    .setVisible(true)
    .setVelocity(0)
    .setScale(1)
    .setAngle(0)
    .setAlpha(1)
    .clearTint();
  level10Boss.body.enable = true;
  level10Boss.body.reset(level10Boss.x, level10Boss.y);
  level10Boss.body.allowGravity = false;
  level10BossState.state = 'idle';
  level10BossState.stateEnteredAt = time;
  level10BossState.nextActionAt = time + LEVEL_10_BOSS_TIMINGS.idleMs[level10BossState.phase];
  updateMistBossHud();
}

function beginMistBossRestoration(scene) {
  if (!level10BossState || level10BossState.recoveryPoseRestored) return;
  level10BossState.recoveryPoseRestored = true;
  scene.tweens.killTweensOf(level10Boss);
  level10BossState.recoveryReturnStartX = level10Boss.x;
  level10BossState.recoveryReturnStartY = level10Boss.y;
  level10BossState.recoveryReturnStartAngle = level10Boss.angle;
  level10BossState.recoveryReturnStartScaleX = level10Boss.scaleX;
  level10BossState.recoveryReturnStartScaleY = level10Boss.scaleY;
  level10Boss
    .setVelocity(0)
    .setVisible(true)
    .setAlpha(1)
    .setTint(THEME.gameplay.lavender);

  const restoreRing = scene.add.ellipse(
    LEVEL_10_ARENA_CONFIG.bossX,
    LEVEL_10_ARENA_CONFIG.bossY,
    88,
    64,
    THEME.worlds.world2.fog.white,
    0.22
  )
    .setStrokeStyle(3, THEME.gameplay.lavender, 0.72)
    .setDepth(THEME.depths.feedback);
  level10BossState.effects.push(restoreRing);
  scene.tweens.add({
    targets: restoreRing,
    scale: 1.8,
    alpha: 0,
    duration: reducedMotion ? 1 : LEVEL_10_BOSS_TIMINGS.restoreMs,
    ease: 'Sine.Out',
    onComplete: () => {
      restoreRing.destroy();
      if (!level10BossState) return;
      const index = level10BossState.effects.indexOf(restoreRing);
      if (index >= 0) level10BossState.effects.splice(index, 1);
    }
  });
}

function finishMistBossDefeat(scene) {
  if (!level10BossState || level10BossState.defeatResolved) return;
  level10BossState.defeatResolved = true;
  closeLevel10Trap();
  Object.values(level10BossState.spikeWalls).flat().forEach((spike) => {
    spike.body.enable = false;
    spike.setAlpha(0.22);
  });
  if (!doorIsOpen) openDoor.call(scene);
  goal.setVisible(true);
  goal.body.enable = true;
  goal.refreshBody();
  updateMistBossHud();
}

function updateMistBoss(scene, time) {
  if (!level10BossState || !level10Boss) return;
  const state = level10BossState.state;
  level10BossState.warningHalo.setPosition(level10Boss.x, level10Boss.y);

  if (state === 'idle' && time >= level10BossState.nextActionAt) {
    level10BossState.chargesRemaining = level10BossState.phase === 3
      ? LEVEL_10_BOSS_TIMINGS.phase3ChargeCount
      : 1;
    level10BossState.comboDodgeCount = 0;
    beginMistBossWarning(scene, time, false);
    return;
  }
  if (
    state === 'warning'
    && time - level10BossState.stateEnteredAt >= level10BossState.warningDuration
  ) {
    startMistBossCharge(scene, time);
    return;
  }
  if (state === 'warning') {
    const ratio = Phaser.Math.Clamp(
      (time - level10BossState.stateEnteredAt) / level10BossState.warningDuration,
      0,
      1
    );
    level10BossState.warningHalo.setScale(0.78 + ratio * 0.35).setAlpha(0.18 + ratio * 0.42);
    return;
  }
  if (state === 'charging') {
    const reachedEnd = level10BossState.chargeDirection < 0
      ? level10Boss.x <= level10BossState.chargeEndX
      : level10Boss.x >= level10BossState.chargeEndX;
    if (
      reachedEnd
      || time - level10BossState.stateEnteredAt >= LEVEL_10_BOSS_TIMINGS.chargeMaxMs
    ) {
      finishMistBossCharge(scene, time);
    }
    return;
  }
  if (
    state === 'comboPause'
    && time - level10BossState.stateEnteredAt >= LEVEL_10_BOSS_TIMINGS.comboPauseMs
  ) {
    beginMistBossWarning(scene, time, true);
    return;
  }
  if (state === 'recovery') {
    const elapsed = time - level10BossState.stateEnteredAt;
    const restoreDuration = reducedMotion ? 1 : LEVEL_10_BOSS_TIMINGS.restoreMs;
    const restoreStartsAt = LEVEL_10_BOSS_TIMINGS.hitReactionMs
      + LEVEL_10_BOSS_TIMINGS.restoreDelayMs;
    if (elapsed >= restoreStartsAt) {
      beginMistBossRestoration(scene);
      const ratio = Phaser.Math.Clamp(
        (elapsed - restoreStartsAt) / restoreDuration,
        0,
        1
      );
      const eased = Phaser.Math.Easing.Sine.InOut(ratio);
      level10Boss
        .setPosition(
          Phaser.Math.Linear(
            level10BossState.recoveryReturnStartX,
            LEVEL_10_ARENA_CONFIG.bossX,
            eased
          ),
          Phaser.Math.Linear(
            level10BossState.recoveryReturnStartY,
            LEVEL_10_ARENA_CONFIG.bossY,
            eased
          )
        )
        .setAngle(Phaser.Math.Linear(
          level10BossState.recoveryReturnStartAngle,
          0,
          eased
        ))
        .setScale(
          Phaser.Math.Linear(level10BossState.recoveryReturnStartScaleX, 1, eased),
          Phaser.Math.Linear(level10BossState.recoveryReturnStartScaleY, 1, eased)
        )
        .setAlpha(1);
      if (ratio >= 1) level10Boss.clearTint();
    }
    if (elapsed >= LEVEL_10_BOSS_TIMINGS.recoveryMs) finishMistBossRecovery(scene, time);
    return;
  }
  if (
    state === 'defeated'
    && time - level10BossState.stateEnteredAt >= LEVEL_10_BOSS_TIMINGS.defeatMs
  ) {
    finishMistBossDefeat(scene);
  }
}

function resetMistBoss(scene) {
  if (!level10BossState || !level10Boss) return;
  scene.tweens.killTweensOf(level10Boss);
  level10BossState.effects.forEach((effect) => {
    scene.tweens.killTweensOf(effect);
    effect.destroy();
  });
  level10BossState.effects = [];
  level10BossState.state = 'idle';
  level10BossState.phase = 1;
  level10BossState.hits = 0;
  level10BossState.stateEnteredAt = scene.time.now;
  level10BossState.nextActionAt = scene.time.now + LEVEL_10_BOSS_TIMINGS.idleMs[1];
  level10BossState.chargeStartX = LEVEL_10_ARENA_CONFIG.bossX;
  level10BossState.chargesRemaining = 1;
  level10BossState.comboDodgeCount = 0;
  level10BossState.recoveryPoseRestored = false;
  level10BossState.defeatResolved = false;
  level10BossState.warningHalo.setVisible(false);
  closeLevel10Trap();
  moveLevel10SpikeWalls(scene, 0);
  level10BossState.spikeWalls.left.concat(level10BossState.spikeWalls.right)
    .forEach((spike) => {
      spike.body.enable = true;
      spike.setAlpha(1);
      spike.refreshBody();
    });
  setLevel10TrapAvailable(false);
  level10Boss
    .setPosition(LEVEL_10_ARENA_CONFIG.bossX, LEVEL_10_ARENA_CONFIG.bossY)
    .setVisible(true)
    .setVelocity(0)
    .setScale(1)
    .setAngle(0)
    .setAlpha(1)
    .clearTint();
  level10Boss.body.enable = true;
  level10Boss.body.reset(level10Boss.x, level10Boss.y);
  level10Boss.body.allowGravity = false;
  updateMistBossHud();
}

function destroyMistBoss(scene) {
  if (!level10BossState) {
    level10Boss?.destroy();
    level10Boss = null;
    return;
  }
  scene.tweens.killTweensOf(level10Boss);
  level10BossState.effects.forEach((effect) => {
    scene.tweens.killTweensOf(effect);
    effect.destroy();
  });
  level10BossState.warningHalo?.destroy();
  level10BossState.phaseText?.destroy();
  level10BossState.healthPips.forEach((pip) => pip.destroy());
  level10Boss?.destroy();
  level10Boss = null;
  level10BossState = null;
}

function initializeFireballSystem(scene, textureKey = 'fireball') {
  fireCannons = [];
  fireCannonClockStart = scene.time.now;
  fireballs = scene.physics.add.group({ allowGravity: false });
  for (let index = 0; index < FIREBALL_POOL_SIZE; index += 1) {
    const fireball = fireballs.create(-100, -100, textureKey);
    fireball.body.allowGravity = false;
    fireball.body.setCircle(9, 3, 3);
    fireball.setDepth(THEME.depths.mechanism).setActive(false).setVisible(false);
    fireball.body.enable = false;
    fireball.setData('owner', null);
    fireball.setData('expiresAt', 0);
  }
}

function createFireCannon(scene, config) {
  const direction = config.direction === 'left' ? -1 : 1;
  const interval = Math.max(900, config.interval || 2400);
  const maxInstances = Math.max(1, config.maxInstances || 1);
  const cannon = scene.add.image(
    config.x,
    config.y,
    config.textureKey || 'fire-cannon'
  )
    .setDepth(THEME.depths.mechanism)
    .setFlipX(direction < 0);
  const definition = {
    id: config.id || null,
    segment: config.segment || null,
    sprite: cannon,
    x: config.x,
    y: config.y,
    direction,
    interval,
    phaseOffset: Math.max(0, config.phaseOffset || 0),
    warningMs: config.warningMs || FIREBALL_DEFAULT_WARNING_MS,
    speed: config.speed || FIREBALL_DEFAULT_SPEED,
    maxInstances,
    maxLifetimeMs: Math.max(
      600,
      config.maxLifetimeMs || interval * maxInstances - 120
    ),
    sharedClock: Boolean(config.sharedClock),
    blockedByWalls: config.blockedByWalls !== false,
    blockedByBoxes: config.blockedByBoxes !== false,
    warningTint: config.warningTint || THEME.gameplay.cannonWarn,
    nextFireAt: 0,
    warningPlayed: false,
    activated: false
  };
  fireCannons.push(definition);
  return cannon;
}

function scheduleFireCannons(scene) {
  const now = scene.time.now;
  fireCannonClockStart = now;
  fireCannons.forEach((cannon) => {
    cannon.nextFireAt = now + cannon.phaseOffset + cannon.warningMs;
    cannon.warningPlayed = false;
    cannon.activated = false;
    cannon.sprite.setPosition(cannon.x, cannon.y).clearTint();
  });
}

function countActiveFireballs(cannon) {
  let count = 0;
  fireballs?.children.each((fireball) => {
    if (fireball.active && fireball.getData('owner') === cannon) count += 1;
  });
  return count;
}

function acquireFireball() {
  let available = null;
  fireballs?.children.each((fireball) => {
    if (!available && !fireball.active) available = fireball;
  });
  return available;
}

function launchFireball(cannon, time) {
  if (countActiveFireballs(cannon) >= cannon.maxInstances) return;
  const fireball = acquireFireball();
  if (!fireball) return;
  const muzzleX = cannon.x + cannon.direction * 31;
  fireball.setData('owner', cannon);
  fireball.setData('expiresAt', time + cannon.maxLifetimeMs);
  fireball.enableBody(true, muzzleX, cannon.y, true, true);
  fireball.body.allowGravity = false;
  fireball.setVelocity(cannon.direction * cannon.speed, 0);
  audioManager.play('fireLaunch');
}

function updateFireCannons(scene, time) {
  if (!fireballs) return;
  const bounds = scene.physics.world.bounds;
  fireballs.children.each((fireball) => {
    if (!fireball.active) return;
    if (
      time >= fireball.getData('expiresAt') ||
      fireball.x < bounds.x - 60 || fireball.x > bounds.right + 60 ||
      fireball.y < bounds.y - 60 || fireball.y > bounds.bottom + 60
    ) {
      deactivateFireball(fireball);
    }
  });

  fireCannons.forEach((cannon) => {
    const view = scene.cameras.main.worldView;
    const inReadableRange = cannon.x >= view.x - 120
      && cannon.x <= view.right + 120
      && cannon.y >= view.y - 120
      && cannon.y <= view.bottom + 120;
    if (!inReadableRange) {
      if (cannon.activated) {
        fireballs.children.each((fireball) => {
          if (fireball.active && fireball.getData('owner') === cannon) {
            deactivateFireball(fireball);
          }
        });
      }
      cannon.activated = false;
      cannon.warningPlayed = false;
      cannon.sprite.setPosition(cannon.x, cannon.y).clearTint();
      return;
    }
    if (!cannon.activated) {
      cannon.activated = true;
      if (cannon.sharedClock) {
        const firstFireAt = fireCannonClockStart + cannon.phaseOffset + cannon.warningMs;
        const elapsedAfterFirst = time - firstFireAt;
        cannon.nextFireAt = elapsedAfterFirst < 0
          ? firstFireAt
          : firstFireAt + (Math.floor(elapsedAfterFirst / cannon.interval) + 1) * cannon.interval;
      } else {
        cannon.nextFireAt = time + cannon.phaseOffset + cannon.warningMs;
      }
      cannon.warningPlayed = false;
    }
    const warningStartsAt = cannon.nextFireAt - cannon.warningMs;
    if (time >= warningStartsAt && time < cannon.nextFireAt) {
      if (!cannon.warningPlayed) {
        cannon.warningPlayed = true;
        audioManager.play('fireWarning');
      }
      const flash = Math.floor((time - warningStartsAt) / 90) % 2 === 0;
      cannon.sprite.setTint(flash ? cannon.warningTint : THEME.gameplay.white);
      cannon.sprite.x = cannon.x + (flash ? cannon.direction * 2 : 0);
    }
    if (time >= cannon.nextFireAt) {
      launchFireball(cannon, time);
      cannon.nextFireAt += cannon.interval;
      if (cannon.nextFireAt <= time) cannon.nextFireAt = time + cannon.interval;
      cannon.warningPlayed = false;
      cannon.sprite.setPosition(cannon.x, cannon.y).clearTint();
    }
  });

}

function deactivateFireball(fireball) {
  if (!fireball?.active) return;
  fireball.setData('owner', null);
  fireball.setData('expiresAt', 0);
  fireball.disableBody(true, true);
  fireball.setPosition(-100, -100);
}

function fireballHitsPlayer(hitPlayer, fireball) {
  if (!fireball?.active || isDead || isCleared) return;
  deactivateFireball(fireball);
  die.call(this, hitPlayer);
}

function fireballHitsPlatform(fireball) {
  const owner = fireball?.getData('owner');
  if (owner?.blockedByWalls) deactivateFireball(fireball);
}

function fireballHitsBox(fireball) {
  const owner = fireball?.getData('owner');
  if (owner?.blockedByBoxes) deactivateFireball(fireball);
}

function resetFireballSystem(scene) {
  fireballs?.children.each((fireball) => deactivateFireball(fireball));
  scheduleFireCannons(scene);
}

function stopFireballSystem() {
  fireballs?.children.each((fireball) => deactivateFireball(fireball));
  fireCannons.forEach((cannon) => cannon.sprite?.clearTint());
}

function destroyFireballSystem() {
  fireballs?.clear(true, true);
  fireballs = null;
  fireCannons.forEach((cannon) => cannon.sprite?.destroy());
  fireCannons = [];
  fireCannonClockStart = 0;
}

function initializeAlternatingSpikeSystem(scene) {
  alternatingSpikes = scene.physics.add.group({ allowGravity: false });
  alternatingSpikeControllers = [];
  alternatingSpikeClockStart = scene.time.now;
}

function createAlternatingSpikePair(scene, config) {
  const floorSurfaceY = config.floorSurfaceY ?? 470;
  const ceilingSurfaceY = config.ceilingSurfaceY ?? 350;
  const travel = config.travel ?? 58;
  const floorSpike = alternatingSpikes.create(
    config.floorX,
    floorSurfaceY - 32,
    'alt-spike'
  ).setDepth(THEME.depths.terrain - 1);
  const ceilingSpike = alternatingSpikes.create(
    config.ceilingX,
    ceilingSurfaceY + 32,
    'alt-spike'
  ).setDepth(THEME.depths.terrain - 1).setFlipY(true);
  let ceilingHousing = null;
  let ceilingMask = null;
  let ceilingMaskShape = null;
  if (config.showCeilingHousing === false) {
    const revealY = config.ceilingRevealY ?? ceilingSurfaceY;
    ceilingMaskShape = scene.make.graphics({ add: false });
    ceilingMaskShape.fillStyle(0xffffff);
    ceilingMaskShape.fillRect(config.ceilingX - 64, revealY, 128, 256);
    ceilingMask = ceilingMaskShape.createGeometryMask();
    ceilingSpike.setMask(ceilingMask);
  } else {
    ceilingHousing = scene.add.rectangle(
      config.ceilingX,
      ceilingSurfaceY,
      120,
      64,
      THEME.gameplay.ground
    )
      .setOrigin(0.5, 1)
      .setStrokeStyle(2, THEME.gameplay.groundLine)
      .setDepth(THEME.depths.terrain);
  }

  const pairNumber = alternatingSpikeControllers.length + 1;
  const floorGroupId = config.floorGroupId || `A${pairNumber}`;
  const ceilingGroupId = config.ceilingGroupId || `B${pairNumber}`;
  const floorDirection = config.floorDirection || 'up';
  const ceilingDirection = config.ceilingDirection || 'down';
  [floorSpike, ceilingSpike].forEach((spike) => {
    spike.body.allowGravity = false;
    spike.setImmovable(true);
    spike.body.setSize(24, 56).setOffset(4, 4);
    spike.setData('dangerous', false);
  });
  floorSpike.setData({ groupId: floorGroupId, direction: floorDirection });
  ceilingSpike.setData({ groupId: ceilingGroupId, direction: ceilingDirection });

  const warningMs = config.warningMs || ALTERNATING_SPIKE_WARNING_MS;
  const transitionMs = config.transitionMs || ALTERNATING_SPIKE_TRANSITION_MS;
  const requestedPeriod = Number.isFinite(config.periodMs) ? config.periodMs : null;
  const holdMs = requestedPeriod
    ? Math.max(400, requestedPeriod / 2 - warningMs - transitionMs)
    : (config.holdMs || ALTERNATING_SPIKE_HOLD_MS);
  const controller = {
    floorSpike,
    ceilingSpike,
    ceilingHousing,
    ceilingMask,
    ceilingMaskShape,
    floorSurfaceY,
    ceilingSurfaceY,
    travel,
    phaseOffset: Math.max(0, config.phaseOffset || 0),
    holdMs,
    warningMs,
    transitionMs,
    periodMs: 2 * (holdMs + warningMs + transitionMs),
    floorGroupId,
    ceilingGroupId,
    floorDirection,
    ceilingDirection,
    lastSegment: -1
  };
  alternatingSpikeControllers.push(controller);
  return controller;
}

function setAlternatingSpikePose(spike, x, extendedY, retractedY, progress, state) {
  const nextY = Phaser.Math.Linear(retractedY, extendedY, Phaser.Math.Clamp(progress, 0, 1));
  spike.setPosition(x, Math.round(nextY));
  spike.body.reset(x, Math.round(nextY));
  const dangerous = progress >= 0.72 && state !== 'warning';
  spike.body.enable = dangerous;
  spike.setData({ dangerous, state });
  if (state === 'warning') {
    spike.setTint(THEME.gameplay.cannonWarn);
  } else {
    spike.clearTint();
  }
}

function updateAlternatingSpikeController(controller, elapsed, audible = true) {
  const { holdMs, warningMs, transitionMs } = controller;
  const halfCycle = holdMs + warningMs + transitionMs;
  const cycle = halfCycle * 2;
  const phase = (elapsed + controller.phaseOffset) % cycle;
  let segment;
  let floorProgress;
  let ceilingProgress;
  let floorState;
  let ceilingState;

  if (phase < holdMs) {
    segment = 0;
    floorProgress = 1;
    ceilingProgress = 0;
    floorState = 'extended';
    ceilingState = 'retracted';
  } else if (phase < holdMs + warningMs) {
    segment = 1;
    floorProgress = 1;
    ceilingProgress = 0;
    floorState = 'extended';
    ceilingState = 'warning';
  } else if (phase < halfCycle) {
    segment = 2;
    const ratio = (phase - holdMs - warningMs) / transitionMs;
    floorProgress = 1 - ratio;
    ceilingProgress = ratio;
    floorState = 'retracting';
    ceilingState = 'extending';
  } else if (phase < halfCycle + holdMs) {
    segment = 3;
    floorProgress = 0;
    ceilingProgress = 1;
    floorState = 'retracted';
    ceilingState = 'extended';
  } else if (phase < halfCycle + holdMs + warningMs) {
    segment = 4;
    floorProgress = 0;
    ceilingProgress = 1;
    floorState = 'warning';
    ceilingState = 'extended';
  } else {
    segment = 5;
    const ratio = (phase - halfCycle - holdMs - warningMs) / transitionMs;
    floorProgress = ratio;
    ceilingProgress = 1 - ratio;
    floorState = 'extending';
    ceilingState = 'retracting';
  }

  if (audible && (segment === 1 || segment === 4) && controller.lastSegment !== segment) {
    audioManager.play('spikeWarning');
  }
  controller.lastSegment = segment;

  setAlternatingSpikePose(
    controller.floorSpike,
    controller.floorSpike.x,
    controller.floorSurfaceY - 32,
    controller.floorSurfaceY - 32 + controller.travel,
    floorProgress,
    floorState
  );
  setAlternatingSpikePose(
    controller.ceilingSpike,
    controller.ceilingSpike.x,
    controller.ceilingSurfaceY + 32,
    controller.ceilingSurfaceY + 32 - controller.travel,
    ceilingProgress,
    ceilingState
  );
}

function updateAlternatingSpikes(scene, time) {
  const elapsed = Math.max(0, time - alternatingSpikeClockStart);
  const view = scene.cameras.main.worldView;
  alternatingSpikeControllers.forEach((controller) => {
    const centerX = (controller.floorSpike.x + controller.ceilingSpike.x) * 0.5;
    const audible = centerX >= view.x - 120 && centerX <= view.right + 120;
    updateAlternatingSpikeController(controller, elapsed, audible);
  });
}

function alternatingSpikeHitsPlayer(hitPlayer, spike) {
  if (!spike?.getData('dangerous') || isDead || isCleared) return;
  die.call(this, hitPlayer);
}

function resetAlternatingSpikeSystem(scene) {
  alternatingSpikeClockStart = scene.time.now;
  alternatingSpikeControllers.forEach((controller) => {
    controller.lastSegment = -1;
    updateAlternatingSpikeController(controller, 0, false);
  });
}

function stopAlternatingSpikeSystem() {
  alternatingSpikeControllers.forEach((controller) => {
    [controller.floorSpike, controller.ceilingSpike].forEach((spike) => {
      if (spike?.body) spike.body.enable = false;
      spike?.setData('dangerous', false);
    });
  });
}

function destroyAlternatingSpikeSystem() {
  alternatingSpikeControllers.forEach((controller) => {
    controller.ceilingSpike?.clearMask();
    controller.ceilingMask?.destroy();
    controller.ceilingMaskShape?.destroy();
    controller.ceilingHousing?.destroy();
  });
  alternatingSpikes?.clear(true, true);
  alternatingSpikes = null;
  alternatingSpikeControllers = [];
  alternatingSpikeClockStart = 0;
}
