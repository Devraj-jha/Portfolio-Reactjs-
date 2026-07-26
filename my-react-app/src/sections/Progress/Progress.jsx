import { useEffect, useRef, useState } from 'react'
import './Progress.css'

const Progress = () => {
  const [visibleBars, setVisibleBars] = useState(false)
  const [visibleTimeline, setVisibleTimeline] = useState(false)
  const barsRef = useRef(null)
  const timelineRef = useRef(null)

  useEffect(() => {
    const observer1 = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleBars(true) },
      { threshold: 0.2 }
    )
    const observer2 = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleTimeline(true) },
      { threshold: 0.2 }
    )
    if (barsRef.current) observer1.observe(barsRef.current)
    if (timelineRef.current) observer2.observe(timelineRef.current)
    return () => { observer1.disconnect(); observer2.disconnect() }
  }, [])

  const skills = [
    { name: 'Python', level: 80 },
    { name: 'C++', level: 75 },
    { name: 'JavaScript', level: 65 },
    { name: 'Go', level: 50 },
    { name: 'React', level: 55 },
    { name: 'HTML/CSS', level: 70 },
  ]

  const timeline = [
    { year: '2023', event: 'Started programming with C++' },
    { year: '2024', event: 'Expanded to Python, built automation scripts' },
    { year: '2025', event: 'Learned web development, built this portfolio' },
    { year: '2026', event: 'Exploring Go, building CLI tools and servers' },
  ]

  return (
    <section className="progress-section">
      {/* Skills */}
      <div className="progress-block" ref={barsRef}>
        <h2 className="progress-heading">Skills</h2>
        <p className="progress-sub">Languages and technologies I've been working with</p>
        <div className="skills-list">
          {skills.map((skill) => (
            <div key={skill.name} className="skill-item">
              <div className="skill-header">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-level">{skill.level}%</span>
              </div>
              <div className="skill-bar">
                <div
                  className={`skill-fill ${visibleBars ? 'animate' : ''}`}
                  style={{ width: visibleBars ? `${skill.level}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="progress-block" ref={timelineRef}>
        <h2 className="progress-heading">Journey</h2>
        <p className="progress-sub">My learning path so far</p>
        <div className="timeline">
          {timeline.map((item, i) => (
            <div
              key={item.year}
              className={`timeline-item ${visibleTimeline ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="timeline-dot" />
              <div className="timeline-content">
                <span className="timeline-year">{item.year}</span>
                <p className="timeline-event">{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Progress