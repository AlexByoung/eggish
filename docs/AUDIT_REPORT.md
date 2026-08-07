# Vertical-Slice Audit Report

## Scope and evidence

- Audited milestone: `8e4dd28` (`v0.1.0-prototype`).
- Static checks: all JavaScript files passed `node --check`; the clean milestone passed `git diff --check`.
- Browser checks: Phaser 3.90.0 loaded through the CDN, the canvas rendered, the developer menu opened Levels 1–3, repeated `R` on Level 3 did not change the counters, and the Console showed no game errors.
- Code review covered player/input, death/reset, boxes, pressure plates, doors, moving platforms, falling platforms, level cleanup, completion, UI, and the three level routes.
- This environment did not provide a reliable way to hold movement keys through full platforming routes. Full completion, exact jump feel, collision edge cases, and focus-loss recovery remain manual playtest requirements; they are not reported as passed.

## [AUD-001] Level 1 retry does not restore the moving platform

- Severity: P1
- Status: Confirmed
- Affected level or system: Level 1 death/reset lifecycle
- Affected files: `js/game.js`
- Evidence: `respawn()` restores the player, camera, jump state, and hints for Level 1 but does not restore `movingPlatform`. Levels 2 and 3 explicitly restore their moving-platform position and velocity in `resetLevel2()` and `resetLevel3()`.
- Reproduction steps: Start Level 1, wait until the green platform has moved away from its initial position, die on the spike or by falling, and observe the platform when the player respawns.
- Expected behavior: A normal death restores the complete initial state of the current level, including the Level 1 moving platform.
- Actual behavior: The platform continues from its pre-death position and direction, so retries do not begin from the same gameplay state.
- Recommended fix: Add a small Level 1 mechanism reset and call it from the Level 1 branch of `respawn()` without changing the platform's established position, speed, or limits.
- Regression risk: Low. Incorrect ordering could briefly leave the platform body at its old position.
- Verification method: Move the platform to both halves of its route, die, and verify that it returns to its original position moving right at the existing speed. Repeat several times and verify one death increment per death.
- Resolution: Fixed after the audit by restoring the existing start position and speed in the Level 1 `respawn()` path. Syntax and startup checks passed; the death-path observation remains part of the manual regression checklist.

## [AUD-002] Door can enable collision on a late doorway entrant

- Severity: P1
- Status: Confirmed
- Affected level or system: Levels 2 and 3 pressure-plate door safety
- Affected files: `js/mechanisms.js`
- Evidence: `closeDoor()` checks `isDoorwayOccupied()` only before starting its closing Tween. Its completion callback unconditionally enables the static body about `DOOR_ANIMATION_MS` later. A player or box can enter the doorway while the body is disabled and the Tween is running.
- Reproduction steps: Release the pressure plate while the doorway is empty, then enter the doorway during the closing animation before the purple door reaches its closed position.
- Expected behavior: The door remains non-colliding and reopens or waits whenever the player or a box occupies the doorway, including during the closing animation.
- Actual behavior: The completion callback enables collision without a final occupancy check, allowing the door to close on the late entrant.
- Recommended fix: Recheck occupancy in the closing Tween's completion callback. If occupied, keep collision disabled and reopen using the existing door animation; otherwise enable and refresh the static body as today.
- Regression risk: Medium. The fix must preserve plate reactivation, animation timing, and the current door-open collision behavior.
- Verification method: In both Levels 2 and 3, test the player and each box entering before closure starts, midway through closure, and after closure. Confirm collision is never enabled on an occupant and normal closure still completes when the area is empty.
- Resolution: Fixed after the audit by rechecking occupancy in the closing Tween completion callback and reopening with the existing animation while collision remains disabled. Syntax and startup checks passed; timing-sensitive player/box cases remain part of the manual regression checklist.

## Verified by code and startup inspection

- Player gravity, speed, acceleration, drag, jump force, body, coyote time, jump buffering, and short-jump code were unchanged from the milestone.
- `die()` guards repeated death and completion overlap; normal death increments the counters once.
- Level 2 and Level 3 `R` resets do not increment deaths and restore their player, boxes, plate, door, moving platform, and applicable falling platforms.
- Boxes have velocity limits, ground drag, delayed out-of-bounds restoration, and reset paths that cancel pending respawn timers.
- Pressure-plate release has a short grace window, avoiding single-frame door flicker.
- Level 3 moving-platform crate support uses recorded collision contact plus visible overlap and top-contact checks; separated boxes are not carried by a broad proximity test.
- Falling platforms guard state transitions, keep one warning/reset timer per cycle, cancel timers and Tweens on reset, and require the player to leave before re-arming.
- Active level colliders are registered and removed through `activeColliders`; Level 2-to-3 cleanup also cancels mechanism timers and destroys old level objects.
- The menu opened each of the three level builders without a Console exception or visible old-level overlay.

## Manual verification still required

- Complete Levels 1, 2, and 3 from start to finish, both individually and in one continuous run.
- Verify all required jumps, intended puzzle solutions, acceptable alternatives, and absence of bypasses or soft locks.
- Exercise spike death, fall death, repeated death/reset, death while holding input, death at completion, and focus loss/recovery.
- Verify player and box transport through moving-platform reversals and unloading.
- Verify falling-platform warning, fall, disappearance, restoration, repeated cycles, death reset, and `R` reset visually.
- Verify Next Level and Replay after actual completion states.
- Recheck the browser Console throughout the full manual regression session.

## Audit conclusion

The three-level prototype loads cleanly and its main reset and cleanup structure is internally consistent. The audit confirmed two P1 lifecycle defects in the milestone: Level 1 did not fully restore its moving platform on death, and a closing door could enable collision on an entrant who arrived during the animation.

Both confirmed P1 findings were addressed after the diagnostic phase. No P0 issue was found. The remaining work is the manual playtest coverage listed above; it is not replaced by the static and browser startup checks completed in this audit.

## Late World 3 route audit — Levels 17–20

- **Level 17:** World 3 mechanisms existed but the post-checkpoint route was predominantly horizontal. The bubble chain now changes height repeatedly, and the ferry is paired with a readable slow cannon.
- **Level 18:** Confirmed a P1 route defect in the second teleport pair. Its exit jar at `x = 3240` stood in the gap before the central floor, so the automatic exit offset could leave the player unsupported. The jar now stands at `x = 3400` and exits above the floor spanning `x = 3340–3860`.
- **Level 19:** Mechanism count was high, but the upper route lacked a reliable return connection. A vertical lift, carrier-mounted spike, and one masked alternating-spike pair now give the branch an explicit multi-height structure.
- **Level 20:** Already included most learned non-boss systems. The audit did not recommend adding every historical mechanic. The disconnected middle lift was moved toward the next upper ledge, and one carrier-mounted spike was added to represent that learned rule.
- Static syntax, configuration references, and geometry checks are required after the changes. Full completion of all routes remains a manual playtest requirement and is not claimed by this audit.
