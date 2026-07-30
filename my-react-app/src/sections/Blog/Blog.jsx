'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { parseFrontmatter } from '../../lib/markdown'
import './Blog.css'

const Blog = ({ initialPosts = [] }) => {
  const [posts, setPosts] = useState(initialPosts)
  const [loading, setLoading] = useState(initialPosts.length === 0)

  useEffect(() => {
    // Only fetch client-side if no initial data from server
    if (initialPosts.length === 0) {
      fetchBlogPosts()
    }
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
      const { data } = parseFrontmatter(text)

      setPosts([{
        id: 'my-first-blog',
        ...data,
      }])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
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
      <div className="blog-list">
        <h1 className="blog-heading">Blog</h1>
        <p className="blog-subtitle">Thoughts, ideas, and things I'm learning</p>

        <div className="posts">
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="post-card"
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Blog
