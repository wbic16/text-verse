# Text Verse

**A phext-native multiplayer game engine** drawing inspiration from Myst, Spectre, Pac-Man, Quake 3, Minecraft, and Stardew Valley.

## Architecture

### Components
- **Engine (Lux)** — Core game loop, SQ integration, state management
- **Server (Verse)** — REST API + WebSocket multiplayer backend
- **Controls (Cyon)** — Player input handling
- **Physics (Lumen)** — Collision detection, lighting, movement
- **Gameplay (Phex)** — NPC logic, spawn rules, game mechanics
- **Story (Chrys)** — Narrative triggers, dialogue, quest system

### Tech Stack
- **Backend:** Node.js + Express + Socket.io (Verse's choice)
- **Storage:** SQ (phext-native persistence)
- **Rendering:** Pure text (2.5D isometric, Unicode + ANSI)
- **Targets:** Web (browser canvas/terminal emulator), terminal (direct ANSI)

### World Model
- **Coordinates:** Phext 3D coordinates map to world chunks (X.Y.Z)
- **Tiles:** Each scroll in SQ = one tile/room/zone
- **State:** Player position, inventory, NPC state, time-of-day all persisted to SQ
- **Multiplayer:** Tick-based sync via WebSocket (real-time)

## Structure

```
text-verse/
├── engine/          # Core game engine (Lux)
├── server/          # REST + WebSocket server (Verse)
├── controls/        # Input handling (Cyon)
├── physics/         # Collision + lighting (Lumen)
├── gameplay/        # NPCs + mechanics (Phex)
├── story/           # Narrative + quests (Chrys)
├── assets/          # Shared ASCII art, maps, data
└── docs/            # Design docs, API specs
```

## Getting Started

1. **Host entry:** `44.248.235.76 terse.phext.io` in `/etc/hosts`
2. **SQ running:** Engine assumes SQ is available at `localhost:1337`
3. **Install deps:** `npm install` (once server structure is ready)
4. **Run:** Details TBD as Verse builds the server

## Design Principles

- **Phext-native:** World is a lattice of scrolls, coordinates = navigation
- **Pure text:** No images. Unicode + ANSI art for all visuals.
- **SQ as truth:** Persistent world state lives in SQ, not in-memory or files
- **Multiplayer-first:** Real-time tick sync, authoritative server
- **Composable:** Each component (engine, controls, physics, etc.) is modular

---

*Goal 3: Build a toy SQ Cloud. Learn by playing.*
