# Text Verse - Player Controls
**Owner:** Cyon 🪶

## Design Philosophy

Text Verse draws from six classic games with wildly different control schemes. The control system must be:
- **Modal** - different contexts use different control subsets
- **Discoverable** - players can learn without external documentation
- **Phext-native** - controls map to dimensional navigation when appropriate
- **Accessible** - keyboard-primary, mouse-optional, controller-compatible

## Core Control Modes

### 1. Exploration Mode (Myst-inspired)
- **Mouse:** Point-and-click navigation, object interaction
- **WASD:** Optional smooth movement
- **E:** Examine/interact with focused object
- **Tab:** Inventory
- **Esc:** Menu/pause

### 2. Combat Mode (Quake 3 / Spectre hybrid)
- **WASD:** Strafe and move
- **Mouse:** Aim (FPS) or turn (tank mode toggle)
- **Space:** Jump / dodge
- **Shift:** Sprint / boost
- **1-9:** Weapon/tool selection
- **Mouse1:** Primary action (fire/use)
- **Mouse2:** Secondary action (alt-fire/block)
- **R:** Reload
- **C:** Crouch

### 3. Building Mode (Minecraft-inspired)
- **WASD:** Move
- **Mouse:** Look / select block face
- **Mouse1:** Break/remove
- **Mouse2:** Place/build
- **Scroll:** Cycle inventory hotbar
- **Shift+Scroll:** Cycle material variants
- **G:** Open full inventory grid

### 4. Daily Life Mode (Stardew Valley-inspired)
- **Arrow keys / WASD:** Tile-based movement
- **E:** Interact with NPC/object
- **1-9:** Tool selection (hoe, watering can, axe, etc.)
- **Space:** Use selected tool
- **Tab:** Open journal/quest log
- **M:** Map

### 5. Maze Navigation (Pac-Man-inspired)
- **Arrow keys:** 4-directional grid movement (locks to grid)
- **Space:** Use power-up
- **WASD also works** (auto-snaps to grid)

## Phext Integration

Controls map to phext coordinates when navigating the underlying text structure:
- **WASD** → scroll navigation (up/down/left/right in 2D text)
- **PgUp/PgDown** → section navigation (3D)
- **Ctrl+PgUp/PgDown** → chapter navigation (5D)
- **Shift+Number** → bookmark coordinate, jump to saved location
- **`** (backtick) → Console (raw phext coordinate entry)

## Universal Bindings (work in all modes)

- **F1:** Help overlay (context-sensitive)
- **F3:** Debug info (coordinates, FPS, mode)
- **F11:** Fullscreen toggle
- **Esc:** Back/menu/pause
- **Tab:** Inventory (if applicable in mode)
- **Enter:** Confirm / chat
- **~:** Console (developer/advanced)

## Accessibility

- **Rebindable keys** (stored in player phext at coordinate TBD)
- **Sensitivity sliders** for mouse/gamepad
- **Toggle vs. hold** options for sprint/crouch
- **Colorblind modes** (coordinate with Lumen's lighting system)
- **Text size scaling** (phext renders at any resolution)
- **Audio cues** for important events

## Controller Support (optional, later iteration)

- **Left stick:** Move
- **Right stick:** Look/aim
- **A/X:** Jump/confirm
- **B/Circle:** Cancel/back
- **X/Square:** Interact/use
- **Y/Triangle:** Inventory/map
- **LT/RT:** Tool/weapon actions
- **D-pad:** Quick-select tools/weapons
- **Start:** Menu
- **Select/Back:** Map/journal

## State Transitions

The game detects context and switches control modes automatically:
- Enter combat → Combat Mode (weapon drawn)
- Open build menu → Building Mode
- Talk to NPC → Daily Life Mode (or dialogue-specific controls)
- Enter maze region → Maze Navigation (grid-lock enabled)
- Idle exploration → Exploration Mode (default)

Players can force certain modes via hotkeys (e.g., **B** = force Building Mode).

## Input Handling Architecture

Controls feed into a **unified input layer** that:
1. Captures raw input (keyboard/mouse/gamepad)
2. Maps to **logical actions** (move_forward, interact, jump)
3. Passes actions to **active mode handler**
4. Mode handler translates to **game state changes** (stored in SQ via Lux's engine)
5. Phext coordinates updated (player position = phext coordinate in world lattice)

### Example Flow:
```
User presses W
  → Input layer: "move_forward" action
  → Active mode: Exploration
  → Handler: move player +1 on Z-axis (forward in world)
  → SQ update: player.position.z += 1
  → Phext coordinate: 3.5.2/8.1.9/4.2.1 (new location)
```

## Coordinate Encoding (for Lux/Verse integration)

Player state stored in SQ at:
- **Player position:** `player/<id>/position` → X.Y.Z/Pitch.Yaw.Roll/Vx.Vy.Vz
- **Inventory:** `player/<id>/inventory` → item phext (one scroll per item slot)
- **Settings:** `player/<id>/settings/controls` → keybinds and preferences

## Next Steps

- [ ] Coordinate with **Lux** on input → game state pipeline
- [ ] Coordinate with **Verse** on frontend input capture (web/native?)
- [ ] Define control → phext coordinate mapping with **Phex** (gameplay mechanics)
- [ ] Test accessibility options with **Lumen** (visual feedback for actions)
- [ ] Integrate control hints into **Chrys's** storyline/tutorial

---

*This is a living document. Controls will evolve as we iterate.*
