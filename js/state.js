"use strict";

let player;
let platforms;
let movingPlatform;
let spikes;
let movingPlatformSpikes = [];
let goal;
let cursors;
let jumpKey;
// DOM touch buttons feed the same gameplay input path as the keyboard without
// changing protected player physics or duplicating movement rules.
let touchInput = {
  left: false,
  right: false,
  up: false,
  down: false,
  jump: false,
  jumpJustDown: false
};
let pausedByOrientation = false;
let developerModeActive = false;
let attemptsText;
let deathsText;
let clearPanel;
let jumpGuide;
let movingGuide;
let startHint;
let backdrop;
let boxes;
let pressureButton;
let door;
let doorLink;
let pushHint;
let thirdLevelIntro;
let fourthLevelIntro;
let fifthLevelIntro;
let sixthLevelIntro;
let seventhLevelIntro;
let eighthLevelIntro;
let worldTransitionOverlay;
let fallingPlatforms;
let movingPlatforms;
let ladders;
let smallSprings;
let recoveryZones;
let isClimbing = false;
let activeLadder = null;
let springLaunchPending = false;
let fireCannons = [];
let fireballs;
let fireCannonClockStart = 0;
let alternatingSpikes;
let alternatingSpikeControllers = [];
let alternatingSpikeClockStart = 0;
let checkpoints;
let checkpointSpawns = [];
let activeCheckpointIndex = -1;
let timedTriggerPlatform;
let timedSwitchMeter;
let timedSwitchActive = false;
let timedSwitchEndsAt = 0;
let timedSwitchArmed = true;
let timedSwitchDurationMs = TIMED_SWITCH_DURATION_MS;
let timedSwitchWarningMs = TIMED_SWITCH_WARNING_MS;
let levelLabel;
let currentLevel = 1;
let activeColliders = [];
let boxSpawns = [];
let buttonReleaseUntil = 0;
let buttonPressed = false;
let doorIsOpen = false;
let doorAnimating = false;
let doorClosedX = 920;
let doorClosedY = 360;
let doorOpenY = 145;
let doorSafetyZone = new Phaser.Geom.Rectangle(892, 242, 56, 232);
let level2MovingMin = 1755;
let level2MovingMax = 1875;
let level3MovingMin = 876;
let level3MovingMax = 1020;
let level4MovingMin = 650;
let level4MovingMax = 760;
let previousMovingPlatformX = 0;
let previousBoxPositions = new Map();
let deaths = 0;
let facing = 1;
let isDead = false;
let isCleared = false;
let coyoteUntil = 0;
let jumpBufferUntil = 0;
let jumpsUsed = 0;
let jumpGuideDismissed = false;
let movingGuideDismissed = false;
let highestUnlockedLevel = 1;
let completedLevels = new Set();
let collectedItems = new Set();
// Keeps progress alive for the current tab when localStorage is blocked.
let memoryProgressSave = null;
let preservedSaveFields = {};
let storageWarningIssued = false;
// Null means a language has not been chosen yet; the shell shows the language fork.
let currentLanguage = null;
let isPaused = false;
let isTransitioning = false;
let reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
let masterVolume = AUDIO_CONFIG.defaults.masterVolume;
let musicVolume = AUDIO_CONFIG.defaults.musicVolume;
let sfxVolume = AUDIO_CONFIG.defaults.sfxVolume;
let audioMuted = AUDIO_CONFIG.defaults.muted;
let wasGrounded = true;
let hudGraphics;
let hudProgressDots = [];
let controlsText;
let celebrationLayer = null;
// Level 10 uses one shared state object so its boss, arena trap, and HUD can be
// reset and destroyed through the existing single-Scene lifecycle.
let level10Boss;
let level10BossState = null;
// Level 11 keeps one optional collectible across checkpoint retries within the same attempt.
let level11Collectible;
let level11CollectibleCollected = false;
let level11RouteFog;
let level12Collectible;
let level12BranchZones;
let level12ReviewBubble;
// Level 13 transition visuals and companion references follow the same explicit
// single-Scene cleanup/reset lifecycle as the other late-game presentation objects.
let level13TransitionState = null;
let mudCompanionPickupZone = null;
let mudCompanionPickupVisual = null;
let mudCompanionFollower = null;
let mudCompanionDialogue = null;
let mudCompanionDialogueTimer = null;
let mudCompanionEncounterResolved = false;
// Level 14 owns one short non-interactive mirror-pool ending sequence.
let level14MirrorLandmark = null;
let level14EndingState = 'idle';
let level14EndingTimer = null;
let level15SeparationZone = null;
let level15CaptureRack = null;
let level15QuestionBubble = null;
let level15SeparationTimer = null;
let level15SeparationState = 'carried';
// Late World 3 levels share teleport/wind mechanisms and explicit story-event
// state so reset/transition cleanup remains deterministic.
let teleportJars = null;
let teleportSequenceState = null;
let windVortices = [];
let lateWorld3Decorations = [];
let level18ReunionZone = null;
let level18ReunionState = 'waiting';
let level18ReunionTimer = null;
// Level 20 needs an explicit ordered route state because its outbound and
// return paths occupy overlapping horizontal space.
let level20RoutePhase = 'start';
// The final cinematic is screen-space presentation, but still needs explicit
// shared ownership so every level/menu transition can cancel its timers and tweens.
let endingCinematicState = null;
let levelStoryBubble = null;
// Screen-space presentation state is shared so level cleanup can always cancel
// input listeners and delayed hint removal before the next level starts.
let storyDialogue = null;
let gameplayHintBanner = null;
let gameplayHintTimer = null;
let gameplayHintZones = [];
let levelTitleTimer = null;
