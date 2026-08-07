"use strict";

const WORLD_1_MOBILITY_SKIN = Object.freeze({
  ladder: Object.freeze({
    textureKey: 'ladder',
    rail: 0xa8714f,
    rung: 0xf2c66f,
    outline: 0x704839
  }),
  spring: Object.freeze({
    textureKey: 'small-spring',
    compressedTextureKey: 'small-spring-compressed',
    base: 0xc58a55,
    coil: 0xf2bf69,
    outline: 0x704839
  })
});

const WORLD_1_VISUALS = Object.freeze({
  motifs: Object.freeze({
    trunk: 0x8f654b,
    canopy: 0xb9784d,
    drip: 0xc98a52,
    chapel: 0xa77555,
    chapelDark: 0x795745,
    amberWindow: 0xe4a849
  })
});

const WORLD_2_VISUALS = Object.freeze({
  backdrop: Object.freeze({
    sky: 0xdff4ef,
    horizon: 0xcfe7ef,
    structures: 0xbfd9e3,
    syrup: 0xc5e5e8,
    syrupDark: 0x94c6cf
  }),
  terrain: Object.freeze({
    textureKey: 'ground-world2',
    fill: 0xc7dce5,
    line: 0x91aeb9
  }),
  transitionFrom: 0xffe7c2,
  fog: Object.freeze({
    white: 0xfffdf7,
    blue: 0xd8edf3,
    alphaNear: 0.44,
    alphaFar: 0.30,
    driftNear: 72,
    driftFar: 44,
    durationNearMs: 7600,
    durationFarMs: 10400
  }),
  mechanisms: Object.freeze({
    movingPlatform: Object.freeze({
      textureKey: 'moving-platform-world2',
      fill: 0xb9dfea,
      accent: 0xe9f7f6,
      outline: 0x7eabb9
    }),
    fireCannon: Object.freeze({
      textureKey: 'fire-cannon-world2',
      fill: 0xd8c9ee,
      frosting: 0xf5edf9,
      outline: 0x927fae,
      warningTint: 0xf0bdd8
    }),
    fireball: Object.freeze({
      textureKey: 'fireball-world2',
      fill: 0xe9a9d0,
      core: 0xf7d8ea,
      outline: 0xa776a2
    }),
    ladder: Object.freeze({
      textureKey: 'ladder-world2',
      rail: 0x8eb9c8,
      rung: 0xf5edf9,
      outline: 0x67556e
    }),
    spring: Object.freeze({
      textureKey: 'small-spring-world2',
      compressedTextureKey: 'small-spring-world2-compressed',
      base: 0xb9dfea,
      coil: 0xe9a9d0,
      outline: 0x67556e
    })
  })
});

const WORLD_3_VISUALS = Object.freeze({
  backdrop: Object.freeze({
    sky: 0xfff0f5,
    horizon: 0xf5d9e3,
    structures: 0xe6b9c8,
    syrup: 0xe9c2b6,
    syrupDark: 0xb98482
  }),
  mirror: Object.freeze({
    roseGold: 0xd39a91,
    silver: 0xe8edf0,
    paleRose: 0xf3ccd8,
    outline: 0x785965
  }),
  terrain: Object.freeze({
    textureKey: 'ground-world3',
    fill: 0xe4c3ca,
    accent: 0xf8e8eb,
    line: 0x9a707a
  }),
  mechanisms: Object.freeze({
    movingPlatform: Object.freeze({
      textureKey: 'moving-platform-world3',
      fill: 0xd8a8b2,
      accent: 0xfff5f7,
      outline: 0x785965
    }),
    fallingPlatform: Object.freeze({
      textureKey: 'memory-cloud',
      fill: 0xc79eae,
      accent: 0xf5dce3,
      outline: 0x745664
    }),
    fireCannon: Object.freeze({
      textureKey: 'fire-cannon-world3',
      fill: 0xcc8f99,
      frosting: 0xfff5f7,
      outline: 0x785965,
      warningTint: 0xf1b7c7
    }),
    fireball: Object.freeze({
      textureKey: 'fireball-world3',
      fill: 0xd39a91,
      core: 0xfff5f7,
      outline: 0x785965
    }),
    ladder: Object.freeze({
      textureKey: 'ladder-world3',
      rail: 0xd39a91,
      rung: 0xf3e1c7,
      outline: 0x785965
    }),
    spring: Object.freeze({
      textureKey: 'small-spring-world3',
      compressedTextureKey: 'small-spring-world3-compressed',
      base: 0xd39a91,
      coil: 0xf3e1c7,
      outline: 0x785965
    }),
    checkpoint: Object.freeze({
      textureKey: 'checkpoint-world3',
      pole: 0xb78e98,
      flag: 0xc8dfe0,
      highlight: 0xf4fbfa,
      outline: 0x627a7d
    })
  })
});
const WORLD_3_PREVIEW_VISUALS = WORLD_3_VISUALS;

// Visual-only design tokens. Replace values here to retheme the shell without
// changing gameplay, level geometry, collision bodies, or progression logic.
const THEME = Object.freeze({
  worlds: Object.freeze({
    world1: WORLD_1_VISUALS,
    world2: WORLD_2_VISUALS,
    world3: WORLD_3_VISUALS,
    world3Preview: WORLD_3_PREVIEW_VISUALS
  }),
  mechanismSkins: Object.freeze({
    world1: WORLD_1_MOBILITY_SKIN,
    world2: WORLD_2_VISUALS.mechanisms,
    world3: WORLD_3_VISUALS.mechanisms
  }),
  colors: Object.freeze({
    cream: '#fffaf2',
    white: '#ffffff',
    blush: '#ffd7e5',
    pink: '#f2a9c2',
    mint: '#c8f1df',
    mintStrong: '#75cdb2',
    lavender: '#ddd2f7',
    purple: '#a994df',
    sky: '#bfe8f5',
    skyStrong: '#79c6e5',
    butter: '#ffe8a3',
    peach: '#ffc9a8',
    coral: '#ee8b97',
    ink: '#67556e',
    inkSoft: '#8c7893',
    shadow: 'transparent',
    overlay: '#fffaf2',
    surfaceStrong: '#ffffff',
    surfaceFaint: '#fffaf2',
    accentOutline: '#f2a9c2',
    focusRing: '#67556e'
  }),
  gameplay: Object.freeze({
    white: 0xffffff,
    blush: 0xffd7e5,
    mint: 0xc8f1df,
    lavender: 0xddd2f7,
    purple: 0xa994df,
    butter: 0xffe8a3,
    skyStrong: 0x79c6e5,
    sky: 0xbfe8f5,
    cloud: 0xfffaf2,
    mountainBack: 0xd9d1ee,
    mountainFront: 0xc5dceb,
    ground: 0xc8a27e,
    groundTop: 0xe2c39c,
    groundLine: 0x9b765f,
    player: 0x4f9fc8,
    playerLight: 0xcaf2fb,
    playerDark: 0x397ca3,
    ink: 0x67556e,
    moving: 0x91dcc2,
    movingLight: 0xc8f1df,
    movingDark: 0x61b99f,
    hazard: 0xee8b97,
    hazardDark: 0xc86f7b,
    goal: 0xffdf83,
    goalLight: 0xfff2c0,
    goalPole: 0xa994df,
    box: 0xffc29f,
    boxLight: 0xffe0ca,
    boxLine: 0xd7977b,
    button: 0xffe39a,
    buttonLight: 0xfff2c7,
    buttonLine: 0xd7b864,
    door: 0xb8a7e5,
    doorLight: 0xded4f7,
    doorLine: 0x8f7bc0,
    falling: 0xd8bca4,
    fallingLight: 0xf0d8c4,
    fallingLine: 0xb49378,
    backdropInk: 0x987563,
    townFar: 0xd9d1e8,
    townNear: 0xc8d8df,
    syrup: 0x91d5df,
    syrupDark: 0x72b6c2,
    dryBank: 0xe6c69f,
    pipe: 0xb98d6f,
    pipeDark: 0x8f6957,
    route: 0xc88c66,
    cannon: 0xd7977b,
    cannonWarn: 0xffdf83,
    fireball: 0xee8b97,
    checkpoint: 0x75cdb2,
    spikeTrack: 0x9885aa
  }),
  levelBackdrops: Object.freeze({
    1: Object.freeze({
      sky: 0xffe4b5,
      horizon: 0xe7b978,
      structures: 0xb97845,
      syrup: 0xd9954e,
      syrupDark: 0xa96532
    }),
    2: Object.freeze({
      sky: 0xf7d9ae,
      horizon: 0xd7a56a,
      structures: 0xb9784c,
      syrup: 0xcd874c,
      syrupDark: 0xa76539
    }),
    3: Object.freeze({
      sky: 0xeecfa8,
      horizon: 0xc99a6e,
      structures: 0xa96f4d,
      syrup: 0xb97c56,
      syrupDark: 0x8d5d46
    }),
    4: Object.freeze({
      sky: 0xe8c9a8,
      horizon: 0xb98b6c,
      structures: 0x95684f,
      syrup: 0xa9745b,
      syrupDark: 0x7e594c
    }),
    5: Object.freeze({
      sky: 0xf2c8a1,
      horizon: 0xc4865e,
      structures: 0xa55e42,
      syrup: 0xd17b43,
      syrupDark: 0xa65b3a
    }),
    6: Object.freeze({
      sky: 0xe7d2b0,
      horizon: 0xb6a184,
      structures: 0x8f8271,
      syrup: 0xa9a27d,
      syrupDark: 0x7f8068
    }),
    7: Object.freeze({
      sky: 0xe5dac5,
      horizon: 0xc4b8aa,
      structures: 0xa8a39b,
      syrup: 0xb1b9a9,
      syrupDark: 0x858f86
    }),
    8: WORLD_2_VISUALS.backdrop,
    9: Object.freeze({
      sky: 0xd7eef2,
      horizon: 0xc1dde6,
      structures: 0xaecad6,
      syrup: 0xb9dce3,
      syrupDark: 0x89b8c5
    }),
    13: Object.freeze({
      sky: 0xdceff0,
      horizon: 0xd3e4e6,
      structures: 0xbfcfd2,
      syrup: 0xc6dee0,
      syrupDark: 0x9dbfc3
    }),
    14: WORLD_3_VISUALS.backdrop
  }),
  depths: Object.freeze({
    background: -30,
    distant: -20,
    scenery: -10,
    link: 2,
    terrain: 3,
    mechanism: 4,
    actor: 6,
    foreground: 7,
    guidance: 8,
    hud: 10,
    feedback: 12,
    celebration: 19,
    modal: 20
  }),
  typography: Object.freeze({
    display: '"Arial Black", Arial, sans-serif',
    body: 'Arial, sans-serif',
    hudSize: '18px',
    labelSize: '14px',
    titleSize: '38px'
  }),
  spacing: Object.freeze({
    xs: '6px',
    sm: '10px',
    md: '16px',
    lg: '24px',
    xl: '34px'
  }),
  radii: Object.freeze({
    button: '0px',
    panel: '0px',
    pill: '0px'
  }),
  shadows: Object.freeze({
    soft: 'none',
    button: 'none',
    buttonPressed: 'none'
  }),
  motion: Object.freeze({
    quickMs: 120,
    menuMs: 190,
    transitionMs: 260,
    deathOutMs: 400,
    respawnInMs: 220,
    clearPanelMs: 360,
    celebrationMs: 760
  })
});

function applyThemeTokens() {
  const root = document.documentElement;
  Object.entries(THEME.colors).forEach(([name, value]) => {
    root.style.setProperty(`--color-${name}`, value);
  });
  Object.entries(THEME.typography).forEach(([name, value]) => {
    root.style.setProperty(`--font-${name}`, value);
  });
  Object.entries(THEME.spacing).forEach(([name, value]) => {
    root.style.setProperty(`--space-${name}`, value);
  });
  Object.entries(THEME.radii).forEach(([name, value]) => {
    root.style.setProperty(`--radius-${name}`, value);
  });
  Object.entries(THEME.shadows).forEach(([name, value]) => {
    root.style.setProperty(`--shadow-${name}`, value);
  });
  root.style.setProperty('--motion-quick', `${THEME.motion.quickMs}ms`);
  root.style.setProperty('--motion-menu', `${THEME.motion.menuMs}ms`);
  root.style.setProperty('--motion-transition', `${THEME.motion.transitionMs}ms`);
}

function applyMotionPreference() {
  document.body.classList.toggle('reduced-motion', reducedMotion);
}

applyThemeTokens();
