// src/sections/Home/Home.jsx
import { useEffect, useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './Home.css';

const Home = () => {
  const [ref, isVisible] = useScrollAnimation(0.3);
  const [textIndex, setTextIndex] = useState(0);
  
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
                  In my free time, I enjoy competitive programming,
                </p>
                
                <p>
                  CLick on the DJ logo at the top LEFT to open terminal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;