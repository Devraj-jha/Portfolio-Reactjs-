// src/App.jsx
import { useState } from 'react'
import Header from './components/Header/Header'
import SocialButtons from './components/SocialButtons/SocialButtons'
import ContactModal from './components/ContactModal/ContactModal'
import AnimatedBackground from './components/AnimatedBackground/AnimatedBackground'
import Home from './sections/Home/Home'
import Blog from './sections/Blog/Blog'
import Progress from './sections/Progress/Progress'
import ProjectsSection from './sections/ProjectsSection/ProjectsSection'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  // Function to render the active section
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

  return (
    <div className="app">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Header with integrated Music & Theme Toggle */}
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
      />
      
      {/* Fixed Social Media Buttons */}
      <SocialButtons 
        onContactClick={() => setIsContactModalOpen(true)}
      />
      
      {/* Main Content Area */}
      <main className="main-content">
        {renderSection()}
      </main>
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  )
}

export default App