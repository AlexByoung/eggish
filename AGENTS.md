# Project Instructions

## 1. Project overview

- This repository contains an original Phaser 3 2D platform-puzzle game.
- The first three playable levels form the stable vertical slice; Levels 4–20 extend it through the World 2 graduation gauntlet, World 3, and the final three-world examination.
- The current milestone is stability and clarity across those three levels, not rapid content growth.
- Design priorities are solid controls, readable rules, short levels, fast retries, and combinations of learned mechanisms.
- Level logic and reliable playability take priority over adding more content.
- This file is operational guidance for Codex, not a player-facing README.

## 2. Technology and runtime

- Phaser 3.90.0 is vendored at `vendor/phaser-3.90.0.min.js` and loaded locally by `index.html`.
- The project uses plain HTML, CSS, and classic JavaScript files.
- Scripts share one global scope and must load in the order declared in `index.html`.
- There is no npm project, package manifest, bundler, framework, transpiler, or build step.
- The game entry point is `index.html`.
- The intended zero-install launch method is opening `index.html` directly in a browser.
- Core gameplay has no network dependency; the PWA service worker precaches the local runtime and assets for offline relaunch after the first HTTP(S) visit.
- For local HTTP testing, run `python -m http.server 8765 --bind 127.0.0.1` from the repository root, then open `http://127.0.0.1:8765/index.html`.
- No repository-defined automated test command currently exists.
- Browser testing is manual playtesting plus Console inspection; do not describe it as automated coverage.
- Do not introduce npm, another framework, ES modules, or a build system without explicit user approval.
- Preserve direct `file://` compatibility when changing script organization.

## 3. Repository map

- `index.html` — page markup, CSS, developer level menu, touch controls, completion buttons, local Phaser runtime, PWA metadata, and script load order.
- `README.md` — player controls, local launch, localStorage behavior, and Render publishing instructions.
- `render.yaml` — free Render Static Site Blueprint configuration for the repository root.
- `app.webmanifest` — install name, landscape/fullscreen display, theme colors, and application icons.
- `service-worker.js` — versioned same-origin application-shell cache and offline navigation fallback.
- `vendor/phaser-3.90.0.min.js` — pinned local Phaser runtime; update intentionally and preserve the version in the filename.
- `assets/icons/` — standard, maskable, and Apple touch application icons.
- `js/constants.js` — shared world sizes, spawn points, mechanism timing, box movement, and friction constants.
- `js/theme.js` — visual-only design tokens for DOM and Phaser presentation.
- `js/state.js` — mutable references and shared state for the single running Phaser Scene.
- `js/mechanisms.js` — boxes, pressure plates, doors, moving-platform crate contact, falling platforms, and mechanism updates.
- `js/companion.js` — reusable small companion data, pickup presentation, persistence hook, and visual following.
- `js/levels.js` — Level 2 through Level 20 construction, collider registration, cleanup, and reset functions.
- `js/game.js` — Phaser configuration, the single Scene callbacks, Level 1, player controls, generated textures, camera, death/completion orchestration, and menu events.
- `js/ui.js` — reusable Phaser HUD, completion panel, and visual-feedback components.
- `css/ui.css` — DOM menu, button, transition, and responsive presentation.
- `.agents/` — currently empty; do not assume it contains project guidance or tooling.
- There is currently no README, asset directory, separate Scene directory, level-data file, or test directory.
- Current gameplay visuals are generated geometric placeholders; the DOM shell uses token-driven CSS.

## 4. Current gameplay systems

- Horizontal player movement with facing-direction flip.
- Gravity, grounded movement, coyote time, jump buffering, two-stage jumping, and short-jump cutoff.
- Camera follow and bounded scrolling.
- Fixed gray platforms and green moving platforms.
- Red spike hazards and falling-out-of-world death.
- Orange pushable boxes with gravity, velocity limits, respawn delay, and platform collisions.
- Full-friction moving-platform transport for the player and genuinely contacting boxes.
- Yellow pressure plates triggered by the player or a box.
- Purple animated doors with collision disabled while open and safe delayed closing.
- Brown falling platforms with idle, warning, falling, resetting, and re-arming behavior.
- Bright goal objects and per-level completion panels.
- Attempts and deaths UI with cumulative deaths across level transitions.
- Progression and level selection for Levels 1 through 20.
- Next-level and replay controls after completion.
- `R` reset for Levels 2 through 20 and replay of a cleared Level 1.
- Delayed restoration for fallen boxes and falling platforms.
- Fixed-phase fire cannons using a bounded reusable fireball pool.
- Shared-clock alternating floor/ceiling spike groups.
- Session-only checkpoints in Levels 5–20 where configured; `R` still restarts from the level entrance.
- Horizontal and vertical moving platforms share the same configurable patrol-platform component.
- Reusable ladders use a slightly padded contact zone and deliberate Up/Down entry, with side and jump exits.
- Reusable small springs provide fixed upward launch, compression, cooldown, optional carrier tracking, and reset-safe delayed calls.
- Carrier-mounted spikes reuse the standard spike hazard while synchronizing visual and static-body positions to selected patrol platforms.
- Level 7 has one session checkpoint and nonfatal gap recovery; Level 8 has two session checkpoints.
- Level 8 introduces the World 2 visual theme and combines existing moving platforms and fire cannons without changing their collision or timing systems.
- Level 9 is a five-floor World 2 vertical tower that reuses ladders, springs, patrol platforms, spikes, and shared-clock fire-cannon synchronization.
- Level 10 is a three-phase World 2 boss arena where the player defeats a charging mist spirit by luring it into existing spike and box-button trap mechanisms.
- Level 11 deepens the World 2 moving-platform/fire-cannon synchronization rule through a constrained gauntlet and a fog-obscured safe-route/shortcut choice.
- Level 12 closes World 2 with four escalating sections that reuse nearly every learned non-boss mechanism, ending in a safe-route/timed-shortcut gate and one persistent shortcut collectible.
- Level 13 is a low-pressure World 2 farewell bridge: two forgiving carrier/cannon combinations lead into synchronized fog, mirror-glint, and music transition feedback, followed by a persistent visual companion that sits on the protagonist's head after pickup.
- Levels 14–20 form World 3: the mirror garden opens at lower pressure, separates and reunites the protagonist and companion, then closes with route choice and a three-world final examination.

## 5. Protected gameplay behavior

- Do not change player gravity, movement speed, acceleration, drag, jump force, collision body, coyote time, jump buffer, or short-jump cutoff unless the user explicitly requests it.
- Player physics and input behavior are currently defined in the Phaser config, `create()`, and `update()` in `js/game.js`.
- Mechanism constants are centralized in `js/constants.js`; reference that file instead of duplicating values.
- Do not adjust an existing level layout while implementing an unrelated feature.
- Do not change existing box, pressure-plate, door, moving-platform, falling-platform, death, or reset behavior incidentally.
- Every new feature must leave all three existing levels completable.
- An `R` reset must not increment deaths.
- A normal spike or fall death must increment deaths exactly once.
- Death and explicit reset must restore the current level's complete initial gameplay state.
- No recoverable mistake may require a page refresh; provide an in-game reset path.
- A door must never close on the player or a box.
- Moving platforms must continue to carry the player and genuinely contacting boxes without influencing separated boxes.
- Box contact with the Level 3 moving platform must use the recorded collision contact logic in `js/mechanisms.js`, not a broad proximity check; moving-platform friction is synchronized at `1`.
- Level changes must not leave old colliders, physics bodies, timers, tweens, UI, or event listeners active.
- Preserve the established death shake, flash, respawn timing, and cumulative counter behavior unless explicitly asked to change them.

## 6. Level-design rules

- Give every level one clear core concept.
- Introduce at most one major new mechanism per level unless the user explicitly requests otherwise.
- Present a new mechanism safely, add risk second, and combine it with learned rules last.
- Define the complete intended solution path before implementing a level.
- Do not reveal puzzle answers through large amounts of instructional text.
- Do not substitute extreme or precision jumps for actual level design.
- Communicate mechanism relationships through position, color, animation, timing, or composition.
- Consider mistakes, alternative solutions, unintended shortcuts, inaccessible objects, and soft locks.
- Keep the route after the core puzzle concise and avoid long repetitive cleanup sections.
- Validate white-box geometry and playability before adding formal art.
- Do not copy characters, layouts, artwork, or distinctive content from another game.
- Required jumps must be verified against the existing player physics rather than assumed reachable.

## 7. Working procedure

1. Read this `AGENTS.md` and the code relevant to the request.
2. Identify affected files, systems, levels, reset paths, and cleanup paths.
3. For a complex task, state a short implementation and verification plan first.
4. Reuse existing functions and state machines before creating new equivalents.
5. Make the smallest change that fully satisfies the request.
6. Do not perform unrelated cleanup or architecture work.
7. Run proportionate static checks and browser verification.
8. Inspect the final diff and remove test hooks, debug UI, and unrelated edits.
9. Report changed files, tests actually run, adjustable parameters, and known limitations.
- If the user asks only for diagnosis, inspect and explain; do not implement a fix without authorization.
- Preserve unrelated user changes in a dirty or untracked working tree.

## 8. Architecture rules

- The project currently uses one Phaser Scene configured as `{ create, update }` in `js/game.js`; do not claim that separate Scene classes exist.
- Level 1 construction remains in `js/game.js`; Levels 2 through 20 are built in `js/levels.js`.
- Add a new level through the existing lifecycle unless the user approves a broader architecture change.
- Put reusable mechanism behavior, including ladders, small springs, and carrier-mounted spikes, in `js/mechanisms.js`, not inside a new level builder.
- Put level construction, collider registration, cleanup, and reset wiring in `js/levels.js`.
- Put shared tunable mechanism values in `js/constants.js`; avoid scattered magic numbers.
- Add mutable shared references only to `js/state.js` and document why global state is required.
- Keep global input, camera, death/completion orchestration, menu events, and texture generation in `js/game.js`; keep reusable visual components in `js/ui.js`.
- Do not duplicate the full box, door, button, moving-platform, spike, goal, or falling-platform system for a new level.
- Register colliders in `activeColliders` so level cleanup can remove them.
- Store and cancel delayed calls and kill relevant tweens before destroying or resetting their owners.
- Destroy or clear old groups, objects, hints, links, and guides during level changes.
- Maintain the classic script order in `index.html`: constants, theme, audio config/manager, state, localization, mechanisms, companion, levels, UI, then game; `js/pwa.js` registers the service worker after game startup.
- Large changes such as Scene classes, data-driven level files, modules, or a build pipeline require explicit approval first.

## 9. Verification checklist

- Manually complete Level 1 from start to goal.
- Manually complete Level 2 from start to goal.
- Manually complete Level 3 from start to goal.
- Manually complete Level 4 from start to goal.
- Manually complete Levels 5 and 6 from start to goal.
- Manually complete Level 7 from start to goal.
- Manually complete Level 8 from start to goal.
- Manually complete Level 9 from bottom to top.
- Manually complete Level 10 by landing all three environmental hits and reaching the opened exit.
- Manually complete both Level 11 routes, collect the shortcut reward, and verify shortcut failure returns to the branch checkpoint.
- Manually complete both Level 12 routes, verify the shortcut-only collectible, and repeat each section from its checkpoint.
- Manually complete Level 13, verify both forgiving synchronization sections, both checkpoints, the transition timeline, mandatory companion pickup, death/reset following, and safe final approach.
- Manually complete Levels 14–20, including separation, solo route, search, reunion, both Level 19 routes, the Level 20 return route, farewell, and ending.
- Verify consecutive transitions from Level 1 through Level 20.
- Compare protected player physics code to ensure it was not changed unintentionally.
- Verify spikes and falling below the world cause one death and one counter increment.
- Verify `R` restores the active supported level without increasing deaths.
- Verify boxes, pressure plates, and doors return to their initial state after death.
- Verify moving platforms carry the player and contacting boxes without affecting separated boxes.
- Verify ladders accept near-edge Up/Down entry without auto-attaching, always restore gravity on exit/reset, and allow top/side/jump exits.
- Verify small springs trigger only from above, launch once per contact, and cancel pending compression on reset/transition.
- Verify falling platforms warn, fall, disappear, restore, and do not immediately loop under a stationary player.
- Repeat deaths and resets to detect duplicate timers, tweens, colliders, or callbacks.
- Verify level transitions leave no old UI or physics objects visible or collidable.
- Verify Next Level and Replay buttons work in every state where they are shown.
- Inspect the browser Console and introduce no new errors or warnings.
- On a coarse-pointer device, verify simultaneous direction+jump input, ladder Up/Down, pause, reset, portrait blocking, landscape resume, and safe-area spacing.
- Stop the local server after one successful online visit and reload once to verify the PWA shell starts from offline cache.
- Run JavaScript syntax checks when Node is available, but do not treat syntax checks as gameplay tests.
- There is no automated gameplay suite; all interaction items above require manual or browser-driven playtesting.

## 10. Definition of done

- The exact requested behavior is implemented.
- No unrelated files or behaviors were changed.
- Every affected existing system and level received an appropriate regression check.
- Death, reset, delayed restoration, and level-transition edge cases were verified when relevant.
- The browser Console has no new errors.
- Any approved rule or architecture change is reflected in project guidance.
- Temporary instrumentation and acceptance controls are removed.
- The final response lists changed files, verification performed, adjustable parameters, and limitations.
- Do not mark work complete when required checks were skipped; state what still needs manual verification.

## 11. Prohibited actions

- Do not install dependencies without explicit permission.
- Do not introduce a framework, package manager, build tool, or module system without explicit permission.
- Do not perform a large refactor without explicit permission.
- Do not rewrite or silently rebalance the three stable levels.
- Do not copy an entire old system to implement a new level.
- Do not silently modify protected physics or collision parameters.
- Do not delete or overwrite user code or files outside the requested scope.
- Do not claim tests were run when they were not.
- Do not use page refresh as the normal recovery path for a soft lock.
- Do not change features outside the stated task.
- Do not add external art, copied assets, enemies, combat, or unrelated systems unless requested.

## Documentation gaps

- The player-facing README documents controls, local launch, save behavior, and Render publishing.
- No dedicated level-design document records level intent, tuning notes, or approved solution paths.
- No manual regression test log or automated test harness exists.
- No asset pipeline or art-direction guide exists because visuals are currently generated white-box graphics.
