// src/components/Header/Header.jsx
import { useState, useEffect, useRef } from 'react'
import './Header.css'

const Header = ({ activeSection, setActiveSection, onTerminalClick }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [theme, setTheme] = useState('light')
  const [showClickPrompt, setShowClickPrompt] = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light'
    setTheme(savedTheme)
    
    // Hide click prompt after 5 seconds
    const timer = setTimeout(() => {
      setShowClickPrompt(false)
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('portfolio-theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(error => {
          console.log('Audio play failed:', error)
          setIsPlaying(false)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleBrandClick = () => {
    setShowClickPrompt(false)
    onTerminalClick()
  }

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'blog', label: 'Blog' },
    { id: 'progress', label: 'Progress' },
    { id: 'projects', label: 'Projects' }
  ]

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''} glass-effect`}>
      <audio
        ref={audioRef}
        loop
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      >
        {/* ADD YOUR MUSIC FILE PATH IN THE SOURCE TAG BELOW */}
        {/* <source src="/music/background.mp3" type="audio/mpeg" /> */}
        {/* <source src="/music/background.ogg" type="audio/ogg" /> */}
        Your browser does not support the audio element.
      </audio>
      
      <nav className="nav">
        <div className="nav-brand" onClick={handleBrandClick}>
          <span className="brand-text hero-gradient">DJ</span>
          <div className="brand-underline"></div>
          {showClickPrompt && (
            <div className="click-prompt">
              <span>Click me!</span>
              <div className="pulse-ring"></div>
            </div>
          )}
        </div>
        
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-button ${activeSection === item.id ? 'active' : ''} ${hoveredItem === item.id ? 'hovered' : ''}`}
                onClick={() => setActiveSection(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span className="button-text">{item.label}</span>
                <div className="button-underline"></div>
                <div className="button-glow"></div>
              </button>
            </li>
          ))}
        </ul>

        <div className="nav-controls">
          <button
            className={`music-toggle ${isPlaying ? 'playing' : ''}`}
            onClick={toggleMusic}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
          >
            <div className="music-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <div className="music-waves">
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
            </div>
          </button>

          <button
            className={`theme-toggle ${theme}`}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <div className="toggle-track">
              <div className="toggle-handle">
                {theme === 'light' ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 S11,19.45,11,20z M6.34,5.16l-1.42,1.42c-0.39,0.39-0.39,1.02,0,1.41c0.39,0.39,1.02,0.39,1.41,0l1.42-1.42 c0.39-0.39,0.39-1.02,0-1.41C7.36,4.77,6.73,4.77,6.34,5.16z M17.66,18.84l-1.42,1.42c-0.39,0.39-0.39,1.02,0,1.41 c0.39,0.39,1.02,0.39,1.41,0l1.42-1.42c0.39-0.39,0.39-1.02,0-1.41C18.68,18.45,18.05,18.45,17.66,18.84z M5.16,17.66 c-0.39-0.39-1.02-0.39-1.41,0c-0.39,0.39-0.39,1.02,0,1.41l1.42,1.42c0.39,0.39,1.02,0.39,1.41,0c0.39-0.39,0.39-1.02,0-1.41 L5.16,17.66z M18.84,6.34c-0.39-0.39-1.02-0.39-1.41,0c-0.39,0.39-0.39,1.02,0,1.41l1.42,1.42c0.39,0.39,1.02,0.39,1.41,0 c0.39-0.39,0.39-1.02,0-1.41L18.84,6.34z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"/>
                  </svg>
                )}
              </div>
            </div>
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Header