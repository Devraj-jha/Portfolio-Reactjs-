// src/sections/ProjectsSection/ProjectsSection.jsx
import Projects from '../../components/Projects/Projects'
import './ProjectsSection.css'

const ProjectsSection = () => {
  return (
    <section className="projects-section">
      <div className="projects-header">
        <h1 className="section-title">My Projects</h1>
        <p className="section-subtitle">
          A collection of things I've built and learned from
        </p>
      </div>
      
      <Projects />
      
      <div className="projects-guide">
        <h2>How to Add New Projects</h2>
        <div className="guide-steps">
          <div className="step">
            <h3>1. Update Projects Data</h3>
            <p>Edit the projects array in the Projects component with your project details.</p>
          </div>
          <div className="step">
            <h3>2. Add Project Images</h3>
            <p>Place images in the public folder and reference them in your project data.</p>
          </div>
          <div className="step">
            <h3>3. Customize Styling</h3>
            <p>Modify the Projects.css file to match your desired look and feel.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection