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
          will add projects soon. 
        </p>
      </div>
      
      <Projects />
      
      {/* <div className="projects-guide">
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
      </div> */}
    </section>
  )
}

export default ProjectsSection
// src/sections/ProjectsSection/ProjectsSection.jsx
// import './ProjectsSection.css'

// const ProjectsSection = () => {
//   return (
//     <section className="projects-section">
//       <div className="coming-soon-container">
//         <div className="coming-soon-content">
//           <div className="code-icon">
//             <div className="code-bracket">{`{ }`}</div>
//           </div>
//           <h1 className="coming-soon-title">Projects </h1>
//           <p className="coming-soon-message">
//             Will add soom 
//           </p>
          
//           <div className="project-grid-preview">
//             <div className="project-card-placeholder">
//               <div className="project-shimmer"></div>
//               <div className="project-info">
//                 <div className="project-title-skeleton"></div>
//                 <div className="project-desc-skeleton"></div>
//               </div>
//             </div>
//             <div className="project-card-placeholder">
//               <div className="project-shimmer"></div>
//               <div className="project-info">
//                 <div className="project-title-skeleton"></div>
//                 <div className="project-desc-skeleton"></div>
//               </div>
//             </div>
//             <div className="project-card-placeholder">
//               <div className="project-shimmer"></div>
//               <div className="project-info">
//                 <div className="project-title-skeleton"></div>
//                 <div className="project-desc-skeleton"></div>
//               </div>
//             </div>
//           </div>
          
//           <div className="tech-stack-preview">
//             <h3></h3>
//             <div className="tech-tags">
//               {/* <span className="tech-tag">React</span>
//               <span className="tech-tag">Node.js</span>
//               <span className="tech-tag">TypeScript</span>
//               <span className="tech-tag">Python</span>
//               <span className="tech-tag">AWS</span>
//               <span className="tech-tag">MongoDB</span> */}
//             </div>
//           </div>
          
//           <div className="countdown">
//             {/* <p>🚀 Launching in: <strong>2 weeks</strong></p> */}
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default ProjectsSection