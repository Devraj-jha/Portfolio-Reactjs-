// src/components/LeafBackground/LeafBackground.jsx
import { useEffect, useState } from 'react';
import './LeafBackground.css';

const LeafBackground = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const createLeaf = () => {
      const leaf = {
        id: Math.random(),
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 10,
        size: 20 + Math.random() * 20,
        rotation: Math.random() * 360,
        type: Math.floor(Math.random() * 3) // 3 different leaf styles
      };
      
      setLeaves(prev => [...prev.slice(-30), leaf]);
      
      setTimeout(() => {
        setLeaves(prev => prev.filter(l => l.id !== leaf.id));
      }, leaf.duration * 1000);
    };

    const leafInterval = setInterval(createLeaf, 500);
    return () => clearInterval(leafInterval);
  }, []);

  return (
    <div className="leaf-background">
      {leaves.map(leaf => (
        <div
          key={leaf.id}
          className={`leaf leaf-${leaf.type}`}
          style={{
            left: `${leaf.left}%`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            transform: `rotate(${leaf.rotation}deg)`
          }}
        />
      ))}
    </div>
  );
};

export default LeafBackground;