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
    case 'quote':
    const quotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Code is like humor. When you have to explain it, it's bad. - Cory House",
  "First, solve the problem. Then, write the code. - John Johnson",
  "Programs must be written for people to read, and only incidentally for machines to execute. - Hal Abelson",
  "Talk is cheap. Show me the code. - Linus Torvalds",
  "Simplicity is prerequisite for reliability. - Edsger W. Dijkstra",
  "Make it work, make it right, make it fast. - Kent Beck",
  "Premature optimization is the root of all evil. - Donald Knuth",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
  "If debugging is the process of removing bugs, then programming must be the process of putting them in. - Edsger W. Dijkstra",
  "Imagination is more important than knowledge. - Albert Einstein",
  "We are made of star-stuff. - Carl Sagan",
  "If I have seen further it is by standing on the shoulders of giants. - Isaac Newton",
  "Nothing in life is to be feared; it is only to be understood. - Marie Curie",
  "The unexamined life is not worth living. - Socrates",
  "You have power over your mind — not outside events. Realize this, and you will find strength. - Marcus Aurelius",
  "Luck is what happens when preparation meets opportunity. - Seneca",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "Stay hungry. Stay foolish. - Steve Jobs",
  "Genius is one percent inspiration and ninety-nine percent perspiration. - Thomas Edison",
  "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away. - Antoine de Saint-Exupéry",
  "Any sufficiently advanced technology is indistinguishable from magic. - Arthur C. Clarke",
  "If you can’t explain it to a six-year-old, you don’t understand it yourself. - Richard Feynman",
  "I have not failed. I’ve just found 10,000 ways that won’t work. - Thomas Edison",
  "The best way to predict the future is to invent it. - Alan Kay",
  "He who has a why to live can bear almost any how. - Friedrich Nietzsche",
  "Real knowledge is to know the extent of one's ignorance. - Confucius",
  "Waste no more time arguing what a good man should be. Be one. - Marcus Aurelius",
  "A ship in harbor is safe—but that is not what ships are built for. - John A. Shedd",
  "You miss 100% of the shots you don’t take. - Wayne Gretzky",
  "In the middle of difficulty lies opportunity. - Albert Einstein",
  "The whole is greater than the sum of its parts. - Aristotle",
  "Learning never exhausts the mind. - Leonardo da Vinci",
  "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
  "Everything should be made as simple as possible, but not simpler. - Albert Einstein",
  "Do not wait to strike till the iron is hot; but make it hot by striking. - William Butler Yeats",
  "The meaning of life is to find your gift. The purpose of life is to give it away. - Pablo Picasso",
  "If you spend too much time thinking about a thing, you'll never get it done. - Bruce Lee",
  "Start where you are. Use what you have. Do what you can. - Arthur Ashe",
  "The important thing is not to stop questioning. Curiosity has its own reason for existing. - Albert Einstein",
  "Small daily improvements are the key to staggering long-term results. - James Clear",
  "Be kind, for everyone you meet is fighting a hard battle. - Plato"
];

  return quotes[Math.floor(Math.random() * quotes.length)]
    case 'date':
    return new Date().toString()
    case 'time':
    return new Date().toLocaleTimeString()
    case 'exit':
    case 'close':
      setIsTerminalOpen(false)
      return 'Closing terminal...'
      case 'home':
        setActiveSection('home')
        break
      case 'blog':
        setActiveSection('blog')
        break
      case 'progress':
        setActiveSection('progress')
        return '🚧 Progress section is under construction. Check back soon!'
      case 'projects':
        setActiveSection('projects')
        return '💼 Projects gallery is being curated.!'
      case 'game':
        setIsGameOpen(true)
        return '🎮 Launching Click Attack Game! Close the terminal to play.'
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

Navigation:
  home       - Navigate to Home section
  blog       - Navigate to Blog section  
  progress   - Navigate to Progress section (Coming Soon)
  projects   - Navigate to Projects section (Launching Soon)

 Technical:
  techstack  - Show my technology stack

Appearance:
  theme      - Toggle between light and dark mode

Utility:
  clear      - Clear terminal
  help       - Show this help message
  echo [text]- Echo back the text
 `
      case 'techstack':
        return `🚀 My Tech Stack:

Frontend:
  React, TypeScript, JavaScript, HTML5, CSS3

Backend:
  Node.js, Python, Express, FastAPI

Databases:
  MongoDB, PostgreSQL

Tools:
  Git, VS Code, Figma, Postman`
      default:
        if (cmd.startsWith('echo ')) {
          return cmd.slice(5)
        }
        return `Command not found: ${cmd}. Type 'help' for available commands.`
    }
    return `Navigated to ${cmd} section`
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