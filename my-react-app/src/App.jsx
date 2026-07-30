import { useState, useEffect, useRef, useCallback } from 'react'
import Header from './components/Header/Header'
import SocialButtons from './components/SocialButtons/SocialButtons'
import ContactModal from './components/ContactModal/ContactModal'
import Terminal from './components/Terminal/Terminal'
import HiddenGame from './components/HiddenGame/HiddenGame'
import LoadingScreen from './components/LoadingScreen/LoadingScreen'
import Footer from './components/Footer/Footer'
import Home from './sections/Home/Home'
import Blog from './sections/Blog/Blog'
import Progress from './sections/Progress/Progress'
import ProjectsSection from './sections/ProjectsSection/ProjectsSection'
import './App.css'

const THEMES = ['light', 'dark', 'sunset', 'ocean', 'forest', 'midnight']

const getNextTheme = (current) => {
  const idx = THEMES.indexOf(current)
  return THEMES[(idx + 1) % THEMES.length]
}

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [isGameOpen, setIsGameOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio-theme') || 'light'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displaySection, setDisplaySection] = useState('home')
  const [spreadOverlay, setSpreadOverlay] = useState(null)
  const overlayRef = useRef(null)

  // Initialize theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  // Loading screen
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Theme spread animation
  useEffect(() => {
    if (!spreadOverlay || !overlayRef.current) return

    const el = overlayRef.current
    const { x, y, theme: targetTheme } = spreadOverlay

    // Set initial clip-path (0% circle at click point)
    el.style.clipPath = `circle(0% at ${x}px ${y}px)`

    // Force reflow then trigger transition
    void el.offsetWidth
    el.style.clipPath = `circle(150% at ${x}px ${y}px)`

    let cleanedUp = false
    const finish = () => {
      if (cleanedUp) return
      cleanedUp = true
      setTheme(targetTheme)
      document.documentElement.setAttribute('data-theme', targetTheme)
      localStorage.setItem('portfolio-theme', targetTheme)
      setSpreadOverlay(null)
    }

    const fallback = setTimeout(finish, 700)
    el.addEventListener('transitionend', () => {
      clearTimeout(fallback)
      finish()
    }, { once: true })

    return () => {
      clearTimeout(fallback)
      cleanedUp = true
    }
  }, [spreadOverlay])

  const toggleTheme = useCallback((e) => {
    const nextTheme = getNextTheme(theme)

    if (!e || !e.currentTarget) {
      // Direct switch (from terminal command)
      setTheme(nextTheme)
      document.documentElement.setAttribute('data-theme', nextTheme)
      localStorage.setItem('portfolio-theme', nextTheme)
      return
    }

    // Spread animation from button center
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    setSpreadOverlay({ theme: nextTheme, x, y })
  }, [theme])

  const handleSectionChange = (section) => {
    if (section === activeSection) return
    setIsTransitioning(true)
    setTimeout(() => {
      setDisplaySection(section)
      setActiveSection(section)
      setIsTransitioning(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 300)
  }

  const renderSection = () => {
    switch (displaySection) {
      case 'home':
        return <Home />
      case 'blog':
        return <Blog />
      case 'progress':
        return <Progress />
      case 'projects':
        return <ProjectsSection />
      default:
        return <Home />
    }
  }

  const handleTerminalCommand = (command) => {
    const cmd = command.toLowerCase().trim()

    switch (cmd) {
      case 'quote':
        const quotes = [
          "The only way to do great work is to love what you do. - Steve Jobs",
          "Code is like humor. When you have to explain it, it's bad. - Cory House",
          "First, solve the problem. Then, write the code. - John Johnson",
          "Talk is cheap. Show me the code. - Linus Torvalds",
          "Simplicity is prerequisite for reliability. - Edsger W. Dijkstra",
          "Make it work, make it right, make it fast. - Kent Beck",
          "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away. - Antoine de Saint-Exupéry",
          "Any sufficiently advanced technology is indistinguishable from magic. - Arthur C. Clarke",
          "The best way to predict the future is to invent it. - Alan Kay",
          "Stay hungry. Stay foolish. - Steve Jobs",
        ]
        return quotes[Math.floor(Math.random() * quotes.length)]
      case 'x':
      case 'twitter':
        window.open('https://x.com/djjhacodes', '_blank')
        return 'Opening X (Twitter) profile...'
      case 'yt':
      case 'youtube':
        window.open('https://www.youtube.com/@djjhaTech', '_blank')
        return 'Opening YouTube channel...'
      case 'github':
        window.open('https://github.com/Devraj-jha', '_blank')
        return 'Opening GitHub profile...'
      case 'linkedin':
        window.open('https://www.linkedin.com/in/devraj-jha-4ba7a2342/', '_blank')
        return 'Opening LinkedIn profile...'
      case 'date':
        return new Date().toString()
      case 'time':
        return new Date().toLocaleTimeString()
      case 'exit':
      case 'close':
        setIsTerminalOpen(false)
        return 'Closing terminal...'
      case 'home':
        handleSectionChange('home')
        return 'Navigated to home'
      case 'blog':
        handleSectionChange('blog')
        return 'Navigated to blog'
      case 'progress':
        handleSectionChange('progress')
        return 'Navigated to progress'
      case 'projects':
        handleSectionChange('projects')
        return 'Navigated to projects'
      case 'game':
        setIsGameOpen(true)
        return 'Launching Click Attack Game!'
      case 'theme':
      case 'toggle theme':
      case 'dark mode':
      case 'light mode':
        toggleTheme()
        return `Theme switched to ${getNextTheme(theme)} mode`
      case 'clear':
        return 'clear'
      case 'help':
        return `Available commands:

  home       - Navigate to Home
  blog       - Navigate to Blog
  progress   - Navigate to Progress
  projects   - Navigate to Projects
  techstack  - Show technology stack
  theme      - Cycle themes: light → dark → sunset → ocean → forest → midnight
  quote      - Random quote
  twitter/x  - Open X profile
  youtube/yt - Open YouTube
  github     - Open GitHub
  linkedin   - Open LinkedIn
  date/time  - Current date/time
  clear      - Clear terminal
  exit/close - Close terminal
  game       - Launch hidden game
  echo [text]   - Echo text`
      case 'techstack':
        return `My Tech Stack:

  Frontend:  React, JavaScript, HTML5, CSS3
  Backend:   Node.js, Python, Go
  Languages: C++, Python, Go, JavaScript
  Tools:     Git, VS Code, Figma`
      default:
        if (cmd.startsWith('echo ')) {
          return cmd.slice(5)
        }
        return `Command not found: ${cmd}. Type 'help' for available commands.`
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="app" data-theme={theme}>
      <Header
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        onTerminalClick={() => setIsTerminalOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <SocialButtons
        onContactClick={() => setIsContactModalOpen(true)}
      />

      <main className="main-content">
        <div className={`page-transition ${isTransitioning ? 'transitioning' : ''}`}>
          {renderSection()}
        </div>
      </main>

      <Footer />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <Terminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onCommand={handleTerminalCommand}
      />

      <HiddenGame
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
      />

      {spreadOverlay && (
        <div
          ref={overlayRef}
          className="theme-spread-overlay"
          data-theme={spreadOverlay.theme}
          style={{
            '--origin-x': `${spreadOverlay.x}px`,
            '--origin-y': `${spreadOverlay.y}px`,
          }}
        />
      )}
    </div>
  )
}

export default App
