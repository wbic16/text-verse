/**
 * Text Verse Game Engine
 * Entry point — exports core modules for server integration
 */

export { GameEngine } from './core/GameEngine.js';
export { SQClient } from './core/SQClient.js';
export { Coordinate } from './core/Coordinate.js';

// Modules to be integrated:
// - Controls (Cyon) — player input → game events
// - Physics (Lumen) — collision, lighting, movement
// - Gameplay (Phex) — NPCs, spawns, mechanics
// - Story (Chrys) — narrative triggers, quests
