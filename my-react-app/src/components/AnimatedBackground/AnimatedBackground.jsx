// src/components/AnimatedBackground/AnimatedBackground.jsx
import { useEffect, useState, useCallback } from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  const [meteors, setMeteors] = useState([]);
  const [stars, setStars] = useState([]);

  // Optimized meteor creation with useCallback
  const createMeteor = useCallback(() => {
    const meteor = {
      id: Math.random(),
      left: Math.random() * 100,
      top: Math.random() * 20,
      delay: Math.random() * 2,
      duration: 0.8 + Math.random() * 0.7
    };
    
    setMeteors(prev => {
      const newMeteors = [...prev.slice(-8), meteor];
      return newMeteors;
    });

    setTimeout(() => {
      setMeteors(prev => prev.filter(m => m.id !== meteor.id));
    }, meteor.duration * 1000);
  }, []);

  // Optimized star creation with useCallback
  const createStar = useCallback(() => {
    const star = {
      id: Math.random(),
      left: Math.random() * 100,
      top: Math.random() * 30,
      delay: Math.random() * 3,
      duration: 0.5 + Math.random() * 0.5
    };
    
    setStars(prev => {
      const newStars = [...prev.slice(-12), star];
      return newStars;
    });

    setTimeout(() => {
      setStars(prev => prev.filter(s => s.id !== star.id));
    }, star.duration * 1000);
  }, []);

  useEffect(() => {
    // Reduced intervals for better performance
    const meteorInterval = setInterval(createMeteor, 800);
    const starInterval = setInterval(createStar, 600);

    return () => {
      clearInterval(meteorInterval);
      clearInterval(starInterval);
    };
  }, [createMeteor, createStar]);

  return (
    <div className="animated-background">
      {/* Meteor Shower - Light Theme */}
      <div className="meteors-container">
        {meteors.map(meteor => (
          <div
            key={meteor.id}
            className="meteor"
            style={{
              left: `${meteor.left}%`,
              top: `${meteor.top}%`,
              animationDelay: `${meteor.delay}s`,
              animationDuration: `${meteor.duration}s`
            }}
          />
        ))}
      </div>

      {/* Shooting Stars - Dark Theme */}
      <div className="stars-container">
        {stars.map(star => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`
            }}
          />
        ))}
      </div>

      {/* Subtle Grid Pattern */}
      <div className="grid-pattern"></div>
    </div>
  );
};

export default AnimatedBackground;