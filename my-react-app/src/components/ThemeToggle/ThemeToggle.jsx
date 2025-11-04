// src/components/ThemeToggle/ThemeToggle.jsx
import { useState, useEffect } from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ theme, toggleTheme }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <button
      className={`theme-toggle ${theme} ${isAnimating ? 'animating' : ''} ${isHovering ? 'hovering' : ''}`}
      onClick={handleToggle}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="toggle-container">
        <div className="celestial-body">
          {/* Sun */}
          <div className="sun">
            <div className="sun-core"></div>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={`sun-ray ray-${i + 1}`}></div>
            ))}
          </div>
          
          {/* Moon */}
          <div className="moon">
            <div className="moon-crater crater-1"></div>
            <div className="moon-crater crater-2"></div>
            <div className="moon-crater crater-3"></div>
          </div>
        </div>
        
        {/* Stars that appear during transition */}
        <div className="transition-stars">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className={`star-twin star-${i + 1}`}></div>
          ))}
        </div>
      </div>
      
      {/* Glow effect */}
      <div className="toggle-glow"></div>
    </button>
  );
};

export default ThemeToggle;