// Utility function to generate a background color based on player name
export const getAvatarColor = (name) => {
  // Simple hash function to generate a color based on the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate a vibrant HSL color with fixed saturation and lightness
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
};

// Function to get player initials for the avatar
export const getInitials = (name) => {
  return name.substring(0, 2).toUpperCase();
};

// Simple avatar path utility without complex dependencies
export const getPlayerAvatarPath = (playerName) => {
  try {
    if (!playerName || typeof playerName !== 'string') {
      return null;
    }
    
    const normalizedName = playerName.toLowerCase().trim();

    // Map player names to their avatar directories
    const playerAvatarMap = {
      'jonas': 'jonas',
      'torben': 'torben',
      'gitte': 'gitte',
      'anette': 'anette',
      'lotte': 'lotte',
      'peter': 'peter',
      'malene': 'malene',
      'kurt': 'kurt'
    };
    
    const avatarDir = playerAvatarMap[normalizedName];
    if (!avatarDir) {
      return null;
    }
    
    // For now, use the 'ok.png' avatar as default
    // In the future, this could be based on player performance or user selection
    const avatarPath = `/assets/${avatarDir}/ok.png`;

    return avatarPath;
  } catch (error) {
    console.error('Error getting player avatar path:', error);
    return null;
  }
};

// Function to get all available avatar options for a player
export const getPlayerAvatarOptions = (playerName) => {
  try {
    if (!playerName || typeof playerName !== 'string') {
      return [];
    }
    
    const normalizedName = playerName.toLowerCase().trim();
    const playerAvatarMap = {
      'jonas': 'jonas',
      'torben': 'torben',
      'gitte': 'gitte',
      'anette': 'anette',
      'lotte': 'lotte',
      'peter': 'peter',
      'malene': 'malene',
      'kurt': 'kurt'
    };
    
    const avatarDir = playerAvatarMap[normalizedName];
    if (!avatarDir) {
      return [];
    }
    
    // Available avatar expressions
    const avatarOptions = [
      { name: 'happy', path: `/assets/${avatarDir}/happy.png`, emoji: '😊' },
      { name: 'ok', path: `/assets/${avatarDir}/ok.png`, emoji: '😐' },
      { name: 'sad', path: `/assets/${avatarDir}/sad.png`, emoji: '😢' }
    ];
    
    return avatarOptions;
  } catch (error) {
    console.error('Error getting player avatar options:', error);
    return [];
  }
};

// Function to determine which avatar to show based on player ranking.
// gamesPlayed is optional: when explicitly 0, there's no real ranking yet
// (e.g. a tournament that hasn't started), so every player gets the
// neutral "ok" avatar regardless of rank position. Omitting it preserves
// rank-only selection for existing call sites.
export const getRankBasedAvatar = (playerName, rank, gamesPlayed) => {
  try {
    const options = getPlayerAvatarOptions(playerName);
    if (options.length === 0) {
      return null;
    }

    if (gamesPlayed === 0) {
      return options.find(opt => opt.name === 'ok')?.path || options[0].path;
    }

    // Choose avatar based on ranking position
    if (rank === 1) {
      // Rank 1: Happy avatar
      const happyAvatar = options.find(opt => opt.name === 'happy')?.path || options[0].path;
      return happyAvatar;
    } else if (rank === 2 || rank === 3) {
      // Ranks 2-3: OK avatar
      const okAvatar = options.find(opt => opt.name === 'ok')?.path || options[0].path;
      return okAvatar;
    } else {
      // Ranks 4-6: Sad avatar
      const sadAvatar = options.find(opt => opt.name === 'sad')?.path || options[0].path;
      return sadAvatar;
    }
  } catch (error) {
    console.error('Error getting rank-based avatar:', error);
    return getPlayerAvatarPath(playerName); // Fallback to default
  }
};

