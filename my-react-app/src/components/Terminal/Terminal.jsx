// src/components/Terminal/Terminal.jsx
import { useState, useEffect, useRef } from 'react';
import './Terminal.css';

const Terminal = ({ isOpen, onClose, onCommand }) => {
  const [commands, setCommands] = useState([]);
  const [input, setInput] = useState('');
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  const techStack = [
    { name: 'React', level: 'Expert', category: 'Frontend' },
    { name: 'TypeScript', level: 'Intermediate', category: 'Language' },
    { name: 'JavaScript', level: 'Expert', category: 'Language' },
    { name: 'Node.js', level: 'Intermediate', category: 'Backend' },
    { name: 'Python', level: 'Advanced', category: 'Language' },
    { name: 'MongoDB', level: 'Expert', category: 'Database' },
    { name: 'PostgreSQL', level: 'Advanced', category: 'Database' },
  ];

  const executeCommand = (cmd) => {
    if (!cmd.trim()) return;

    // Add the input command to history
    const newCommands = [...commands, { type: 'input', content: cmd }];
    
    let output = '';
    
    switch (cmd.toLowerCase()) {
      case 'techstack':
        output = '🚀 My Tech Stack:\n\n';
        const categories = {};
        techStack.forEach(tech => {
          if (!categories[tech.category]) categories[tech.category] = [];
          categories[tech.category].push(tech);
        });
        
        Object.keys(categories).forEach(category => {
          output += `📂 ${category}:\n`;
          categories[category].forEach(tech => {
            output += `   ${tech.name.padEnd(15)} - ${tech.level}\n`;
          });
          output += '\n';
        });
        break;
        
      case 'clear':
        setCommands([]);
        return;
        
      case 'game':
        output = '🎮 Launching hidden game... Close terminal to play!';
        break;
        
      case 'help':
        output = `Available commands:

🌐 Navigation:
  home       - Navigate to Home section
  blog       - Navigate to Blog section  
  progress   - Navigate to Progress section
  projects   - Navigate to Projects section

💻 Technical:
  techstack  - Show my technology stack

🎮 Games:
  game       - Play Click Attack Game

🎨 Appearance:
  theme      - Toggle light/dark mode

🛠️ Utility:
  clear      - Clear terminal
  help       - Show this help message
  echo [text]- Echo back the text

`;
        break;
        
      default:
        if (cmd.startsWith('echo ')) {
          output = cmd.slice(5);
        } else {
          const navResult = onCommand(cmd);
          if (navResult && navResult !== 'clear') {
            output = navResult;
          } else if (!navResult) {
            output = `Command not found: ${cmd}. Type 'help' for available commands.`;
          }
        }
    }
    
    if (output && output !== 'clear') {
      newCommands.push({ type: 'output', content: output });
    }
    
    setCommands(newCommands);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    executeCommand(input);
    setInput('');
  };

  // Auto-scroll to bottom when commands change
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Initialize terminal when it opens
  useEffect(() => {
    if (isOpen) {
      setCommands([
        { type: 'output', content: '🌟 Welcome to DevRaj\'s Terminal' },
        { type: 'output', content: 'Type "help" to see available commands.' }
      ]);
      setInput('');
    }
  }, [isOpen]);

  // Handle Escape key to close terminal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="terminal-overlay" onClick={onClose}>
      <div className="terminal-container" onClick={(e) => e.stopPropagation()}>
        <div className="terminal-header">
          <div className="terminal-controls">
            <div className="control close" onClick={onClose}></div>
            <div className="control minimize"></div>
            <div className="control maximize"></div>
          </div>
          <div className="terminal-title">terminal — bash</div>
        </div>
        
        <div className="terminal-body" ref={terminalRef}>
          <div className="welcome-message">
            <div className="ascii-art">
{`$$$$$$$\\      
$$  __$$\\     
$$ |  $$ |$$\\ 
$$ |  $$ |\\__|
$$ |  $$ |$$\\ 
$$ |  $$ |$$ |
$$$$$$$  |$$ |
\\_______/ $$ |
    $$\\   $$ |
    \\$$$$$$  |
     \\______/ `}
            </div>
            <div className="welcome-text">
              Welcome to my Terminal
            </div>
          </div>

          {commands.map((command, index) => (
            <div key={index} className={`terminal-line ${command.type}`}>
              {command.type === 'input' && (
                <span className="prompt">devraj@portfolio:~$ </span>
              )}
              <span className="content">
                {command.type === 'input' ? command.content : (
                  <pre className="output-content">{command.content}</pre>
                )}
              </span>
            </div>
          ))}
          
          <form onSubmit={handleSubmit} className="terminal-input-line">
            <span className="prompt">devraj@portfolio:~$ </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="terminal-input"
              autoFocus
              spellCheck="false"
              placeholder="Type a command..."
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Terminal;