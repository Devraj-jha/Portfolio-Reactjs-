// src/sections/Blog/Blog.jsx
import './Blog.css'

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'The Journey Begins: Building My Portfolio',
      excerpt: 'How I started building this portfolio website and the technologies I chose...',
      date: '2024-01-15',
      readTime: '5 min read',
      tags: ['Web Development', 'React', 'Portfolio']
    },
    {
      id: 2,
      title: 'Understanding React Hooks Deep Dive',
      excerpt: 'A comprehensive look at React Hooks and how to use them effectively in your projects...',
      date: '2024-01-10',
      readTime: '8 min read',
      tags: ['React', 'JavaScript', 'Tutorial']
    },
    {
      id: 3,
      title: 'CSS Animations That Wow Your Users',
      excerpt: 'Creating engaging user experiences with smooth CSS animations and transitions...',
      date: '2024-01-05',
      readTime: '6 min read',
      tags: ['CSS', 'Animation', 'UI/UX']
    },
    {
      id: 4,
      title: 'The Future of Web Development in 2024',
      excerpt: 'Predictions and trends for web development in the coming year...',
      date: '2024-01-01',
      readTime: '7 min read',
      tags: ['Web Development', 'Trends', 'Future']
    }
  ]

  return (
    <section className="blog-section">
      {/* <div className="blog-header">
        <h1 className="section-title">My Blog</h1>
        <p className="section-subtitle">Random ideas, thoughts, and things I'm learning</p>
      </div>
      
      <div className="blog-posts">
        {blogPosts.map(post => (
          <article key={post.id} className="blog-post">
            <div className="post-header">
              <h2 className="post-title">{post.title}</h2>
              <div className="post-meta">
                <span className="post-date">{post.date}</span>
                <span className="post-read-time">{post.readTime}</span>
              </div>
            </div>
            
            <p className="post-excerpt">{post.excerpt}</p>
            
            <div className="post-footer">
              <div className="post-tags">
                {post.tags.map(tag => (
                  <span key={tag} className="post-tag">{tag}</span>
                ))}
              </div>
              <button className="read-more-btn">Read More</button>
            </div>
          </article>
        ))}
      </div> */}
      
      <div className="blog-coming-soon">
        <h2>More Content Coming Soon!</h2>
        <p>Will write blogs here !!! </p>
      </div>
    </section>
  )
}

export default Blog