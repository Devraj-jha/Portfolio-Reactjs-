// src/sections/Home/Home.jsx
import { useEffect, useState } from 'react';
import Terminal from '../../components/Terminal/Terminal';
import './Home.css';

const Home = () => {
  const [meteors, setMeteors] = useState([]);
  const [stars, setStars] = useState([]);

  // Meteor animation for light theme
  useEffect(() => {
    const createMeteor = () => {
      const meteor = {
        id: Math.random(),
        left: Math.random() * 100,
        delay: Math.random() * 5
      };
      setMeteors(prev => [...prev, meteor]);
      setTimeout(() => {
        setMeteors(prev => prev.filter(m => m.id !== meteor.id));
      }, 1000);
    };

    const meteorInterval = setInterval(createMeteor, 2000);
    return () => clearInterval(meteorInterval);
  }, []);

  // Star shooting animation for dark theme
  useEffect(() => {
    const createStar = () => {
      const star = {
        id: Math.random(),
        left: Math.random() * 100,
        delay: Math.random() * 3
      };
      setStars(prev => [...prev, star]);
      setTimeout(() => {
        setStars(prev => prev.filter(s => s.id !== star.id));
      }, 800);
    };

    const starInterval = setInterval(createStar, 1500);
    return () => clearInterval(starInterval);
  }, []);

  return (
    <section className="home-section">
      {/* Meteor Animations */}
      {meteors.map(meteor => (
        <div
          key={meteor.id}
          className="meteor"
          style={{
            left: `${meteor.left}%`,
            animationDelay: `${meteor.delay}s`
          }}
        />
      ))}

      {/* Star Animations */}
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.left}%`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}

      <div className="home-container">
        {/* ASCII Art */}
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

        {/* Profile Section with Text Wrapping */}
        <div className="profile-section fade-in-up">
          <div className="profile-content">
            <div className="profile-image-container">
              <div className="profile-image">
                <div className="image-placeholder">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div className="image-glow"></div>
              </div>
            </div>
            
            <div className="about-me">
              <h1 className="greeting">
                Hello, I'm <span className="gold-text">DJ</span>
              </h1>
              <h2 className="title">Creative Developer & Problem Solver</h2>
              
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
                <div className="stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div className="stat">
                  <span className="stat-number">3+</span>
                  <span className="stat-label">Years</span>
                </div>
                <div className="stat">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Passion</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Component */}
          <Terminal />
        </div>
      </div>
    </section>
  );
};

export default Home;