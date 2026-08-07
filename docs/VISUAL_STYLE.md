# Visual Shell and Theme Tokens

This stage defines a replaceable pastel, front-facing pixel UI shell. It intentionally uses generated geometry and contains no final character or environment artwork.

## Layer boundaries

- `js/theme.js`: the single design-token source for palette, Phaser placeholder colors, typography, spacing, radii, shadows, and motion duration.
- `css/ui.css`: DOM presentation for title, settings, level select, pause, completion actions, transitions, responsive layout, and button interaction.
- `js/ui.js`: Phaser-only visual components for the HUD, completion panel, death/respawn treatment, and geometric celebration particles.
- `index.html`: semantic menu markup and script/style loading only.
- `js/game.js`: gameplay and shell-event orchestration. It calls visual helpers but does not define reusable UI components.
- `js/levels.js` and `js/mechanisms.js`: level/mechanism logic; only token references are permitted for their placeholder colors and labels.

## Token structure

`THEME` in `js/theme.js` has six groups:

- `colors`: CSS-ready hexadecimal colors used by DOM UI.
- `gameplay`: numeric Phaser colors for generated placeholder textures and graphics.
- `typography`: bold system font stacks and text sizes. No web-font download is required.
- `spacing`: shared breathing-room values from `xs` through `xl`.
- `radii`: currently zeroed so panels and buttons remain square.
- `shadows`: currently disabled; retained as replaceable token slots.
- `motion`: hover, menu, transition, death, respawn, completion, and particle durations.

`applyThemeTokens()` exposes the CSS-compatible groups as custom properties. DOM components consume those variables; Phaser components read `THEME` directly. This prevents duplicate palettes in logic files.

## Future replacement entry points

### Background story and menu identity

Change title copy and semantic markup in `index.html`. Change palette, fonts, spacing, shape language, and timing in `js/theme.js`. Do not add story state to the theme file.

### Character artwork

Replace the generated `player` texture inside `createTextures()` in `js/game.js`, or add a separately approved preload/asset path. Preserve the player texture key, origin assumptions, and protected `27 x 38` collision body unless gameplay changes are explicitly approved.

### Level and mechanism artwork

Replace the generated `ground`, `moving-platform`, `spike`, `goal`, `box`, `button`, `door`, and `fall-platform` textures. Keep their texture keys and collision-body setup. `THEME.gameplay` is the first place to change placeholder colors before real assets exist.

### Background artwork

`drawBackdrop()` in `js/game.js` owns the current geometric placeholder background. Replace its drawing only after an art direction exists; do not change world bounds or level coordinates.

### UI artwork

DOM panels and buttons are in `css/ui.css`; Phaser HUD/completion/feedback shapes are in `js/ui.js`. Replace decoration here without touching movement, death counting, reset, or level construction.

## Current rendering rules

- Gameplay objects are flat front-facing color blocks with two-pixel Phaser outlines.
- Platforms have no visible top plane, side plane, bevel, material gradient, or highlight.
- DOM panels and buttons use square corners, solid fills, two-pixel borders, and color-only interaction states.
- Phaser antialiasing is disabled and canvas scaling uses nearest-neighbor pixel rendering.
- Decorative feedback uses rectangles rather than circles, curved blobs, shadows, or glass effects.
- Semantic colors remain stable: red/coral hazards, mint moving platforms, orange boxes, yellow switches/goals, and purple doors.

## Accessibility and motion

Settings offers Full and Reduced motion. The preference is stored beside unlock progress. Reduced motion shortens CSS and Phaser presentation animations without changing timers used by gameplay mechanisms.
