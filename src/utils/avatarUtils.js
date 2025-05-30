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
