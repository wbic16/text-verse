/**
 * Coordinate.js
 * Phext-native 3D coordinate system for Text Verse
 * Maps to SQ scroll coordinates: X.Y.Z
 */

export class Coordinate {
  constructor(x = 1, y = 1, z = 1) {
    this.x = Math.max(1, Math.floor(x)); // Min coordinate = 1
    this.y = Math.max(1, Math.floor(y));
    this.z = Math.max(1, Math.floor(z));
  }

  /**
   * Convert coordinate to SQ scroll address
   * Format: X.Y.Z (e.g., "5.3.7")
   */
  toString() {
    return `${this.x}.${this.y}.${this.z}`;
  }

  /**
   * Parse SQ scroll address into Coordinate
   * @param {string} addr - Format: "X.Y.Z"
   * @returns {Coordinate}
   */
  static fromString(addr) {
    const parts = addr.split('.').map(n => parseInt(n, 10));
    if (parts.length !== 3 || parts.some(isNaN)) {
      throw new Error(`Invalid coordinate string: ${addr}`);
    }
    return new Coordinate(parts[0], parts[1], parts[2]);
  }

  /**
   * Calculate distance to another coordinate (Manhattan distance)
   */
  distanceTo(other) {
    return Math.abs(this.x - other.x) + 
           Math.abs(this.y - other.y) + 
           Math.abs(this.z - other.z);
  }

  /**
   * Get neighboring coordinates (6 directions in 3D)
   */
  neighbors() {
    return [
      new Coordinate(this.x + 1, this.y, this.z), // East
      new Coordinate(this.x - 1, this.y, this.z), // West
      new Coordinate(this.x, this.y + 1, this.z), // North
      new Coordinate(this.x, this.y - 1, this.z), // South
      new Coordinate(this.x, this.y, this.z + 1), // Up
      new Coordinate(this.x, this.y, this.z - 1), // Down
    ].filter(c => c.x >= 1 && c.y >= 1 && c.z >= 1); // Stay in valid bounds
  }

  /**
   * Check equality with another coordinate
   */
  equals(other) {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  /**
   * Clone this coordinate
   */
  clone() {
    return new Coordinate(this.x, this.y, this.z);
  }
}
