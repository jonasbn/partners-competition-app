import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getAvatarColor, getInitials } from '../utils/avatarUtils';
import Logger from '../utils/logger';

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
  const avatarRef = useRef(null);

  // Handle mouse enter
  const handleMouseEnter = (e) => {
    setIsHovered(true);
    setShowPopup(true);
    
    // Calculate popup position based on avatar position
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      setPopupPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
    }
    
    // Log avatar hover interaction
    Logger.userAction('avatar_hover', {
      playerName,
      avatarSrc: avatarSrc ? 'custom' : 'fallback',
      size
    });
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowPopup(false);
  };

  // Update popup position on scroll or resize
  useEffect(() => {
    if (showPopup && avatarRef.current) {
      const updatePosition = () => {
        const rect = avatarRef.current.getBoundingClientRect();
        setPopupPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      };

      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [showPopup]);

  // Handle click events
  const handleClick = (e) => {
    if (onClick) {
      Logger.userAction('avatar_click', {
        playerName,
        avatarSrc: avatarSrc ? 'custom' : 'fallback'
      });
      onClick(e);
    }
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

  // Style for the popup (using fixed positioning for portal)
  const popupStyle = {
    position: 'fixed',
    left: `${popupPosition.x}px`,
    top: `${popupPosition.y}px`,
    transform: 'translate(-50%, -50%)', // Center the popup on the avatar
    zIndex: 999999, // Extremely high z-index to ensure popups appear above everything
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
        ref={avatarRef}
        className={`avatar-container ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
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

      {/* Hover popup rendered via portal to ensure it appears above all other elements */}
      {showPopup && createPortal(
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
            bottom: '-25px',
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
        </div>,
        document.body
      )}
    </>
  );
};

export default AvatarWithHover;
