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
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 8,
        size: 15 + Math.random() * 25,
        rotation: Math.random() * 360,
        type: Math.floor(Math.random() * 3),
        animation: Math.random() > 0.5 ? 'fallLeft' : 'fallRight'
      };
      
      setLeaves(prev => [...prev.slice(-25), leaf]);
      
      setTimeout(() => {
        setLeaves(prev => prev.filter(l => l.id !== leaf.id));
      }, leaf.duration * 1000);
    };

    const leafInterval = setInterval(createLeaf, 800);
    return () => clearInterval(leafInterval);
  }, []);

  // Leaf SVG data for different types
  const leafSVGs = [
    // Cherry blossom leaf
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23" + (document.documentElement.getAttribute('data-theme') === 'dark' ? 'ccc' : '666') + "' d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9C21 10.1 20.1 11 19 11C17.9 11 17 10.1 17 9C17 7.9 17.9 7 19 7C20.1 7 21 7.9 21 9ZM3 9C3 10.1 3.9 11 5 11C6.1 11 7 10.1 7 9C7 7.9 6.1 7 5 7C3.9 7 3 7.9 3 9ZM12 20C13.1 20 14 20.9 14 22C14 23.1 13.1 24 12 24C10.9 24 10 23.1 10 22C10 20.9 10.9 20 12 20ZM5 15C3.9 15 3 15.9 3 17C3 18.1 3.9 19 5 19C6.1 19 7 18.1 7 17C7 15.9 6.1 15 5 15ZM19 15C17.9 15 17 15.9 17 17C17 18.1 17.9 19 19 19C20.1 19 21 18.1 21 17C21 15.9 20.1 15 19 15Z'/%3E%3C/svg%3E",
    
    // Maple leaf
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23" + (document.documentElement.getAttribute('data-theme') === 'dark' ? 'ddd' : '888') + "' d='M12 2C11.5 2 11 2.2 10.6 2.6C10.2 3 10 3.5 10 4C10 4.5 10.2 5 10.6 5.4C11 5.8 11.5 6 12 6C12.5 6 13 5.8 13.4 5.4C13.8 5 14 4.5 14 4C14 3.5 13.8 3 13.4 2.6C13 2.2 12.5 2 12 2ZM17.5 8C16.9 8 16.4 8.2 16 8.6C15.6 9 15.4 9.5 15.4 10.1C15.4 10.7 15.6 11.2 16 11.6C16.4 12 16.9 12.2 17.5 12.2C18.1 12.2 18.6 12 19 11.6C19.4 11.2 19.6 10.7 19.6 10.1C19.6 9.5 19.4 9 19 8.6C18.6 8.2 18.1 8 17.5 8ZM6.5 8C5.9 8 5.4 8.2 5 8.6C4.6 9 4.4 9.5 4.4 10.1C4.4 10.7 4.6 11.2 5 11.6C5.4 12 5.9 12.2 6.5 12.2C7.1 12.2 7.6 12 8 11.6C8.4 11.2 8.6 10.7 8.6 10.1C8.6 9.5 8.4 9 8 8.6C7.6 8.2 7.1 8 6.5 8Z'/%3E%3C/svg%3E",
    
    // Simple leaf
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23" + (document.documentElement.getAttribute('data-theme') === 'dark' ? 'eee' : 'aaa') + "' d='M12 2C8.1 2 5 5.1 5 9C5 12.9 8.1 16 12 16C15.9 16 19 12.9 19 9C19 5.1 15.9 2 12 2ZM12 14C9.2 14 7 11.8 7 9C7 6.2 9.2 4 12 4C14.8 4 17 6.2 17 9C17 11.8 14.8 14 12 14Z'/%3E%3C/svg%3E"
  ];

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
            transform: `rotate(${leaf.rotation}deg)`
          }}
        >
          <img 
            src={leafSVGs[leaf.type]} 
            alt="leaf" 
            style={{
              width: '100%',
              height: '100%',
              opacity: 0.7
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default LeafBackground;