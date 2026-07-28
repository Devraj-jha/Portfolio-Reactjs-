import './CarGameSection.css'

const CarGameSection = ({ onStartCarGame }) => {
  return (
    <section className="cardrive-section">
      <div className="cardrive-hero">
        <div className="cardrive-glitch">🏎️</div>
        <h1 className="cardrive-title">3D Drive</h1>
        <p className="cardrive-subtitle">Dodge obstacles in a colorful 3D world</p>
        <button className="cardrive-btn" onClick={onStartCarGame}>
          ▶ Play
        </button>
        <p className="cardrive-hint">Press <kbd>←</kbd> <kbd>→</kbd> or <kbd>A</kbd> <kbd>D</kbd> to steer</p>
      </div>
    </section>
  )
}

export default CarGameSection
