// src/components/LeafBackground/LeafBackground.jsx
import { useEffect, useState } from 'react';
import './LeafBackground.css';

const LeafBackground = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    // Create initial leaves
    const initialLeaves = Array.from({ length: 15 }, (_, i) => createLeaf(i * 0.5));
    setLeaves(initialLeaves);

    // Continuously create new leaves
    const leafInterval = setInterval(() => {
      setLeaves(prev => {
        // Remove leaves that are too old (off-screen)
        const filtered = prev.filter(leaf => {
          const timePassed = Date.now() - leaf.createdAt;
          return timePassed < leaf.duration * 1000;
        });
        
        // Add new leaf if we have less than 20 leaves
        if (filtered.length < 20) {
          return [...filtered, createLeaf()];
        }
        return filtered;
      });
    }, 800); // Add new leaf every 800ms

    return () => clearInterval(leafInterval);
  }, []);

  const createLeaf = (delay = 0) => {
    const types = ['cherry', 'maple', 'simple'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      id: Math.random(),
      left: Math.random() * 100,
      delay: delay + Math.random() * 2,
      duration: 12 + Math.random() * 8, // 12-20 seconds
      size: 20 + Math.random() * 25, // 20-45px
      rotation: Math.random() * 360,
      type: type,
      animation: Math.random() > 0.5 ? 'fallLeft' : 'fallRight',
      swing: Math.random() * 4 - 2, // -2 to 2 degrees swing
      createdAt: Date.now(),
      opacity: 0.6 + Math.random() * 0.3 // 0.6-0.9 opacity
    };
  };

  // Pixelated cherry blossom colors
  const leafColors = {
    cherry: ['#FFB7C5', '#FF9EB5', '#FF85A5', '#FF6B95'], // Pink shades
    maple: ['#FFD700', '#FFA500', '#FF8C00', '#FF6347'], // Orange/Yellow shades
    simple: ['#98FB98', '#90EE90', '#7CFC00', '#32CD32']  // Green shades
  };

  const getLeafColor = (type) => {
    const colors = leafColors[type];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="leaf-background">
      {leaves.map(leaf => (
        <div
          key={leaf.id}
          className={`leaf leaf-${leaf.type} ${leaf.animation}`}
          style={{
            left: `${leaf.left}%`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            transform: `rotate(${leaf.rotation}deg)`,
            opacity: leaf.opacity,
            filter: 'brightness(1.1) saturate(1.2)'
          }}
        >
          <div 
            className="leaf-shape"
            style={{
              backgroundColor: getLeafColor(leaf.type),
              width: '100%',
              height: '100%',
              borderRadius: leaf.type === 'cherry' ? '42% 58% 70% 30% / 47% 36% 64% 53%' :
                         leaf.type === 'maple' ? '50% 50% 50% 70% / 60% 60% 40% 40%' :
                         '60% 40% 30% 70% / 60% 30% 70% 40%',
              transform: `scale(${0.8 + Math.random() * 0.4})`,
              boxShadow: `
                inset 2px 2px 4px rgba(255, 255, 255, 0.3),
                inset -2px -2px 4px rgba(0, 0, 0, 0.2),
                2px 2px 8px rgba(0, 0, 0, 0.1)
              `
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default LeafBackground;