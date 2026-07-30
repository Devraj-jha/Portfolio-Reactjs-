'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';
import Header from '../Header/Header';
import SocialButtons from '../SocialButtons/SocialButtons';
import ContactModal from '../ContactModal/ContactModal';
import Terminal from '../Terminal/Terminal';
import HiddenGame from '../HiddenGame/HiddenGame';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import Footer from '../Footer/Footer';
import './AppShell.css';

const QUOTES = [
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
];

function pathnameToSection(pathname) {
  const section = pathname.replace(/^\//, '') || 'home';
  // Handle nested routes like /blog/something
  return section.split('/')[0];
}

function AppShellInner({ children }) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const { theme, toggleTheme, ripple } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const isMinimalPage = pathname === '/minimal';

  // Loading screen — show on first visit per session (skip for minimal page)
  useEffect(() => {
    if (isMinimalPage) {
      setShowLoading(false);
      return;
    }
    const visited = sessionStorage.getItem('portfolio-visited');
    if (visited) {
      setShowLoading(false);
    } else {
      const timer = setTimeout(() => {
        setShowLoading(false);
        sessionStorage.setItem('portfolio-visited', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isMinimalPage]);

  // Sync theme attribute on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleTerminalCommand = useCallback((command) => {
    const cmd = command.toLowerCase().trim();

    switch (cmd) {
      case 'quote':
        return QUOTES[Math.floor(Math.random() * QUOTES.length)];
      case 'x':
      case 'twitter':
        window.open('https://x.com/djjhacodes', '_blank');
        return 'Opening X (Twitter) profile...';
      case 'yt':
      case 'youtube':
        window.open('https://www.youtube.com/@djjhaTech', '_blank');
        return 'Opening YouTube channel...';
      case 'github':
        window.open('https://github.com/Devraj-jha', '_blank');
        return 'Opening GitHub profile...';
      case 'linkedin':
        window.open('https://www.linkedin.com/in/devraj-jha-4ba7a2342/', '_blank');
        return 'Opening LinkedIn profile...';
      case 'date':
        return new Date().toString();
      case 'time':
        return new Date().toLocaleTimeString();
      case 'exit':
      case 'close':
        setIsTerminalOpen(false);
        return 'Closing terminal...';
      case 'home':
        router.push('/');
        return 'Navigated to home';
      case 'blog':
        router.push('/blog');
        return 'Navigated to blog';
      case 'progress':
        router.push('/progress');
        return 'Navigated to progress';
      case 'projects':
        router.push('/projects');
        return 'Navigated to projects';
      case 'game':
        setIsGameOpen(true);
        return 'Launching Click Attack Game!';
      case 'theme':
      case 'toggle theme':
      case 'dark mode':
      case 'light mode':
        toggleTheme();
        return `Theme switched`;
      case 'clear':
        return 'clear';
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
  echo [text]   - Echo text`;
      case 'techstack':
        return `My Tech Stack:

  Frontend:  React, JavaScript, HTML5, CSS3
  Backend:   Node.js, Python, Go
  Languages: C++, Python, Go, JavaScript
  Tools:     Git, VS Code, Figma`;
      default:
        if (cmd.startsWith('echo ')) {
          return cmd.slice(5);
        }
        return `Command not found: ${cmd}. Type 'help' for available commands.`;
    }
  }, [router, toggleTheme]);

  if (showLoading && !isMinimalPage) {
    return <LoadingScreen />;
  }

  // Minimal page — render without AppShell chrome (header, footer, sidebar)
  if (isMinimalPage) {
    return (
      <div className="app">
        {children}
        {ripple && (
          <div
            className="theme-ripple"
            style={{ left: ripple.x, top: ripple.y }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        activeSection={pathnameToSection(pathname)}
        onTerminalClick={() => setIsTerminalOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <SocialButtons
        onContactClick={() => setIsContactModalOpen(true)}
      />

      <main className="main-content">
        {children}
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

      {ripple && (
        <div
          className="theme-ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      )}

      {/* Minimal toggle */}
      <a href="/minimal" className="minimal-toggle-btn" title="Minimal view">
        M
      </a>
    </div>
  );
}

export function AppShell({ children }) {
  // Read the theme from the <html> attribute set by the inline script
  let initialTheme = 'light';
  if (typeof document !== 'undefined') {
    initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
  }

  return (
    <ThemeProvider initialTheme={initialTheme}>
      <AppShellInner>{children}</AppShellInner>
    </ThemeProvider>
  );
}
