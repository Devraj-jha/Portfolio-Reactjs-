// src/components/MagneticCursor/MagneticCursor.jsx
import { useEffect, useState } from 'react';
import { useMousePosition } from '../../hooks/useMousePosition';
import './MagneticCursor.css';

const MagneticCursor = () => {
  const { x, y } = useMousePosition();
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseEnter = (e) => {
      if (e.target.matches('button, a, [role="button"]')) {
        setIsPointer(true);
      }
    };

    const handleMouseLeave = () => {
      setIsPointer(false);
    };

    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
    
    setIsVisible(true);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div 
        className={`cursor-dot ${isPointer ? 'pointer' : ''}`}
        style={{ left: `${x}px`, top: `${y}px` }}
      />
      <div 
        className={`cursor-outline ${isPointer ? 'pointer' : ''}`}
        style={{ left: `${x}px`, top: `${y}px` }}
      />
    </>
  );
};

export default MagneticCursor;