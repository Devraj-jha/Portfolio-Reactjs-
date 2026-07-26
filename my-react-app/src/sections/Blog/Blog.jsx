// src/sections/Blog/Blog.jsx
import { useState, useEffect } from 'react'
import './Blog.css'

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/content/blog/my-first-blog.md')
      
      if (!response.ok) {
        setPosts([])
        setLoading(false)
        return
      }
      
      const text = await response.text()
      const { data, content } = parseFrontmatter(text)
      
      setPosts([{
        id: 'my-first-blog',
        ...data,
        content
      }])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const parseFrontmatter = (text) => {
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!match) return { data: {}, content: text }
    
    const frontmatterStr = match[1]
    const content = match[2]
    const data = {}
    
    frontmatterStr.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim()
        let value = line.substring(colonIndex + 1).trim()
        value = value.replace(/^["'](.*)["']$/, '$1')
        
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(item => 
            item.trim().replace(/["']/g, '')
          )
        }
        
        data[key] = value
      }
    })
    
    return { data, content }
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
      .map(para => para.trim())
      .filter(para => para.length > 0)
      .map(para => {
        if (para.match(/^<(h[1-6]|ul|ol|pre|hr)/)) {
          return para
        }
        return `<p>${para.replace(/\n/g, '<br>')}</p>`
      })
      .join('')
      .replace(/<p>---<\/p>/g, '<hr>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
    
    return html
  }

  const handlePostClick = (post) => {
    setSelectedPost(post)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackClick = () => {
    setSelectedPost(null)
  }

  if (loading) {
    return (
      <section className="blog-section">
        <p className="blog-loading">Loading...</p>
      </section>
    )
  }

  if (posts.length === 0) {
    return (
      <section className="blog-section">
        <div className="blog-empty">
          <h2>Coming Soon</h2>
          <p>Blog posts will appear here.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="blog-section">
      {selectedPost ? (
        <div className="blog-post-detail">
          <button onClick={handleBackClick} className="back-btn">
            ← Back
          </button>
          
          <article>
            <h1 className="post-title">{selectedPost.title}</h1>
            
            <div className="post-meta">
              <span>{selectedPost.date}</span>
              <span>·</span>
              <span>{selectedPost.readTime}</span>
            </div>
            
            <div className="post-tags">
              {selectedPost.tags && selectedPost.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            
            <div 
              className="post-content"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedPost.content) }}
            />
          </article>
        </div>
      ) : (
        <div className="blog-list">
          <h1 className="blog-heading">Blog</h1>
          <p className="blog-subtitle">Thoughts, ideas, and things I'm learning</p>
          
          <div className="posts">
            {posts.map(post => (
              <article 
                key={post.id}
                className="post-card"
                onClick={() => handlePostClick(post)}
              >
                <h2 className="post-card-title">{post.title}</h2>
                
                <div className="post-meta">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                
                <p className="post-excerpt">{post.excerpt}</p>
                
                <div className="post-tags">
                  {post.tags && post.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default Blog