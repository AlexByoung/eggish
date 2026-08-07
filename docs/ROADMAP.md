# Roadmap

This is a high-level sequence, not authorization to implement later stages during stabilization work.

## 1. Stabilize the three-level vertical slice

- Document the current design and architecture.
- Preserve the playable prototype milestone.
- Audit player input, death/reset, mechanisms, lifecycle cleanup, and all three levels.
- Fix only confirmed high-priority stability issues and run regression checks.

## 2. Complete shell and progression features

Implemented in the current working tree; full manual twenty-level regression remains required before milestone tagging.

- Add a proper title flow.
- Add pause/resume behavior.
- Replace the development selector with an intentional level-select flow.
- Define save/progression behavior.
- Add polished transitions between levels and menus.

## 3. Add foundational animation, audio, and feedback

Visual shell feedback, the first player animation set, and foundational audio feedback are implemented in the current working tree. Full twenty-level manual regression remains required before milestone tagging.

- Define player and mechanism animation requirements.
- Add original sound effects and music direction.
- Improve readable feedback without changing protected gameplay behavior.

## 4. Establish an original art specification

- Define palette, pixel scale, silhouettes, environment language, UI style, and asset naming.
- Document originality requirements and avoid copying another game's protected expression.

## 5. Art-pass the first three levels

- Replace generated white-box visuals incrementally.
- Preserve collision geometry and re-run full gameplay regression after each pass.

## 6. External blind playtesting

- Recruit players unfamiliar with the solutions.
- Record completion paths, confusion, soft locks, retries, and completion time.
- Separate usability issues from intentional discovery.

## 7. Design Levels 4–20

- Use blind-test findings and the one-primary-concept rule.
- Document each solution and recovery path before implementation.
- Reuse existing mechanisms before proposing new ones.
- Level 4, 「軟糖節拍橋」, is implemented with the automatically triggered timed gate.
- Level 5, 「太妃糖爐廊」, adds reusable fixed-phase fire cannons and one session checkpoint.
- Level 6, 「薄荷可可輪班廠」, adds shared-clock alternating spikes, reuses fireballs, and adds two session checkpoints.
- Level 7, `棉花糖升降站`, closes World 1 by teaching carriers, ladders, and springs in recoverable spaces before adding readable spike and fireball pressure. Its transition to the next world is narrative and rhythmic, not a premature visual reskin.
- Level 8, `棉花糖迷霧地帶`, formally opens World 2, reskins existing tools and cannons, and raises the difficulty through isolated, relaxed, then formal synchronization without redefining the Level 7 mobility rules.
- Level 9, `棉花糖霧塔`, is the first fully vertical high-difficulty World 2 stage. Five compact floors combine ladders, springs, lifts, synchronized cannons, and spike-side landings with two session checkpoints.
- Level 10 implements the World 2 environmental boss arena; Level 11 implements the constrained branch-choice test.
- Level 12, `棉花糖毕业回廊`, closes World 2 by reusing nearly every learned non-boss mechanism across sequence, synchronization, spatial-restriction, and branch-choice sections.
- Level 13, `雾散镜光桥`, provides a low-pressure World 2 farewell, synchronized World 3 foreshadowing, and the small mud companion encounter.
- Level 14, `镜子花园`, opens World 3 with a low-pressure fixed-platform route, visual companion carrying, and the mirror-pool story beat.
- Level 15, `小泥人被抓走了`, raises the difficulty and persists the mandatory companion-separation state for the planned Level 18 rescue.
- Level 16, `一个人的机关路`, combines mirrored carrier timing with Level 12-strength projectile, spike, falling-platform, and box-door pressure.
- Levels 17–20 complete the search, reunion, wind-route choice, three-world final examination, farewell, and ending.
- Full manual twenty-level regression remains required before milestone tagging.

## 8. Full QA and release preparation

- Establish repeatable regression coverage.
- Verify supported browsers, focus behavior, persistence, audio, performance, and accessibility basics.
- Perform content lock, release packaging, and final originality review.
