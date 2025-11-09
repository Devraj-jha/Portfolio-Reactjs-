// src/App.jsx
import { useState, useEffect } from 'react'
import Header from './components/Header/Header'
import SocialButtons from './components/SocialButtons/SocialButtons'
import ContactModal from './components/ContactModal/ContactModal'
import Terminal from './components/Terminal/Terminal'
import VideoBackground from './components/VideoBackground/VideoBackground'
import HiddenGame from './components/HiddenGame/HiddenGame'
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
  const [theme, setTheme] = useState('light')

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('portfolio-theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const renderSection = () => {
    switch (activeSection) {
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
      case 'home':
        setActiveSection('home')
        setIsTerminalOpen(false)
        return '📍 Navigating to Home section...'
      case 'blog':
        setActiveSection('blog')
        setIsTerminalOpen(false)
        return '📝 Navigating to Blog section...'
      case 'progress':
        setActiveSection('progress')
        setIsTerminalOpen(false)
        return '🚧 Progress section is under construction. Check back soon!'
      case 'projects':
        setActiveSection('projects')
        setIsTerminalOpen(false)
        return '💼 Projects gallery is being curated. Launching in 2 weeks!'
      case 'game':
        setIsGameOpen(true)
        setIsTerminalOpen(false)
        return '🎮 Launching Click Attack Game! Close the terminal to play.'
      case 'theme':
      case 'toggle theme':
      case 'dark mode':
      case 'light mode':
        toggleTheme()
        return `🎨 Theme switched to ${theme === 'light' ? 'dark' : 'light'} mode`
      case 'clear':
        return 'clear'
      case 'help':
        return `Available commands:

🌐 Navigation:
  home       - Navigate to Home section
  blog       - Navigate to Blog section  
  progress   - Navigate to Progress section (Coming Soon)
  projects   - Navigate to Projects section (Launching Soon)

🎮 Games & Fun:
  game       - Play Click Attack Game 🎯

💻 Technical:
  techstack  - Show my technology stack

🎨 Appearance:
  theme      - Toggle between light and dark mode

🛠️ Utility:
  clear      - Clear terminal
  help       - Show this help message
  echo [text]- Echo back the text

💡 Pro Tip: Click the "DJ" logo to open the terminal!`
      case 'techstack':
        return `🚀 My Tech Stack:

Frontend:
  React, TypeScript, JavaScript, HTML5, CSS3

Backend:
  Node.js, Python, Express, FastAPI

Databases:
  MongoDB, PostgreSQL, Redis

Cloud & DevOps:
  AWS, Docker, CI/CD, GitHub Actions

Tools:
  Git, VS Code, Figma, Postman`
      default:
        if (cmd.startsWith('echo ')) {
          return cmd.slice(5)
        }
        return `Command not found: ${cmd}. Type 'help' for available commands.`
    }
  }

  const handleSectionChange = (section) => {
    setActiveSection(section)
  }

  return (
    <div className="app" data-theme={theme}>
      <VideoBackground />
      
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
        {renderSection()}
      </main>
      
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
    </div>
  )
}

export default App