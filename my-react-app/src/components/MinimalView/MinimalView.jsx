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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

const TOP_PROJECTS_COUNT = 3

const MinimalView = ({ onBack }) => {
  const [blogPosts, setBlogPosts] = useState([])
  const [showAllProjects, setShowAllProjects] = useState(false)
  const [selectedBlogPost, setSelectedBlogPost] = useState(null)
  const [blogLoading, setBlogLoading] = useState(true)
  const [isBW, setIsBW] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [ghData, setGhData] = useState(null)
  const [ghLoading, setGhLoading] = useState(true)

  useEffect(() => {
    fetch('/contributions.json')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.contributions) {
          setGhData(data.contributions)
        }
        setGhLoading(false)
      })
      .catch(() => setGhLoading(false))
  }, [])

  const buildGHCalendar = (contributions) => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 340)
    startDate.setDate(startDate.getDate() - startDate.getDay())

    // Build a map from date string -> contribution day
    const dayMap = {}
    contributions.forEach(d => { dayMap[d.date] = d })

    const weeks = []
    const current = new Date(startDate)

    while (current <= today) {
      const week = []
      for (let d = 0; d < 7; d++) {
        const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
        const match = dayMap[key]
        week.push({
          count: match ? match.count : 0,
          level: match ? match.level : 0,
          date: new Date(current),
        })
        current.setDate(current.getDate() + 1)
      }
      weeks.push(week)
    }

    const monthLabels = []
    let lastMonth = -1
    weeks.forEach((week, wi) => {
      const month = week[3]?.date?.getMonth()
      if (month !== undefined && month !== lastMonth) {
        monthLabels.push({ index: wi, label: MONTHS[month], span: 1 })
        if (lastMonth >= 0) {
          monthLabels[monthLabels.length - 2].span = wi - monthLabels[monthLabels.length - 2].index
        }
        lastMonth = month
      }
    })
    if (monthLabels.length > 0) {
      monthLabels[monthLabels.length - 1].span = weeks.length - monthLabels[monthLabels.length - 1].index
    }

    return { weeks, monthLabels }
  }

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
      <div className={`minimal-page${isBW ? ' minimal-bw' : ''}`} style={{ fontSize: `${fontSize}px` }}>
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
    <div className={`minimal-page${isBW ? ' minimal-bw' : ''}`} style={{ fontSize: `${fontSize}px` }}>
      <div className="minimal-container">
        {/* Controls */}
        <div className="minimal-controls">
          <div className="minimal-controls-group">
            <button className="minimal-ctrl-btn" onClick={() => setFontSize(s => Math.max(12, s - 2))} title="Decrease font size">A−</button>
            <button className="minimal-ctrl-btn" onClick={() => setFontSize(s => Math.min(32, s + 2))} title="Increase font size">A+</button>
          </div>
          <button
            className={`minimal-ctrl-btn${isBW ? ' active' : ''}`}
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

        {/* GitHub Streak — heatmap */}
        <section className="minimal-section">
          <h2 className="minimal-section-heading">GitHub Streak</h2>
          {ghLoading ? (
            <p className="minimal-muted">Loading streak...</p>
          ) : ghData ? (
            (() => {
              const { weeks, monthLabels } = buildGHCalendar(ghData)
              return (
                <div className="minimal-gh-calendar">
                  <div className="minimal-gh-table">
                    <div className="minimal-gh-row">
                      <div className="minimal-gh-labels-col" />
                      <div
                        className="minimal-gh-month-labels"
                        style={{ gridTemplateColumns: `repeat(${weeks.length}, 13px)` }}
                      >
                        {monthLabels.map((m, i) => (
                          <span
                            key={i}
                            className="minimal-gh-month-label"
                            style={{ gridColumn: `${m.index + 1} / span ${m.span}` }}
                          >
                            {m.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="minimal-gh-row">
                      <div className="minimal-gh-day-labels">
                        {DAY_LABELS.map((day, i) => (
                          <span key={i} className="minimal-gh-day-label">{day}</span>
                        ))}
                      </div>
                      <div className="minimal-gh-cells">
                        {weeks.map((week, wi) => (
                          <div key={wi} className="minimal-gh-week">
                            {week.map((day, di) => (
                              <div
                                key={di}
                                className="minimal-gh-cell"
                                data-level={day.level}
                                title={`${day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} — ${day.count} ${day.count === 1 ? 'contribution' : 'contributions'}`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="minimal-gh-legend">
                    <span className="minimal-gh-legend-label">Less</span>
                    {[0, 1, 2, 3, 4].map(level => (
                      <div key={level} className="minimal-gh-cell" data-level={level} />
                    ))}
                    <span className="minimal-gh-legend-label">More</span>
                  </div>
                </div>
              )
            })()
          ) : (
            <p className="minimal-muted">Couldn't load contribution data.</p>
          )}
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