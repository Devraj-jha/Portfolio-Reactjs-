// src/sections/Home/Home.jsx
import { useEffect, useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './Home.css';

const Home = () => {
  const [ref, isVisible] = useScrollAnimation(0.3);
  const [textIndex, setTextIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const rotatingTexts = [
    "Programmer",
    "Problem Solver", 
    "Python and c++ Guy",
    "Loves aesthetic"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.log('Failed to load profile image');
    setImageLoaded(true); // Still set to true to hide loading state
  };

  return (
    <section className="home-section">
      <div className="home-container">
        <div className="ascii-art scale-in">
          <pre className="ascii-text">
{`
 ██████████       █████
▒▒███▒▒▒▒███       ▒▒███ 
 ▒███   ▒▒███       ▒███ 
 ▒███    ▒███       ▒███ 
 ▒███    ▒███       ▒███ 
 ▒███    ███  ███   ▒███ 
 ██████████  ▒▒████████  
▒▒▒▒▒▒▒▒▒▒    ▒▒▒▒▒▒▒▒   
                         
                         
                                           
`}
          </pre>
        </div>

        <div ref={ref} className={`profile-section ${isVisible ? 'visible' : ''}`}>
          <div className="profile-content">
            <div className="profile-image-container">
              <div className="profile-image glass-effect">
                <div className={`image-wrapper ${imageLoaded ? 'loaded' : ''}`}>
                  {/* Replace with your profile image path */}
                  <img 
                    src="/assets/profile.png" 
                    alt="Devraj - Programmer & Problem Solver"
                    className="profile-photo"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                  
                  {/* Fallback if image fails to load */}
                  {!imageLoaded && (
                    <div className="image-loading">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="image-glow"></div>
              </div>
            </div>
            
            <div className="about-me">
              <h1 className="greeting hero-gradient">
                Hello, I'm <span className="accent-text">Devraj jha</span>
              </h1>
              
              <h2 className="title">
                <span className="rotating-text">
                  {rotatingTexts[textIndex]}
                </span>
              </h2>
              
              <div className="description">
                <p>
                  I design user interfaces, Solve problems and write automation scripts.
                </p>

                <p>
                  I began programming about two years ago, starting with C++. Over time, I expanded my skills to include Python — which I use to speed up my workflow and handle backend development.
                </p>

                <p>
                  My focus is on creating beautiful, responsive, and lag-free websites. Currently, I'm diving deeper into frontend development while building various Python projects.
                </p>

                <p>
                  In my free time, I enjoy competitive programming, Watching One Piece and reading books. Some of my favorites include:
                </p>
                <ul>
                  <li><em>The Brothers Karamazov</em></li>
                  <li><em>Introduction to algorithm</em></li>
                  <li><em>Yoga Sutras</em></li>
                  <li><em>Ashtavakra Gita</em></li>
                  <li><em>SICP </em> (currently reading)</li>
                  <li><em>The Hitchhiker's Guide to the Galaxy</em></li>
                  <li><em>Sherlock Holmes</em> (Reading currently)</li>
                </ul><p>
CLick on the DJ logo at the top LEFT to open terminal                </p>
              </div>
              
              <div className="stats-grid">
                <div className="stat glass-effect">
                  <span className="stat-number">10+</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div className="stat glass-effect">
                  <span className="stat-number">2+</span>
                  <span className="stat-label">Years</span>
                </div>
                <div className="stat glass-effect">
                  <span className="stat-number">700+</span>
                  <span className="stat-label">hours</span>
                </div>
                
              </div>
              <p>
            </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;