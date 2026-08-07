# Art Direction

## Purpose

The visual system presents the existing twenty-level route as one continuous journey through 雲糖鎮. It follows the established narrative: 蛋仔 travels upstream while the 快樂糖漿河 changes from healthy to depleted, crosses World 2, meets 小泥人, and completes the World 3 mirror-garden route. The art must support the current gameplay and may not add mechanics, characters, factions, plot turns, or level geometry.

## World boundaries

- **World 1 — 太妃糖林:** Levels 1–7. Level 7 remains fully inside the World 1 skin; its transition to the next world is conveyed through narrative direction and pacing, not an early color swap.
- **World 2 — 棉花糖迷霧:** Levels 8–13. Level 8 is the first visible and musical world change.
- **World 3 — 焦糖鏡花園:** Levels 14–20. The mirror-garden route covers separation, pursuit, reunion, route choice, and the final examination already defined by the Bible.

Levels 1–7 use a restrained warm World 1 skin: caramel ground, amber and toffee skies, sticky syrup bands, broad stepped forest silhouettes, and sparse amber-chapel landmarks. Their distant composition uses tree canopies and chapel towers rather than generic town blocks. Levels 6–7 progressively reduce saturation and thin the motifs so the forest finale feels depleted without borrowing World 2 fog, mint terrain, or cold mechanism skins.

## World 2 — 棉花糖迷霧

Level 8 shifts the backdrop to light mint, mist blue, pale lavender, and milk white. Clearly visible semi-opaque stepped cloud silhouettes drift at background depth and never receive physics bodies; the near layer uses alpha `0.44` and the far layer uses `0.30`. World 2 moving platforms use mist-blue fills with pale flat patches; cannons use lavender frosting colors; fireballs use pink-purple blocks. Ladders use straight mist-blue rails and pale rungs; small springs use flat blue bases and pink coils. The intended feeling is light and uncertain, but actual blur is not used: soft cotton edges are represented with large stepped pixel contours and overlapping translucent flat layers. All skin values and texture keys live under `WORLD_2_VISUALS` in `js/theme.js`. The generated textures preserve the World 1 source dimensions and collision setup.

World 2 must remain distinguishable from World 1 at a glance: colder hues, lower saturation, more open negative space, drifting fog layers, stepped cloud walls and separated mist islands instead of tree/chapel silhouettes. Hazards and traversal edges retain crisp outlines even when scenery appears soft.

Level 9 keeps the same World 2 mechanism skins and terrain texture, but arranges the environment as a vertical mist tower. Its background spans the complete negative-Y world and uses two detached stepped fog layers with different vertical scroll factors, producing cloud-depth progression during ascent without blur, gradients, collision bodies, or changes to gameplay silhouettes. Narrow shaft walls remain crisp mist-blue rectangles; fog always stays behind platforms, cannons, hazards, the player, and HUD.

## World 3 — 焦糖鏡花園

World 3 uses rose gold, champagne, pale blush, and mirror silver. Its identity is hard, bright, precise, and symmetrical: diamond and hexagonal motifs, paired columns, mirrored compositions, and sharp highlight strips replace World 2's diffuse fog shapes. The flat pixel rules still apply, so reflections are represented by solid mirrored color blocks and crisp diagonal highlight bands rather than gradients, glass shaders, bloom, or realistic reflections. Gameplay silhouettes remain clearer than decorative mirror geometry.

World 3 ladders and small springs use dedicated rose-gold rails/bases, champagne rungs/coils, and the same dark mirror outline as other World 3 mechanisms. Their texture dimensions and physics setup remain identical to the World 1/2 variants.

## Core visual language

- Use a front-facing, flat 2D pixel presentation.
- Build shapes from integer-positioned rectangles, straight lines, square corners, and clear silhouettes.
- Use solid fills only. Do not use gradients, blur, glass effects, soft glow, bevels, realistic shadows, or perspective planes.
- Platforms show one front face only. Do not draw top faces, side faces, thickness, curved caps, or highlight strips that imply volume.
- Boxes, pressure plates, doors, goals, moving platforms, and falling platforms remain front-facing symbols with consistent two-pixel outlines.
- Keep decorative detail sparse and large enough to remain stable under Phaser canvas scaling.
- Phaser must retain `pixelArt: true`, `antialias: false`, and `roundPixels: true`. CSS must retain `image-rendering: pixelated` and `crisp-edges`.
- Visual animation and display scaling must never alter a physics Body.

## Palette

The shared palette is centralized in `js/theme.js`. Background colors are intentionally quieter than gameplay colors.

| Role | Color | Use |
|---|---:|---|
| Cream | `#fffaf2` | DOM surround and light UI fields |
| Amber butter sky | `#ffe4b5` | Level 1 healthy-state sky |
| Warm toffee sky | `#f7d9ae` | Level 2 first-anomaly sky |
| Muted caramel sky | `#eecfa8` | Level 3 intensified-anomaly sky |
| Darkened caramel sky | `#e8c9a8` | Level 4 upstream timing-route sky |
| Toffee terrain | `#c8a27e` | Fixed terrain throughout World 1 |
| Mist-blue terrain | `#c7dce5` | Fixed terrain beginning at Level 8 / World 2 |
| Ink | `#67556e` | Shared outlines and primary text |
| Blush / pink | `#ffd7e5` / `#f2a9c2` | UI accent and route markers |
| Mint | `#c8f1df` | UI accent; stronger green is reserved for moving platforms |
| Lavender / purple | `#ddd2f7` / `#a994df` | Distant town shapes, doors, and progress |
| Toffee syrup | `#d9954e` to `#a9a27d` | World 1 background river; progressively depleted |
| Mist syrup | `#c5e5e8` | World 2 background river only |
| Coral | `#ee8b97` | Hazards; never reused for passive background emphasis |
| Peach | `#ffc29f` | Pushable boxes |
| Yellow | `#ffe39a` | Pressure plates, links, and goals |

### Functional color rules

- Hazards stay coral/red with a darker outline.
- Pushable boxes stay peach/orange with a darker outline.
- Pressure plates and their door links stay yellow.
- Doors stay purple.
- Moving platforms stay mint green and use repeated flat direction marks rather than a shaded edge.
- Falling platforms stay brown and use cracks plus their existing warning-state change.
- Ladders use two straight outlined rails and evenly spaced rectangular rungs; their complete visible rectangle is the interaction range.
- Small springs use a flat base and stacked rectangular coil marks. Normal and compressed textures share the same `48 × 28` canvas and never resize the physics Body.
- Goals stay yellow with a purple support and must remain distinct from passive scenery.
- Background syrup never uses the moving-platform green and remains lower contrast than interactive objects.
- Fixed and alternating spikes use one centered tip per hazard. Their bases render behind terrain so floor spikes emerge from the ground and ceiling spikes emerge from a flat overhead housing instead of floating in front of the platform face.

## Depth system

Depth values are centralized in `THEME.depths`.

| Layer | Depth | Contents |
|---|---:|---|
| Background | `-30` | Sky, distant town silhouettes, syrup river, environmental clues |
| Distant / scenery reserve | `-20` / `-10` | Future flat background separation only |
| Mechanism underlay | `2` | Plate-to-door links and spike sprites whose bases sit behind terrain |
| Terrain | `3` | Fixed platforms and non-blocking level labels |
| Mechanisms | `4` | Goals, doors, plates, moving and falling platforms |
| Actors | `6` | Player and pushable boxes |
| Foreground reserve | `7` | Sparse decoration only; it may never cover actors or mechanisms |
| Guidance | `8` | Short control and teaching hints |
| HUD | `10–11` | Attempts, deaths, controls, level indicator |
| Feedback | `12` | Brief death particles |
| Celebration / modal | `19–20` | Completion feedback and completion panel |

Foreground decoration should normally remain unused. If a future composition needs it, keep it outside traversal silhouettes; reduce or remove it if it can cover the player, spikes, platform edges, boxes, plates, doors, or goals.

## Background construction and readability

`drawBackdrop(scene, worldWidth, level)` is the reusable background entry point. It creates a single cleanup-owned container with three flat drawing layers: full-frame sky, distant town silhouette, and level-specific scenery/river state. Level builders pass only their existing world width and level number.

- Background shapes use integer coordinates and solid rectangles.
- Repeating World 1 silhouettes combine broad route structures with intentional stepped toffee trees and sparse amber chapels. They are narrative landmarks, not random natural decoration.
- `drawWorld1ToffeeMotifs(...)` owns those motifs for Levels 1–7. Levels 6–7 use wider spacing and lower alpha so the visual transition is gradual and cleanup still occurs through the single backdrop container.
- Level 8 does not call the World 1 motif function and uses `ground-world2`; this keeps the first World 2 screen colder and more open without changing platform geometry or bodies.
- White block clouds are sparse and never overlap gameplay silhouettes at ground level.
- The syrup river remains behind all terrain and actors.
- Environmental arrows and conduit marks point right/upstream but never disclose a puzzle solution.
- Background contrast and saturation must remain below all functional objects.
- Background containers are destroyed by the existing level cleanup path, so restart and transition must not accumulate layers.

## Level themes

### Level 1 — normal 雲糖鎮 edge

The cream sky, complete town silhouette, full syrup band, and regular right-facing route markers establish the normal candy-world state and the travel direction. The mood is relaxed and safe enough to teach movement, jumping, one hazard, and a moving platform.

### Level 2 — first visible disruption

The palette warms and loses saturation. The syrup band is lower, while square storage blocks, gauges, and interrupted conduit shapes suggest that distribution has begun to fail. These are environmental clues only; they do not redefine the existing box, plate, or door puzzle.

### Level 3 — depleted upstream route

The sky and town silhouette become more muted. The river is reduced to separated shallow pools, and broken conduit segments plus a right-facing source marker reinforce that the problem lies farther upstream. This strengthens the established anomaly without adding a source object, cutscene, or new plot event.

### Level 4 — 軟糖節拍橋

The upstream bridge keeps Level 3's depleted river language and adds sparse repeated conduit beats to suggest interrupted timing. The countdown is hidden until the player stands on the first falling platform, then appears as a flat outlined bar: yellow while active and coral only during the final warning window. It uses the existing guidance and mechanism depths, solid fills, integer coordinates, and no glow or gradient. The background does not add moving scenery, a button, a second mechanic, or a new plot object.

The backgrounds are successive states of the same toffee forest, amber-chapel route, and syrup system, not separate biomes. Levels 6–7 continue the same shapes at reduced density and saturation; the full cold-pastel break occurs only at Level 8.

## Player presentation

蛋仔 uses a transparent PNG Sprite Sheet at `assets/characters/danzai-spritesheet.png`. Each frame is `35 × 42`, matching the former placeholder canvas, while the protected physics Body remains `27 × 38` with offset `(4, 4)`. The base artwork faces right and uses Phaser `flipX` for left movement. Its identity is the yellow egg silhouette, round-tipped antenna, large side eye, small curved mouth, short limbs, and white shoes. The flat palette is limited to dark brown `#562018`, yellow `#FFCC2E`, warm white `#FFFAF0`, and transparency. Frames are authored directly on the target pixel grid rather than reduced from smooth illustration. They use crisp hard edges, a continuous one-to-two-pixel outline, a roughly `28–31` pixel-wide body, enlarged feature clusters, stable scale/body center, and a fixed grounded shoe baseline. Idle is frames `0–2`, Run `3–8`, Jump `9–10`, and Fall `11–12`. Animation playback may change presentation only and must never alter origin, display scale, or physics.

## UI rules

- Keep the existing title, level-select, settings, pause, HUD, and completion information architecture and button behavior.
- Menus and buttons use solid rectangular fills, square corners, two-pixel ink borders, and no shadows.
- Hover/focus uses a fill change plus an inset two-pixel focus outline.
- Pressed state uses the ink fill with light text; it must not move or scale the button.
- Disabled and locked states remain readable through reduced opacity and text, not blur.
- Text must maintain clear contrast against cream or white surfaces.
- Reduced motion affects presentation timing only and never mechanism timing.

## Extending the style

Future approved levels should continue the same visual grammar before introducing a new palette variation:

1. Identify the existing 雲糖鎮 location and the single emotional/mechanical idea already approved for the level.
2. Reuse the shared sky/town/river layer structure and all functional colors.
3. For World 1, preserve the warm caramel ground and reuse the stepped toffee-tree/amber-chapel vocabulary. Change only a small set of background tokens, river state, density, and two or three large environmental clues.
4. Keep passive scenery quieter than mechanisms and preserve the depth table.
5. Validate white-box geometry and completion before adding decoration.
6. Do not introduce perspective, texture noise, unapproved characters, or narrative events through background art.
