// src/components/Terminal/Terminal.jsx
import { useState, useEffect, useRef } from 'react';
import './Terminal.css';

const Terminal = ({ isOpen, onClose, onCommand }) => {
  const [commands, setCommands] = useState([]);
  const [input, setInput] = useState('');
  const terminalRef = useRef(null);

  const techStack = [
    { name: 'React', level: 'Expert', category: 'Frontend' },
    { name: 'TypeScript', level: 'intermediate', category: 'Language' },
    { name: 'JavaScript', level: 'Expert', category: 'Language' },
    { name: 'Node.js', level: 'intermediate', category: 'Backend' },
    { name: 'Python', level: 'Advanced', category: 'Language' },
    // { name: 'AWS', level: 'Intermediate', category: 'Cloud' },
    // { name: 'Docker', level: 'Advanced', category: 'DevOps' },
    { name: 'MongoDB', level: 'Expert', category: 'Database' },
    // { name: 'GraphQL', level: 'Intermediate', category: 'API' },
    { name: 'PostgreSQL', level: 'Advanced', category: 'Database' },
    // { name: 'Redis', level: 'Intermediate', category: 'Cache' }
  ];

  const executeCommand = (cmd) => {
    const newCommands = [...commands, { type: 'input', content: cmd }];
    
    let output = '';
    
    switch (cmd.toLowerCase()) {
      case 'techstack':
        output = ' My Tech Stack:\n\n';
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

🌐 Navigation:
  home       - Navigate to Home section
  blog       - Navigate to Blog section  
  progress   - Navigate to Progress section
  projects   - Navigate to Projects section

💻 Technical:
  techstack  - Show my technology stack


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
        { type: 'output', content: '🌟 Welcome' },
        { type: 'output', content: 'Type "help" to see available commands.' },
        { type: 'output', content: '' }
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
          <div className="terminal-title">terminal — bash</div>
        </div>
        
        <div className="terminal-body" ref={terminalRef}>
          <div className="welcome-message">
            <div className="ascii-art">
              {`
$$$$$$$\      
$$  __$$\     
$$ |  $$ |$$\ 
$$ |  $$ |\__|
$$ |  $$ |$$\ 
$$ |  $$ |$$ |
$$$$$$$  |$$ |
\_______/ $$ |
    $$\   $$ |
    \$$$$$$  |
     \______/ 

              `}
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
              <span className={`content ${command.type === 'output' ? 'output' : ''}`}>
                {command.content.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </span>
            </div>
          ))}
          
          <form onSubmit={handleSubmit} className="terminal-input-line">
            <span className="prompt">devraj@portfolio:~$ </span>
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