// src/components/Terminal/Terminal.jsx
import { useState, useEffect, useRef } from 'react';
import './Terminal.css';

const Terminal = ({ isOpen, onClose, onCommand }) => {
  const [commands, setCommands] = useState([]);
  const [input, setInput] = useState('');
  const terminalRef = useRef(null);

  const techStack = [
    { name: 'React', level: 'Expert', category: 'Frontend' },
    { name: 'TypeScript', level: 'Advanced', category: 'Language' },
    { name: 'Node.js', level: 'Expert', category: 'Backend' },
    { name: 'Python', level: 'Advanced', category: 'Language' },
    { name: 'Cpp', level: 'Advanced', category: 'Language' },

    { name: 'MongoDB', level: 'Expert', category: 'Database' },

    { name: 'PostgreSQL', level: 'Advanced', category: 'Database' },

  ];

  const executeCommand = (cmd) => {
    const newCommands = [...commands, { type: 'input', content: cmd }];
    
    let output = '';
    
    switch (cmd.toLowerCase()) {
      case 'techstack':
        output = 'My Tech Stack:\n\n';
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
        output = '🎮 Launching hidden game... Type "start" to begin!';
        break;
        
      case 'start':
        output = '🎯 Game started! Use commands: "left", "right", "up", "down" to move. Type "exit" to quit.';
        break;
        
      case 'help':
        output = `Available commands:

  home       - Navigate to Home section
  blog       - Navigate to Blog section  
  progress   - Navigate to Progress section
  projects   - Navigate to Projects section
  techstack  - Show my technology stack
  clear      - Clear terminal
  echo [text]- Echo back the text
  exit/close - to exit the terminal 
  date/time  - for date and time. 
  quote      - for some quotes :)
  twitter/x  - Open my X/Twitter profile
  youtube/yt    - Open my YouTube channel
  github     - Open my GitHub profile
  linkedin   - Open my LinkedIn profile

`;
        break;
        
      default:
        if (cmd.startsWith('echo ')) {
          output = cmd.slice(5);
        } else {
          // Check if it's a navigation command
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

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  useEffect(() => {
    if (isOpen) {
      setCommands([
        // { type: 'output', content: '🌟 Welcome to DJ\'s Terminal!' },
        { type: 'output', content: 'Type "help" to see available commands.' },
        { type: 'output', content: 'just type your next cmd to enter after help, to make cmd line show' }
      ]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="terminal-overlay" onClick={onClose}>
      <div className="terminal-container scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="terminal-header">
          <div className="terminal-controls">
            <div className="control close" onClick={onClose}></div>
            <div className="control minimize"></div>
            <div className="control maximize"></div>
          </div>
          <div className="terminal-title">terminal — bash — 80×24</div>
        </div>
        
        <div className="terminal-body" ref={terminalRef}>
          <div className="welcome-message">
            <div className="ascii-art">
              {`
⣠⣤⣤⡤⠤⢤⣤⣀⡀⠀⠐⠒⡄⠀⡠⠒⠀⠀⢀⣀⣤⠤⠤⣤⣤⣤⡄
⠈⠻⣿⡤⠤⡏⠀⠉⠙⠲⣄⠀⢰⢠⠃⢀⡤⠞⠋⠉⠈⢹⠤⢼⣿⠏⠀
⠀⠀⠘⣿⡅⠓⢒⡤⠤⠀⡈⠱⣄⣼⡴⠋⡀⠀⠤⢤⡒⠓⢬⣿⠃⠀⠀
⠀⠀⠀⠹⣿⣯⣐⢷⣀⣀⢤⡥⢾⣿⠷⢥⠤⣀⣀⣞⣢⣽⡿⠃⠀⠀⠀
⠀⠀⠀⠀⠈⢙⣿⠝⠀⢁⠔⡨⡺⡿⡕⢔⠀⡈⠐⠹⣟⠋⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢼⣟⢦⢶⢅⠜⢰⠃⠀⢹⡌⢢⣸⠦⠴⣿⡇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠘⣿⣇⡬⡌⢀⡟⠀⠀⠀⢷⠀⣧⢧⣵⣿⠂⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⢻⠛⠋⠉⠀⠀⠀⠀⠈⠉⠙⢻⡏⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢰⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠄⠀⠀⠀⠀⠀⠀

              `}
            </div>
            <div className="welcome-text">
              Welcome to The Terminal
            </div>
          </div>

          {commands.map((command, index) => (
            <div key={index} className={`terminal-line ${command.type}`}>
              {command.type === 'input' && (
                <span className="prompt">Dj@portfolio:~$ </span>
              )}
              <span className={`content ${command.type === 'output' ? 'output' : ''}`}>
                {command.content.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </span>
            </div>
          ))}
          
          <form onSubmit={handleSubmit} className="terminal-input-line">
            <span className="prompt">Dj@portfolio:~$ </span>
            <input
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