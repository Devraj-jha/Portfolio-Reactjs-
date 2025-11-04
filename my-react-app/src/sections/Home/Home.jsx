// src/sections/Home/Home.jsx
import { useEffect, useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './Home.css';

const Home = () => {
  const [ref, isVisible] = useScrollAnimation(0.3);
  const [textIndex, setTextIndex] = useState(0);
  
  const rotatingTexts = [
    "Creative Developer",
    "Problem Solver", 
    "Tech Enthusiast",
    "UI/UX Designer"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="home-section">
      <div className="home-container">
        <div className="ascii-art scale-in">
          <pre className="ascii-text">
{`
╔═══════════════════════════════╗
║                               ║
║     ██████╗      ██╗         ║
║    ██╔════╝      ╚██╗        ║
║    ██║            ╚██╗       ║
║    ██║            ██╔╝       ║
║    ╚██████╗      ██╔╝        ║
║     ╚═════╝      ╚═╝         ║
║                               ║
╚═══════════════════════════════╝
`}
          </pre>
        </div>

        <div ref={ref} className={`profile-section ${isVisible ? 'visible' : ''}`}>
          <div className="profile-content">
            <div className="profile-image-container">
              <div className="profile-image glass-effect">
                <div className="image-placeholder">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div className="image-glow"></div>
              </div>
            </div>
            
            <div className="about-me">
              <h1 className="greeting hero-gradient">
                Hello, I'm <span className="accent-text">DJ</span>
              </h1>
              
              <h2 className="title">
                <span className="rotating-text">
                  {rotatingTexts[textIndex]}
                </span>
              </h2>
              
              <div className="description">
                <p>
                  I craft digital experiences that blend elegant design with 
                  cutting-edge technology. Passionate about creating solutions 
                  that make a difference. With over 3 years of experience in 
                  full-stack development, I specialize in building scalable 
                  applications that deliver exceptional user experiences.
                </p>
                <p>
                  My approach combines technical expertise with creative 
                  problem-solving to transform complex challenges into 
                  elegant solutions. I believe in writing clean, maintainable 
                  code and staying at the forefront of emerging technologies.
                </p>
              </div>
              
              <div className="stats-grid">
                <div className="stat glass-effect">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div className="stat glass-effect">
                  <span className="stat-number">3+</span>
                  <span className="stat-label">Years</span>
                </div>
                <div className="stat glass-effect">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Passion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;