"use strict";

const WIDTH = 960;
const HEIGHT = 540;
const TOTAL_LEVELS = 20;
const WORLD_WIDTH = 1420;
const LEVEL_2_WIDTH = 2350;
const LEVEL_3_WIDTH = 2750;
const LEVEL_4_WIDTH = 3200;
const LEVEL_5_WIDTH = 6600;
const LEVEL_6_WIDTH = 7600;
const LEVEL_7_WIDTH = 7000;
const LEVEL_8_WIDTH = 8500;
const LEVEL_9_WIDTH = 960;
const LEVEL_9_WORLD_TOP = -2050;
const LEVEL_9_WORLD_BOTTOM = 640;
const LEVEL_10_WIDTH = 1120;
const LEVEL_11_WIDTH = 5600;
const LEVEL_12_WIDTH = 7600;
const LEVEL_13_WIDTH = 6400;
const LEVEL_14_WIDTH = 3600;
const LEVEL_15_WIDTH = 6500;
const LEVEL_16_WIDTH = 7200;
const LEVEL_17_WIDTH = 5400;
const LEVEL_18_WIDTH = 1120;
const LEVEL_19_WIDTH = 1120;
const LEVEL_20_WIDTH = 6000;
const LEVEL_16_WORLD_TOP = -600;
const LEVEL_17_WORLD_TOP = -620;
const LEVEL_18_WORLD_TOP = -2760;
const LEVEL_19_WORLD_TOP = -2760;
const LEVEL_20_WORLD_TOP = -1250;
const START = { x: 74, y: 425 };
const LEVEL_2_START = { x: 76, y: 425 };
const LEVEL_3_START = { x: 76, y: 425 };
const LEVEL_4_START = { x: 76, y: 425 };
const LEVEL_5_START = { x: 76, y: 425 };
const LEVEL_6_START = { x: 76, y: 425 };
const LEVEL_7_START = { x: 76, y: 425 };
const LEVEL_8_START = { x: 76, y: 425 };
const LEVEL_9_START = { x: 170, y: 425 };
const LEVEL_10_START = { x: 320, y: 425 };
const LEVEL_11_START = { x: 76, y: 425 };
const LEVEL_12_START = { x: 90, y: 425 };
const LEVEL_13_START = { x: 90, y: 425 };
const LEVEL_14_START = { x: 90, y: 425 };
const LEVEL_15_START = { x: 90, y: 425 };
const LEVEL_16_START = { x: 90, y: 425 };
const LEVEL_17_START = { x: 90, y: 425 };
const LEVEL_18_START = { x: 170, y: 425 };
const LEVEL_19_START = { x: 170, y: 425 };
const LEVEL_20_START = { x: 90, y: 425 };
const LEVEL_1_MOVING_PLATFORM_START = { x: 640, y: 439 };
const LEVEL_1_MOVING_PLATFORM_MAX_X = 970;
const LEVEL_1_MOVING_PLATFORM_SPEED = 95;
const SAVE_KEY = 'block-hero.progress.v1';
const SAVE_VERSION = 1;
const BOX_PUSH_MAX_SPEED = 82;
const BOX_GROUND_DRAG = 650;
const BOX_MOVING_PLATFORM_DRAG = 220;
const BOX_MOVING_PLATFORM_GRIP = 1;
const PLAYER_MAX_JUMPS = 2;
const PLAYER_FIRST_JUMP_VELOCITY = -475;
const PLAYER_SECOND_JUMP_VELOCITY = -430;
const PLAYER_SHORT_JUMP_CUTOFF = -175;
const PLAYER_COYOTE_MS = 95;
const PLAYER_JUMP_BUFFER_MS = 110;
const TOOL_RESPAWN_MS = 2500;
const DOOR_ANIMATION_MS = 200;
const FALL_WARNING_MS = 500;
const FALL_RESET_MS = TOOL_RESPAWN_MS;
const FALL_INITIAL_SPEED = 40;
const WORLD3_CLOUD_FADE_MS = 180;
const TIMED_SWITCH_DURATION_MS = 9000;
const TIMED_SWITCH_WARNING_MS = 3000;
const FIREBALL_POOL_SIZE = 32;
const FIREBALL_DEFAULT_WARNING_MS = 650;
const FIREBALL_DEFAULT_SPEED = 210;
const ALTERNATING_SPIKE_WARNING_MS = 600;
const ALTERNATING_SPIKE_TRANSITION_MS = 280;
const ALTERNATING_SPIKE_HOLD_MS = 1200;
const LADDER_CLIMB_SPEED = 145;
const LADDER_SNAP_SPEED = 105;
const LADDER_ATTACH_PADDING_X = 3;
const LADDER_ATTACH_PADDING_Y = 2;
const SPRING_DEFAULT_VELOCITY = 680;
const SPRING_DEFAULT_COOLDOWN_MS = 220;
const SPRING_COMPRESS_MS = 65;
const LEVEL_7_PLATFORM_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'review-slow', segment: 'horizontal-review',
    axis: 'x', x: 780, y: 479,
    distance: 300, direction: 1, speed: 60, width: 160
  }),
  Object.freeze({
    id: 'review-fast', segment: 'horizontal-review',
    axis: 'x', x: 1460, y: 479,
    distance: 300, direction: 1, speed: 105, width: 160
  }),
  Object.freeze({
    id: 'ladder-transfer-slow', segment: 'ladder-platform',
    axis: 'x', x: 3460, y: 389,
    distance: 360, direction: 1, speed: 78, width: 160
  }),
  Object.freeze({
    id: 'ladder-transfer-fast', segment: 'ladder-platform',
    axis: 'x', x: 4330, y: 269,
    distance: 420, direction: 1, speed: 115, width: 160
  }),
  Object.freeze({
    id: 'final-horizontal', segment: 'multi-direction',
    axis: 'x', x: 5780, y: 324,
    distance: 300, direction: 1, speed: 72, width: 160
  }),
  Object.freeze({
    id: 'vertical-finale', segment: 'finale',
    axis: 'y', x: 6520, y: 455,
    distance: 225, direction: -1, speed: 60, width: 160
  })
]);
const LEVEL_7_LADDER_CONFIGS = Object.freeze([
  Object.freeze({ id: 'ladder-teach', x: 2250, y: 395, height: 150 }),
  Object.freeze({ id: 'ladder-transfer', x: 4050, y: 320, height: 120 })
]);
const LEVEL_7_SPRING_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'gap-platform-assist', carrierId: 'ladder-transfer-slow',
    x: 3460, y: 365, movesWithPlatform: true,
    launchVelocity: 650, direction: 'up', cooldownMs: 260, initialDelay: 0
  }),
  Object.freeze({
    id: 'spring-to-lift', x: 5120, y: 456,
    launchVelocity: 650, direction: 'up', cooldownMs: 240, initialDelay: 0
  })
]);
const LEVEL_7_CANNON_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'gap-fire-wall', segment: 'ladder-platform',
    x: 4760, y: 350, direction: 'left',
    interval: 3600, phaseOffset: 1400, warningMs: 800,
    speed: 175, maxInstances: 1
  }),
  Object.freeze({
    id: 'final-fire-wall', segment: 'multi-direction',
    x: 6130, y: 285, direction: 'left',
    interval: 3400, phaseOffset: 1800, warningMs: 800,
    speed: 180, maxInstances: 1
  })
]);
const LEVEL_7_SPIKE_POSITIONS = Object.freeze([3020, 4960, 6740]);
const LEVEL_7_MOVING_SPIKE_CONFIGS = Object.freeze([
  Object.freeze({ carrierId: 'review-fast', offsetX: 42, offsetY: -13 }),
  Object.freeze({ carrierId: 'final-horizontal', offsetX: -42, offsetY: -13 }),
  Object.freeze({ carrierId: 'vertical-finale', offsetX: 34, offsetY: -13 })
]);
const LEVEL_8_PLATFORM_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'warmup-platform', segment: 'platform-warmup',
    axis: 'x', x: 700, y: 479, distance: 300, direction: 1,
    speed: 62, width: 160
  }),
  Object.freeze({
    id: 'relaxed-sync-platform', segment: 'relaxed-sync',
    axis: 'x', x: 3380, y: 479, distance: 400, direction: 1,
    speed: 60, width: 160
  }),
  Object.freeze({
    id: 'formal-vertical', segment: 'formal-sync-a',
    axis: 'y', x: 4690, y: 455, distance: 155, direction: -1,
    speed: 82, width: 140
  }),
  Object.freeze({
    id: 'formal-slow', segment: 'formal-sync-b',
    axis: 'x', x: 5680, y: 339, distance: 400, direction: 1,
    speed: 72, width: 160
  }),
  Object.freeze({
    id: 'formal-fast', segment: 'formal-sync-b',
    axis: 'x', x: 6420, y: 339, distance: 420, direction: 1,
    speed: 102, width: 160
  }),
  Object.freeze({
    id: 'exam-vertical', segment: 'world2-exam',
    axis: 'y', x: 7670, y: 455, distance: 155, direction: -1,
    speed: 86, width: 140
  }),
  Object.freeze({
    id: 'exam-horizontal', segment: 'world2-exam',
    axis: 'x', x: 7980, y: 324, distance: 300, direction: 1,
    speed: 82, width: 160
  })
]);
const LEVEL_8_CANNON_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'standalone-review', segment: 'cannon-review',
    x: 3150, y: 430, direction: 'left',
    interval: 2800, phaseOffset: 1000, warningMs: 650,
    speed: 190, maxInstances: 1
  }),
  Object.freeze({
    id: 'relaxed-cannon', segment: 'relaxed-sync',
    x: 3860, y: 430, direction: 'left',
    interval: 3800, phaseOffset: 1500, warningMs: 750,
    speed: 175, maxInstances: 1
  }),
  Object.freeze({
    id: 'formal-vertical-cannon', segment: 'formal-sync-a',
    x: 5050, y: 390, direction: 'left',
    interval: 2800, phaseOffset: 1000, warningMs: 650,
    speed: 195, maxInstances: 2
  }),
  Object.freeze({
    id: 'formal-slow-cannon', segment: 'formal-sync-b',
    x: 6280, y: 300, direction: 'left',
    interval: 2700, phaseOffset: 1200, warningMs: 650,
    speed: 195, maxInstances: 2
  }),
  Object.freeze({
    id: 'formal-fast-cannon', segment: 'formal-sync-b',
    x: 7050, y: 300, direction: 'right',
    interval: 2400, phaseOffset: 1700, warningMs: 650,
    speed: 215, maxInstances: 2
  }),
  Object.freeze({
    id: 'exam-high-cannon', segment: 'world2-exam',
    x: 8280, y: 300, direction: 'left',
    interval: 2600, phaseOffset: 1400, warningMs: 650,
    speed: 205, maxInstances: 2
  })
]);
const LEVEL_8_LADDER_CONFIGS = Object.freeze([
  Object.freeze({ id: 'review-ladder', x: 1250, y: 400, height: 140 }),
  Object.freeze({ id: 'formal-ladder', x: 4420, y: 400, height: 140 }),
  Object.freeze({ id: 'exam-ladder', x: 7250, y: 405, height: 130 })
]);
const LEVEL_8_SPRING_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'formal-spring', x: 5350, y: 456,
    launchVelocity: 640, direction: 'up', cooldownMs: 240, initialDelay: 0
  })
]);
const LEVEL_8_SPIKE_POSITIONS = Object.freeze([2520, 4370, 7550]);
const LEVEL_8_MOVING_SPIKE_CONFIGS = Object.freeze([
  Object.freeze({ carrierId: 'relaxed-sync-platform', offsetX: 42, offsetY: -13 }),
  Object.freeze({ carrierId: 'formal-slow', offsetX: -42, offsetY: -13 }),
  Object.freeze({ carrierId: 'exam-horizontal', offsetX: 42, offsetY: -13 })
]);
const LEVEL_8_RAINBOW_CLOUD_CONFIGS = Object.freeze([
  Object.freeze({ x: 3400, y: 365 }),
  Object.freeze({ x: 3610, y: 280 }),
  Object.freeze({ x: 3820, y: 195 })
]);
const LEVEL_9_FLOOR_BOUNDS = Object.freeze([
  Object.freeze({ id: 'floor-1', bottomY: 470, topY: 0 }),
  Object.freeze({ id: 'floor-2', bottomY: 0, topY: -450 }),
  Object.freeze({ id: 'floor-3', bottomY: -450, topY: -900 }),
  Object.freeze({ id: 'floor-4', bottomY: -900, topY: -1350 }),
  Object.freeze({ id: 'floor-5', bottomY: -1350, topY: -1920 })
]);
const LEVEL_9_PLATFORM_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'floor-1-ladder-transfer', floor: 1,
    axis: 'x', x: 340, y: 250, distance: 240, direction: 1,
    speed: 100, width: 120
  }),
  Object.freeze({
    id: 'floor-3-synced-lift', floor: 3,
    axis: 'y', x: 455, y: -441, distance: 320, direction: -1,
    speed: 96, width: 120
  }),
  Object.freeze({
    id: 'floor-4-narrow-lift', floor: 4,
    axis: 'y', x: 520, y: -891, distance: 330, direction: -1,
    speed: 115, width: 110
  }),
  Object.freeze({
    id: 'floor-5-final-transfer', floor: 5,
    axis: 'x', x: 500, y: -1770, distance: 180, direction: 1,
    speed: 112, width: 110
  })
]);
const LEVEL_9_LADDER_CONFIGS = Object.freeze([
  Object.freeze({ id: 'floor-1-entry', x: 270, y: 360, height: 220 }),
  Object.freeze({ id: 'floor-1-exit', x: 680, y: 135, height: 270 }),
  Object.freeze({ id: 'floor-2-rise', x: 455, y: -297.5, height: 305 }),
  Object.freeze({ id: 'floor-3-exit', x: 455, y: -827.5, height: 145 }),
  Object.freeze({ id: 'floor-4-exit', x: 520, y: -1282.5, height: 135 }),
  Object.freeze({ id: 'floor-5-entry', x: 520, y: -1445, height: 190 }),
  Object.freeze({ id: 'floor-5-goal', x: 390, y: -1850, height: 140 })
]);
const LEVEL_9_SPRING_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'floor-2-direction-spring', x: 650, y: -14,
    launchVelocity: 680, direction: 'up', cooldownMs: 230, initialDelay: 0
  }),
  Object.freeze({
    id: 'floor-5-direction-spring', x: 520, y: -1554,
    launchVelocity: 680, direction: 'up', cooldownMs: 230, initialDelay: 0
  })
]);
const LEVEL_9_CANNON_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'floor-3-synced-cannon', floor: 3,
    x: 810, y: -616, direction: 'left',
    interval: 3333.333, phaseOffset: 150, warningMs: 600,
    speed: 220, maxInstances: 2, sharedClock: true
  }),
  Object.freeze({
    id: 'floor-4-narrow-cannon', floor: 4,
    x: 625, y: -1071, direction: 'left',
    interval: 2869.565, phaseOffset: 1090, warningMs: 580,
    speed: 230, maxInstances: 2, sharedClock: true
  })
]);
const LEVEL_9_SPIKE_CONFIGS = Object.freeze([
  Object.freeze({ id: 'floor-2-landing-spike', x: 580, y: -149 }),
  Object.freeze({ id: 'floor-5-landing-spike', x: 710, y: -1684 })
]);
const LEVEL_9_CHECKPOINT_CONFIGS = Object.freeze([
  Object.freeze({ id: 'after-floor-2', x: 455, y: -483, spawnX: 455, spawnY: -495 }),
  Object.freeze({ id: 'after-floor-4', x: 520, y: -1383, spawnX: 520, spawnY: -1395 })
]);
const LEVEL_10_ARENA_CONFIG = Object.freeze({
  leftWallX: 90,
  rightWallX: 870,
  wallYs: Object.freeze([356, 404, 452]),
  phase3Inset: 95,
  bossX: 610,
  bossY: 392,
  lurePadXs: Object.freeze([200, 760]),
  trapX: 480,
  trapWidth: 88,
  boxX: 410,
  boxY: 420,
  exitDoorX: 965,
  goalX: 1055
});
const LEVEL_10_BOSS_TIMINGS = Object.freeze({
  idleMs: Object.freeze([0, 1350, 1050, 760]),
  warningMs: Object.freeze([0, 1050, 760, 580]),
  comboWarningMs: 520,
  comboPauseMs: 500,
  chargeSpeed: Object.freeze([0, 360, 430, 500]),
  chargeOvershoot: 60,
  chargeMaxMs: 1650,
  recoveryMs: 3400,
  hitReactionMs: 850,
  restoreDelayMs: 120,
  restoreMs: 1000,
  defeatMs: 1500,
  phase3ChargeCount: 2
});
const LEVEL_11_TIMING_WINDOWS = Object.freeze({
  l8FormalWarningMs: 650,
  constrainedWarningMs: Object.freeze([550, 540, 520]),
  constrainedIntervalMs: Object.freeze([2300, 2180, 2050]),
  shortcutWarningMs: Object.freeze([510, 490]),
  shortcutIntervalMs: Object.freeze([1950, 1850])
});
const LEVEL_11_CONSTRAINED_CEILING_Y = 170;
const LEVEL_11_PLATFORM_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'constrained-lift-a', segment: 'constrained-sync',
    axis: 'y', x: 620, y: 455, distance: 120, direction: -1,
    speed: 98, width: 120
  }),
  Object.freeze({
    id: 'constrained-slide-b', segment: 'constrained-sync',
    axis: 'x', x: 900, y: 335, distance: 220, direction: 1,
    speed: 112, width: 130
  }),
  Object.freeze({
    id: 'constrained-lift-c', segment: 'constrained-sync',
    axis: 'y', x: 1310, y: 455, distance: 140, direction: -1,
    speed: 108, width: 120
  }),
  Object.freeze({
    id: 'shortcut-lift-a', segment: 'hidden-shortcut',
    axis: 'y', x: 2380, y: 455, distance: 120, direction: -1,
    speed: 112, width: 120
  }),
  Object.freeze({
    id: 'shortcut-slide-b', segment: 'hidden-shortcut',
    axis: 'x', x: 2670, y: 335, distance: 440, direction: 1,
    speed: 128, width: 140
  })
]);
const LEVEL_11_CANNON_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'constrained-cannon-a', segment: 'constrained-sync',
    x: 820, y: 398, direction: 'left',
    interval: LEVEL_11_TIMING_WINDOWS.constrainedIntervalMs[0],
    phaseOffset: 260,
    warningMs: LEVEL_11_TIMING_WINDOWS.constrainedWarningMs[0],
    speed: 225, maxInstances: 2, sharedClock: true
  }),
  Object.freeze({
    id: 'constrained-cannon-b', segment: 'constrained-sync',
    x: 1180, y: 360, direction: 'right',
    interval: LEVEL_11_TIMING_WINDOWS.constrainedIntervalMs[1],
    phaseOffset: 980,
    warningMs: LEVEL_11_TIMING_WINDOWS.constrainedWarningMs[1],
    speed: 235, maxInstances: 2, sharedClock: true
  }),
  Object.freeze({
    id: 'constrained-cannon-c', segment: 'constrained-sync',
    x: 1530, y: 394, direction: 'left',
    interval: LEVEL_11_TIMING_WINDOWS.constrainedIntervalMs[2],
    phaseOffset: 1480,
    warningMs: LEVEL_11_TIMING_WINDOWS.constrainedWarningMs[2],
    speed: 245, maxInstances: 2, sharedClock: true
  }),
  Object.freeze({
    id: 'shortcut-cannon-a', segment: 'hidden-shortcut',
    x: 2860, y: 390, direction: 'left',
    interval: LEVEL_11_TIMING_WINDOWS.shortcutIntervalMs[0],
    phaseOffset: 220,
    warningMs: LEVEL_11_TIMING_WINDOWS.shortcutWarningMs[0],
    speed: 245, maxInstances: 2, sharedClock: true
  }),
  Object.freeze({
    id: 'shortcut-cannon-b', segment: 'hidden-shortcut',
    x: 3820, y: 286, direction: 'left',
    interval: LEVEL_11_TIMING_WINDOWS.shortcutIntervalMs[1],
    phaseOffset: 920,
    warningMs: LEVEL_11_TIMING_WINDOWS.shortcutWarningMs[1],
    speed: 258, maxInstances: 2, sharedClock: true
  })
]);
const LEVEL_11_BRANCH_CONFIG = Object.freeze({
  checkpointX: 2040,
  checkpointY: 437,
  checkpointSpawnX: 2070,
  checkpointSpawnY: 425,
  shortcutEntryX: 2260,
  shortcutRecoveryLeft: 2260,
  shortcutRecoveryRight: 4260,
  mergeX: 4660,
  collectibleX: 3820,
  collectibleY: 246
});
const LEVEL_11_FOG_CONFIG = Object.freeze({
  startX: 2460,
  endX: 4140,
  topY: 292,
  bottomY: 478,
  alpha: 0.78,
  driftX: 34,
  driftDurationMs: 2400
});
const LEVEL_12_COLLECTIBLE_ID = 'world2-graduation-keepsake';
const LEVEL_12_SEGMENT_BOUNDS = Object.freeze([
  Object.freeze({ id: 'sequence', startX: 0, endX: 1800 }),
  Object.freeze({ id: 'synchronization', startX: 1800, endX: 3650 }),
  Object.freeze({ id: 'spatial-restriction', startX: 3650, endX: 5350 }),
  Object.freeze({ id: 'branch-choice', startX: 5350, endX: 7600 })
]);
const LEVEL_12_PLATFORM_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'sequence-slide-a', segment: 'sequence',
    axis: 'x', x: 470, y: 430, distance: 180, direction: 1,
    speed: 92, width: 120
  }),
  Object.freeze({
    id: 'sequence-lift-b', segment: 'sequence',
    axis: 'y', x: 850, y: 430, distance: 125, direction: -1,
    speed: 108, width: 116
  }),
  Object.freeze({
    id: 'sequence-slide-c', segment: 'sequence',
    axis: 'x', x: 1080, y: 295, distance: 230, direction: 1,
    speed: 124, width: 112
  }),
  Object.freeze({
    id: 'sequence-lift-d', segment: 'sequence',
    axis: 'y', x: 1510, y: 425, distance: 140, direction: -1,
    speed: 136, width: 108
  }),
  Object.freeze({
    id: 'sync-slide-a', segment: 'synchronization',
    axis: 'x', x: 2080, y: 425, distance: 300, direction: 1,
    speed: 132, width: 116
  }),
  Object.freeze({
    id: 'sync-lift-b', segment: 'synchronization',
    axis: 'y', x: 2810, y: 455, distance: 180, direction: -1,
    speed: 126, width: 110
  }),
  Object.freeze({
    id: 'sync-slide-c', segment: 'synchronization',
    axis: 'x', x: 3190, y: 300, distance: 260, direction: 1,
    speed: 142, width: 106
  }),
  Object.freeze({
    id: 'narrow-slide', segment: 'spatial-restriction',
    axis: 'x', x: 3920, y: 420, distance: 300, direction: 1,
    speed: 132, width: 110
  }),
  Object.freeze({
    id: 'narrow-lift', segment: 'spatial-restriction',
    axis: 'y', x: 4840, y: 425, distance: 118, direction: -1,
    speed: 122, width: 108
  }),
  Object.freeze({
    id: 'safe-slide', segment: 'branch-safe',
    axis: 'x', x: 5680, y: 425, distance: 250, direction: 1,
    speed: 104, width: 126
  }),
  Object.freeze({
    id: 'safe-lift', segment: 'branch-safe',
    axis: 'y', x: 6360, y: 425, distance: 105, direction: -1,
    speed: 104, width: 120
  }),
  Object.freeze({
    id: 'shortcut-slide-a', segment: 'branch-shortcut',
    axis: 'x', x: 5580, y: 270, distance: 260, direction: 1,
    speed: 142, width: 104
  }),
  Object.freeze({
    id: 'shortcut-slide-b', segment: 'branch-shortcut',
    axis: 'x', x: 6110, y: 230, distance: 230, direction: -1,
    speed: 152, width: 100
  }),
  Object.freeze({
    id: 'shortcut-lift-c', segment: 'branch-shortcut',
    axis: 'y', x: 6600, y: 305, distance: 110, direction: -1,
    speed: 132, width: 100
  })
]);
const LEVEL_12_CANNON_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'sync-cannon-a', segment: 'synchronization',
    x: 2550, y: 382, direction: 'left',
    interval: 1800, phaseOffset: 320, warningMs: 480,
    speed: 255, maxInstances: 2, sharedClock: true
  }),
  Object.freeze({
    id: 'sync-cannon-b', segment: 'synchronization',
    x: 3500, y: 275, direction: 'left',
    interval: 1720, phaseOffset: 1030, warningMs: 460,
    speed: 265, maxInstances: 2, sharedClock: true
  }),
  Object.freeze({
    id: 'narrow-cannon', segment: 'spatial-restriction',
    x: 5100, y: 430, direction: 'left',
    interval: 1900, phaseOffset: 640, warningMs: 480,
    speed: 255, maxInstances: 2, sharedClock: true
  }),
  Object.freeze({
    id: 'safe-cannon', segment: 'branch-safe',
    x: 6860, y: 430, direction: 'left',
    interval: 2800, phaseOffset: 820, warningMs: 620,
    speed: 220, maxInstances: 1
  }),
  Object.freeze({
    id: 'shortcut-cannon', segment: 'branch-shortcut',
    x: 6880, y: 175, direction: 'left',
    interval: 1650, phaseOffset: 510, warningMs: 430,
    speed: 270, maxInstances: 2, sharedClock: true
  })
]);
const LEVEL_12_ALTERNATING_SPIKE_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'sync-spike-pair', segment: 'synchronization',
    floorX: 2680, ceilingX: 2910,
    floorSurfaceY: 470, ceilingSurfaceY: 255,
    periodMs: 2140, warningMs: 520, transitionMs: 250,
    phaseOffset: 180
  }),
  Object.freeze({
    id: 'safe-spike-pair', segment: 'branch-safe',
    floorX: 6080, ceilingX: 6320,
    floorSurfaceY: 470, ceilingSurfaceY: 300,
    periodMs: 2260, warningMs: 540, transitionMs: 260,
    phaseOffset: 760
  })
]);
const LEVEL_12_CHECKPOINT_CONFIGS = Object.freeze([
  Object.freeze({ id: 'after-sequence', x: 1740, y: 437, spawnX: 1740, spawnY: 425 }),
  Object.freeze({ id: 'after-sync', x: 3590, y: 437, spawnX: 3590, spawnY: 425 }),
  Object.freeze({ id: 'after-narrow', x: 5290, y: 437, spawnX: 5290, spawnY: 425 })
]);
const LEVEL_13_PLATFORM_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'farewell-slide', segment: 'world2-farewell',
    axis: 'x', x: 620, y: 455, distance: 240, direction: 1,
    speed: 58, width: 170
  }),
  Object.freeze({
    id: 'farewell-lift', segment: 'world2-farewell',
    axis: 'y', x: 2050, y: 455, distance: 92, direction: -1,
    speed: 52, width: 180
  })
]);
const LEVEL_13_CANNON_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'farewell-cannon-a', segment: 'world2-farewell',
    x: 1210, y: 420, direction: 'left',
    interval: 4400, phaseOffset: 1550, warningMs: 900,
    speed: 160, maxInstances: 1
  }),
  Object.freeze({
    id: 'farewell-cannon-b', segment: 'world2-farewell',
    x: 2350, y: 410, direction: 'left',
    interval: 4600, phaseOffset: 1900, warningMs: 920,
    speed: 155, maxInstances: 1
  })
]);
const LEVEL_13_CHECKPOINT_CONFIGS = Object.freeze([
  Object.freeze({ id: 'after-farewell', x: 2850, y: 437, spawnX: 2850, spawnY: 425 }),
  Object.freeze({ id: 'after-transition', x: 5050, y: 437, spawnX: 5050, spawnY: 425 })
]);
const LEVEL_13_TRANSITION_CONFIG = Object.freeze({
  startX: 2850,
  endX: 5200,
  musicSwitchX: 3820,
  fogEndAlpha: 0.08,
  glintMaxAlpha: 0.62,
  mirrorStartX: 3300,
  mirrorEndX: 5600,
  mudPickupX: 5660,
  mudPickupY: 466,
  goalX: 6220
});
const LEVEL_14_PLATFORM_CONFIGS = Object.freeze([
  Object.freeze({ id: 'garden-entry', x: 400, y: 505, width: 800, height: 70 }),
  Object.freeze({ id: 'mirror-bridge', x: 900, y: 470, width: 220, height: 24 }),
  Object.freeze({ id: 'garden-center', x: 1400, y: 505, width: 800, height: 70 }),
  Object.freeze({ id: 'reflection-step', x: 1500, y: 425, width: 280, height: 24 }),
  Object.freeze({ id: 'garden-walk', x: 2200, y: 505, width: 800, height: 70 }),
  Object.freeze({ id: 'shrine-approach', x: 3000, y: 505, width: 1200, height: 70 })
]);
const LEVEL_14_SPIKE_POSITIONS = Object.freeze([680, 1260, 2220]);
const LEVEL_14_CHECKPOINT_CONFIG = Object.freeze({
  x: 1860,
  y: 437,
  spawnX: 1860,
  spawnY: 425
});
const LEVEL_14_MIRROR_POOL_CONFIG = Object.freeze({
  x: 3340,
  surfaceY: 458,
  triggerWidth: 150,
  triggerHeight: 112,
  companionRestX: 3286,
  companionRestY: 456,
  setDownMs: 380,
  silhouetteMs: 720
});
const MUD_COMPANION_SEPARATED_ID = 'mud-companion-separated';
const MUD_COMPANION_REUNITED_ID = 'mud-companion-reunited';
const MUD_COMPANION_FAREWELL_ID = 'mud-companion-farewell';
const TELEPORT_JAR_COOLDOWN_MS = 520;
const TELEPORT_JAR_ENTRY_MS = 240;
const TELEPORT_JAR_TRAVEL_MS = 340;
const TELEPORT_JAR_EXIT_MS = 220;
const WIND_VORTEX_PUSH = 9;
const WIND_VORTEX_MAX_SPEED = 245;
const LEVEL_13_WIND_VORTEX_CONFIGS = Object.freeze([
  Object.freeze({ x: 3300, y: 400, width: 420, height: 180, direction: 1 })
]);
const LEVEL_14_TELEPORT_JAR_PAIRS = Object.freeze([
  Object.freeze({
    first: Object.freeze({ x: 1600, y: 445, direction: 1 }),
    second: Object.freeze({ x: 2050, y: 445, direction: 1 })
  })
]);
const LEVEL_16_TELEPORT_JAR_PAIRS = Object.freeze([
  Object.freeze({
    first: Object.freeze({ x: 4900, y: 445, direction: 1 }),
    second: Object.freeze({ x: 4600, y: -200, direction: 1 })
  })
]);
const LEVEL_16_WIND_VORTEX_CONFIGS = Object.freeze([
  Object.freeze({ x: 5480, y: 400, width: 420, height: 180, direction: 1 })
]);
const LEVEL_15_PLATFORM_CONFIGS = Object.freeze([
  Object.freeze({ id: 'paired-entry-slide', axis: 'x', x: 680, y: 430, distance: 250, direction: 1, speed: 104, width: 130 }),
  Object.freeze({ id: 'paired-entry-lift', axis: 'y', x: 1420, y: 455, distance: 150, direction: -1, speed: 112, width: 124 }),
  Object.freeze({ id: 'split-exit-lift', axis: 'y', x: 3500, y: 455, distance: 165, direction: -1, speed: 122, width: 116 }),
  Object.freeze({ id: 'split-exit-slide', axis: 'x', x: 3930, y: 320, distance: 330, direction: 1, speed: 132, width: 112 }),
  Object.freeze({ id: 'final-mirror-lift', axis: 'y', x: 4930, y: 455, distance: 170, direction: -1, speed: 128, width: 108 }),
  Object.freeze({ id: 'final-crate-ferry', axis: 'x', x: 5575, y: 479, distance: 60, direction: 1, speed: 48, width: 80 })
]);
const LEVEL_15_CANNON_CONFIGS = Object.freeze([
  Object.freeze({ id: 'entry-cannon', x: 1100, y: 388, direction: 'left', interval: 2250, phaseOffset: 420, warningMs: 560, speed: 230, maxInstances: 2, sharedClock: true }),
  Object.freeze({ id: 'pre-split-cannon', x: 2420, y: 410, direction: 'left', interval: 2050, phaseOffset: 1080, warningMs: 520, speed: 242, maxInstances: 2, sharedClock: true }),
  Object.freeze({ id: 'post-split-cannon', x: 4380, y: 280, direction: 'left', interval: 1920, phaseOffset: 650, warningMs: 500, speed: 250, maxInstances: 2, sharedClock: true }),
  Object.freeze({ id: 'final-cannon', x: 5750, y: 410, direction: 'left', interval: 1850, phaseOffset: 1220, warningMs: 480, speed: 258, maxInstances: 2, sharedClock: true })
]);
const LEVEL_15_ALTERNATING_SPIKES = Object.freeze([
  Object.freeze({ id: 'pre-split-pair', floorX: 2050, ceilingX: 2250, floorSurfaceY: 470, ceilingSurfaceY: 300, ceilingRevealY: 313, showCeilingHousing: false, periodMs: 2200, warningMs: 520, transitionMs: 250, phaseOffset: 200 }),
  Object.freeze({ id: 'post-split-pair', floorX: 4550, ceilingX: 4740, floorSurfaceY: 470, ceilingSurfaceY: 285, ceilingRevealY: 298, showCeilingHousing: false, periodMs: 1980, warningMs: 470, transitionMs: 235, phaseOffset: 760 })
]);
const LEVEL_15_CHECKPOINTS = Object.freeze([
  Object.freeze({ x: 2580, y: 437, spawnX: 2580, spawnY: 425 }),
  Object.freeze({ x: 4720, y: 437, spawnX: 4720, spawnY: 425 })
]);
const LEVEL_15_SEPARATION_CONFIG = Object.freeze({
  triggerX: 2920,
  triggerY: 270,
  captureX: 2760,
  captureY: 448,
  rackStartY: -110,
  rackExitY: -150,
  setDownMs: 620,
  rackDropMs: 520,
  clampHoldMs: 260,
  rackLiftMs: 720,
  questionMs: 1650
});
const LEVEL_16_PLATFORM_CONFIGS = Object.freeze([
  Object.freeze({ id: 'reverse-a', axis: 'x', x: 620, y: 430, distance: 300, direction: 1, speed: 128, width: 116 }),
  Object.freeze({ id: 'reverse-b', axis: 'x', x: 1180, y: 330, distance: 300, direction: -1, speed: 128, width: 116 }),
  Object.freeze({ id: 'lift-a', axis: 'y', x: 2280, y: 455, distance: 175, direction: -1, speed: 132, width: 110 }),
  Object.freeze({ id: 'slide-b', axis: 'x', x: 2770, y: 300, distance: 360, direction: 1, speed: 145, width: 106 }),
  Object.freeze({ id: 'narrow-lift', axis: 'y', x: 4240, y: 455, distance: 190, direction: -1, speed: 142, width: 104 }),
  Object.freeze({ id: 'final-slide', axis: 'x', x: 5140, y: 300, distance: 420, direction: 1, speed: 152, width: 100 }),
  Object.freeze({ id: 'final-crate-ferry', axis: 'x', x: 6490, y: 479, distance: 50, direction: 1, speed: 48, width: 80 })
]);
const LEVEL_16_CANNON_CONFIGS = Object.freeze([
  Object.freeze({ id: 'reverse-cannon-a', x: 1040, y: 390, direction: 'left', interval: 1900, phaseOffset: 260, warningMs: 480, speed: 250, maxInstances: 2, sharedClock: true }),
  Object.freeze({ id: 'reverse-cannon-b', x: 1600, y: 250, direction: 'left', interval: 1820, phaseOffset: 910, warningMs: 460, speed: 258, maxInstances: 2, sharedClock: true }),
  Object.freeze({ id: 'center-cannon', x: 3350, y: 410, direction: 'left', interval: 1750, phaseOffset: 530, warningMs: 440, speed: 265, maxInstances: 2, sharedClock: true }),
  Object.freeze({ id: 'narrow-cannon', x: 4850, y: 231, direction: 'left', interval: 1680, phaseOffset: 1120, warningMs: 430, speed: 270, maxInstances: 2, sharedClock: true }),
  Object.freeze({ id: 'final-cannon', x: 6300, y: 410, direction: 'left', interval: 1620, phaseOffset: 740, warningMs: 420, speed: 276, maxInstances: 2, sharedClock: true })
]);
const LEVEL_16_ALTERNATING_SPIKES = Object.freeze([
  Object.freeze({ id: 'reverse-pair', floorX: 1450, ceilingX: 1620, floorSurfaceY: 470, ceilingSurfaceY: 285, ceilingRevealY: 298, showCeilingHousing: false, periodMs: 1900, warningMs: 450, transitionMs: 225, phaseOffset: 180 }),
  Object.freeze({ id: 'center-pair', floorX: 3150, ceilingX: 3340, floorSurfaceY: 470, ceilingSurfaceY: 280, ceilingRevealY: 293, showCeilingHousing: false, periodMs: 1820, warningMs: 430, transitionMs: 220, phaseOffset: 620 }),
  Object.freeze({ id: 'final-pair', floorX: 5660, ceilingX: 5860, floorSurfaceY: 470, ceilingSurfaceY: 280, ceilingRevealY: 293, showCeilingHousing: false, periodMs: 1740, warningMs: 410, transitionMs: 210, phaseOffset: 980 })
]);
const LEVEL_16_CHECKPOINTS = Object.freeze([
  Object.freeze({ x: 2100, y: 437, spawnX: 2100, spawnY: 425 }),
  Object.freeze({ x: 5000, y: 437, spawnX: 5000, spawnY: 425 })
]);
const LEVEL_16_VERTICAL_TRIAL = Object.freeze({
  fixedPlatforms: Object.freeze([
    Object.freeze([1500, 90, 280, 26]),
    Object.freeze([1760, 10, 180, 26]),
    Object.freeze([2050, -80, 300, 26]),
    Object.freeze([2550, -300, 320, 26]),
    Object.freeze([3400, -300, 440, 26]),
    Object.freeze([4100, -150, 320, 26]),
    Object.freeze([4600, -140, 360, 26]),
    Object.freeze([4900, -70, 160, 26]),
    Object.freeze([5200, -40, 300, 26]),
    Object.freeze([5650, 120, 280, 26])
  ]),
  ladders: Object.freeze([
    Object.freeze({ id: 'trial-entry-ladder', x: 1500, y: 188, height: 220 }),
    Object.freeze({ id: 'trial-return-ladder', x: 4100, y: -225, height: 170 })
  ]),
  springs: Object.freeze([
    Object.freeze({ id: 'trial-upper-spring', x: 2050, y: -104, launchVelocity: 760, cooldownMs: 260 })
  ]),
  movingPlatforms: Object.freeze([
    Object.freeze({ id: 'trial-upper-slide', axis: 'x', x: 2780, y: -300, distance: 330, direction: 1, speed: 112, width: 118 }),
    Object.freeze({ id: 'trial-upper-lift', axis: 'y', x: 3850, y: -120, distance: 180, direction: -1, speed: 104, width: 116 })
  ])
});
const LEVEL_17_SPRING_CONFIG = Object.freeze({
  id: 'first-checkpoint-step-assist',
  x: 1950,
  y: 456,
  launchVelocity: 720,
  direction: 'up',
  cooldownMs: 260,
  initialDelay: 0
});
const LEVEL_17_FALLING_PLATFORM_CONFIGS = Object.freeze([
  Object.freeze({ x: 2360, y: 110 }),
  Object.freeze({ x: 2510, y: 35 }),
  Object.freeze({ x: 2670, y: -45 }),
  Object.freeze({ x: 2840, y: -120 }),
  Object.freeze({ x: 3020, y: -195 }),
  Object.freeze({ x: 3200, y: -260 })
]);
const LEVEL_17_VERTICAL_TRIAL = Object.freeze({
  fixedPlatforms: Object.freeze([
    Object.freeze([2050, 145, 260, 26]),
    Object.freeze([3400, -285, 420, 26]),
    Object.freeze([4140, -285, 360, 26]),
    Object.freeze([5100, -245, 560, 26])
  ]),
  ladders: Object.freeze([
    Object.freeze({ id: 'mud-trail-ladder', x: 2050, y: 225, height: 190 })
  ])
});
const LEVEL_17_CANNON_CONFIG = Object.freeze({
  id: 'trail-ferry-cannon',
  x: 4420,
  y: 395,
  direction: 'left',
  interval: 2700,
  phaseOffset: 700,
  warningMs: 650,
  speed: 215,
  maxInstances: 1
});
const LEVEL_18_PLATFORM_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'floor-1-ladder-transfer',
    axis: 'x',
    x: 340,
    y: 250,
    distance: 300,
    direction: 1,
    speed: 110,
    width: 130
  }),
  Object.freeze({
    id: 'floor-3-cannon-lift',
    axis: 'y',
    x: 620,
    y: -441,
    distance: 330,
    direction: -1,
    speed: 110,
    width: 110
  }),
  Object.freeze({
    id: 'floor-4-wind-transfer',
    axis: 'x',
    x: 300,
    y: -1120,
    distance: 480,
    direction: 1,
    speed: 122,
    width: 110
  }),
  Object.freeze({
    id: 'floor-6-final-transfer',
    axis: 'x',
    x: 470,
    y: -2240,
    distance: 330,
    direction: 1,
    speed: 126,
    width: 105
  })
]);
const LEVEL_18_FIXED_PLATFORM_CONFIGS = Object.freeze([
  Object.freeze([180, 505, 360, 70]),
  Object.freeze([790, 15, 200, 30]),
  Object.freeze([620, -130, 200, 30]),
  Object.freeze([240, -335, 180, 30]),
  Object.freeze([820, -435, 180, 30]),
  Object.freeze([380, -650, 30, 400]),
  Object.freeze([950, -650, 30, 400]),
  Object.freeze([620, -885, 180, 30]),
  Object.freeze([400, -1040, 180, 30]),
  Object.freeze([900, -1210, 180, 30]),
  Object.freeze([900, -1360, 180, 30]),
  Object.freeze([650, -1510, 650, 30]),
  Object.freeze([900, -1645, 180, 30]),
  Object.freeze([390, -1905, 180, 30]),
  Object.freeze([520, -2045, 150, 30]),
  Object.freeze([760, -2170, 170, 30]),
  Object.freeze([940, -2240, 180, 30]),
  Object.freeze([650, -2445, 620, 30])
]);
const LEVEL_18_LADDER_CONFIGS = Object.freeze([
  Object.freeze({ id: 'floor-1-entry', x: 250, y: 360, height: 220 }),
  Object.freeze({ id: 'floor-1-exit', x: 790, y: 135, height: 270 }),
  Object.freeze({ id: 'floor-3-exit', x: 620, y: -827.5, height: 145 })
]);
const LEVEL_18_SPRING_CONFIGS = Object.freeze([
  Object.freeze({ id: 'floor-2-entry', x: 790, y: -14, launchVelocity: 680, cooldownMs: 230 }),
  Object.freeze({ id: 'floor-4-entry', x: 620, y: -914, launchVelocity: 700, cooldownMs: 230 }),
  Object.freeze({ id: 'floor-4-chain-a', x: 930, y: -1239, launchVelocity: 680, cooldownMs: 230 }),
  Object.freeze({ id: 'floor-5-chain-b', x: 900, y: -1389, launchVelocity: 720, cooldownMs: 230 }),
  Object.freeze({ id: 'floor-6-wind-chain-a', x: 390, y: -1934, launchVelocity: 700, cooldownMs: 230 }),
  Object.freeze({ id: 'floor-6-wind-chain-b', x: 520, y: -2074, launchVelocity: 700, cooldownMs: 230 }),
  Object.freeze({ id: 'floor-6-final', x: 940, y: -2269, launchVelocity: 730, cooldownMs: 230 })
]);
const LEVEL_18_CLOUD_CONFIGS = Object.freeze([
  Object.freeze({ x: 500, y: -220 }),
  Object.freeze({ x: 360, y: -285 }),
  Object.freeze({ x: 760, y: -1740 }),
  Object.freeze({ x: 590, y: -1825 }),
  Object.freeze({ x: 800, y: -2350 })
]);
const LEVEL_18_TELEPORT_JAR_PAIRS = Object.freeze([
  Object.freeze([
    Object.freeze({ x: 240, y: -386, direction: 1 }),
    Object.freeze({ x: 820, y: -486, direction: -1 })
  ]),
  Object.freeze([
    Object.freeze({ x: 380, y: -1561, direction: 1 }),
    Object.freeze({ x: 900, y: -1696, direction: -1 })
  ])
]);
const LEVEL_18_WIND_VORTEX_CONFIGS = Object.freeze([
  Object.freeze({ x: 620, y: -1120, width: 700, height: 240, direction: 1 }),
  Object.freeze({ x: 540, y: -2050, width: 560, height: 260, direction: 1 }),
  Object.freeze({ x: 700, y: -2280, width: 720, height: 160, direction: -1 })
]);
const LEVEL_18_CANNON_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'floor-3-shaft-cannon',
    x: 880, y: -620, direction: 'left',
    interval: 2500, phaseOffset: 620, warningMs: 580,
    speed: 230, maxInstances: 2
  }),
  Object.freeze({
    id: 'floor-5-cloud-cannon',
    x: 1030, y: -1780, direction: 'left',
    interval: 2100, phaseOffset: 360, warningMs: 520,
    speed: 245, maxInstances: 2
  }),
  Object.freeze({
    id: 'floor-6-final-cannon',
    x: 1040, y: -2320, direction: 'left',
    interval: 1900, phaseOffset: 820, warningMs: 500,
    speed: 250, maxInstances: 2
  })
]);
const LEVEL_18_SPIKE_CONFIGS = Object.freeze([
  Object.freeze({ id: 'floor-6-spring-guard', x: 1010, y: -2259 })
]);
const LEVEL_18_MOVING_SPIKE_CONFIGS = Object.freeze([
  Object.freeze({ carrierId: 'floor-1-ladder-transfer', offsetX: 40, offsetY: -13 }),
  Object.freeze({ carrierId: 'floor-3-cannon-lift', offsetX: 36, offsetY: -13 }),
  Object.freeze({ carrierId: 'floor-4-wind-transfer', offsetX: -38, offsetY: -13 }),
  Object.freeze({ carrierId: 'floor-6-final-transfer', offsetX: -36, offsetY: -13 })
]);
const LEVEL_18_ALTERNATING_SPIKE_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'floor-5-alternating-corridor',
    floorX: 550,
    ceilingX: 740,
    floorSurfaceY: -1525,
    ceilingSurfaceY: -1660,
    ceilingRevealY: -1647,
    showCeilingHousing: false,
    periodMs: 2000,
    warningMs: 520,
    transitionMs: 260,
    phaseOffset: 350
  })
]);
const LEVEL_18_CHECKPOINT_CONFIGS = Object.freeze([
  Object.freeze({ id: 'after-floor-2', x: 750, y: -483, spawnX: 750, spawnY: -495 }),
  Object.freeze({ id: 'after-floor-4', x: 835, y: -1408, spawnX: 835, spawnY: -1420 }),
  Object.freeze({ id: 'after-floor-5', x: 320, y: -1953, spawnX: 320, spawnY: -1965 })
]);
const LEVEL_18_REUNION_CONFIG = Object.freeze({
  companionX: 650,
  companionY: -2468,
  zoneX: 650,
  zoneY: -2502,
  goalX: 920,
  goalY: -2493
});
const LEVEL_19_FIXED_PLATFORM_CONFIGS = Object.freeze([
  Object.freeze([220, 505, 440, 70]),
  Object.freeze([430, 300, 180, 30]),
  Object.freeze([700, 95, 180, 30]),
  Object.freeze([730, -120, 600, 30]),
  Object.freeze([930, -391, 160, 30]),
  Object.freeze([280, -350, 220, 30]),
  Object.freeze([280, -580, 220, 30]),
  Object.freeze([560, -800, 240, 30]),
  Object.freeze([900, -980, 180, 30]),
  Object.freeze([650, -1190, 700, 30]),
  Object.freeze([280, -1400, 180, 30]),
  Object.freeze([560, -1600, 260, 30]),
  Object.freeze([620, -2020, 180, 30]),
  Object.freeze([300, -2240, 180, 30]),
  Object.freeze([650, -2480, 700, 30]),
  // Floor-textured walls keep the tower narrow without introducing a new wall system.
  Object.freeze([25, -1000, 50, 3100]),
  Object.freeze([1095, -1000, 50, 3100]),
  Object.freeze([520, -520, 30, 600])
]);
const LEVEL_19_PLATFORM_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'floor-3-wind-carrier', axis: 'x', x: 560, y: -900,
    distance: 300, direction: 1, speed: 128, width: 112
  }),
  Object.freeze({
    id: 'floor-5-cannon-lift', axis: 'y', x: 560, y: -1640,
    distance: 300, direction: -1, speed: 128, width: 108
  })
]);
const LEVEL_19_SPRING_CONFIGS = Object.freeze([
  Object.freeze({ id: 'opening-a', x: 250, y: 456, launchVelocity: 740, cooldownMs: 230 }),
  Object.freeze({ id: 'opening-b', x: 430, y: 271, launchVelocity: 740, cooldownMs: 230 }),
  Object.freeze({ id: 'opening-c', x: 700, y: 66, launchVelocity: 750, cooldownMs: 230 }),
  Object.freeze({ id: 'safe-route-a', x: 450, y: -149, launchVelocity: 720, cooldownMs: 240 }),
  Object.freeze({ id: 'safe-route-b', x: 280, y: -379, launchVelocity: 720, cooldownMs: 240 }),
  Object.freeze({ id: 'safe-route-merge', x: 280, y: -609, launchVelocity: 735, cooldownMs: 240 }),
  Object.freeze({ id: 'floor-3-reverse', x: 900, y: -1009, launchVelocity: 735, cooldownMs: 230 }),
  Object.freeze({ id: 'floor-6-wind', x: 620, y: -2049, launchVelocity: 735, cooldownMs: 230 }),
  Object.freeze({ id: 'floor-6-final', x: 300, y: -2269, launchVelocity: 745, cooldownMs: 230 })
]);
const LEVEL_19_CLOUD_CONFIGS = Object.freeze([
  Object.freeze({ x: 850, y: -500 }),
  Object.freeze({ x: 760, y: -610 }),
  Object.freeze({ x: 670, y: -710 }),
  Object.freeze({ x: 430, y: -1510 }),
  Object.freeze({ x: 470, y: -2355 })
]);
const LEVEL_19_TELEPORT_JAR_PAIRS = Object.freeze([
  Object.freeze([
    Object.freeze({ x: 930, y: -171, direction: -1 }),
    Object.freeze({ x: 930, y: -431, direction: -1 })
  ]),
  Object.freeze([
    Object.freeze({ x: 930, y: -1241, direction: -1 }),
    Object.freeze({ x: 280, y: -1451, direction: 1 })
  ])
]);
const LEVEL_19_WIND_VORTEX_CONFIGS = Object.freeze([
  Object.freeze({ x: 820, y: -590, width: 520, height: 500, direction: -1 }),
  Object.freeze({ x: 710, y: -920, width: 660, height: 220, direction: 1 }),
  Object.freeze({ x: 700, y: -1110, width: 660, height: 180, direction: -1 }),
  Object.freeze({ x: 470, y: -2160, width: 560, height: 180, direction: -1 }),
  Object.freeze({ x: 430, y: -2350, width: 480, height: 180, direction: 1 })
]);
const LEVEL_19_CANNON_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'shortcut-cloud-cannon', x: 1030, y: -630, direction: 'left',
    interval: 2050, phaseOffset: 300, warningMs: 500, speed: 250, maxInstances: 2
  }),
  Object.freeze({
    id: 'teleport-cloud-cannon', x: 1030, y: -1510, direction: 'left',
    interval: 1900, phaseOffset: 760, warningMs: 470, speed: 260, maxInstances: 2
  }),
  Object.freeze({
    id: 'lift-cannon', x: 1030, y: -1810, direction: 'left',
    interval: 1750, phaseOffset: 420, warningMs: 440, speed: 268, maxInstances: 2
  }),
  Object.freeze({
    id: 'final-wind-cannon', x: 1030, y: -2350, direction: 'left',
    interval: 1650, phaseOffset: 940, warningMs: 430, speed: 272, maxInstances: 2
  })
]);
const LEVEL_19_SPIKE_CONFIGS = Object.freeze([
  Object.freeze({ id: 'floor-3-landing', x: 965, y: -999 }),
  Object.freeze({ id: 'final-landing', x: 375, y: -2259 })
]);
const LEVEL_19_MOVING_SPIKE_CONFIGS = Object.freeze([
  Object.freeze({ carrierId: 'floor-5-cannon-lift', offsetX: 36, offsetY: -13 })
]);
const LEVEL_19_ALTERNATING_SPIKE_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'floor-4-teleport-corridor',
    floorX: 520, ceilingX: 760,
    floorSurfaceY: -1205, ceilingSurfaceY: -1340,
    ceilingRevealY: -1327, showCeilingHousing: false,
    periodMs: 1900, warningMs: 460, transitionMs: 230, phaseOffset: 520
  })
]);
const LEVEL_19_CHECKPOINT_CONFIGS = Object.freeze([
  Object.freeze({ id: 'branch', x: 730, y: -168, spawnX: 730, spawnY: -180 }),
  Object.freeze({ id: 'merge', x: 560, y: -848, spawnX: 560, spawnY: -860 }),
  Object.freeze({ id: 'after-teleport', x: 430, y: -1648, spawnX: 430, spawnY: -1660 }),
  Object.freeze({ id: 'after-lift', x: 620, y: -2068, spawnX: 620, spawnY: -2080 })
]);
const LEVEL_19_GOAL_CONFIG = Object.freeze({ x: 900, y: -2528 });
const LEVEL_20_FIXED_PLATFORM_CONFIGS = Object.freeze([
  Object.freeze([600, 505, 1200, 70]),
  Object.freeze([1900, 505, 1300, 70]),
  Object.freeze([1700, 280, 440, 30]),
  Object.freeze([2100, 50, 400, 30]),
  Object.freeze([2600, -430, 400, 30]),
  Object.freeze([3500, -560, 260, 30]),
  Object.freeze([4200, -850, 300, 30]),
  Object.freeze([4750, 300, 300, 30]),
  Object.freeze([5650, 300, 500, 30]),
  Object.freeze([3200, 300, 400, 30]),
  Object.freeze([2700, 300, 700, 30])
]);
const LEVEL_20_WALL_CONFIGS = Object.freeze([
  // The first divider leaves one upper-gallery opening and one return opening.
  Object.freeze([2550, -925, 48, 650]),
  Object.freeze([2550, -125, 48, 550]),
  Object.freeze([2550, 435, 48, 210]),
  // The far divider can only be crossed outward by teleporting; the lower
  // opening carries the player back into the return room.
  Object.freeze([4400, -550, 48, 1400]),
  Object.freeze([4400, 435, 48, 210])
]);
const LEVEL_20_PLATFORM_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'ascent-lift', axis: 'y', x: 2300, y: 46,
    distance: 400, direction: -1, speed: 112, width: 112
  }),
  Object.freeze({
    id: 'upper-wind-carrier', axis: 'x', x: 2700, y: -500,
    distance: 700, direction: 1, speed: 126, width: 120
  }),
  Object.freeze({
    id: 'return-carrier', axis: 'x', x: 4150, y: 296,
    distance: 750, direction: -1, speed: 132, width: 120
  }),
  Object.freeze({
    id: 'right-room-carrier', axis: 'x', x: 5320, y: 296,
    distance: 350, direction: -1, speed: 112, width: 126
  })
]);
const LEVEL_20_SPRING_CONFIGS = Object.freeze([
  Object.freeze({ id: 'ground-rise', x: 1500, y: 456, launchVelocity: 720, cooldownMs: 240 })
]);
const LEVEL_20_LADDER_CONFIGS = Object.freeze([
  Object.freeze({ id: 'ascent-room-ladder', x: 1900, y: 150, width: 48, height: 230 })
]);
const LEVEL_20_CLOUD_CONFIGS = Object.freeze([
  Object.freeze({ x: 3770, y: -620 }),
  Object.freeze({ x: 3990, y: -738 })
]);
const LEVEL_20_EARLY_FALLING_PLATFORM_CONFIGS = Object.freeze([
  Object.freeze({ x: 1375, y: 390 })
]);
const LEVEL_20_SPIKE_CONFIGS = Object.freeze([
  Object.freeze({ x: 1375 }),
  Object.freeze({ x: 1600 })
]);
const LEVEL_20_TELEPORT_JAR_PAIR = Object.freeze([
  Object.freeze({ x: 4300, y: -901, direction: -1 }),
  Object.freeze({ x: 5700, y: 249, direction: -1 })
]);
const LEVEL_20_WIND_VORTEX_CONFIGS = Object.freeze([
  Object.freeze({ x: 3450, y: -650, width: 1700, height: 420, direction: 1 }),
  Object.freeze({ x: 5050, y: 230, width: 1900, height: 180, direction: -1 }),
  Object.freeze({ x: 3750, y: 230, width: 1050, height: 180, direction: -1 })
]);
const LEVEL_20_CANNON_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'ascent-cannon', x: 3180, y: -520, direction: 'left',
    interval: 2100, phaseOffset: 380, warningMs: 520, speed: 252, maxInstances: 2
  }),
  Object.freeze({
    id: 'cloud-cannon', x: 4250, y: -720, direction: 'left',
    interval: 1850, phaseOffset: 820, warningMs: 470, speed: 264, maxInstances: 2
  }),
  Object.freeze({
    id: 'right-return-cannon', x: 4650, y: 230, direction: 'right',
    interval: 2300, phaseOffset: 1180, warningMs: 560, speed: 238, maxInstances: 2
  })
]);
const LEVEL_20_MOVING_SPIKE_CONFIGS = Object.freeze([
  Object.freeze({ carrierId: 'upper-wind-carrier', offsetX: -40, offsetY: -13 })
]);
const LEVEL_20_ALTERNATING_SPIKE_CONFIGS = Object.freeze([
  Object.freeze({
    id: 'right-return-room',
    floorX: 5500, ceilingX: 5720,
    floorSurfaceY: 285, ceilingSurfaceY: 120,
    ceilingRevealY: 133, showCeilingHousing: false,
    periodMs: 2200, warningMs: 540, transitionMs: 260, phaseOffset: 120
  }),
  Object.freeze({
    id: 'return-corridor',
    floorX: 2750, ceilingX: 2940,
    floorSurfaceY: 285, ceilingSurfaceY: 120,
    ceilingRevealY: 133, showCeilingHousing: false,
    periodMs: 1850, warningMs: 450, transitionMs: 225, phaseOffset: 460
  })
]);
const LEVEL_20_CHECKPOINT_CONFIGS = Object.freeze([
  Object.freeze({ id: 'after-door', x: 1450, y: 437, spawnX: 1450, spawnY: 425 }),
  Object.freeze({ id: 'upper-deck', x: 2600, y: -478, spawnX: 2600, spawnY: -490 }),
  Object.freeze({ id: 'after-teleport', x: 5600, y: 252, spawnX: 5600, spawnY: 240 }),
  Object.freeze({ id: 'return-corridor', x: 2450, y: 252, spawnX: 2450, spawnY: 240 })
]);
const LEVEL_20_PUZZLE_CONFIG = Object.freeze({
  boxX: 500,
  boxY: 420,
  buttonX: 1000,
  doorX: 1250
});
const LEVEL_20_FINAL_APPROACH_CONFIG = Object.freeze({
  goalX: 1600,
  goalY: 437
});

const ENDING_CINEMATIC_CONFIG = Object.freeze({
  walkY: 470,
  companionY: 452,
  playerX: 280,
  companionX: 200,
  worldPanDistance: 420,
  worldPanMs: 7600,
  worldSlideMs: 820,
  dialogueLeadMs: 1800,
  actorTravelMs: 45000,
  actorTravelDistance: 900,
  cameraLiftMs: 2800,
  endingHoldMs: 4200,
  actorAnimationSpeed: 0.58,
  companionStepMs: 760,
  dialogue: Object.freeze([
    Object.freeze({ speaker: 'mud', text: '就送到这里吧。前面的路，你已经会自己走了。' }),
    Object.freeze({ speaker: 'player', text: '谢谢你陪我走过这么远。' }),
    Object.freeze({ speaker: 'mud', text: '也谢谢你，一次都没有把我忘下。' }),
    Object.freeze({ speaker: 'player', text: '再见，小泥人。以后也要记得回家的路。' })
  ])
});
const LEVEL_12_TIMED_GATE_CONFIG = Object.freeze({
  triggerX: 6480,
  triggerY: 166,
  doorX: 7160,
  doorClosedY: 220,
  doorOpenY: -320,
  durationMs: 6800,
  warningMs: 2200
});
const LEVEL_NARRATIVE_HINTS = Object.freeze({
  1: '蛋仔要找到糖果河源头\n因为蛋蛋太唐了',
  2: '糖箱门廊：箱子不会自己走。推一下吧。',
  3: '焦糖断桥：上游更干了。慢慢走，也会到。',
  4: '软糖节拍桥：节拍乱了。准备好再出发。',
  5: '太妃糖炉廊：火很急。蛋仔不急。',
  6: '薄荷可可轮班厂：尖刺在轮班。等一下也行。',
  7: '棉花糖升降站：梯子慢慢爬，弹簧会自己弹。',
  8: '棉花糖迷雾地带：看不清没关系，先看懂节拍。',
  9: '棉花糖雾塔：五层机关，一层一层来。',
  10: '棉花糖雾灵殿：它冲过来时，机关就是武器。',
  11: '雾潮分岔站：看不清也要选，选了就往前。',
  12: '棉花糖毕业回廊：前面学过的，差不多都来点。'
});
