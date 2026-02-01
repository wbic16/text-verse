/**
 * SQClient.js
 * Interface to SQ (phext storage) for world persistence
 * Assumes SQ is running at localhost:1337 with authentication
 */

import axios from 'axios';
import { Coordinate } from './Coordinate.js';

export class SQClient {
  constructor(options = {}) {
    this.baseURL = options.baseURL || 'http://localhost:1337';
    this.username = options.username || 'text-verse';
    this.password = options.password || 'phext-game-2026';
    this.collection = options.collection || 'world';
    this.client = axios.create({
      baseURL: this.baseURL,
      auth: {
        username: this.username,
        password: this.password
      },
      timeout: 5000
    });
  }

  /**
   * Read tile data from a coordinate
   * @param {Coordinate} coord
   * @returns {Promise<string>} Tile content (plain text)
   */
  async readTile(coord) {
    try {
      const response = await this.client.get(`/fetch/${this.collection}/${coord.toString()}`);
      return response.data || '';
    } catch (error) {
      if (error.response?.status === 404) {
        return ''; // Empty tile
      }
      throw new Error(`SQ read failed at ${coord}: ${error.message}`);
    }
  }

  /**
   * Write tile data to a coordinate
   * @param {Coordinate} coord
   * @param {string} content - Tile content (plain text)
   */
  async writeTile(coord, content) {
    try {
      await this.client.post(`/save/${this.collection}/${coord.toString()}`, content, {
        headers: { 'Content-Type': 'text/plain' }
      });
    } catch (error) {
      throw new Error(`SQ write failed at ${coord}: ${error.message}`);
    }
  }

  /**
   * Read player state
   * @param {string} playerId - Player's unique ID
   * @returns {Promise<object>} Player state object
   */
  async readPlayer(playerId) {
    try {
      const response = await this.client.get(`/fetch/players/${playerId}`);
      return JSON.parse(response.data || '{}');
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // New player
      }
      throw new Error(`Player read failed for ${playerId}: ${error.message}`);
    }
  }

  /**
   * Write player state
   * @param {string} playerId
   * @param {object} state - Player state object
   */
  async writePlayer(playerId, state) {
    try {
      await this.client.post(`/save/players/${playerId}`, JSON.stringify(state, null, 2), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      throw new Error(`Player write failed for ${playerId}: ${error.message}`);
    }
  }

  /**
   * Batch read tiles (for loading chunks)
   * @param {Coordinate[]} coords - Array of coordinates
   * @returns {Promise<Map<string, string>>} Map of coord.toString() -> content
   */
  async readBatch(coords) {
    const results = new Map();
    const promises = coords.map(async coord => {
      const content = await this.readTile(coord);
      results.set(coord.toString(), content);
    });
    await Promise.all(promises);
    return results;
  }

  /**
   * Health check — is SQ accessible?
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    try {
      await this.client.get('/');
      return true;
    } catch (error) {
      return false;
    }
  }
}
