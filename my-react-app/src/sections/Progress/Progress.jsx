import './Progress.css'

const Progress = () => {
  return (
    <section className="progress-section">
      <div className="coming-soon-container">
        <div className="coming-soon-content">
          <div className="construction-icon">
            <div className="crane">
              <div className="crane-base"></div>
              <div className="crane-arm"></div>
              <div className="crane-hook"></div>
            </div>
          </div>
          <h1 className="coming-soon-title">Progress Section</h1>
          <p className="coming-soon-message">
             My achievement tree and progress tracking system is currently under construction.
           </p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '65%' }}></div>
          </div>

          <div className="feature-preview">
            <h3>What to Expect:</h3>
            <ul>
              <li> Solo Leveling-style Progress Tree</li>
              <li> Step by step Task to complete</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Progress
