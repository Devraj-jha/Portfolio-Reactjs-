import { useState, useEffect } from 'react'
import Header from './components/Header/Header'
import SocialButtons from './components/SocialButtons/SocialButtons'
import ContactModal from './components/ContactModal/ContactModal'
import Terminal from './components/Terminal/Terminal'
import HiddenGame from './components/HiddenGame/HiddenGame'
import CarGame from './components/CarGame/CarGame'
import LoadingScreen from './components/LoadingScreen/LoadingScreen'
import Footer from './components/Footer/Footer'
import Home from './sections/Home/Home'
import Blog from './sections/Blog/Blog'
import Progress from './sections/Progress/Progress'
import ProjectsSection from './sections/ProjectsSection/ProjectsSection'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [isGameOpen, setIsGameOpen] = useState(false)
  const [isCarGameOpen, setIsCarGameOpen] = useState(false)
  const [theme, setTheme] = useState('light')
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displaySection, setDisplaySection] = useState('home')

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  // Loading screen
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('portfolio-theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

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
      case 'cardrive':
        return <CarGameSection onStartCarGame={() => setIsCarGameOpen(true)} />
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
        window.open('https://x.com/djjha_', '_blank')
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
      case 'car':
      case 'drive':
      case 'racing':
        handleSectionChange('cardrive')
        return '🏎️ Entering 3D Drive mode! Use left/right arrows to dodge obstacles.'
      case 'theme':
      case 'toggle theme':
      case 'dark mode':
      case 'light mode':
        toggleTheme()
        return `Theme switched to ${theme === 'light' ? 'dark' : 'light'} mode`
      case 'clear':
        return 'clear'
      case 'help':
        return `Available commands:

  home       - Navigate to Home
  blog       - Navigate to Blog
  progress   - Navigate to Progress
  projects   - Navigate to Projects
  car/drive  - 3D Car Driving Game!
  techstack  - Show technology stack
  theme      - Toggle light/dark mode
  quote      - Random quote
  twitter/x  - Open X profile
  youtube/yt - Open YouTube
  github     - Open GitHub
  linkedin   - Open LinkedIn
  date/time  - Current date/time
  clear      - Clear terminal
  exit/close - Close terminal
  game       - Launch hidden game
  echo [text]- Echo text`
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

      <CarGame
        isOpen={isCarGameOpen}
        onClose={() => setIsCarGameOpen(false)}
      />
    </div>
  )
}

export default App
