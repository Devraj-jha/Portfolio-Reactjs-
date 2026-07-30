'use client';

import { useState, useEffect } from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsVisible(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="loading-screen">
      <div className="loader-content">
        <div className="loader-logo">
          <div className="logo-shape">DJ</div>
        </div>
        
        <div className="loading-bar-container">
          <div 
            className="loading-progress" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="loader-text">
          <span className="loading-dots">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;