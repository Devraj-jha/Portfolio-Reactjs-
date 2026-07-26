import './Projects.css'

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'IP Tracker',
      description: 'IP geolocation tool built in Go.',
      technologies: ['Go'],
      githubUrl: 'https://github.com/Devraj-jha/IP-Tracker',
    },
    {
      id: 2,
      title: 'Automatic Folder Organizer',
      description: 'Automatically organizes files into folders by type.',
      technologies: ['Python'],
      githubUrl: 'https://github.com/Devraj-jha/Automatic-Folder-Organizer',
    },
    {
      id: 3,
      title: 'Go Webserver',
      description: 'HTTP server using only the Go standard library.',
      technologies: ['Go'],
      githubUrl: 'https://github.com/Devraj-jha/golang-webserver-no-deps',
    },
    {
      id: 4,
      title: 'Python Projects',
      description: 'Collection of compact Python projects under 100 lines.',
      technologies: ['Python'],
      githubUrl: 'https://github.com/Devraj-jha/Python-Projects',
    },
    {
      id: 5,
      title: 'Small Go Projects',
      description: 'Backend utilities and experiments in Go.',
      technologies: ['Go'],
      githubUrl: 'https://github.com/Devraj-jha/Small_go_projects',
    },
    {
      id: 6,
      title: 'Snake Game',
      description: 'Classic Snake game built with Pygame.',
      technologies: ['Python', 'Pygame'],
      githubUrl: 'https://github.com/Devraj-jha/Snake-Game',
    },
    {
      id: 7,
      title: 'Minimal Chat',
      description: 'React typing application.',
      technologies: ['React', 'JavaScript'],
      githubUrl: 'https://github.com/Devraj-jha/Minimal_Type',
    },
    {
      id: 8,
      title: 'CodeForces Problems',
      description: 'Competitive programming solutions on CodeForces.',
      technologies: ['C++'],
      githubUrl: 'https://github.com/Devraj-jha/CodeForces-Problem',
    },
    {
      id: 9,
      title: 'Portfolio Website',
      description: 'This very portfolio — React single page application.',
      technologies: ['React', 'Vite'],
      githubUrl: 'https://github.com/Devraj-jha/Portfolio-Reactjs-',
    },
    {
      id: 10,
      title: 'Rock Paper Scissors',
      description: 'Classic browser game built with JavaScript.',
      technologies: ['JavaScript', 'HTML', 'CSS'],
      githubUrl: 'https://github.com/Devraj-jha/Rock-Paper-Scissors-',
    },
  ]

  return (
    <div className="projects-list">
      {projects.map(project => (
        <a
          key={project.id}
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="project-item"
        >
          <div className="project-item-header">
            <h3 className="project-item-title">{project.title}</h3>
            <span className="project-arrow">↗</span>
          </div>
          <p className="project-item-desc">{project.description}</p>
          <div className="project-item-tags">
            {project.technologies.map(tech => (
              <span key={tech} className="project-tag">{tech}</span>
            ))}
          </div>
        </a>
      ))}
    </div>
  )
}

export default Projects
