// src/components/Projects/Projects.jsx
import './Projects.css'

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'Python projects under 100 Lines of code',
      description: 'These are the projects I created to Pratice my python logic and problem solving skills. and includes some cool projects.',
      technologies: ['Python'],
      status: 'In Progress',
      githubUrl: 'https://github.com/Devraj-jha/Python-Projects.git',
      // liveUrl: 'https://yourportfolio.com',
      image: '/project-placeholder-1.jpg'
    },
    {
      id: 2,
      title: 'Small web projects',
      description: 'Projects I created in Plain html css js. to pratice',
      technologies: ['javascript', 'html5','css'],
      status: 'In Progress',
      githubUrl: 'https://github.com/Devraj-jha/Small-Web-Projects.git',
      liveUrl: null,
      image: '/project-placeholder-2.jpg'
    },
    // {
    //   id: 3,
    //   title: 'Task Management App',
    //   description: 'A productivity app for managing tasks with drag-and-drop functionality.',
    //   technologies: ['React', 'TypeScript', 'Firebase', 'Tailwind'],
    //   status: 'Completed',
    //   githubUrl: 'https://github.com/yourusername/taskapp',
    //   liveUrl: 'https://yourtaskapp.com',
    //   image: '/project-placeholder-3.jpg'
    // },
    // {
    //   id: 4,
    //   title: 'Weather Dashboard',
    //   description: 'Real-time weather application with beautiful data visualizations.',
    //   technologies: ['Vue.js', 'Chart.js', 'Weather API', 'CSS'],
    //   status: 'Planning',
    //   githubUrl: null,
    //   liveUrl: null,
    //   image: '/project-placeholder-4.jpg'
    // }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'var(--green)'
      case 'In Progress': return 'var(--yellow)'
      case 'Planning': return 'var(--purple)'
      default: return 'var(--text-light)'
    }
  }

  return (
    <div className="projects-grid">
      {projects.map(project => (
        <div key={project.id} className="project-card">
          <div className="project-image">
            {/* Replace with actual project images */}
            <div className="project-image-placeholder">
              <span>Project Image</span>
            </div>
            <div className="project-status" style={{ backgroundColor: getStatusColor(project.status) }}>
              {project.status}
            </div>
          </div>
          
          <div className="project-content">
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>
            
            <div className="project-technologies">
              {project.technologies.map(tech => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
            
            <div className="project-links">
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link github"
                >
                  GitHub
                </a>
              )}
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link live"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Projects