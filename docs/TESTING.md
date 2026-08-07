# Testing

## Mobile/PWA release checks

- Test at representative landscape phone and tablet sizes with a coarse pointer. Verify the bottom-left Left/Right buttons can be held while the right half of the game surface is tapped to jump, and that releasing one finger does not release the other input.
- Verify no Up/Down or standalone Jump button is visible, and tapping the right half of the game surface uses the existing two-stage jump rule.
- Verify the top-left gear hides the controls, pauses gameplay, and opens the existing action panel with current attempt/death counts; Resume restores the controls, and Restart restores the current level without incrementing deaths.
- Verify the centered controls reminder appears in Level 1 and is hidden from Level 2 onward, while the level label remains at the top right.
- Rotate to portrait during gameplay and confirm the bilingual rotation screen pauses the Scene. Rotate back and confirm gameplay and touch controls resume without a duplicate timer or input.
- In iPhone/iPad Safari landscape, test with the address and tab bars both expanded and collapsed; the complete 16:9 canvas, top HUD, bottom controls, and safe-area padding must remain visible after every `visualViewport` resize.
- Background the browser during active gameplay and confirm held controls clear and the pause menu is shown on return.
- Load every level through `?dev=1`, confirm one canvas, visible landscape touch controls whenever no dialogue is active, and no new Console errors.
- Visit once online, wait for service-worker installation, stop the server, and reload. The title menu, local Phaser runtime, scripts, sprite, CSS, manifest, and icons must all resolve from cache.
- Validate `app.webmanifest`, including fullscreen display, landscape orientation, 192/512 icons, and the maskable icon.
- Verify the legacy `block-hero.progress.v1` key loads older version-1 saves, fills missing fields, clamps invalid level/volume values, and preserves unlocks after reload and tab close/reopen on the same origin.
- Place malformed JSON in the save key and reload; the language/new-game flow must appear without a white screen and Console must contain one clear save warning.
- Open Settings and cancel each clear-save confirmation independently; storage must remain unchanged. Accept both confirmations only in an isolated test origin and verify the key is removed and the game returns to default progress.

The repository has no automated gameplay suite, linter configuration, package scripts, or build command. Keep command checks, browser checks, and manual playtests distinct in reports.

## Command-executable checks

Run from the repository root. These checks require a locally available Node executable but install nothing.

```powershell
node --check js/constants.js
node --check js/theme.js
node --check js/audio-config.js
node --check js/audio-manager.js
node --check js/state.js
node --check js/mechanisms.js
node --check js/levels.js
node --check js/ui.js
node --check js/game.js
git diff --check
git status --short
```

These commands check syntax, whitespace, and repository state only. They do not prove Phaser behavior or level playability.

## Local browser startup

The zero-install entry is `index.html`. For a controlled local HTTP session:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/index.html`. Phaser is loaded from a CDN, so network access or a cached CDN response is required.

## Browser-observable checks

- Page loads and a Phaser canvas is created.
- The browser tab, title screen, and accessible game label show `蛋仔快跑`.
- Levels 1–6 each show their own short Bible-aligned opening hint; the title screen uses 蛋仔's sugar-jar motto instead of reusing a level hint.
- The `player` Sprite Sheet loads as 13 frames of `35 × 42`; no fallback blue block appears during a normal load.
- 蛋仔 is visible in all twenty levels, faces right by default, flips cleanly to face left, and remains in front of backgrounds/platform decoration but behind HUD and menus.
- Idle cycles through frames `0–2` without shoe-baseline drift; Run cycles through frames `3–8` with clearly alternating feet and no sliding, sudden scaling, or origin shift.
- Jump uses frames `9–10` while rising and Fall uses frames `11–12` while descending; landing returns to Idle or Run without changing the physics Body.
- At low and maximum running velocity, the six-frame Run playback rate remains visually coordinated with ground travel.
- Title screen shows Start/Continue and Level Select.
- Level Select disables locked levels and starts each available level correctly.
- Completing each level unlocks the next through Level 20; the unlock and completed markers survive reload.
- A missing, blocked, or malformed save falls back to Level 1 without blocking play.
- Escape/P opens pause; physics, Scene time, and Tweens remain frozen until resume.
- Pause restart does not add a death; title and level-select actions leave no old level objects.
- Level label, attempt count, death count, and control text remain visible.
- Next Level appears after Levels 1–19; Replay appears after every standard clear; Level 20 enters the ending flow.
- Level 1 → Level 20 transitions work consecutively in one session.
- Canvas and keyboard input recover after switching focus away and back; no movement key remains stuck.
- Browser Console shows no new errors or warnings.
- Old UI, hints, links, platforms, doors, and goals do not remain after transitions.
- Repeatedly switch among all unlocked levels in both directions and confirm cleanup remains stable.
- Title, settings, level-select, pause, HUD, and completion UI use the token palette and shared button/panel components.
- Title, settings, level-select, pause, completion actions, HUD, and clear panel use square corners, solid fills, and consistent two-pixel outlines without gradients or shadows.
- Levels 1–6 render platforms as flat front rectangles without top/side planes, bevels, rounded edges, or highlight strips.
- Fixed and alternating spikes have one centered tip. Fixed spike bases sit behind platform faces; Level 6 floor spikes emerge from the ground and ceiling spikes emerge from the overhead housing without floating above either panel.
- Each Level 6 ceiling-spike housing has a 120 × 64 static Body covering its complete visible rectangle; its upper 40 pixels must not allow the player to pass through.
- Level 5 and Level 6 checkpoint flagpoles visually meet the ground surface while retaining their existing respawn coordinates and session-only behavior.
- Player, spike, goal, box, pressure plate, door, moving platform, and falling platform remain visually distinct at normal and reduced viewport sizes.
- Hover, focus, active, disabled, and locked button states remain readable using color changes without position or scale movement.
- Full/Reduced motion toggles update immediately and survive reload without changing mechanism timing.
- Master, Music, and SFX sliders plus global mute update immediately and survive reload without changing level progress.
- Before the first pointer/keyboard gesture, audio remains silent without an autoplay exception; the first interaction unlocks audio without replaying queued SFX.
- Jump, landing, death, pressure plate, door opening, UI hover/select, and level-clear events produce at most one appropriate feedback event per semantic trigger.
- Pause stops music and active continuous SFX; resume does not duplicate loops. Restart, replay, return to title, and level transition leave no old loop playing.
- Verify Levels 1–7 use the warm `toffeeForest` loop, Levels 8–12 use the slower `marshmallowMist` loop, Level 13 can crossfade into `transitionAmbience`, and Levels 14–20 use the bright `caramelMirror` loop.
- With optional menu music paths unset or unavailable, title, settings, pause, level select, all twenty levels, and transitions remain usable without a JavaScript error.
- On a fresh save, the language fork appears before the title. Chinese mode contains only Chinese interface copy; English mode contains only English interface copy. The choice survives reload without changing the legacy save key.
- In Levels 8, 9, 11, and 12, verify the Bible-aligned opening narrative hint appears once in the selected language and does not overlap or replace the existing segment hints.
- Compare Level 1–7 distant scenery with Level 8: World 1 reads as toffee forest/amber chapel/sticky syrup, while World 2 reads as open stepped cloud walls and mist islands rather than the same composition recolored.
- In Levels 16–20, every ladder and spring uses the World 3 rose-gold/champagne skin; no World 2 blue mobility texture remains. Confirm Body sizes, offsets, spring launch velocity, and ladder behavior are unchanged.
- Death uses one smooth fade-out and respawn fade-in; it still increments counters once and restores the same state.
- Completion particles are geometric, clean up on replay/transition, and do not obstruct completion actions.
- Resize below 720px and verify canvas corners and completion buttons remain usable.

## Protected-physics check

Before and after gameplay work, compare the Phaser physics config and player setup/update sections in `js/game.js`. Gravity, collision body, maximum velocity, drag, acceleration, jump velocity, coyote time, jump buffer, and short-jump cutoff must not change unless explicitly requested.

The approved two-stage-jump revision uses first-jump velocity `-475`, second-jump velocity `-430`, two jumps per landing, the existing `-175` short-jump cutoff, 95 ms coyote time, and 110 ms input buffering. Verify the jump count resets only after genuine grounded contact or a level reset.

For character-art work, also verify the player origin remains the Phaser default `(0.5, 0.5)`, display scale remains `1`, depth remains `THEME.depths.actor`, and the Body remains `27 × 38` with offset `(4, 4)` through Idle, Run, Jump, Fall, death, respawn, reset, and level transitions.

## Manual playtest — Level 1

- Complete the level from the normal start without developer intervention.
- Verify left/right movement, facing, full jump, short jump, landing, and edge behavior.
- Verify the first jump is visibly lower than the former single jump, the second jump works once in mid-air, a third press does nothing, and landing restores both jumps.
- Stand still on every moving-platform type and verify the player retains the same relative horizontal position; repeat with a box and confirm only a genuinely contacting box is carried.
- Press left and right together and verify the result is stable and input clears after release.
- Rapidly tap jump near landing and verify buffering does not create repeated unintended jumps.
- Touch the spike: one death, one attempt increment, one feedback sequence, correct respawn.
- Fall below the world: the same single-count death behavior occurs.
- Hold a direction during death and confirm respawn does not leave collision disabled or input stuck.
- Ride the moving platform through reversal and disembark; verify no remote carry afterward.
- Reach the goal and verify death cannot also trigger after `isCleared` is set.

## Manual playtest — Level 2

- Complete the intended plate/door/box route and final raised route.
- Push each box against walls and platforms; verify no tunneling or abnormal acceleration.
- Stand on a box and jump; verify it stays stable.
- Trigger the plate separately with player and box.
- Leave the plate and verify stable release without rapid visual flicker.
- Hold the plate with a box and verify the door stays open with collision disabled.
- Remove pressure and stand in the doorway; verify the door waits to close.
- Repeat with a box in the doorway.
- Drop a box out of bounds; verify delayed individual restoration.
- Press `R`; verify player, both boxes, plate, door, moving platform, and camera reset without a death increment.
- Die by spike and world fall; verify the same full puzzle restoration with one death increment.

## Manual playtest — Level 3

- Complete the full transport, door, falling-platform, spike, and goal route.
- Load the box onto the moving platform without precision placement.
- Verify real contact carries the box with full horizontal synchronization and reversal does not throw it.
- Place the box a visible distance above or beside the platform; verify it receives no platform displacement.
- Ride with player and box simultaneously; verify no penetration or launch.
- Unload the box and verify platform influence stops immediately.
- Hold the plate with the transported box and verify safe door behavior.
- Trigger the first falling platform: warning precedes falling and safe ground prevents forced death.
- Verify later platforms proceed through warning, falling, hidden/resetting, restored, and re-armed states.
- Stay over a restored safe platform and verify it does not immediately loop until the player leaves.
- Press `R` during warning, falling, hidden reset, and box respawn delay; all objects must restore immediately without a death.

## Manual playtest — Level 4

- Complete the intended box transport, box-step, timed-gate, falling-platform, door, spike, and goal route.
- Confirm the player cannot reach the 110-pixel-high staging ledge directly with the protected jump settings, but can reach it from the transported box.
- Verify the box rides only while genuinely contacting the moving platform and stops inheriting motion after unloading.
- At both travel endpoints, verify the 60-pixel moving platform meets each shore edge without rendering inside the fixed terrain.
- Push the box from either side while both player and box ride the moving platform, including during reversal; their visible silhouettes and physics bodies must not overlap.
- Verify no countdown or meter appears on the setup route; stand on the first falling platform and confirm one 9000 ms window starts, turns coral during the final 3000 ms, and does not refresh while continuously occupied.
- Pause during the countdown and confirm the timer, physics, Tweens, and meter remain frozen; resume without shortening or restarting the window.
- Let the timer expire before reaching the door; verify it closes. Return to the first falling platform and verify a new attempt works without refreshing the page.
- Stand in the doorway at expiry, then repeat with a box; verify closure waits until the safety rectangle is clear.
- Trigger each falling platform, cross the fixed middle rest point, and verify warning/fall/restore/re-arm behavior is unchanged.
- Touch each spike and fall from the route; each valid death increments once and restores the complete Level 4 setup.
- Press `R` before activation, during countdown, during door closure, and during falling-platform reset; verify a complete reset with no death increment.
- Complete Level 4 and verify Level 5 unlocks without changing the Level 4 retry path.

## Manual playtest — Level 5

- Remain still at the entrance: the first overhead demonstration must not hit the player.
- Confirm all seven cannons show a 0.5–0.8 second warning and always keep their configured direction, speed, interval, and phase.
- Confirm fireballs disappear on fixed platforms and the box, never push the box, and never exceed the 32-object pool.
- Push the box into several wrong but reachable positions; `R` must restore it without adding a death.
- Activate the checkpoint, die in every later segment, and verify the player returns there while the box, cannons, fireballs, moving platforms, and falling platforms reset.
- Pause during warning and while a fireball is moving; neither the schedule nor the projectile may advance.
- Die 20 times in mixed sections and compare the active projectile count and frame pacing with the first run.
- Complete the level and verify Level 6 unlocks, its name appears in Level Select, and no projectile can kill the player after completion.

## Manual playtest — Level 6

- Observe one full A/B cycle before entering. Verify the states appear in order: retracted, warning, extending, extended, retracting.
- Walk through every retracted spike group and verify there is no residual lethal collision.
- Deliberately touch each group only after it is visibly extended; every valid death increments exactly once.
- Pause during warning and during a transition; both A and B groups must freeze without phase drift.
- Repeat death and reset at both checkpoints; every spike pair must restart at its configured shared phase.
- Test the box at both edges of its lane and against the cannon. It must block fireballs without being pushed or causing a permanent soft lock.
- Ride both moving platforms from both directions; verify neither can push the player into a wall or an already invisible hazard.
- Land from the second moving platform and verify there is a stable waiting area before the final alternating pair.
- Cross the final alternating pair, then traverse all three falling platforms using both 140-pixel fixed islands; each island must remain safe for an unlimited wait.
- Verify the final cannon is visible before its projectile can intersect the higher falling-platform route, then confirm the goal buffer is nonlethal.
- Complete Level 6 and verify Level 7 unlocks with the name 棉花糖升降站 while all older progress and settings remain intact.

## Manual playtest — Level 7

### Current World 1 finale

- Compare Levels 1–5 side by side and verify their backgrounds read as one warm toffee/amber route: caramel terrain, sticky syrup, stepped forest silhouettes, and sparse amber chapels, with no perspective faces or added collision.
- Move consecutively from Level 5 through Levels 6 and 7. Verify saturation and motif density reduce gradually rather than changing abruptly, while Level 7 remains visibly part of World 1.
- Restart Levels 1–7 repeatedly and verify the reusable tree/chapel scenery is destroyed and recreated exactly once, with no duplicate background shapes.
- Verify Level 7 creates no box, door, falling platform, alternating spike, or timed switch.
- Walk through each ladder without pressing Up/Down and verify the player does not attach automatically.
- Enter every ladder from both directions; climb up/down, stop in place, leave with Left/Right, jump away with Space, and step naturally onto the exact top surface.
- Verify the lightly padded ladder entry accepts near-edge Up/Down input, applies only a capped center correction, and never teleports the player.
- Trigger both springs from above without pressing Jump. Verify side and underside contact do not trigger.
- Verify the spring shows its compressed texture for 65 ms, restores the normal texture, applies one upward velocity, plays one sound, and respects its cooldown.
- Miss every moving-platform transfer and verify the recovery strip returns the player to the entrance or active checkpoint without increasing deaths.
- Verify five horizontal speeds (60/72/78/105/115), the final vertical carrier, both ladders, and both springs remain understandable without a blind landing.
- Confirm the removed right-side ladder is absent and the final route remains reachable through the existing platform sequence.
- On all three spike-carrying platforms, verify each spike stays aligned with its carrier at both endpoints and leaves a usable safe side.
- Verify the difficulty rises from recoverable ladder/spring teaching into visible spike and fireball pressure without an unavoidable hit.
- Activate the midpoint checkpoint, recover from a missed transfer, and verify platform phase, spring texture/cooldown, ladder state, gravity, and jump state return deterministically.
- Press `R` while climbing and during spring compression; verify timers are cancelled, gravity is restored, and the entrance restart adds no death.
- Verify Level 7 retains the World 1 skin through its goal, then complete it and confirm Level 8 unlocks as the formal World 2 opening.

## Manual playtest — Level 8

### Current World 2 opening

- Enter from Level 7 and verify the warm background fades into mint/mist-blue while `World 2：棉花糖迷霧` fades in, remains for two seconds, and fades out without blocking control.
- Compare Level 8 directly with Levels 1–5. Its mint sky, mist-blue syrup, cold blue terrain, open negative space, and fog must make the world boundary obvious at a glance.
- Verify Level 8 fixed platforms use the cold `ground-world2` presentation while retaining the same platform dimensions and collision behavior.
- Verify both fog layers drift slowly behind terrain and mechanisms, have no collision bodies, and stop leaving tweens after replay or level transition.
- Verify the World 2 moving-platform, cannon, and fireball textures use their cold-pastel skin while the same objects in Levels 1–7 retain their original textures.
- Verify Level 7 retains the World 1 skin through its goal; the visible and musical World 2 transition begins only when Level 8 starts.
- With the World 2 music path absent, verify Level 8 remains playable and the prior music fades out safely. After a valid file is supplied, verify the World 1 track fades out and the World 2 track fades in.
- Press `R` after either checkpoint and verify the level restarts at the World 2 entrance without increasing deaths.
- Complete Level 8 and verify Level 9 unlocks as `棉花糖霧塔`, Next Level remains available, and existing settings/progress survive reload.
- Reload an older Level 7 save and verify Level 8 unlock state is derived without clearing progress, settings, or completed markers.

- Verify the opening horizontal platform, ladder, and spring can be completed before any cannon activates.
- Use both fixed shelters in the standalone cannon lane and verify no moving platform is required there.
- Cross the relaxed 60 px/s platform against its 3800 ms cannon, then activate checkpoint one at x = 4250.
- Confirm the formal ladder is protected from the y = 390 fireball lane by the visible fixed cover; climbing must not contain an unavoidable hit.
- Ride the 82 px/s vertical platform only after the cannon is visible and warned.
- Use the formal spring, then cross the 72 and 102 px/s horizontal platforms. Verify the two cannon directions do not create a simultaneous closed window.
- Activate checkpoint two at x = 6970 and verify it is left of the right-facing cannon, outside its projectile path.
- Complete the final short-ladder, vertical-platform, and horizontal-platform sequence while reading at most one intersecting fireball lane at a time.
- Confirm all seven platforms, six cannons, three ladders, one spring, six total spikes, and two checkpoints reset deterministically after death.
- Verify the three carrier-mounted spikes stay visually and physically aligned at both travel endpoints, and that each affected platform retains a safe standing area.
- Die 20 times after checkpoint two and verify the fireball pool remains bounded, spring delayed calls do not multiply, and ladder gravity state never persists.
- Reach the final ground behind the last left-facing cannon and verify no fireball remains active after goal completion.

## Manual playtest — Level 9

- Enter from Level 8 and verify the level remains in the World 2 cold palette, uses World 2 terrain/mechanism skins, and starts at the tower base without replaying the Level 8 world-title transition.
- Verify the physics world spans `y = -2050` through `640`, the camera follows a full spring launch without losing the player, and the next required landing is visible before commitment.
- Floor 1 (`470 → 0`): transfer from the ladder to the 100 px/s carrier and into the second ladder. Miss from both carrier endpoints and confirm the fall route is readable.
- Floor 2 (`0 → -450`): trigger the spring without Jump, steer to the safe side of the spike landing, and verify side/underside spring contact still does not trigger.
- Activate checkpoint 1 at `(455, -483)`. Die on Floor 3 and verify respawn `(455, -495)`, deterministic carrier positions, restored gravity, and a reset shared cannon clock.
- Floor 3 (`-450 → -900`): observe several complete cycles of the 96 px/s lift and `3333 ms` cannon. Verify their safe crossing phase does not drift after pause/resume or repeated death.
- Floor 4 (`-900 → -1350`): ride the 115 px/s lift through the narrow shaft while the `2869 ms` cannon is active. Verify there is no side route that separates the lift and projectile timing.
- Activate checkpoint 2 at `(520, -1383)`. Die on Floor 5 and verify respawn `(520, -1395)` without retaining spring compression, ladder gravity suppression, active fireballs, or stale camera position.
- Floor 5 (`-1350 → -1920`): complete ladder → spring → spike-side landing → 112 px/s carrier → final ladder as one chain.
- Deliberately miss each Floor 5 transfer and verify the player falls into earlier tower space rather than being silently teleported to the same floor.
- Reach the final platform and verify the goal is accessible in under three seconds, hazards stop immediately, Replay works, Level 10 unlocks, and Next Level is available.
- Press `R` from both checkpoints and while climbing, spring-compressing, riding a lift, and during cannon warning. Verify a tower-base restart with no death increment and no duplicated timer/collider.
- Repeat 20 deaths across Floors 3–5 and verify cannon phase remains deterministic, the fireball pool stays bounded, fog tweens do not multiply, and Console remains clean.
- Reload an older save containing Level 8 in `completedLevels`; verify Level 9 unlocks without changing the existing storage key or clearing settings.

## Manual playtest — Level 12

- Complete the sequence section through all four carriers and verify the `92/108/124/136 px/s` rhythm is readable without changing player physics.
- Die on the carrier-mounted spike and miss each transfer; confirm one death per lethal contact and respawn at the latest checkpoint.
- Complete the synchronization section with both cannons, the alternating-spike pair, three carriers, and both falling platforms. Pause during each warning and verify all clocks remain frozen.
- Repeat checkpoint-1 deaths 20 times; verify fireballs remain bounded, carrier phases reset, alternating spikes remain synchronized, and falling-platform timers do not duplicate.
- Push the corridor box into each wall, beneath the lift, and out of the intended cover position. Verify fireballs disappear on contact without moving the box and `R` restores it.
- Traverse the spatial-restriction section without the box only if an intentional skill route exists; otherwise confirm the box cannot create a permanent soft lock.
- From checkpoint 3, complete the lower route by moving the nearby box onto the pressure plate. Verify the full-height door opens, cannot close on player or box, and closes only after the doorway is clear.
- Complete the upper shortcut by entering through the spring, crossing all three fast carriers, activating the falling-platform timer, and reaching the door inside `6800 ms`.
- Confirm walking along the lower route does not mark the player as a shortcut entrant and cannot collect the upper keepsake.
- Collect the keepsake once, reload the page, and verify `collectedItems` retains it without changing completed levels, audio settings, or old saves that lack the array.
- Die and press `R` before and after collecting. The collectible must not duplicate, reappear incorrectly, or block completion.
- Verify all three checkpoint markers use the documented respawns and `R` always returns to `(90, 425)` without increasing deaths.
- Reach the goal by both routes. Input and all lethal systems must stop immediately; Level 12 shows Next Level and unlocks Level 13.
- Transition repeatedly among Levels 10, 11, and 12 and inspect Console for stale silhouettes, fog tweens, colliders, cannon callbacks, falling-platform delayed calls, or duplicated objects.
- Confirm the Level 9 tower, Level 10 boss silhouette, and mirror-color strips remain parallax decoration only and never affect collision.

## Repetition and lifecycle checks

- Repeat spike death and world-fall death at least five times in each affected level.
- Press `R` repeatedly, including during a death feedback sequence, and check counters and state.
- Repeat the full twenty-level sequence and representative Replay paths.
- Alternate Levels 9 through 20 twenty times from Level Select and inspect for stale fireballs, spike bodies, colliders, timers, warning audio, fog tweens, companion visuals, or duplicated platform motion.

## Manual playtest — Level 13

- Complete both slow carrier/cannon combinations without waiting through more than one full cannon cycle.
- Confirm the isolated spike is readable and does not combine with another lethal timing rule.
- Activate each checkpoint, die once after it, and confirm mechanisms, fog/glints, music state, and camera restore deterministically.
- Traverse `x = 2850 → 5200` and confirm fog thinning, mirror glints, and the music handoff progress as one gradual transition.
- Confirm the low procedural transition ambience fades in without a Console error; setting a future audio path must remain a drop-in replacement.
- Confirm the small mud figure begins on the ground even when the save already contains its ID. It must not begin seated on the player's head in Level 13.
- Touch the small mud figure, verify its two-line dialogue appears once, and confirm it changes from the lightly swaying standing pose to a seated black stick figure attached to the player's head only after the dialogue ends.
- Die during the dialogue and confirm the ground encounter is restored without duplicating the dialogue Timer. Die after pickup and confirm the seated companion returns with the checkpoint respawn.
- Press `R` after pickup and confirm Level 13 restarts its complete ground encounter while the persistent companion ID remains owned for later levels.
- Reload the page and confirm the existing version-1 save retains the companion ID without losing earlier unlocks or collectibles, while Level 13 still replays its encounter in the intended order.
- Confirm the Level 13 goal cannot complete before pickup and becomes normally completable afterward.

## Manual playtest — Level 14

- Enter from Level 13 completion and from Level Select; confirm the companion begins behind the protagonist in both cases.
- Walk both directions and jump repeatedly; confirm the companion changes sides with facing, remains visually attached, and never changes player collision or movement values.
- Complete the three isolated spike reads and confirm the midpoint checkpoint limits repetition without changing `R` behavior.
- Die after the midpoint checkpoint; confirm the companion reattaches at the checkpoint and the mirror-pool ending returns to its untouched state.
- Press `R`; confirm the level restarts at `(90, 425)`, deaths do not increase, and the companion remains carried.
- Reach the mirror pool; confirm the companion is placed at the pool edge, the indistinct water silhouette lasts less than one second, no explanatory text appears, and the all-clear panel follows.
- Replay Level 14 and alternate between Levels 13 and 14 repeatedly; confirm no duplicate companion, mirror-pool tween, ending Timer, collider, or presentation object survives cleanup.

## Manual playtest — Levels 15 and 16

- Complete Level 15 from the entrance with the companion visible behind the player before `x = 2920`.
- Confirm the full-height separation trigger cannot be jumped over, player input pauses only during the short transfer, the mirror bars close, and the companion remains visible inside the cell.
- Die before and after separation; verify the correct carried/separated presentation is restored and no follower duplicates.
- Press `R` after separation; verify Level 15 restarts from `(90, 425)` with the companion carried and deaths do not increase.
- Reload after separation and confirm `mud-companion-separated` remains in `collectedItems`.
- At the final Level 15 box-door section, push the box onto `final-crate-ferry`, verify it stays synchronized through both reversals, unload it onto the far platform, and press the door plate.
- Complete every Level 15 carrier/cannon, alternating-spike, falling-platform, and final box-door section from its intended checkpoint.
- Enter Level 16 from progression and Level Select; confirm no companion follower is created.
- Confirm the shortened Level 16 upper landing islands no longer allow walking over `slide-b` or `final-slide`; both moving platforms must be visibly useful and reachable.
- Push the final Level 16 box onto its shortened `final-crate-ferry`, ride it across the 130-pixel gap, unload the box, and open the door.
- Complete both paired-carrier chains, all three alternating-spike groups, all four falling platforms, and the final box-door section.
- Repeat deaths and `R` resets in both levels; inspect for duplicate fireballs, platform motion, alternating-spike controllers, companion visuals, cell bars, colliders, or delayed callbacks.
- Watch for duplicate callbacks, faster-than-normal platform motion, duplicate UI, repeated door animations, or multiple respawn effects.
- Confirm `activeColliders` does not grow after level transitions in diagnostic testing.
- Confirm no old Timer or Tween changes a destroyed object after transition.
- Confirm no refresh is required to recover from a lost box or failed falling-platform sequence.

## Audit reporting

For every check, record whether it was command-checked, browser-observed, manually played, suspected from code inspection, or not verified. Never convert a code inference into a claimed playtest result.

## Manual playtest — Levels 17–20

- Level 17: activate checkpoint one, clear the spike, use the spring to reach the `x = 2050` ledge, and cross all six bubble platforms without an extreme jump.
- Level 17: ride the ferry through at least three cannon cycles, then die and press `R`; verify fireballs, bubbles, spring, ferry, and falling platforms reset once.
- Level 18: climb all six floors from the entrance without skipping a floor. Verify the floor-one carrier reaches the exit ladder, the spring above the second ladder has a completely safe required landing, and the floor-three lift overlaps its exit ladder at the top of travel.
- Level 18: verify the upper wind/carrier section feeds two consecutive springs without a ladder, then verify the final rightward wind field makes both offset spring landings readable and leaves the floor-six carrier with a spike-free standing side.
- Level 18: enter both teleport pairs in both directions. Verify the first pair connects the floor-two cloud route to the cannon shaft and the second connects the alternating-spike corridor to the floor-five cloud climb without placing the player over an unsupported gap.
- Level 18: verify the three checkpoints restart on supported platforms after floors two, four, and five, and that each checkpoint still requires the remaining intended ascent tools.
- Level 18: verify the non-colliding mud traces sit on safe landings, become more frequent near the reunion, remain behind gameplay actors, and cannot be mistaken for spikes or interactive objects.
- Level 18: verify all three checkpoint markers and respawn positions are visibly separate from teleport jars and springs. Activating or respawning at a checkpoint must not immediately trigger either mechanism.
- Level 18: reset or leave the level during each teleport phase, then die during a teleport cooldown, cannon warning, and reunion dialogue; verify player visibility, scale, physics, camera follow, and all timers restore deterministically with no duplicate companion or dialogue timer.
- Level 19: complete the opening three-spring ascent without using a ladder, then complete both wall-separated branch routes. Verify the left route uses broad supported spring landings and the right teleport/cloud route reconnects above the internal wall.
- Level 19: verify both floor-textured outer walls and the internal branch wall block the player, fireballs, and unintended horizontal shortcuts while leaving the intended lower branch opening and upper merge clear.
- Level 19: verify the cannon lift retains a spike-free standing side and the final opposing wind fields guide the two spring transfers in their intended directions.
- Level 19: observe the floor/ceiling alternating pair for ten cycles, pause and resume, then die repeatedly; verify the shared phase, mask, and collision state do not drift.
- Level 20: complete the box/plate/door opening, the spring/cannon-lift ascent, the upper wind-carrier/cloud route, the downward teleport, and the left-moving return carrier/alternating-spike corridor in that order. Verify the route changes direction instead of continuing as one horizontal or vertical line.
- Level 20: verify the upper carrier-mounted spike retains a safe standing side, the teleport destination and its checkpoint do not overlap, and the return carrier reaches the fixed left platform.
- Level 20: walk through the central area during both the initial outward trip and final return; verify no farewell dialogue triggers and the companion remains carried. Activating the final return checkpoint must reveal the goal immediately. Entering the goal must start the ending cinematic, whose dialogue is the only formal farewell.
- In Levels 17–20, repeat each checkpoint death and `R` reset while a timed mechanism is active. Inspect Console for stale timers, duplicate colliders, pooled fireball growth, or destroyed-object callbacks.
