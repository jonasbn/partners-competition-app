import React, { useState } from 'react';
import { getAvatarColor, getInitials } from '../utils/avatarUtils';

const AvatarWithHover = ({
  playerName,
  avatarSrc,
  size = 40,
  borderColor = 'var(--bs-primary, #0d6efd)',
  className = '',
  style = {},
  onClick = null
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  // Handle mouse enter
  const handleMouseEnter = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;
    
    setPopupPosition({ x, y });
    setIsHovered(true);
    setShowPopup(true);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowPopup(false);
  };

  // Style for the avatar circle (fallback)
  const avatarStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: getAvatarColor(playerName),
    color: 'white',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: `${size * 0.4}px`,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
    ...style
  };

  // Style for the avatar image
  const avatarImageStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    objectFit: 'cover',
    border: `2px solid ${borderColor}`,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
    ...style
  };

  // Style for the popup
  const popupStyle = {
    position: 'fixed',
    left: `${popupPosition.x}px`,
    top: `${popupPosition.y - 120}px`, // Position above the avatar
    transform: 'translateX(-50%)',
    zIndex: 10000,
    pointerEvents: 'none',
    opacity: showPopup ? 1 : 0,
    transition: 'opacity 0.2s ease',
    background: 'var(--card-bg, white)',
    border: '2px solid var(--card-border, #dee2e6)',
    borderRadius: '50%',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
    padding: '4px'
  };

  // Style for the popup avatar image
  const popupAvatarStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    display: 'block'
  };

  // Style for the popup fallback circle
  const popupAvatarCircleStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: getAvatarColor(playerName),
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '36px'
  };

  return (
    <>
      <div 
        className={`avatar-container ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{ position: 'relative', display: 'inline-block' }}
      >
        {avatarSrc ? (
          <>
            <img 
              src={avatarSrc} 
              alt={`${playerName} avatar`}
              style={avatarImageStyle}
              onError={(e) => {
                // Fallback to avatar circle if image fails to load
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'inline-flex';
              }}
            />
            <div 
              style={{...avatarStyle, display: 'none'}} 
              className="avatar-fallback"
            >
              {getInitials(playerName)}
            </div>
          </>
        ) : (
          <div style={avatarStyle} className="avatar-fallback">
            {getInitials(playerName)}
          </div>
        )}
      </div>

      {/* Hover popup */}
      {showPopup && (
        <div style={popupStyle}>
          {avatarSrc ? (
            <img 
              src={avatarSrc} 
              alt={`${playerName} avatar (large)`}
              style={popupAvatarStyle}
              onError={(e) => {
                // Fallback to colored circle for popup too
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            style={{
              ...popupAvatarCircleStyle, 
              display: avatarSrc ? 'none' : 'flex'
            }}
          >
            {getInitials(playerName)}
          </div>
          
          {/* Player name label */}
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--card-bg, white)',
            color: 'var(--text-color, black)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            whiteSpace: 'nowrap',
            border: '1px solid var(--card-border, #dee2e6)'
          }}>
            {playerName}
          </div>
        </div>
      )}
    </>
  );
};

export default AvatarWithHover;
