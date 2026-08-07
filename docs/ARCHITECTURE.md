# Architecture

## Runtime and entry point

- `index.html` is the game entry point and contains page CSS, title/level-select/pause menus, touch controls, completion buttons, local Phaser runtime loading, PWA metadata, and classic script tags.
- Phaser 3.90.0 is pinned locally at `vendor/phaser-3.90.0.min.js`. There is no package manager, build step, or module loader.
- Classic scripts load in this required order: `js/constants.js`, `js/theme.js`, `js/audio-config.js`, `js/audio-manager.js`, `js/state.js`, `js/localization.js`, `js/mechanisms.js`, `js/companion.js`, `js/levels.js`, `js/ui.js`, then `js/game.js`.
- Direct browser opening is supported. For local HTTP testing, run `python -m http.server 8765 --bind 127.0.0.1` from the repository root.

## Phaser Scene structure

The game uses one Phaser Scene configured as `{ preload, create, update }` in `js/game.js`. There are no Scene subclasses and no actual Phaser Scene transition. Level changes rebuild objects inside the same Scene.

- `preload()` loads the `player` Sprite Sheet and delegates optional configured music loading to the shared audio manager.
- `create()` builds the player, shared Phaser UI, input handlers, Level 1, and the DOM shell handlers.
- `update(time)` runs the active level update and the protected player control loop.
- `startLevel2()`, `startLevel3()`, and `startLevel4()` in `js/levels.js` clean the previous level and construct the next one.

## File responsibilities

- `js/constants.js`: level count, world widths, spawn points, mechanism timing, box speed/drag/grip, and other shared mechanism constants.
- `js/theme.js`: replaceable visual tokens shared by CSS and Phaser presentation.
- `js/audio-config.js`: semantic audio events, optional asset keys/paths, category volumes, cooldowns, overlap limits, loops, and fade timing.
- `js/audio-manager.js`: Web Audio SFX synthesis, Phaser music playback/fades, browser unlock, volume/mute control, loop ownership, pause/resume, and cleanup.
- `js/state.js`: mutable global references for the current Scene objects and cross-level state.
- `js/localization.js`: Chinese/English UI strings, level names, narrative translations, and DOM localization helpers.
- `js/mechanisms.js`: reusable box, pressure-plate, door, moving-platform contact, carrier-mounted spike, falling-platform, ladder, small-spring, timer, and mechanism-update functions.
- `js/companion.js`: small-companion data, encounter, persistence, following, reset, and cleanup behavior.
- `js/levels.js`: Level 2–20 construction, collider wiring, world cleanup, and reset functions.
- `js/game.js`: Phaser configuration, Level 1, player/input/camera/animation logic, generated fallback and gameplay textures, death/completion flow, and UI/menu behavior.
- `js/pwa.js`: HTTP(S)-only registration for the root service worker; direct `file://` launch remains supported without PWA features.
- `js/ui.js`: reusable Phaser HUD, completion panel, death/respawn presentation, and celebration particles.

## Mobile input and installability

- Keyboard and DOM touch controls feed one shared input abstraction; mobile movement uses bottom-left Left/Right buttons, while tapping the right half of the game surface triggers the unchanged jump rule. The top-left gear pauses gameplay and opens the existing resume/restart/level-select/main-menu panel, where attempts and deaths are shown.
- Coarse-pointer devices receive only visible Left/Right movement controls plus right-half-screen jumping. Touch controls hide during menus, dialogue, completion, and the ending cinematic. The centered controls reminder is visible only in Level 1.
- Portrait orientation blocks gameplay and pauses the Scene until the device returns to landscape. Browser backgrounding clears held touch state and opens the pause menu during active gameplay.
- The DOM shell uses `dvh` with a `visualViewport.height` CSS-variable fallback so Safari address/tab bars and their expand-collapse transitions cannot make the 16:9 game container taller than the actually visible viewport.
- `app.webmanifest` requests fullscreen landscape presentation and points to standard and maskable icons under `assets/icons/`.
- `service-worker.js` precaches the complete same-origin application shell, uses a network-first navigation strategy with an offline `index.html` fallback, and serves versioned cached runtime assets without relying on query strings.
- Developer-only level access and the ending preview are available under `?dev=1`; production URLs keep the ending-preview button hidden.
- `css/ui.css`: reusable DOM panels, buttons, transitions, responsive layout, and reduced-motion rules.

## Player and input

The Phaser world gravity is set in the config in `js/game.js`. Player construction, collision body, maximum velocity, and drag are in `create()`. Acceleration, facing, grounded detection, coyote time, jump buffering, jump force, and short-jump cutoff are in `update()`.

The player keeps the existing `player` texture key and loads `assets/characters/danzai-spritesheet.png` as 13 frames of `35 × 42`. `createPlayerAnimations()` registers Idle, Run, Jump, and Fall clips; `updatePlayerAnimation()` selects presentation state from the already-computed grounded state and velocity. Run playback rate scales against the unchanged `225` maximum horizontal speed. If the PNG fails to load, `createTextures()` generates the previous blue placeholder without changing player construction or physics.

Cursor keys and Space are created once in `create()`. `R` and Enter listeners are also registered once there. Levels are rebuilt inside the same Scene, so level transitions do not currently register duplicate keyboard listeners.

## Level organization

Level layouts are imperative code, not data files.

- Level 1 geometry, hazards, moving platform, and goal are created by `startLevel1()` in `js/game.js`.
- Level 2 is created by `startLevel2()` in `js/levels.js`.
- Level 3 is created by `startLevel3()` in `js/levels.js`.
- Level 4 is created by `startLevel4()` in `js/levels.js`.
- Levels 5 and 6 are created by `startLevel5()` and `startLevel6()` in `js/levels.js`.
- Level 7 is created by `startLevel7()` in `js/levels.js`.
- Level 8 is created by `startLevel8()` in `js/levels.js`; it owns the World 2 presentation, warm-up sequence, formal synchronization segment, checkpoint, and reset wiring.
- Level 9 is created by `startLevel9()` in `js/levels.js`; it uses a negative-Y vertical world, five floor bands, faster vertical camera follow, two session checkpoints, and the existing World 2 mechanism skins.
- Levels 10 and 11 are created by `startLevel10()` and `startLevel11()` in `js/levels.js`; they own the World 2 boss arena and the high-pressure branch-choice stage.
- Level 12 is created by `startLevel12()` in `js/levels.js`; its four segment bounds, platform/cannon timing, alternating-spike pairs, checkpoints, collectible ID, and timed-gate values are centralized in `js/constants.js`.
- Level 13 is created by `startLevel13()` in `js/levels.js`; its forgiving World 2 mechanisms and position-driven transition timeline are centralized in `js/constants.js`, while `js/companion.js` owns the small mud companion.
- Level 14 is created by `startLevel14()` in `js/levels.js`; it reuses the companion in a collision-free carried mode and owns one cancellable mirror-pool ending Timer through the single-Scene lifecycle.
- Levels 15 and 16 are created by `startLevel15()` and `startLevel16()` in `js/levels.js`. Level 15 owns the mirror-cell separation state and persists `MUD_COMPANION_SEPARATED_ID`; Level 16 deliberately creates no companion follower.
- Levels 17–20 complete the search, reunion, forked wind route, final return route, farewell, and ending cinematic through the same single-Scene lifecycle.
- Level-specific coordinates and several movement bounds remain inside level builders or shared state rather than a dedicated level-data structure.

## Gameplay objects and mechanisms

Objects are Phaser Arcade Physics images, sprites, groups, and generated textures rather than custom classes. `js/mechanisms.js` contains the reusable behavior:

- Box construction, speed limiting, delayed respawn, and reset.
- Pressure-plate evaluation shared by Levels 2 and 3.
- Door opening, collision disabling, safe closing, and reset.
- Levels 3 and 4 box contact recording with full-friction platform synchronization.
- Falling-platform state, timers, tween warning, hiding, restoration, and re-arming.
- Level 4 first-platform trigger, Scene-clock timed-gate countdown, meter rendering, expiry, and retry state.
- Fire-cannon scheduling, the bounded fireball pool, projectile cleanup, and blocking rules.
- Optional shared-clock fire-cannon scheduling for Level 9 lift synchronization. Earlier cannons retain activation-relative timing; shared-clock cannons derive their next cycle from the most recent deterministic level reset.
- Shared-clock alternating-spike controllers and their visual/collision state synchronization.
- Carrier-mounted standard spikes that retain a fixed offset from their patrol platform and refresh their static collision body after carrier motion.
- Session-only checkpoints that affect death respawn but not full `R` resets or localStorage.
- `createPatrolPlatform()` accepts an axis, start position, distance, direction, speed, and width. Its horizontal branch preserves the earlier `minX/maxX` behavior; its vertical branch uses the same group, cleanup, reset, collision, and friction lifecycle.
- Optional moving-platform, cannon, and fireball texture keys select a visual skin while retaining the existing physics bodies and mechanism logic. World 2 skin tokens live in `js/theme.js`.
- Fire-cannon readability and projectile cleanup use the active camera/world rectangle on both axes, so horizontal levels and the negative-Y Level 9 tower share one implementation.
- `createLadder()` builds a visual/body-matched overlap tool. `updateLadderInteraction()` owns lightly padded deliberate Up/Down entry, capped center correction, gravity suppression, top exit, side exit, and jump exit without registering new keyboard listeners.
- `createSmallSpring()` and `smallSpringHitsPlayer()` own fixed upward spring behavior. Compression uses one stored Scene delayed call; cooldown, initial delay, optional carrier tracking, textures, and launch velocity are object data.
- `resetMobilityTools()` and `destroyMobilityTools()` restore gravity, collision direction, climb state, pending spring timers, textures, and mobility groups during death, `R`, replay, and level transition.

## State

`js/state.js` holds mutable globals for the player, groups, current level, UI, door state, counters, timers represented as object data, moving-platform bounds, jump state, ladder climb ownership, spring launch pending state, and mobility/recovery groups. The lifetime of these values matches the single Phaser Scene. This is simple but makes cleanup correctness important and increases coupling between files.

## UI

- DOM UI in `index.html`: first-run language fork, title, locked level select, settings, pause, Next Level, Replay, and transition overlay.
- Phaser HUD, completion UI, and visual feedback are constructed in `js/ui.js`; level-specific hints remain with their builders.
- `js/game.js` invokes visual helpers at semantic gameplay events without moving presentation code into player physics.
- DOM listeners are installed once by `setupClearActions()` and `setupShell()`.
- Progress preserves the legacy `localStorage` key `block-hero.progress.v1`. The normalized version-1 payload contains `saveVersion`, legacy `version`, unlocked/completed levels, total deaths, `zh`/`en` language choice, reduced-motion preference, nested and legacy-compatible Master/Music/SFX volume and mute fields, plus persistent collectible IDs. Missing legacy fields receive safe defaults, invalid values are clamped or ignored, unknown top-level fields are retained on the next save, malformed data falls back without a white screen, and blocked storage uses an in-memory page-session fallback. Checkpoints and other runtime puzzle state are never persisted.

## Audio

- Gameplay and UI code emit semantic events through the single global `audioManager`; synthesis parameters and playback policy are not stored in level builders.
- Short SFX use native Web Audio and do not add a dependency. The current wired events are jump, landing, death, pressure plate, door opening, UI hover/select, and level clear.
- `boxPush` and `movingPlatform` have configured loop definitions and manager lifecycle APIs, but their per-frame gameplay triggers are intentionally deferred to a later feedback pass.
- Music entries support Phaser preload, procedural Web Audio loops, switching, and fades. World 1, World 2, and World 3 currently use the `toffeeForest`, `marshmallowMist`, and `caramelMirror` procedural themes; the Level 13 boundary retains a separate transition ambience. Optional future audio files belong under `assets/audio/` and are registered only in `js/audio-config.js`.
- Browser autoplay restrictions are handled by deferring music until the first pointer or keyboard interaction. One-shot SFX requested before unlock are discarded rather than replayed in a burst.
- Pausing gameplay pauses music and active loops. Title and level-transition shell states can keep audio active while physics and Scene time remain paused.

## Death and reset lifecycle

1. Spike overlap or falling below the world calls `die()` in `js/game.js`.
2. `die()` guards duplicate death, increments counters, disables player collision, applies feedback, and schedules `respawn()` through a tween completion.
3. `respawn()` restores Level 1 directly or delegates to the active `resetLevel2()` through `resetLevel20()` function in `js/levels.js`.
4. Level reset functions restore player, camera, boxes, switch, door, moving platforms, checkpoints, and level-specific mechanisms.
5. `R` directly calls the active Level 2/3 reset and therefore does not increment deaths. On a cleared Level 1 it invokes replay.

## Completion and level change lifecycle

1. Goal overlap calls `clearLevel()` in `js/game.js`.
2. Input and hazards stop because `isCleared` makes `update()` return.
3. Completion UI is shown; Levels 3 and 4 also stop moving/falling mechanisms.
4. Next Level passes through the guarded transition flow, which pauses gameplay and calls the target builder after fade-out.
5. Replay invokes the relevant reset path.

## Cleanup and lifecycle management

- All created physics colliders/overlaps are stored in `activeColliders`; `removeActiveColliders()` removes them before level reconstruction.
- Level 1 hints and guide tweens are stopped or destroyed when entering Level 2.
- `cleanupCurrentLevel()` cancels box/falling-platform timers, kills selected tweens, clears groups, destroys old objects, and nulls shared references before any level builder runs.
- `cleanupCurrentLevel()` and reset paths stop audio loops before rebuilding gameplay state; Scene shutdown/destroy removes unlock listeners and owned sounds.
- Box delayed calls are stored on each box as `respawnTimer` and removed by reset/cleanup.
- Falling-platform warning/reset timers are stored on platform data and removed by reset/cleanup.
- Door and player tweens are killed during Level 2/3 reset.
- Pause freezes Arcade Physics, the Scene clock, and active Tweens. DOM controls remain available to resume the single Scene.
- The audio manager registers defensive Scene shutdown/destroy cleanup even though the current game does not switch Phaser Scenes.

## Known architecture risks

- Global mutable state makes ownership and valid lifetime implicit.
- Level 1 construction/reset differs from Levels 2 and 3.
- Layouts are hard-coded builders, so adding levels increases `js/levels.js` size.
- Cleanup is manual and must be updated for every new object, timer, tween, and listener.
- Some player tuning values remain in `js/game.js` rather than `js/constants.js`; they are protected and must not be moved or changed casually.

## Extension rules

- Add reusable mechanism behavior to `js/mechanisms.js` and tunable mechanism values to `js/constants.js`.
- Add mutable shared references only to `js/state.js` when the existing single-Scene design requires them.
- Add new level construction, collider registration, cleanup, and reset wiring to `js/levels.js` using existing lifecycle functions.
- Register every collider in `activeColliders` and store every delayed call that must be cancelled.
- Reuse boxes, plates, doors, goals, spikes, moving platforms, and falling-platform state rather than copying them.
- Any move to Scene classes, data-driven levels, modules, or a build system requires explicit approval and a separate migration plan.
