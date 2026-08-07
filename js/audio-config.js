"use strict";

const AUDIO_CONFIG = Object.freeze({
  defaults: Object.freeze({
    masterVolume: 0.8,
    musicVolume: 0.55,
    sfxVolume: 0.8,
    muted: false
  }),
  events: Object.freeze({
    jump: { category: 'sfx', volume: 0.45, cooldown: 60, maxInstances: 2, synth: 'jump' },
    land: { category: 'sfx', volume: 0.26, cooldown: 80, maxInstances: 1, synth: 'land' },
    death: { category: 'sfx', volume: 0.7, cooldown: 250, maxInstances: 1, synth: 'death' },
    boxPush: { category: 'sfx', volume: 0.2, loop: true, synth: 'boxPush' },
    button: { category: 'sfx', volume: 0.48, cooldown: 120, maxInstances: 1, synth: 'button' },
    door: { category: 'sfx', volume: 0.38, cooldown: 260, maxInstances: 1, synth: 'door' },
    movingPlatform: { category: 'sfx', volume: 0.12, loop: true, synth: 'movingPlatform' },
    spring: { category: 'sfx', volume: 0.34, cooldown: 90, maxInstances: 2, synth: 'spring' },
    uiHover: { category: 'sfx', volume: 0.22, cooldown: 45, maxInstances: 1, synth: 'uiHover' },
    uiSelect: { category: 'sfx', volume: 0.38, cooldown: 80, maxInstances: 2, synth: 'uiSelect' },
    levelClear: { category: 'sfx', volume: 0.58, cooldown: 500, maxInstances: 1, synth: 'levelClear' },
    fireWarning: { category: 'sfx', volume: 0.28, cooldown: 140, maxInstances: 2, synth: 'fireWarning' },
    fireLaunch: { category: 'sfx', volume: 0.42, cooldown: 90, maxInstances: 3, synth: 'fireLaunch' },
    spikeWarning: { category: 'sfx', volume: 0.07, cooldown: 500, maxInstances: 1, synth: 'spikeWarning' },
    menuMusic: {
      key: 'menu_music', category: 'music', path: null, volume: 0.35,
      loop: true, fadeIn: 600, fadeOut: 400
    },
    levelMusic: {
      key: 'level_music', category: 'music', path: null, volume: 0.35,
      loop: true, fadeIn: 500, fadeOut: 400
    },
    world2Music: {
      key: 'world2_music', category: 'music', path: null, volume: 0.34,
      loop: true, fadeIn: 900, fadeOut: 650
    },
    transitionAmbience: {
      key: 'transition_ambience', category: 'music', path: null, volume: 0.25,
      loop: true, fadeIn: 1400, fadeOut: 1200, synth: 'transitionAmbience'
    }
  })
});
