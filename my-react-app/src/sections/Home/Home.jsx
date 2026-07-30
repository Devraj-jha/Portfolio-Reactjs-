'use client';

import { useEffect, useState, useRef } from 'react'
import GitHubContributions from '../../components/GitHubContributions/GitHubContributions'
import { useTheme } from '../../contexts/ThemeContext'
import './Home.css'

const BG_COUNT = 20 // scans b1 … b20 across jpg/jpeg/png
const THEME_ORDER = ['light', 'dark', 'sunset', 'ocean', 'forest', 'midnight']

const tryLoad = (src) =>
  new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(src)
    img.onerror = () => resolve(null)
    img.src = src
  })

/** Scans for bg images b1.jpg/b1.jpeg/b1.png … bN, preloads, returns sorted array */
const useHeroBackgrounds = () => {
  const [images, setImages] = useState([])

  useEffect(() => {
    let mounted = true

    ;(async () => {
      const exts = ['jpg', 'jpeg', 'png', 'gif']
      const found = []

      for (let i = 1; i <= BG_COUNT; i++) {
        for (const ext of exts) {
          const src = `/assets/b${i}.${ext}`
          const result = await tryLoad(src)
          if (result) {
            found.push(result)
            break // one format per index is enough
          }
        }
      }

      if (mounted) setImages(found)
    })()

    return () => { mounted = false }
  }, [])

  return images
}

/** Full-width fading background — renders nothing when no images exist */
const HeroBackground = ({ images, currentIndex }) => {
  if (images.length === 0) return null

  return (
    <div className="hero-bg-slideshow" aria-hidden="true">
      {images.map((src, i) => (
        <div
          key={src}
          className="hero-bg-image"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === currentIndex ? 1 : 0,
          }}
        />
      ))}
      <div className="hero-bg-overlay" />
    </div>
  )
}

const Home = () => {
  const { theme } = useTheme()
  const [textIndex, setTextIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef(null)

  const rotatingTexts = [
    "Programmer",
    "Problem Solver",
    "Python & C++ Guy",
    "Web Developer"
  ]

  const bgImages = useHeroBackgrounds()

  // Map themes to GIFs when available (GIFs load after static images)
  const themeIdx = Math.max(0, THEME_ORDER.indexOf(theme))
  const firstGifIdx = bgImages.findIndex(src => src.endsWith('.gif'))
  const bgIndex = bgImages.length > 0
    ? (firstGifIdx >= 0 ? (firstGifIdx + themeIdx) % bgImages.length : themeIdx % bgImages.length)
    : 0

  // Typewriter effect
  useEffect(() => {
    const currentText = rotatingTexts[textIndex]
    let timeout

    if (!isDeleting) {
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        }, 100)
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000)
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 50)
      } else {
        setIsDeleting(false)
        setTextIndex((prev) => (prev + 1) % rotatingTexts.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, textIndex])

  // Stats visibility on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true)
      },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const techStack = [
    'Python', 'C++', 'JavaScript', 'Go',
    'React', 'Node.js', 'HTML/CSS', 'Git'
  ]

  return (
    <section className="home-section">
      <div className="home-container">
        {/* Hero Area */}
        <div className="hero-area">
          <HeroBackground images={bgImages} currentIndex={bgIndex} />
          <div className="hero-content">
            <p className="hero-greeting">Hello, I'm</p>
            <h1 className="hero-name">
              Devraj <span className="hero-name-accent">Jha</span>
            </h1>
            <h2 className="hero-title">
              <span className="typewriter-text">{displayText}</span>
              <span className="cursor">|</span>
            </h2>
            <p className="hero-description">
              I build things for the web, solve problems, and automate workflows.
              Two years into programming, exploring frontend development and backend systems.
            </p>

            {/* Quick Stats */}
            <div className="quick-stats" ref={statsRef}>
              <div className={`stat-item ${statsVisible ? 'visible' : ''}`}>
                <span className="stat-number">2+</span>
                <span className="stat-label">Years Coding</span>
              </div>
              <div className={`stat-item ${statsVisible ? 'visible' : ''}`}>
                <span className="stat-number">10+</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className={`stat-item ${statsVisible ? 'visible' : ''}`}>
                <span className="stat-number">2</span>
                <span className="stat-label">Languages</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="profile-frame">
              <img
                src="/assets/profile.png"
                alt="Devraj Jha"
                className="profile-photo"
              />
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="tech-section">
          <h3 className="tech-heading">Technologies I Work With</h3>
          <div className="tech-grid">
            {techStack.map((tech) => (
              <span key={tech} className="tech-badge">{tech}</span>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="about-section">
          <h3 className="about-heading">About Me</h3>
          <div className="about-content">
            <p>
              I started programming about two years ago with C++. Since then, I've expanded
              into Python for automation and backend work, and JavaScript/React for frontend development.
            </p>
            <p>
              My focus is on creating clean, responsive, and performant websites.
              I also enjoy competitive programming and building tools that make life easier.
            </p>
          </div>
        </div>

        {/* GitHub Contributions */}
        <GitHubContributions username="Devraj-jha" />

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <span className="scroll-text">Scroll to explore</span>
          <div className="scroll-arrow">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
