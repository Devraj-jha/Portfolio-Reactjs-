'use client';

import Projects from '../../components/Projects/Projects'
import './ProjectsSection.css'

const ProjectsSection = () => {
  return (
    <section className="projects-section">
      <div className="projects-header">
        <h1 className="projects-title">My Projects</h1>
        <p className="projects-subtitle">
          A collection of things I've built and learned from
        </p>
      </div>

      <Projects />
    </section>
  )
}

export default ProjectsSection
