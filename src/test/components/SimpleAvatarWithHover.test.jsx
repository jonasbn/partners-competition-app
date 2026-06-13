import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SimpleAvatarWithHover from '../../components/SimpleAvatarWithHover';

vi.mock('../../utils/simpleAvatarUtils', () => ({
  getAvatarColor: () => 'hsl(200, 70%, 60%)',
  getInitials: (name) => name.substring(0, 2).toUpperCase(),
}));

describe('SimpleAvatarWithHover – rendering', () => {
  it('renders an img element when avatarSrc is provided', () => {
    render(
      <SimpleAvatarWithHover
        playerName="Jonas"
        avatarSrc="/assets/jonas/happy.png"
        size={40}
      />
    );
    const img = screen.getByAltText('Jonas avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/assets/jonas/happy.png');
  });

  it('renders initials when no avatarSrc is provided', () => {
    render(<SimpleAvatarWithHover playerName="Torben" size={40} />);
    expect(screen.getByText('TO')).toBeInTheDocument();
  });

  it('applies the size prop to the image style', () => {
    render(
      <SimpleAvatarWithHover
        playerName="Gitte"
        avatarSrc="/assets/gitte/ok.png"
        size={60}
      />
    );
    const img = screen.getByAltText('Gitte avatar');
    expect(img.style.width).toBe('60px');
    expect(img.style.height).toBe('60px');
  });
});

describe('SimpleAvatarWithHover – hover popup', () => {
  it('shows the player name in a portal popup on mouse enter', () => {
    render(
      <SimpleAvatarWithHover
        playerName="Anette"
        avatarSrc="/assets/anette/ok.png"
        size={40}
      />
    );
    const container = document.querySelector('.avatar-container');
    fireEvent.mouseEnter(container);
    expect(screen.getByText('Anette')).toBeInTheDocument();
  });

  it('hides the popup on mouse leave', () => {
    render(
      <SimpleAvatarWithHover
        playerName="Lotte"
        avatarSrc="/assets/lotte/ok.png"
        size={40}
      />
    );
    const container = document.querySelector('.avatar-container');
    fireEvent.mouseEnter(container);
    fireEvent.mouseLeave(container);
    expect(screen.queryByText('Lotte')).not.toBeInTheDocument();
  });
});

describe('SimpleAvatarWithHover – click', () => {
  it('calls the onClick prop when the avatar is clicked', () => {
    const handleClick = vi.fn();
    render(
      <SimpleAvatarWithHover
        playerName="Peter"
        avatarSrc="/assets/peter/ok.png"
        size={40}
        onClick={handleClick}
      />
    );
    const container = document.querySelector('.avatar-container');
    fireEvent.click(container);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not throw when clicked without an onClick prop', () => {
    render(
      <SimpleAvatarWithHover playerName="Jonas" avatarSrc="/assets/jonas/ok.png" size={40} />
    );
    const container = document.querySelector('.avatar-container');
    expect(() => fireEvent.click(container)).not.toThrow();
  });
});
