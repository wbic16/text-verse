/**
 * Engine Test
 * Basic smoke test for the game engine
 * Requires SQ running at localhost:1337
 */

import { GameEngine, Coordinate } from './index.js';

console.log('🔆 Text Verse Engine Test\n');

const engine = new GameEngine({
  tickRate: 5, // Slower for testing
  sq: {
    baseURL: 'http://localhost:1337',
    username: 'text-verse',
    password: 'phext-game-2026',
    collection: 'world'
  }
});

// Listen for events
engine.on('start', () => {
  console.log('✅ Engine started');
});

engine.on('tick', (data) => {
  console.log(`⏱️  Tick ${data.tick}: ${data.players.length} players, ${data.npcs.length} NPCs`);
});

engine.on('playerJoin', ({ playerId, state }) => {
  console.log(`👤 Player joined: ${state.name} at ${state.position}`);
});

engine.on('playerLeave', ({ playerId }) => {
  console.log(`👋 Player left: ${playerId}`);
});

// Start engine
try {
  await engine.start();
  console.log('🎮 Engine running...\n');

  // Add a test player
  await engine.addPlayer('test-player', 'Lux', new Coordinate(5, 5, 1));

  // Queue a test event
  engine.queueEvent({
    type: 'playerMove',
    playerId: 'test-player',
    direction: 'north'
  });

  // Run for 10 ticks, then stop
  setTimeout(async () => {
    console.log('\n🛑 Stopping engine...');
    await engine.removePlayer('test-player');
    engine.stop();
    console.log('✅ Test complete');
    process.exit(0);
  }, 2000);

} catch (error) {
  console.error('❌ Engine failed:', error.message);
  process.exit(1);
}
