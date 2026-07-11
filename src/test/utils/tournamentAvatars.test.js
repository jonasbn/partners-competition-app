import { describe, it, expect } from 'vitest';
import { getPlayerAvatarPath, getPlayerAvatarOptions } from '../../utils/simpleAvatarUtils';

describe('simpleAvatarUtils — tournament players', () => {
  it('resolves an avatar path for Malene', () => {
    expect(getPlayerAvatarPath('Malene')).toBe('/assets/malene/ok.png');
  });

  it('resolves an avatar path for Kurt', () => {
    expect(getPlayerAvatarPath('Kurt')).toBe('/assets/kurt/ok.png');
  });

  it('resolves avatar options (happy/ok/sad) for Malene', () => {
    const options = getPlayerAvatarOptions('Malene');
    expect(options.map(o => o.name)).toEqual(['happy', 'ok', 'sad']);
    expect(options[0].path).toBe('/assets/malene/happy.png');
  });

  it('resolves avatar options (happy/ok/sad) for Kurt', () => {
    const options = getPlayerAvatarOptions('Kurt');
    expect(options.map(o => o.name)).toEqual(['happy', 'ok', 'sad']);
    expect(options[2].path).toBe('/assets/kurt/sad.png');
  });

  it('still resolves an existing season player unaffected by the change', () => {
    expect(getPlayerAvatarPath('Jonas')).toBe('/assets/jonas/ok.png');
  });
});
