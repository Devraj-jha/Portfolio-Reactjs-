// src/App.jsx
import { useState, useEffect } from 'react'
import Header from './components/Header/Header'
import SocialButtons from './components/SocialButtons/SocialButtons'
import ContactModal from './components/ContactModal/ContactModal'
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

  const handleSectionChange = (section) => {
    setActiveSection(section)
  }

  return (
    <div className="app" data-theme={theme}>
      <VideoBackground />
      
      <Header 
        activeSection={activeSection} 
        setActiveSection={handleSectionChange}
        onTerminalClick={() => console.log('Terminal disabled for now')}
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
      
      <HiddenGame 
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
      />
    </div>
  )
}

export default App