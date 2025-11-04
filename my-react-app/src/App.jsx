// src/App.jsx
import { useState } from 'react'
import Header from './components/Header/Header'
import SocialButtons from './components/SocialButtons/SocialButtons'
import ContactModal from './components/ContactModal/ContactModal'
import Terminal from './components/Terminal/Terminal'
import LeafBackground from './components/LeafBackground/LeafBackground'
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
        break
      case 'blog':
        setActiveSection('blog')
        break
      case 'progress':
        setActiveSection('progress')
        break
      case 'projects':
        setActiveSection('projects')
        break
      case 'game':
        setIsGameOpen(true)
        return '🎮 Launching hidden game...'
      case 'clear':
        return 'clear'
      case 'help':
        return `Available commands:
  home       - Navigate to Home section
  blog       - Navigate to Blog section  
  progress   - Navigate to Progress section
  projects   - Navigate to Projects section
  game       - Launch hidden game 🎮
  techstack  - Show my technology stack
  clear      - Clear terminal
  help       - Show this help message`
      default:
        if (cmd.startsWith('echo ')) {
          return cmd.slice(5)
        }
        return `Command not found: ${command}. Type 'help' for available commands.`
    }
    return `Navigated to ${cmd} section`
  }

  return (
    <div className="app">
      <LeafBackground />
      
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onTerminalClick={() => setIsTerminalOpen(true)}
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