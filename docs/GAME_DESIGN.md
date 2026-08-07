# Game Design

## Vertical-slice goal

The current product is an original twenty-level Phaser 3 platform-puzzle game. The first three levels remain the stable vertical slice; Levels 4–20 extend it without changing their layouts or the protected player feel.

## Core experience

- Traverse short platforming spaces with consistent, responsive controls.
- Observe object placement and color relationships before acting.
- Infer a rule, execute a short plan, and recover quickly from mistakes.
- Finish each level soon after resolving its central puzzle.

The intended loop is **observe → reason → execute → learn from failure → retry**.

## Design pillars

1. **Solid and consistent controls.** The same movement and jump behavior applies across all levels.
2. **One primary concept per level.** Each level teaches or combines a small number of readable rules.
3. **Short, information-rich failure.** Hazards reset quickly and a failed attempt should clarify the solution.
4. **Visual puzzle communication.** Position, color, motion, and composition communicate relationships before text does.
5. **Stable combinations.** Reused mechanisms must behave consistently when combined.

## Current player abilities

The playable protagonist is 蛋仔.

- Move left and right and visibly face the movement direction.
- Jump twice before landing. The lower first jump preserves grounded platforming; the second jump provides aerial correction.
- Release jump early for a shorter jump.
- Ride moving platforms with full horizontal synchronization.
- Approach a ladder and press Up/Down to attach, leave sideways, or jump away with Space.
- Trigger fixed upward small springs by landing on them from above.
- Push boxes from the side.
- Stand on boxes and use them as steps.
- Trigger pressure plates by standing on them.
- Reset Levels 2–20 with `R` without adding a death.

The player has no direct attack, item inventory, or lifting action. Level 10 is the only implemented enemy encounter: the player defeats the mist spirit indirectly by luring it into existing environmental mechanisms.

## Implemented mechanisms

- **Fixed platforms:** stable gray collision surfaces.
- **Moving platforms:** green horizontal platforms that carry the player and genuinely contacting boxes with full horizontal synchronization.
- **Spikes:** red hazards that cause a counted death.
- **World fall:** leaving the bottom of the play area causes a counted death.
- **Boxes:** orange gravity-driven pushable objects with capped speed and delayed restoration after falling out of bounds.
- **Pressure plates:** yellow switches triggered by the player or a box, with a short release grace period for stable detection.
- **Doors:** purple animated blockers; opening disables collision, and closing waits until the doorway is clear of the player and boxes.
- **Falling platforms:** brown platforms with idle, warning, falling, hidden/resetting, and re-armed states.
- **Timed gate trigger:** Standing on Level 4's first falling platform opens the linked door for nine seconds; the meter appears only after contact, drains, and changes to the hazard color during the final three seconds.
- **Fire cannon:** A fixed-phase, warned projectile lane. Fireballs travel at constant speed, disappear on walls or boxes, and never impart force to boxes.
- **Alternating spikes:** Floor and ceiling groups share one deterministic clock and expose retracted, warning, moving, and extended states.
- **Session checkpoint:** Levels 5–20 use approved safe boundaries where configured; checkpoints are not written to the long-term save and `R` clears them.
- **Axis-configurable moving platform:** The existing patrol-platform component supports horizontal or vertical travel. Level 7 first teaches transfers, ladders, and springs in recoverable spaces, then adds clearly readable spike and fireball pressure as the World 1 finale.
- **Ladder:** A reusable lightly padded overlap tool. Up/Down enters a gravity-free climb and applies a capped center correction; horizontal input exits, and Space uses the existing first-jump velocity to leave.
- **Small spring:** A reusable top-contact tool with configurable upward launch velocity, direction metadata, cooldown, initial delay, and optional moving-platform carrier. Its compression timer and texture state reset with the level.
- **World 2 mechanism skins:** Level 8 is the formal World 2 opening and reuses the existing moving-platform and fire-cannon state machines with separate cold-pastel texture keys. Appearance changes never alter bodies, paths, projectile speeds, or collision callbacks; difficulty continues upward from Level 7 rather than restarting.
- **Shared-clock vertical synchronization:** Level 9 can opt individual cannons into the same reset-time clock used by deterministic patrol platforms. This preserves a tuned lift/projectile phase through pause and reset without changing the activation-driven timing used by earlier levels.
- **Environmental boss:** Level 10 reuses spike and box-button mechanisms for a three-hit mist-spirit encounter; the player never gains a direct attack.
- **Branch rewards:** Level 11 has a run-local extra mist-sugar reward, while Level 12 has one persistent World 2 graduation keepsake.
- **Visual companion:** Level 13 introduces the small mud companion through a mandatory touch-and-dialogue encounter. It follows visually without changing player physics and continues into Level 14.
- **World 3 route:** Levels 14–20 cover the mirror-garden opening, companion separation, solo pursuit, reunion, route choice, and the final three-world examination.
- **Goals:** bright finish markers that stop play and show level-complete actions.

## Death and retry principles

- Spike and world-fall deaths increment both the death-derived attempt count and the death count exactly once.
- Death feedback is immediate and brief, then restores the active level.
- `R` is a recovery tool, not a death, and must not change counters.
- Puzzle objects, collision state, timers, moving platforms, and camera position must return to their level start state.
- A recoverable mistake must never require a browser refresh.

## Shell and progression

- The title screen provides Continue and Level Select.
- Level 1 is always available; completing a level permanently unlocks the next one through Level 20 in the same browser.
- The save contains unlock/completion progress, language choice, preferences, and persistent special-collectible IDs. Deaths, attempts, player position, checkpoints, and puzzle-object state remain session or level state.
- Pause freezes the complete gameplay simulation and offers resume, restart, level select, and title actions.
- Menu and level transitions must never change a level solution or increment deaths.

## Current visual direction

- The game uses a front-facing, flat 2D pixel presentation with integer-aligned geometry, square corners, solid fills, crisp outlines, and no perspective planes.
- Worlds 1–3 have distinct token-driven palettes, background compositions, and mechanism skins, while retaining shared readable gameplay silhouettes.
- Do not use gradients, blur, glass effects, soft shadows, bevels, or pseudo-3D platform faces.
- Visual replacements must preserve texture keys, collision geometry, level coordinates, and mechanism readability.

## Teaching principles

- Show a new rule safely before attaching lethal risk.
- Let the player see related objects together where possible.
- Use consistent colors: gray ground, green movement, orange boxes, yellow switches/goals, purple doors, red hazards, and brown falling platforms.
- Use brief hints only for basic controls; do not state puzzle solutions.
- Combine a learned rule with an older rule only after the individual rule is readable.

## Puzzle readability

- Required objects should be visible within a reasonable camera span.
- A plate-to-door relationship should be communicated by shared color and a visible link.
- Motion, warning flashes, and collision changes should have immediate feedback.
- Important objects must not be hidden behind UI.
- Alternative solutions are acceptable when they preserve the intended learning and do not trivialize the level.

## Difficulty sources

- Sequencing known rules.
- Timing a wide, slow moving platform.
- Positioning a box without precision pushing.
- Committing to falling-platform movement after a clear warning.
- Reading hazards and planning a short safe route.

Difficulty must not come from extreme jump distances, unstable box physics, invisible relationships, excessive text, or long repetition after the puzzle is solved.

## Prohibited design approaches

- Do not copy characters, artwork, layouts, or distinctive content from another game.
- Do not use precision or maximum-distance jumps as a substitute for puzzle design.
- Do not reveal the full answer through mandatory instructional text.
- Do not introduce multiple major mechanics in one level without explicit approval.
- Do not create difficulty through inconsistent collision or unrecoverable objects.
- Do not extend the post-puzzle route solely to increase playtime.
