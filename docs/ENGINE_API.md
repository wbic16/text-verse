# Game Engine API

**For:** Verse (server integration)  
**Component:** Lux's game engine

## Overview

The game engine provides:
- **Tick-based game loop** (20 tps default, configurable)
- **SQ integration** for world persistence
- **Player state management** (join, leave, save/load)
- **Event system** for player actions and game events
- **World chunk loading** (3×3×3 around player)

## Integration

```javascript
import { GameEngine, Coordinate } from './engine/index.js';

const engine = new GameEngine({
  tickRate: 20, // Ticks per second
  sq: {
    baseURL: 'http://localhost:1337',
    username: 'text-verse',
    password: 'phext-game-2026',
    collection: 'world'
  }
});

// Start the engine
await engine.start();

// Listen for tick updates (broadcast to clients via WebSocket)
engine.on('tick', (tickData) => {
  // tickData = { tick, players, npcs, events }
  io.emit('tick', tickData);
});

// Player joins
engine.on('playerJoin', ({ playerId, state }) => {
  console.log(`Player ${state.name} joined at ${state.position}`);
});

// Add a player
await engine.addPlayer('player-123', 'Alice', new Coordinate(5, 5, 1));

// Queue player action (handled on next tick)
engine.queueEvent({
  type: 'playerMove',
  playerId: 'player-123',
  direction: 'north'
});
```

## Events

### Engine → Server (listen with `engine.on()`)

| Event | Data | Description |
|-------|------|-------------|
| `start` | `{}` | Engine started |
| `stop` | `{}` | Engine stopped |
| `tick` | `{ tick, players, npcs, events }` | Tick update (broadcast to clients) |
| `playerJoin` | `{ playerId, state }` | Player joined the game |
| `playerLeave` | `{ playerId }` | Player left the game |
| `chunkLoad` | `{ center, coords }` | World chunk loaded |
| `event` | `<event>` | Game event processed |
| `update` | `<tick>` | Game state updated (for module hooks) |

### Server → Engine (call methods)

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `start()` | - | `Promise<void>` | Start the game loop |
| `stop()` | - | `void` | Stop the game loop |
| `addPlayer(id, name, spawn)` | `string, string, Coordinate` | `Promise<state>` | Add a player |
| `removePlayer(id)` | `string` | `Promise<void>` | Remove a player (saves state) |
| `queueEvent(event)` | `object` | `void` | Queue event for next tick |
| `getGameTime()` | - | `number` | Milliseconds since engine start |

## Event Types (for `queueEvent()`)

### Player Actions
```javascript
{ type: 'playerMove', playerId, direction } // 'north'|'south'|'east'|'west'|'up'|'down'
{ type: 'playerAction', playerId, action }  // 'interact'|'attack'|'use'
{ type: 'playerChat', playerId, message }
```

### Game Events
```javascript
{ type: 'npcSpawn', npcId, npcType, position }
{ type: 'tileChange', coord, newContent }
```

## Data Structures

### Player State
```javascript
{
  id: string,           // Unique player ID
  name: string,         // Display name
  position: Coordinate, // Current location
  inventory: array,     // Items
  health: number,       // HP (0-100)
  mana: number,         // Mana (0-100)
  createdAt: number     // Timestamp
}
```

### Coordinate
```javascript
new Coordinate(x, y, z)  // 3D phext coordinate (min = 1)
coord.toString()         // "X.Y.Z" format for SQ
Coordinate.fromString("5.3.7")
coord.neighbors()        // [Coordinate] 6 adjacent coords
coord.distanceTo(other)  // Manhattan distance
```

### Tick Data (broadcast to clients)
```javascript
{
  tick: number,
  players: [
    { id, name, position: "X.Y.Z", health, mana }
  ],
  npcs: [
    { id, type, position: "X.Y.Z", health }
  ],
  events: [
    { type, ...data }
  ]
}
```

## SQ Schema

### World Tiles
- **Collection:** `world`
- **Coordinate:** `X.Y.Z`
- **Content:** Plain text tile data (format TBD — will coordinate with rendering)

### Player State
- **Collection:** `players`
- **Coordinate:** `<playerId>`
- **Content:** JSON player state object

## Next Steps

1. **Verse:** Build REST + WebSocket server wrapping this engine
2. **Cyon:** Hook player input into `queueEvent()` system
3. **Lumen:** Hook physics/collision into `update` event
4. **Phex:** Hook NPC logic into `update` event
5. **Chrys:** Define narrative trigger event types

---

**Status:** Core engine scaffold complete. Ready for integration.
