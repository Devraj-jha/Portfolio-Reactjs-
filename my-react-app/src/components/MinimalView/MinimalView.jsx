import './MinimalView.css'

const MinimalView = ({ onBack }) => {
  return (
    <div className="minimal-page">
      <div className="minimal-container">
        {/* Header */}
        <header className="minimal-header">
          <h1 className="minimal-name">Devraj Jha</h1>
          <p className="minimal-subtitle">Programmer &middot; Problem solver &middot; Web developer</p>
          <div className="minimal-links">
            <a href="https://github.com/Devraj-jha" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://x.com/djjhacodes" target="_blank" rel="noopener noreferrer">X / Twitter</a>
            <a href="https://www.youtube.com/@djjhaTech" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="https://www.linkedin.com/in/devraj-jha-4ba7a2342/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="mailto:devraj@example.com">Email</a>
          </div>
        </header>

        {/* About */}
        <section className="minimal-section">
          <h2 className="minimal-section-heading">About</h2>
          <p>
            I started programming about two years ago with C++. Since then I've expanded
            into Python for automation and backend work, and JavaScript / React for frontend
            development. I focus on clean, responsive, and performant websites. I also enjoy
            competitive programming and building tools that make life easier.
          </p>
        </section>

        {/* Projects */}
        <section className="minimal-section">
          <h2 className="minimal-section-heading">Projects</h2>
          <ul className="minimal-project-list">
            <li className="minimal-project-item">
              <div className="minimal-project-title">Portfolio Website</div>
              <div className="minimal-project-desc">
                Personal portfolio built with React, featuring theme cycling, terminal, and GitHub contributions graph.
              </div>
              <div className="minimal-project-links">
                <a href="https://github.com/Devraj-jha/Portfolio-Reactjs-" target="_blank" rel="noopener noreferrer">source</a>
              </div>
            </li>
            <li className="minimal-project-item">
              <div className="minimal-project-title">Click Attack Game</div>
              <div className="minimal-project-desc">
                Simple browser-based reaction game built into the portfolio.
              </div>
            </li>
          </ul>
        </section>

        {/* Tech */}
        <section className="minimal-section">
          <h2 className="minimal-section-heading">Technologies</h2>
          <ul className="minimal-tech-list">
            <li className="minimal-tech-item">Python</li>
            <li className="minimal-tech-item">C++</li>
            <li className="minimal-tech-item">JavaScript</li>
            <li className="minimal-tech-item">Go</li>
            <li className="minimal-tech-item">React</li>
            <li className="minimal-tech-item">Node.js</li>
            <li className="minimal-tech-item">HTML/CSS</li>
            <li className="minimal-tech-item">Git</li>
          </ul>
        </section>

        {/* Contact */}
        <section className="minimal-section">
          <h2 className="minimal-section-heading">Contact</h2>
          <p>
            <a href="https://github.com/Devraj-jha" target="_blank" rel="noopener noreferrer">GitHub</a>
            &nbsp;&middot;&nbsp;
            <a href="https://x.com/djjhacodes" target="_blank" rel="noopener noreferrer">X / Twitter</a>
            &nbsp;&middot;&nbsp;
            <a href="https://www.linkedin.com/in/devraj-jha-4ba7a2342/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            &nbsp;&middot;&nbsp;
            <a href="https://www.youtube.com/@djjhaTech" target="_blank" rel="noopener noreferrer">YouTube</a>
            &nbsp;&middot;&nbsp;
            <a href="mailto:devraj@example.com">Email</a>
          </p>
        </section>

        {/* Footer */}
        <footer className="minimal-footer">
          <button className="minimal-back-btn" onClick={onBack}>
            &larr; back to normal view
          </button>
        </footer>
      </div>
    </div>
  )
}

export default MinimalView