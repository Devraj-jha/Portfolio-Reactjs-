'use client';

import { useState, useEffect, useRef } from 'react';
import './HiddenGame.css';

const HiddenGame = ({ isOpen, onClose }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [targets, setTargets] = useState([]);
  const gameRef = useRef(null);

  useEffect(() => {
    if (isOpen && isPlaying) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Create targets periodically
      const targetInterval = setInterval(() => {
        if (isPlaying && targets.length < 5) {
          createTarget();
        }
      }, 1000);

      return () => {
        clearInterval(timer);
        clearInterval(targetInterval);
      };
    }
  }, [isOpen, isPlaying, targets.length]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
    setIsPlaying(true);
    
    // Create initial targets
    setTimeout(() => {
      createTarget();
      createTarget();
    }, 100);
  };

  const endGame = () => {
    setIsPlaying(false);
    setTargets([]);
  };

  const createTarget = () => {
    if (!gameRef.current) return;

    const gameRect = gameRef.current.getBoundingClientRect();
    const size = 30 + Math.random() * 30; // 30-60px
    const target = {
      id: Math.random(),
      x: Math.random() * (gameRect.width - size),
      y: Math.random() * (gameRect.height - size),
      size: size,
      type: Math.floor(Math.random() * 3), // Different target types
      createdAt: Date.now()
    };

    setTargets(prev => [...prev, target]);

    // Remove target after 3 seconds if not clicked
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== target.id));
    }, 3000);
  };

  const handleTargetClick = (targetId, points = 1) => {
    if (!isPlaying) return;

    setScore(prev => prev + points);
    setTargets(prev => prev.filter(target => target.id !== targetId));
  };

  const getTargetEmoji = (type) => {
    const emojis = ['🎯', '⭐', '🔴'];
    return emojis[type] || '🎯';
  };

  const getTargetPoints = (type) => {
    return type + 1; // 1, 2, or 3 points
  };

  if (!isOpen) return null;

  return (
    <div className="game-overlay" onClick={onClose}>
      <div className="game-container scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="game-header">
          <h2>🎮 Click Attack Game</h2>
          <button className="close-game" onClick={onClose}>×</button>
        </div>
        
        <div className="game-stats">
          <div className="stat">
            <span className="label">Score:</span>
            <span className="value">{score}</span>
          </div>
          <div className="stat">
            <span className="label">Time:</span>
            <span className="value time-critical" style={{ color: timeLeft <= 10 ? '#ff4444' : 'inherit' }}>
              {timeLeft}s
            </span>
          </div>
          <div className="stat">
            <span className="label">Targets:</span>
            <span className="value">{targets.length}</span>
          </div>
        </div>

        <div className="game-instructions">
          <p>Click the targets before they disappear! Different targets give different points:</p>
          <div className="target-types">
            <span>🎯 = 1 point</span>
            <span>⭐ = 2 points</span>
            <span>🔴 = 3 points</span>
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
                  <h3>Game Over! 🎉</h3>
                  <div className="final-score">
                    Final Score: <span className="score-number">{score}</span>
                  </div>
                  <div className="score-message">
                    {score >= 50 && '🏆 Amazing! You are a clicking champion!'}
                    {score >= 30 && score < 50 && '👍 Great job! You have quick reflexes!'}
                    {score >= 15 && score < 30 && '😊 Good effort! Keep practicing!'}
                    {score < 15 && '🎯 Nice try! You will get better!'}
                  </div>
                  <button onClick={startGame} className="play-again-btn">
                    Play Again
                  </button>
                </>
              ) : (
                <>
                  <h3>Ready to Play?</h3>
                  <p>Click targets to earn points. The game lasts 30 seconds!</p>
                  <div className="game-tips">
                    <p>💡 <strong>Tips:</strong></p>
                    <ul>
                      <li>Click faster for more points</li>
                      <li>Red targets are worth more</li>
                      <li>Targets disappear after 3 seconds</li>
                    </ul>
                  </div>
                  <button onClick={startGame} className="start-btn">
                    Start Game
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              {targets.map(target => (
                <button
                  key={target.id}
                  className={`target target-${target.type}`}
                  style={{
                    left: `${target.x}px`,
                    top: `${target.y}px`,
                    width: `${target.size}px`,
                    height: `${target.size}px`,
                    fontSize: `${target.size * 0.6}px`
                  }}
                  onClick={() => handleTargetClick(target.id, getTargetPoints(target.type))}
                >
                  {getTargetEmoji(target.type)}
                </button>
              ))}
              <div className="game-hud">
                <div className="time-left">Time: {timeLeft}s</div>
                <div className="current-score">Score: {score}</div>
              </div>
            </>
          )}
        </div>

        <div className="game-controls">
          {isPlaying && (
            <button onClick={endGame} className="end-game-btn">
              End Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HiddenGame;