// src/components/MusicPlayer/MusicPlayer.jsx
import { useState, useRef, useEffect } from 'react';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setAudioProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleEnded = () => setIsPlaying(false);
    const handleTimeUpdate = updateProgress;
    const handleLoadedMetadata = updateProgress;

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  return (
    <button
      className={`music-player ${isPlaying ? 'playing' : ''} ${isHovering ? 'hovering' : ''}`}
      onClick={togglePlay}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
    >
      <audio
        ref={audioRef}
        loop
        preload="metadata"
      >
        <source src="/assets/background-music.mp3" type="audio/mpeg" />
        <source src="/assets/background-music.ogg" type="audio/ogg" />
      </audio>
      
      <div className="music-icon-container">
        <div className="music-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        
        {/* Animated Sound Waves */}
        <div className="sound-waves">
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="progress-ring">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle
            className="progress-ring-background"
            cx="30"
            cy="30"
            r="26"
            stroke="var(--border-color)"
            strokeWidth="2"
            fill="none"
          />
          <circle
            className="progress-ring-circle"
            cx="30"
            cy="30"
            r="26"
            stroke="var(--accent-primary)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={163.36}
            strokeDashoffset={163.36 - (163.36 * audioProgress) / 100}
            transform="rotate(-90 30 30)"
          />
        </svg>
      </div>

      {/* Glow Effect */}
      <div className="music-glow"></div>
    </button>
  );
};

export default MusicPlayer;