import { describe, it, expect } from 'vitest';

describe('Basic App Tests', () => {
  it('should have a basic test that passes', () => {
    expect(true).toBe(true);
  });

  it('should test basic JavaScript functionality', () => {
    const array = [1, 2, 3];
    expect(array.length).toBe(3);
    
    const doubled = array.map(x => x * 2);
    expect(doubled).toEqual([2, 4, 6]);
  });

  it('should test object operations', () => {
    const player = { name: 'Jonas', score: 10 };
    expect(player.name).toBe('Jonas');
    expect(player.score).toBe(10);
    
    const updatedPlayer = { ...player, score: 15 };
    expect(updatedPlayer.score).toBe(15);
    expect(player.score).toBe(10); // Original unchanged
  });
});