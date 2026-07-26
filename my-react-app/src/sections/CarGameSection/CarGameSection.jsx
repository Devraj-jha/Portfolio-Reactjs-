import './CarGameSection.css'

const CarGameSection = ({ onStartCarGame }) => {
  return (
    <section className="cardrive-section">
      <div className="cardrive-hero">
        <div className="cardrive-glitch">🏎️</div>
        <h1 className="cardrive-title">3D Drive</h1>
        <p className="cardrive-subtitle">A colorful 3D driving game — dodge obstacles, set high scores!</p>
        <div className="cardrive-info">
          <div className="cardrive-detail">
            <span className="cardrive-label">Controls</span>
            <span className="cardrive-value"><kbd>←</kbd> <kbd>→</kbd> or <kbd>A</kbd> <kbd>D</kbd></span>
          </div>
          <div className="cardrive-detail">
            <span className="cardrive-label">Goal</span>
            <span className="cardrive-value">Survive as long as possible</span>
          </div>
          <div className="cardrive-detail">
            <span className="cardrive-label">Engine</span>
            <span className="cardrive-value">Three.js 3D</span>
          </div>
        </div>
        <button className="cardrive-btn" onClick={onStartCarGame}>
          Launch Game
        </button>
        <p className="cardrive-hint">You can also type <kbd>car</kbd> or <kbd>drive</kbd> in the terminal</p>
      </div>
    </section>
  )
}

export default CarGameSection