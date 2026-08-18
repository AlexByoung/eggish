# Level Design

This document records the behavior implemented by the current code. It is not permission to rebalance layouts or physics.

## Level 1 — movement, jump, and moving-platform introduction

### Core concept

Learn the protected movement/jump model, avoid one spike, and use a moving platform to cross the larger gap to the goal.

### Prior knowledge

None. The level provides basic movement text, a two-step double-jump demonstration that explicitly shows the second press in midair, and a moving-platform hint.

### Rules introduced or combined

- Horizontal movement and facing.
- Full and short jump behavior, including an explicit keyboard/touch explanation of the second midair press used for the double jump.
- Red spikes cause death.
- Green platforms move and can carry the player.
- The bright flag-like object is the goal.

### Intended thought chain and normal route

1. Move right and read the spike as a hazard.
2. Jump over the spike and onto the raised gray platform.
3. Observe the green platform moving horizontally at the same usable height.
4. Board it when it approaches, ride toward the right platform, then disembark.
5. Reach the goal to reveal Next Level and Replay.

### Alternatives and errors

- Different jump timing over the spike is acceptable.
- Waiting on either safe platform for the moving platform is acceptable.
- Missing the moving platform or touching the spike causes a normal counted death.
- No puzzle object can be permanently lost in this level.

### Recovery and acceptance

Death restores the Level 1 start, camera, and player state. Acceptance requires reliable spike death, moving-platform transport, reachable goal, correct counters, and successful transition to Level 2.

## Level 2 — persistent pressure through box placement

### Core concept

Discover that a pressure plate opens a distant door only while held, then use a box to keep it active. Reuse a second box as a step to reach the raised final route.

### Prior knowledge

Movement, jumping, hazards, moving platforms, goals, and fast retry from Level 1.

### Rules introduced or combined

- Orange boxes can be pushed and stood on.
- Player or box contact activates a yellow pressure plate.
- The plate controls the purple door indicated by a yellow link.
- The door disables collision while open and waits for a clear doorway before closing.
- A second box can be used for height, not only as a switch weight.

### Intended thought chain and normal route

1. Safely learn that side contact pushes the first box.
2. Step on the visible plate and observe the linked door open, then close after leaving.
3. Infer that the nearby box can maintain pressure.
4. Push the first box onto the plate and pass through the held-open door.
5. Move the second box into a useful step position and climb to the raised platform.
6. Avoid the raised spike, use the moving platform, and reach the goal.

### Alternatives and errors

- The first box may approach the plate from different positions.
- The second box may be positioned at more than one workable distance from the step.
- Standing personally on the plate is valid observation but cannot cover the implemented plate-to-door distance before safe closure.
- Boxes that leave world bounds hide and restore at their own spawn after the configured delay.
- `R` immediately restores the full Level 2 puzzle without adding a death.

### Possible soft locks and recovery

- A badly positioned but still in-bounds box may be inconvenient; `R` is the supported recovery.
- Door closure must wait while the player or a box occupies the safety rectangle.
- Death and `R` must restore both boxes, the plate, door collision, moving platform, player, and camera.

### Acceptance

Both player and box activate the plate; the box holds it stably; the door has no hidden collision while open and never closes on an occupant; the second box supports the climb; all states reset; the goal transitions to Level 3.

## Level 3 — transporting a box, then falling-platform execution

### Core concept

Combine known box/plate/door rules with moving-platform transport, then introduce falling platforms safely before a short combined traversal.

### Prior knowledge

All Level 1 movement and moving-platform rules plus Level 2 box, pressure-plate, door, hazard, reset, and box-as-step rules.

### Rules introduced or combined

- A genuinely contacting box rides the wide moving platform with full horizontal synchronization.
- A separated box must not receive platform displacement.
- Brown platforms warn before falling, disappear, restore after a delay, and require the player to leave before re-arming.
- The first falling-platform demonstration is backed by safe ground; later platforms cross a gap.

### Intended thought chain and normal route

1. Cross the short safe opening and identify the box, moving platform, far-side plate, and closed door.
2. Wait for the wide green platform to reach the loading side.
3. Push the box onto it and board or follow it across the gap.
4. At the unloading side, push the box onto the plate so the linked door stays open.
5. Pass the door and naturally trigger the safe falling-platform demonstration.
6. Read the warning and continue through the later falling platforms, using the fixed safe platform to reset timing.
7. Avoid the final spike and reach the goal.

### Alternatives and errors

- The player may cross separately from the box or ride beside it.
- Loading and unloading timing may vary as long as real contact is maintained.
- A box falling out of bounds restores after the configured delay; `R` immediately restores the entire puzzle.
- Waiting too long on an exposed falling platform may cause a counted world-fall death.
- The intended door cannot be bypassed without the transported box under the current layout.

### Possible soft locks and recovery

- A box can be pushed into a poor in-bounds position; `R` is the supported recovery.
- Moving-platform contact must expire immediately after separation to avoid remote box movement.
- Falling-platform timers and tweens must be cancelled on death, `R`, completion, and level cleanup.
- A restored falling platform does not re-trigger until a stationary player leaves it once.

### Acceptance

The box loads, remains controllable, survives platform reversal, unloads, and holds the plate; the door is safe; the first falling platform teaches without death; later platforms warn/fall/restore; the final goal and Replay work; repeated reset creates no duplicate lifecycle objects.

## Level 4 — 軟糖節拍橋: plan, time, and execute

### Core concept

Introduce the automatically triggered timed gate as the only major new rule. The player prepares the route first; stepping onto the first falling platform commits to the timed sequence.

### Prior knowledge

All protected movement plus box transport, moving platforms, falling platforms, spikes, doors, fast death recovery, and `R` reset from Levels 1–3.

### Rules introduced or combined

- Standing on the first falling platform opens the linked purple door for 9000 ms.
- On first-platform contact, a solid-color meter appears, drains during the active window, and turns coral for the final 3000 ms. It remains hidden before contact and after expiry/reset.
- Remaining on the trigger platform does not refresh the timer; after leaving it can start a new attempt following expiry.
- Door closure keeps the existing doorway-occupancy safety rule.
- Existing boxes, moving platforms, falling platforms, and spikes retain their established behavior.

### Intended thought chain and normal route

1. Observe the separated shores, box, moving platform, raised staging ledge, linked door, and route beyond it.
2. Wait for the moving platform, transport the box to the far shore, and place it below the raised ledge.
3. Use the box as a step and reach the staging ledge without starting the timed section.
4. Wait until ready, then step onto the first falling platform to begin the countdown.
5. Move continuously across the falling-platform chain, using the fixed middle rest point if needed.
6. Clear the first ground spike, pass the door before it closes, clear the final spike, and reach the goal.

### Alternatives and errors

- The player may ride beside the box or cross separately once genuine box/platform contact is established.
- A failed timer attempt is recoverable by returning to the first falling platform; no death or refresh is required.
- If the timer expires while the player or box occupies the doorway, closure waits until the doorway is clear.
- Lost boxes restore after the existing delay; `R` restores the complete level immediately without adding a death.
- Falling from the timed route or touching a spike causes one counted death and a full Level 4 reset.

### Acceptance

The box cannot be skipped for the 110-pixel staging ledge under the protected jump model; the box transports and unloads reliably; first-platform contact starts one timed window and pauses with the Scene; the meter, expiry, retry, and safe door closure remain synchronized; the falling platforms reset; both hazards count once; Level 4 completion unlocks Level 5.

## Level 5 — 太妃糖爐廊: read, shelter, and advance

### Core concept

Fixed-phase fire cannons make danger observable before it becomes lethal. The route teaches the warning signal safely, then asks the player to cross between cover, push one box as a movable shield, ride two moving platforms, and finish through a short two-cannon sequence.

### Route

1. Watch one overhead fireball cross the starting space and disappear at a wall.
2. Use three low cover pillars to cross a torso-height firing lane.
3. Push the existing box toward a left-facing cannon so the box absorbs projectiles.
4. Activate the single checkpoint, then use two moving platforms with a safe island between them.
5. Cross a short falling-platform chain and its central safe island.
6. Read two differently phased cannons through the final fixed-spike route.
7. Enter a completely safe goal buffer.

### Recovery and acceptance

The level contains seven cannons, one box, two moving platforms, four falling platforms, five fixed spike regions, and one session checkpoint. Fireballs never move or destroy the box. Death resets every cannon, projectile, box, moving platform, and falling platform to a deterministic state while keeping the checkpoint. `R` clears the checkpoint and returns to the entrance.

## Level 6 — 薄荷可可輪班廠: plan around a shared rhythm

### Core concept

Seven A/B spike pairs share one clock. Floor and ceiling groups alternate through retracted, warning, moving, and extended states. The route first isolates that rhythm, then combines it with elevation, fireballs, a box shield, moving platforms, and a final falling-platform exam.

### Route

1. Observe and cross two safe, readable A/B pairs without fireballs.
2. Use a short three-step elevation section with one A/B pair.
3. Pass the first checkpoint, then cross a deliberately offset fireball/spike combination.
4. Reach a second checkpoint and push one box through a spike-limited fireball lane.
5. Ride two moving platforms through one alternating pair while a slow outer cannon establishes the second rhythm.
6. Land on a fixed observation shore, pass one alternating pair, then cross a three-platform falling route under one cannon. Two 140-pixel fixed islands split the falling route into readable steps.
7. Enter a fully safe final buffer and complete the factory route.

### Recovery and acceptance

The level contains fourteen alternating spike groups arranged as seven synchronized pairs, five cannons, one box, two moving platforms, three falling platforms, two fixed spike regions, and two session checkpoints. Death restores all mechanisms to their initial phase while keeping the latest checkpoint. `R` clears both checkpoints. Retracted spikes have no lethal body; warning and motion remain visually aligned with collision activation.

## Level 7 — 棉花糖升降站: World 1 finale and transfer between moving axes

### Current design — mobility-tool teaching and World 1 finale

Level 7 is the final 太妃糖林 level. It teaches ladders and small springs safely before combining them with the existing patrol-platform component, then adds sparse fixed fireball and spike pressure, including readable spikes mounted on selected carriers. The escalation is deliberate: missing an ordinary transfer uses the nonfatal recovery strip, while touching a clearly visible hazard remains a counted death. It still contains no boxes, doors, falling platforms, or timed switches.

1. Cross slow and fast horizontal carriers with broad shores.
2. Enter the first ladder with Up/Down and climb to a wide fixed platform; the small contact padding forgives near-edge input without pulling in passing players.
3. Trigger the first spring from above and land on a broad, motionless teaching platform.
4. Combine a short ladder with 78 px/s and 115 px/s horizontal carriers.
5. Use a spring to reach the observation area for an 88 px/s vertical carrier.
6. Activate the midpoint checkpoint, cross the final horizontal carrier while reading its offset mounted spike, and transfer to the last lift without using a redundant right-side ladder.
7. Ride the retained 60 px/s final lift while keeping to the visible safe side of its mounted spike, then disembark on the goal ground.

The current version contains five horizontal carriers at 60, 72, 78, 105, and 115 px/s; one vertical carrier; two ladders; two springs; two cannons; three fixed spikes; three carrier-mounted spikes; and one checkpoint. An invisible recovery strip catches ordinary gap falls before the normal world-death line, restores the latest safe spawn and deterministic platform phase, and does not increment deaths. Spike and fireball contact remains a normal counted death. Its closing composition may foreshadow thinner air and an uncertain route ahead through text and pacing, but it retains the complete World 1 visual skin.

## Level 8 — 棉花糖迷霧地帶: enter World 2 and restore the shared rhythm

### Current design — teaching-to-exam continuation

Level 8 is the formal World 2 opening and does not reset the difficulty curve. It introduces no new movement rule; it applies the ladder and spring behavior learned in Level 7 under fixed, warned fireball pressure, with cold World 2 skins and fog providing the clear world boundary:

1. Safely chain one horizontal platform, one ladder, and one spring before any cannon activates.
2. Cross a standalone cannon lane with two fixed low shelters and no moving platform.
3. Use a 60 px/s platform with a right-side spike against a relaxed 3800 ms cannon. Three falling platforms with a rainbow-cloud skin rise above this lane; their lowest collision body is above the normal single-jump dodge space, so the lower solution remains unobstructed.
4. Climb a protected ladder, wait behind a fixed low cover, and transfer to an 82 px/s vertical platform under one visible cannon.
5. Use a spring to stage for 72 and 102 px/s horizontal carriers while two fixed-phase cannons establish successive directions, then activate checkpoint two.
6. Complete the World 2 exam with a short ladder, one spring, an 86 px/s vertical platform, an 82 px/s horizontal platform, and the two visible exam-direction cannons.
7. Pass behind the final left-facing cannon into a fully safe goal strip; completion immediately disables all pooled projectiles.

The current version contains seven moving platforms, six cannons, three ladders, one spring, three rainbow-cloud falling platforms, three fixed spikes, three carrier-mounted spikes, and two checkpoints. It still contains no boxes, doors, random intervals, or new projectile types. Camera-range activation plus phase offsets ensures every cannon is visible before its first warning and shot. Mounted spikes occupy only one side of their carriers so every affected platform retains a readable standing area. Spikes are inherited secondary pressure; moving-platform and cannon synchronization remains the primary World 2 concept.

## Level 9 — 棉花糖霧塔: vertical pressure and committed transfers

### Core concept

Level 9 extends the Bible's approved World 2 cannon/synchronization direction into a five-floor vertical tower. It adds no new player ability or hazard. Difficulty comes from switching among ladders, springs, horizontal transfers, synchronized lifts, fireball lanes, and precise spike-side landings while a failed transfer can drop the player one or two floors.

The world runs from `y = 470` at the tower base to `y = -1920` at the goal platform. Negative Y is intentional: the existing bottom-of-world death rule remains unchanged, while the camera receives a vertical bound from `-2050` to `540`.

### Floor coordinates and route

1. **Floor 1 — `470 → 0`: ladder/carrier transfer.** Climb the entry ladder at `x = 270`, leave it for the 100 px/s horizontal carrier at `y = 250`, then jump into the exit ladder at `x = 680`. Missing the transfer falls to the tower base.
2. **Floor 2 — `0 → -450`: spring direction landing.** Trigger the spring at `(650, -14)`, steer left onto the platform whose top is `y = -145`, avoid the spike at `(580, -149)`, then climb the ladder at `x = 455`.
3. **Floor 3 — `-450 → -900`: synchronized lift lane.** Board the 96 px/s lift at `x = 455`. Its 320-pixel travel and the cannon at `(810, -616)` share the reset clock; the cannon uses a `3333 ms` interval, `150 ms` phase offset, `600 ms` warning, and `220 px/s` projectile speed. A short exit ladder reaches the next floor.
4. **Floor 4 — `-900 → -1350`: space-limited shaft.** Ride the 115 px/s lift inside the walls at `x = 380` and `x = 650`. The cannon at `(625, -1071)` uses a `2869 ms` interval, `1090 ms` phase offset, `580 ms` warning, and `230 px/s` projectile speed. The lift and cannon cannot be handled in separate spaces.
5. **Floor 5 — `-1350 → -1920`: committed final chain.** Climb to the spring at `(520, -1554)`, steer onto the `y = -1680` landing while avoiding its right-side spike, jump to the 112 px/s horizontal carrier at `y = -1770`, then transfer to the final ladder at `x = 390`. The goal platform is the only broad fully safe buffer and requires less than three seconds of movement to reach the goal.

### Checkpoints and reset

- Checkpoint 1 is at `(455, -483)` with respawn `(455, -495)`, immediately after Floors 1–2.
- Checkpoint 2 is at `(520, -1383)` with respawn `(520, -1395)`, immediately after Floor 4.
- Hazard death keeps the latest checkpoint and resets platforms, springs, fireballs, cannon phase, ladder gravity state, and camera.
- `R` clears both session checkpoints and restarts from `(170, 425)`.
- Ordinary missed transfers are not caught locally; the player can fall back through one or more earlier floor spaces before reaching the bottom death line.

### Tuning

All floor boundaries and mechanism coordinates are in `js/constants.js`:

- `LEVEL_9_FLOOR_BOUNDS`: floor height ranges.
- `LEVEL_9_PLATFORM_CONFIGS`: platform axis, distance, speed, and starting position.
- `LEVEL_9_LADDER_CONFIGS` and `LEVEL_9_SPRING_CONFIGS`: vertical connections and launch strength.
- `LEVEL_9_CANNON_CONFIGS`: `interval`, `phaseOffset`, `warningMs`, and projectile `speed`. Adjust `phaseOffset` first when the safe crossing moment is misplaced; adjust `interval` together with the paired lift's half-cycle only when the pattern drifts.
- `LEVEL_9_SPIKE_CONFIGS` and `LEVEL_9_CHECKPOINT_CONFIGS`: landing pressure and punishment boundaries.

## Level 10 — 棉花糖雾灵殿: environmental boss

### Core concept

Level 10 is the game's single environmental boss encounter. 蛋仔 gains no attack: the player reads the mist spirit's warning and charge, then uses existing spikes and the box/pressure-plate trap to land three environmental hits. Phase one teaches the lure safely, phase two requires arming the central box trap, and phase three asks for two consecutive dodges before the second charge is redirected.

### Completion and reset

The exit remains closed until all three hits are registered. Warning, charge, recovery, trap state, box position, hit pips, and the boss Body return through the normal level reset lifecycle. A boss collision or arena hazard counts one death; `R` restarts the arena without increasing deaths. The localized phase HUD is guidance only and does not alter timing.

## Level 11 — 雾潮分岔站: committed route choice

### Core concept

Level 11 deepens World 2 synchronization through a constrained opening gauntlet and one explicit branch. The lower route is longer and more readable; the upper shortcut is fog-obscured, faster, and carries the run-local extra mist-sugar reward. Both routes reuse existing carriers, cannons, spikes, ladders, springs, and checkpoints rather than introducing a new movement rule.

### Choice and recovery

The route signs and brief protagonist line establish commitment without revealing a complete solution. Shortcut failure returns to the branch checkpoint, and the optional reward never blocks completion or permanent progression. Death, `R`, pause, and transition cleanup must remove route fog, reward feedback, fireballs, colliders, and timers without duplicating them.

## Level 12 — 棉花糖毕业回廊: World 2 graduation

### Core concept

Level 12 introduces no new player ability or hazard. It is a four-part graduation route that deliberately reuses almost every learned non-boss mechanism: horizontal and vertical carriers, ladders, springs, fixed and carrier-mounted spikes, alternating spikes, fire cannons, falling platforms, boxes, a pressure plate, a timed trigger, a door, checkpoints, and a branch-only collectible. The World 2 boss returns only as a non-colliding background silhouette.

### Segment coordinates and route

1. **Sequence — `x = 0 → 1800`.** Transfer across four carriers at `92`, `108`, `124`, and `136 px/s`, switching between horizontal and vertical motion. A ladder, spring, and one carrier spike force distinct transfer reads without adding projectile pressure.
2. **Synchronization — `x = 1800 → 3650`.** Three carriers at `132`, `126`, and `142 px/s` share the lane with two deterministic cannons (`1800/1720 ms`) and one alternating-spike pair. Two falling platforms form the exit chain.
3. **Spatial restriction — `x = 3650 → 5350`.** One box supplies projectile cover inside a low corridor. A horizontal carrier, vertical lift, ladder, fixed spike, wall, and `1900 ms` cannon must be handled in the same constrained space.
4. **Branch choice — `x = 5350 → 7600`.** The lower route uses a box/pressure-plate door solution with a slower cannon and alternating spikes. The upper shortcut uses a spring, three faster carriers, a carrier spike, a `1650 ms` cannon, and a `6800 ms` timed trigger. The shortcut-only World 2 keepsake sits before both paths merge at the full-height final door.

The last ground strip is fully safe. The distant Level 9 tower, Level 10 mist spirit, and faint mirror-color strips are detached parallax graphics only; they never register bodies or overlaps.

### Checkpoints and reset

- Checkpoint 1: marker `(1740, 437)`, respawn `(1740, 425)`.
- Checkpoint 2: marker `(3590, 437)`, respawn `(3590, 425)`.
- Checkpoint 3: marker `(5290, 437)`, respawn `(5290, 425)`.
- Hazard death preserves the latest checkpoint but resets every carrier, spring, ladder state, falling platform, alternating-spike controller, cannon clock, fireball, box, plate, timed trigger, and door.
- `R` clears the three session checkpoints and restarts from `(90, 425)` without incrementing deaths.
- The keepsake ID is stored in the existing save under `collectedItems`; missing arrays in older version-1 saves remain valid.

### Tuning

All primary difficulty values are in `js/constants.js`:

- `LEVEL_12_SEGMENT_BOUNDS`: the four section ranges.
- `LEVEL_12_PLATFORM_CONFIGS`: carrier positions, axes, distances, widths, and speeds.
- `LEVEL_12_CANNON_CONFIGS`: interval, warning, phase, speed, and overlap limits.
- `LEVEL_12_ALTERNATING_SPIKE_CONFIGS`: shared period, warning, transition, and phase.
- `LEVEL_12_CHECKPOINT_CONFIGS`: punishment boundaries.
- `LEVEL_12_TIMED_GATE_CONFIG`: shortcut trigger, full-height final door, countdown, and warning time.
- `LEVEL_12_COLLECTIBLE_ID`: persistent shortcut reward identity.

The special collectible eligibility and overlap callback are `handleLevel12BranchZone()` and `collectLevel12Keepsake()` in `js/levels.js`. The World 2 recap silhouettes and faint World 3 mirror-color foreshadowing are drawn by `createWorld2GraduationPresentation()` in `js/ui.js`.

## Level 13 — 雾散镜光桥: World 2 farewell

Level 13 is a low-pressure bridge rather than another exam. Two deliberately slow World 2 carrier/cannon combinations and one isolated spike occupy the first half. Two generous session checkpoints limit repetition.

From `x = 2850` to `x = 5200`, player position drives one shared transition ratio. That ratio thins both fog layers and reveals flat rose-gold/silver mirror glints; crossing `x = 3820` requests the neutral transition ambience through the existing music fade system. Near `x = 5660`, touching the mandatory small mud companion starts its short two-line introduction. Only after that dialogue does it change from a lightly swaying standing silhouette to a seated pose mounted visually on the protagonist's head for the safe goal approach. Entering or replaying Level 13 always begins with this encounter on the ground, even when the persistent save already owns the companion for later levels.

Tuning is centralized in `js/constants.js`:

- `LEVEL_13_PLATFORM_CONFIGS`: forgiving platform axes, travel, speed, and width.
- `LEVEL_13_CANNON_CONFIGS`: long intervals, warning time, phase, and projectile speed.
- `LEVEL_13_CHECKPOINT_CONFIGS`: low-punishment respawn boundaries.
- `LEVEL_13_TRANSITION_CONFIG`: fog/glint/music timeline, encounter position, and goal.

The transition visuals are implemented by the Level 13 presentation functions in `js/ui.js`. Companion identity and following offsets are in `MUD_COMPANION_CONFIG` in `js/companion.js`.

## Level 14 — 镜子花园 / World 3 opening

Level 14 resets the difficulty after the World 2 climax. Its route uses only broad fixed platforms, three isolated standard spikes, and one midpoint checkpoint. No moving platform, cannon, timed gate, ladder, spring, box puzzle, or precision jump is required.

The small mud companion is attached in the `carried` follow mode from level start. It remains a visual object behind the protagonist, has no physics body, and does not modify movement. At the mirror pool, player input pauses for a short presentation: the companion moves to the pool edge, an indistinct silhouette appears in the water for less than one second, and normal level completion follows without explanatory text.

Primary tuning is centralized in:

- `LEVEL_14_PLATFORM_CONFIGS`, `LEVEL_14_SPIKE_POSITIONS`, and `LEVEL_14_CHECKPOINT_CONFIG` in `js/constants.js`.
- `LEVEL_14_MIRROR_POOL_CONFIG` in `js/constants.js` for the landmark position, set-down duration, and silhouette duration.
- `MUD_COMPANION_CONFIG` in `js/companion.js` for visual scale, carried offsets, and lean.

World 3 palette and terrain values are in `WORLD_3_VISUALS` in `js/theme.js`. The sharp mirrored garden and mirror-pool presentation are created by the Level 14 functions in `js/ui.js`.

## Level 15 — 小泥人被抓走了 / companion separation

Level 15 raises World 3 to the Level 11 difficulty range. The route combines six patrol platforms, four shared-clock cannons, two alternating-spike pairs, three falling platforms, fixed spikes, and a final box/pressure-plate door. In the closing puzzle a short 80-pixel-wide, ground-aligned ferry crosses the 100-pixel floor gap so the player can push the crate onto it, unload it on the far side, and press the door plate. Two checkpoints divide the long synchronization route.

The full-height separation trigger at `x = 2920` is mandatory. It freezes player input briefly, moves the purely visual companion into the mirror cell, closes the rose-gold bars, and stores `MUD_COMPANION_SEPARATED_ID` in the version-1 save. Death after separation keeps the companion in the cell; `R` replays Level 15 from the entrance with the companion carried, while the persistent story flag remains available to Levels 16–18.

Tuning is in `LEVEL_15_PLATFORM_CONFIGS`, `LEVEL_15_CANNON_CONFIGS`, `LEVEL_15_ALTERNATING_SPIKES`, `LEVEL_15_CHECKPOINTS`, and `LEVEL_15_SEPARATION_CONFIG`. The crate ferry is the `final-crate-ferry` entry in `LEVEL_15_PLATFORM_CONFIGS`.

## Level 16 — 一个人的机关路 / high-pressure mirror exam

Level 16 starts without the companion and targets the Level 12 difficulty range. Its trial vertical route adds an upper ladder, spring, horizontal carrier, lift, and a high teleport-jar exit above the existing ground challenge. The route repeatedly reconnects with the lower floor instead of becoming a detached second course. The closing box/plate door remains on solid ground.

The level introduces no attack and no companion physics. Its new play pattern comes from arranging reused mechanisms into mirrored transfer chains: the player must read a carrier and its opposite-moving partner as one timing problem, then carry that rhythm into projectile and spike windows.

Tuning is in `LEVEL_16_PLATFORM_CONFIGS`, `LEVEL_16_CANNON_CONFIGS`, `LEVEL_16_ALTERNATING_SPIKES`, `LEVEL_16_CHECKPOINTS`, and `LEVEL_16_VERTICAL_TRIAL`. Its vertical camera top is `LEVEL_16_WORLD_TOP`.

## Level 17 — 寻找小泥人 / falling-platform climb

Level 17 is now a continuous ascent. A ladder and spring leave the ground route, six falling platforms with the disappearing-cloud skin climb toward a high landing, and a horizontal ferry plus one readable cannon continue across the upper level. Mud traces occupy both ground and upper landings so the search narrative follows the actual route.

Primary tuning is in `LEVEL_17_SPRING_CONFIG`, `LEVEL_17_FALLING_PLATFORM_CONFIGS`, `LEVEL_17_CANNON_CONFIG`, and `LEVEL_17_VERTICAL_TRIAL`. Its vertical camera top is `LEVEL_17_WORLD_TOP`.

## Level 18 — 小泥人回来了 / teleport planning

Level 18 is a six-floor vertical tower rather than a horizontal route with raised side paths. The first three floors retain three purposeful ladders, but the upper tower avoids repeating the same scaffold silhouette: a wind-driven carrier hands off to two consecutive springs, the alternating-spike teleport corridor feeds a cloud climb, and a second directional wind field bends another two-spring staircase toward the final carrier/cloud ascent. The spring above the second ladder has an unobstructed landing; no fixed spike occupies its required trajectory. Non-colliding mud traces continue across safe landings and become more frequent near the summit, so the ascent reads as an active search rather than a repeat of Level 9's mechanism tower. Three checkpoints divide the tower into repeatable two-floor tests, and the companion reunion remains on the fully supported top platform.

Primary tuning is split by mechanism in `LEVEL_18_FIXED_PLATFORM_CONFIGS`, `LEVEL_18_PLATFORM_CONFIGS`, `LEVEL_18_LADDER_CONFIGS`, `LEVEL_18_SPRING_CONFIGS`, `LEVEL_18_CLOUD_CONFIGS`, `LEVEL_18_TELEPORT_JAR_PAIRS`, `LEVEL_18_WIND_VORTEX_CONFIGS`, `LEVEL_18_CANNON_CONFIGS`, `LEVEL_18_SPIKE_CONFIGS`, `LEVEL_18_MOVING_SPIKE_CONFIGS`, `LEVEL_18_ALTERNATING_SPIKE_CONFIGS`, and `LEVEL_18_CHECKPOINT_CONFIGS`. Its vertical camera top is `LEVEL_18_WORLD_TOP`.

## Level 19 — 风中的两条路 / vertical route-choice tower

Level 19 is a narrow six-floor tower enclosed by floor-textured solid walls. It begins with three consecutive springs and contains no ladders. At the first checkpoint an internal wall separates a broad left spring route from a faster right teleport/cloud/cannon shortcut; both routes reconnect above the wall. The remaining floors combine a wind-driven horizontal carrier, an alternating-spike teleport corridor, a cannon lift with one safe standing side, and a two-direction wind/spring/cloud finale.

Primary tuning is in `LEVEL_19_FIXED_PLATFORM_CONFIGS`, `LEVEL_19_PLATFORM_CONFIGS`, `LEVEL_19_SPRING_CONFIGS`, `LEVEL_19_CLOUD_CONFIGS`, `LEVEL_19_TELEPORT_JAR_PAIRS`, `LEVEL_19_WIND_VORTEX_CONFIGS`, `LEVEL_19_CANNON_CONFIGS`, `LEVEL_19_ALTERNATING_SPIKE_CONFIGS`, and `LEVEL_19_CHECKPOINT_CONFIGS`. Its vertical camera top is `LEVEL_19_WORLD_TOP`.

## Level 20 — 糖果大考验 / final mechanism graduation

Level 20 is a roomed loop graduation rather than one open rectangle or a catalogue of disconnected mechanisms. Two tall divider walls leave separate upper and lower openings, forming an entrance box/door room, a spring-and-ladder ascent room, an upper wind/cloud gallery, and a teleported lower return room. The player travels right through the box/plate/door recap, rises by spring and ladder into a cannon lift, continues outward across one wind-driven carrier and two disappearing clouds, then uses a teleport jar to cross the far divider and descend. A left-moving return carrier and one masked alternating-spike corridor bring the player through the lower openings to the final approach while the companion remains carried.

Level 20 progression is phase-gated in that exact order. Its checkpoints cannot be activated out of sequence, the post-teleport checkpoint requires the outbound jar transfer, and the return checkpoint sits on the elevated return corridor rather than the initial ground route. Falling from the upper wind/cloud route recovers to the upper-deck checkpoint without adding a death, so a missed jump cannot become a shortcut into the return route. Activating the final return checkpoint opens the goal; death preserves that checkpoint and restores the visible goal without inserting a farewell scene.

Primary tuning is in `LEVEL_20_FIXED_PLATFORM_CONFIGS`, `LEVEL_20_WALL_CONFIGS`, `LEVEL_20_PLATFORM_CONFIGS`, `LEVEL_20_SPRING_CONFIGS`, `LEVEL_20_LADDER_CONFIGS`, `LEVEL_20_EARLY_FALLING_PLATFORM_CONFIGS`, `LEVEL_20_SPIKE_CONFIGS`, `LEVEL_20_CLOUD_CONFIGS`, `LEVEL_20_TELEPORT_JAR_PAIR`, `LEVEL_20_WIND_VORTEX_CONFIGS`, `LEVEL_20_CANNON_CONFIGS`, `LEVEL_20_ALTERNATING_SPIKE_CONFIGS`, `LEVEL_20_CHECKPOINT_CONFIGS`, `LEVEL_20_PUZZLE_CONFIG`, and `LEVEL_20_FINAL_APPROACH_CONFIG`.

Completing the final goal starts `ENDING_CINEMATIC_CONFIG` instead of the standard clear panel. Each established caramel, fog-tower, and mirror-garden background is wider than the viewport and first pans slowly left within its own world. At each boundary, the next complete world slides rapidly from right to left over the current one like a presentation slide, then resumes the slower internal pan. The protagonist and mud companion move more slowly from left to right in a separate foreground layer, preserving the parallax effect through the pans and slide changes. Both stop and stand naturally during the farewell, resume their slow walk after the last line, then stop again for the established upward camera lift. During that lift the third-world backdrop, terrain, and label fade away before the closing thanks and return to the title menu.

The far-right Level 20 chamber is part of the required return route. The outbound cloud cannon now fires from the reachable side of the divider. Teleporting places the player at the far-right landing, where a return cannon, alternating spikes, leftward wind, and a patrol platform across a floor gap must be crossed before re-entering the lower wall opening.
