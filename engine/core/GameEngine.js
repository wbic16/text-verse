/**
 * GameEngine.js
 * Core game loop and state manager for Text Verse
 * Tick-based multiplayer-safe architecture
 */

import { EventEmitter } from 'events';
import { SQClient } from './SQClient.js';
import { Coordinate } from './Coordinate.js';

export class GameEngine extends EventEmitter {
  constructor(options = {}) {
    super();
    this.tickRate = options.tickRate || 20; // Ticks per second (50ms per tick)
    this.sq = new SQClient(options.sq || {});
    this.running = false;
    this.tick = 0;
    this.startTime = null;
    
    // Game state
    this.players = new Map(); // playerId -> playerState
    this.loadedChunks = new Map(); // coord.toString() -> tileData
    this.npcs = new Map(); // npcId -> npcState
    this.events = []; // Event queue for this tick
  }

  /**
   * Start the game loop
   */
  async start() {
    if (this.running) return;
    
    // Health check SQ
    const sqOk = await this.sq.healthCheck();
    if (!sqOk) {
      throw new Error('SQ is not accessible. Ensure SQ is running at localhost:1337');
    }

    this.running = true;
    this.startTime = Date.now();
    this.tick = 0;
    
    this.emit('start');
    this._loop();
  }

  /**
   * Stop the game loop
   */
  stop() {
    this.running = false;
    this.emit('stop');
  }

  /**
   * Main game loop (called every tick)
   */
  _loop() {
    if (!this.running) return;

    const tickStart = Date.now();
    this.tick++;

    // Process queued events
    this._processEvents();

    // Update game state
    this._update();

    // Emit tick event (for server to broadcast to clients)
    this.emit('tick', {
      tick: this.tick,
      players: this._serializePlayers(),
      npcs: this._serializeNPCs(),
      events: this.events
    });

    // Clear event queue
    this.events = [];

    // Schedule next tick
    const tickDuration = Date.now() - tickStart;
    const nextTickDelay = Math.max(0, (1000 / this.tickRate) - tickDuration);
    setTimeout(() => this._loop(), nextTickDelay);
  }

  /**
   * Process queued events (player actions, NPC triggers, etc.)
   */
  _processEvents() {
    // Placeholder — will integrate with Controls (Cyon), Gameplay (Phex), etc.
    for (const event of this.events) {
      this.emit('event', event);
    }
  }

  /**
   * Update game state (physics, NPCs, world changes)
   */
  _update() {
    // Placeholder — will integrate with Physics (Lumen), Gameplay (Phex)
    // For now, just emit update event for modules to hook into
    this.emit('update', this.tick);
  }

  /**
   * Add a player to the game
   */
  async addPlayer(playerId, name, spawnCoord = new Coordinate(1, 1, 1)) {
    // Load player state from SQ (or create new)
    let state = await this.sq.readPlayer(playerId);
    
    if (!state) {
      // New player
      state = {
        id: playerId,
        name,
        position: spawnCoord,
        inventory: [],
        health: 100,
        mana: 100,
        createdAt: Date.now()
      };
      await this.sq.writePlayer(playerId, state);
    }

    this.players.set(playerId, state);
    this.emit('playerJoin', { playerId, state });
    
    // Load the chunk the player is in
    await this._loadChunk(state.position);
    
    return state;
  }

  /**
   * Remove a player from the game
   */
  async removePlayer(playerId) {
    const state = this.players.get(playerId);
    if (!state) return;

    // Save player state to SQ
    await this.sq.writePlayer(playerId, state);
    this.players.delete(playerId);
    this.emit('playerLeave', { playerId });
  }

  /**
   * Load a chunk (3x3x3 area around a coordinate)
   */
  async _loadChunk(center) {
    const coords = [];
    for (let x = center.x - 1; x <= center.x + 1; x++) {
      for (let y = center.y - 1; y <= center.y + 1; y++) {
        for (let z = center.z - 1; z <= center.z + 1; z++) {
          const coord = new Coordinate(x, y, z);
          if (!this.loadedChunks.has(coord.toString())) {
            coords.push(coord);
          }
        }
      }
    }

    if (coords.length > 0) {
      const tiles = await this.sq.readBatch(coords);
      tiles.forEach((content, coordStr) => {
        this.loadedChunks.set(coordStr, content);
      });
      this.emit('chunkLoad', { center, coords });
    }
  }

  /**
   * Queue an event for processing on next tick
   */
  queueEvent(event) {
    this.events.push(event);
  }

  /**
   * Serialize player states for network transmission
   */
  _serializePlayers() {
    const result = [];
    this.players.forEach((state, id) => {
      result.push({
        id,
        name: state.name,
        position: state.position.toString(),
        health: state.health,
        mana: state.mana
      });
    });
    return result;
  }

  /**
   * Serialize NPC states for network transmission
   */
  _serializeNPCs() {
    const result = [];
    this.npcs.forEach((state, id) => {
      result.push({
        id,
        type: state.type,
        position: state.position.toString(),
        health: state.health
      });
    });
    return result;
  }

  /**
   * Get current game time (milliseconds since start)
   */
  getGameTime() {
    return this.startTime ? Date.now() - this.startTime : 0;
  }
}
