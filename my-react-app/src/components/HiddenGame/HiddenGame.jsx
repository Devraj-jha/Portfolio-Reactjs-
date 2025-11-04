// src/components/HiddenGame/HiddenGame.jsx
import { useState, useEffect, useRef } from 'react';
import './HiddenGame.css';

const HiddenGame = ({ isOpen, onClose }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameRef = useRef(null);

  useEffect(() => {
    if (isOpen && isPlaying) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, isPlaying]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    moveTarget();
  };

  const moveTarget = () => {
    if (!gameRef.current || !isPlaying) return;
    
    const gameRect = gameRef.current.getBoundingClientRect();
    const newX = Math.random() * (gameRect.width - 50);
    const newY = Math.random() * (gameRect.height - 50);
    
    setPosition({ x: newX, y: newY });
  };

  const handleTargetClick = () => {
    if (!isPlaying) return;
    
    setScore(prev => prev + 1);
    moveTarget();
  };

  if (!isOpen) return null;

  return (
    <div className="game-overlay" onClick={onClose}>
      <div className="game-container scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="game-header">
          <h2>🎮 Hidden Game</h2>
          <button className="close-game" onClick={onClose}>×</button>
        </div>
        
        <div className="game-stats">
          <div className="stat">
            <span className="label">Score:</span>
            <span className="value">{score}</span>
          </div>
          <div className="stat">
            <span className="label">Time:</span>
            <span className="value">{timeLeft}s</span>
          </div>
        </div>

        <div 
          ref={gameRef}
          className="game-area"
        >
          {!isPlaying ? (
            <div className="game-start">
              {timeLeft === 0 ? (
                <>
                  <h3>Game Over!</h3>
                  <p>Final Score: {score}</p>
                  <button onClick={startGame} className="play-again-btn">
                    Play Again
                  </button>
                </>
              ) : (
                <>
                  <h3>Click the Target Game</h3>
                  <p>Click the moving target as many times as possible in 30 seconds!</p>
                  <button onClick={startGame} className="start-btn">
                    Start Game
                  </button>
                </>
              )}
            </div>
          ) : (
            <div
              className="target"
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`
              }}
              onClick={handleTargetClick}
            />
          )}
        </div>

        <div className="game-instructions">
          <p>Click the red target as fast as you can!</p>
        </div>
      </div>
    </div>
  );
};

export default HiddenGame;