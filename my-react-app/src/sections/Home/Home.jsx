import { useEffect, useState, useRef } from 'react'
import './Home.css'

const Home = () => {
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