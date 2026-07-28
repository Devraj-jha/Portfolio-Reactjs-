import CarGame from '../../components/CarGame/CarGame'
import './CarGameSection.css'

const CarGameSection = () => {
  return (
    <section className="cardrive-section">
      <CarGame embedded={true} />
    </section>
  )
}

export default CarGameSection
