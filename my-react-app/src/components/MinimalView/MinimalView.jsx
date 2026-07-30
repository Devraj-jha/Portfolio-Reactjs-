import { useState, useEffect } from 'react'
import './MinimalView.css'

const projects = [
  { title: 'IP Tracker', desc: 'IP geolocation tool built in Go.', tech: ['Go'], url: 'https://github.com/Devraj-jha/IP-Tracker' },
  { title: 'Automatic Folder Organizer', desc: 'Automatically organizes files into folders by type.', tech: ['Python'], url: 'https://github.com/Devraj-jha/Automatic-Folder-Organizer' },
  { title: 'Go Webserver', desc: 'HTTP server using only the Go standard library.', tech: ['Go'], url: 'https://github.com/Devraj-jha/golang-webserver-no-deps' },
  { title: 'Python Projects', desc: 'Collection of compact Python projects under 100 lines.', tech: ['Python'], url: 'https://github.com/Devraj-jha/Python-Projects' },
  { title: 'Small Go Projects', desc: 'Backend utilities and experiments in Go.', tech: ['Go'], url: 'https://github.com/Devraj-jha/Small_go_projects' },
  { title: 'Snake Game', desc: 'Classic Snake game built with Pygame.', tech: ['Python', 'Pygame'], url: 'https://github.com/Devraj-jha/Snake-Game' },
  { title: 'Minimal Chat', desc: 'React typing application.', tech: ['React', 'JavaScript'], url: 'https://github.com/Devraj-jha/Minimal_Type' },
  { title: 'CodeForces Problems', desc: 'Competitive programming solutions on CodeForces.', tech: ['C++'], url: 'https://github.com/Devraj-jha/CodeForces-Problem' },
  { title: 'Portfolio Website', desc: 'This very portfolio — React single page application.', tech: ['React', 'Vite'], url: 'https://github.com/Devraj-jha/Portfolio-Reactjs-' },
  { title: 'Rock Paper Scissors', desc: 'Classic browser game built with JavaScript.', tech: ['JavaScript', 'HTML', 'CSS'], url: 'https://github.com/Devraj-jha/Rock-Paper-Scissors-' },
]

const parseFrontmatter = (text) => {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { data: {}, content: text }
  const data = {}
  match[1].split('\n').forEach(line => {
    const ci = line.indexOf(':')
    if (ci > 0) {
      let value = line.substring(ci + 1).trim().replace(/^["'](.*)["']$/, '$1')
      if (value.startsWith('[') && value.endsWith(']'))
        value = value.slice(1, -1).split(',').map(s => s.trim().replace(/["']/g, ''))
      data[line.substring(0, ci).trim()] = value
    }
  })
  return { data, content: match[2] }
}

const renderMarkdown = (content) => {
  if (!content) return ''
  let html = content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/`(.*?)`/gim, '<code>$1</code>')
    .replace(/^\s*-\s(.*$)/gim, '<li>$1</li>')
    .replace(/((?:<li>.*?<\/li>\s*)+)/g, '<ul>$1</ul>')
    .split(/\n\n/)
    .map(p => p.trim()).filter(p => p.length)
    .map(p => p.match(/^<(h[1-6]|ul|ol|pre|hr)/) ? p : `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('')
    .replace(/<p>---<\/p>/g, '<hr>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="minimal-blog-link">$1</a>')
  return html
}

const TOP_PROJECTS_COUNT = 3

const MinimalView = ({ onBack }) => {
  const [blogPosts, setBlogPosts] = useState([])
  const [showAllProjects, setShowAllProjects] = useState(false)
  const [selectedBlogPost, setSelectedBlogPost] = useState(null)
  const [blogLoading, setBlogLoading] = useState(true)
  const [isBW, setIsBW] = useState(false)

  useEffect(() => {
    fetch('/content/blog/my-first-blog.md')
      .then(res => res.ok ? res.text() : null)
      .then(text => {
        if (!text) { setBlogLoading(false); return }
        const { data, content } = parseFrontmatter(text)
        setBlogPosts([{ id: 'my-first-blog', ...data, content }])
        setBlogLoading(false)
      })
      .catch(() => setBlogLoading(false))
  }, [])

  if (selectedBlogPost) {
    return (
      <div className={`minimal-page${isBW ? ' minimal-bw' : ''}`}>
        <div className="minimal-container">
          <button className="minimal-back-btn" onClick={() => setSelectedBlogPost(null)}>
            &larr; back to blog
          </button>
          <article className="minimal-blog-article">
            <h1 className="minimal-blog-article-title">{selectedBlogPost.title}</h1>
            <div className="minimal-blog-meta">
              {selectedBlogPost.date} · {selectedBlogPost.readTime}
            </div>
            <div
              className="minimal-blog-content"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedBlogPost.content) }}
            />
          </article>
          <footer className="minimal-footer">
            <button className="minimal-back-btn" onClick={() => setSelectedBlogPost(null)}>
              &larr; back to blog
            </button>
          </footer>
        </div>
      </div>
    )
  }

  return (
    <div className={`minimal-page${isBW ? ' minimal-bw' : ''}`}>
      <div className="minimal-container">
        {/* Theme toggle for minimal view */}
        <div className="minimal-theme-toggle">
          <button
            className={`minimal-theme-btn${isBW ? ' active' : ''}`}
            onClick={() => setIsBW(!isBW)}
            title={isBW ? 'Switch to serif theme' : 'Switch to black & white theme'}
          >
            {isBW ? 'Aa' : 'BW'}
          </button>
        </div>
        {/* Header */}
        <header className="minimal-header">
          <h1 className="minimal-name">Devraj Jha</h1>
          <p className="minimal-subtitle">Programmer &middot; Problem solver &middot; Web developer</p>
          <div className="minimal-links">
            <a href="https://github.com/Devraj-jha" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://x.com/djjhacodes" target="_blank" rel="noopener noreferrer">X / Twitter</a>
            <a href="https://www.youtube.com/@djjhaTech" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="https://www.linkedin.com/in/devraj-jha-4ba7a2342/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="mailto:devraj@example.com">Email</a>
          </div>
        </header>

        {/* About */}
        <section className="minimal-section">
          <h2 className="minimal-section-heading">About</h2>
          <p>
            I started programming about two years ago with C++. Since then I've expanded
            into Python for automation and backend work, and JavaScript / React for frontend
            development. I focus on clean, responsive, and performant websites. I also enjoy
            competitive programming and building tools that make life easier.
          </p>
        </section>

        {/* Projects */}
        <section className="minimal-section">
          <h2 className="minimal-section-heading">Projects</h2>
          <ul className="minimal-project-list">
            {projects.slice(0, showAllProjects ? projects.length : TOP_PROJECTS_COUNT).map((p, i) => (
              <li key={i} className="minimal-project-item">
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="minimal-project-title-link">
                  {p.title} ↗
                </a>
                <div className="minimal-project-desc">{p.desc}</div>
                <div className="minimal-project-tech">{p.tech.join(' · ')}</div>
              </li>
            ))}
          </ul>
          {!showAllProjects && projects.length > TOP_PROJECTS_COUNT && (
            <button className="minimal-expand-btn" onClick={() => setShowAllProjects(true)}>
              Show all {projects.length} projects ↓
            </button>
          )}
          {showAllProjects && projects.length > TOP_PROJECTS_COUNT && (
            <button className="minimal-expand-btn" onClick={() => setShowAllProjects(false)}>
              Show less ↑
            </button>
          )}
        </section>

        {/* Blog */}
        <section className="minimal-section">
          <h2 className="minimal-section-heading">Blog</h2>
          {blogLoading ? (
            <p className="minimal-muted">Loading...</p>
          ) : blogPosts.length === 0 ? (
            <p className="minimal-muted">Coming soon.</p>
          ) : (
            <ul className="minimal-blog-list">
              {blogPosts.map(post => (
                <li key={post.id} className="minimal-blog-item">
                  <button
                    className="minimal-blog-title-btn"
                    onClick={() => setSelectedBlogPost(post)}
                  >
                    {post.title}
                  </button>
                  <div className="minimal-blog-meta">
                    {post.date} · {post.readTime}
                  </div>
                  {post.excerpt && (
                    <div className="minimal-blog-excerpt">{post.excerpt}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Tech */}
        <section className="minimal-section">
          <h2 className="minimal-section-heading">Technologies</h2>
          <ul className="minimal-tech-list">
            <li className="minimal-tech-item">Python</li>
            <li className="minimal-tech-item">C++</li>
            <li className="minimal-tech-item">JavaScript</li>
            <li className="minimal-tech-item">Go</li>
            <li className="minimal-tech-item">React</li>
            <li className="minimal-tech-item">Node.js</li>
            <li className="minimal-tech-item">HTML/CSS</li>
            <li className="minimal-tech-item">Git</li>
          </ul>
        </section>

        {/* Contact */}
        <section className="minimal-section">
          <h2 className="minimal-section-heading">Contact</h2>
          <p>
            <a href="https://github.com/Devraj-jha" target="_blank" rel="noopener noreferrer">GitHub</a>
            &nbsp;&middot;&nbsp;
            <a href="https://x.com/djjhacodes" target="_blank" rel="noopener noreferrer">X / Twitter</a>
            &nbsp;&middot;&nbsp;
            <a href="https://www.linkedin.com/in/devraj-jha-4ba7a2342/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            &nbsp;&middot;&nbsp;
            <a href="https://www.youtube.com/@djjhaTech" target="_blank" rel="noopener noreferrer">YouTube</a>
            &nbsp;&middot;&nbsp;
            <a href="mailto:devraj@example.com">Email</a>
          </p>
        </section>

        {/* Footer */}
        <footer className="minimal-footer">
          <button className="minimal-back-btn" onClick={onBack}>
            &larr; back to normal view
          </button>
        </footer>
      </div>
    </div>
  )
}

export default MinimalView