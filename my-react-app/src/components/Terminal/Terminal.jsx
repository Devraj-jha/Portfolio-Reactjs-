// src/components/Terminal/Terminal.jsx
import { useState, useEffect, useRef } from 'react';
import './Terminal.css';

const Terminal = () => {
  const [commands, setCommands] = useState([]);
  const [input, setInput] = useState('');
  const terminalRef = useRef(null);

  const techStack = [
    { name: 'React', level: 'Expert' },
    { name: 'TypeScript', level: 'Advanced' },
    { name: 'Node.js', level: 'Expert' },
    { name: 'Python', level: 'Advanced' },
    { name: 'AWS', level: 'Intermediate' },
    { name: 'Docker', level: 'Advanced' },
    { name: 'MongoDB', level: 'Expert' },
    { name: 'GraphQL', level: 'Intermediate' }
  ];

  const executeCommand = (cmd) => {
    const newCommands = [...commands];
    
    switch (cmd.toLowerCase()) {
      case 'techstack':
        newCommands.push({ type: 'output', content: '🚀 My Tech Stack:', isCommand: false });
        techStack.forEach(tech => {
          newCommands.push({ 
            type: 'output', 
            content: `   ${tech.name.padEnd(12)} - ${tech.level}`,
            isCommand: false 
          });
        });
        break;
      case 'clear':
        setCommands([]);
        return;
      case 'help':
        newCommands.push({ type: 'output', content: 'Available commands:', isCommand: false });
        newCommands.push({ type: 'output', content: '  techstack - Display my technology stack', isCommand: false });
        newCommands.push({ type: 'output', content: '  clear     - Clear terminal', isCommand: false });
        newCommands.push({ type: 'output', content: '  help      - Show this help message', isCommand: false });
        break;
      default:
        newCommands.push({ type: 'output', content: `Command not found: ${cmd}`, isCommand: false });
    }
    
    setCommands(newCommands);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newCommands = [...commands, { type: 'input', content: input }];
    setCommands(newCommands);
    executeCommand(input);
    setInput('');
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  useEffect(() => {
    // Initial welcome message
    setCommands([
      { type: 'output', content: 'Welcome to my terminal! Type "help" for available commands.', isCommand: false }
    ]);
  }, []);

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-controls">
          <div className="control close"></div>
          <div className="control minimize"></div>
          <div className="control maximize"></div>
        </div>
        <div className="terminal-title">bash — Terminal</div>
      </div>
      
      <div className="terminal-body" ref={terminalRef}>
        {commands.map((command, index) => (
          <div key={index} className={`terminal-line ${command.type}`}>
            {command.type === 'input' && (
              <span className="prompt">visitor@portfolio:~$ </span>
            )}
            <span className={`content ${command.isCommand ? 'command' : ''}`}>
              {command.content}
            </span>
          </div>
        ))}
        
        <form onSubmit={handleSubmit} className="terminal-input-line">
          <span className="prompt">visitor@portfolio:~$ </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="terminal-input"
            autoFocus
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;