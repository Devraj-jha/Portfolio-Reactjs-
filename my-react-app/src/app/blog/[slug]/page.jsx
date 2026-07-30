import { notFound } from 'next/navigation';
import { parseFrontmatter, renderMarkdown } from '../../../lib/markdown';

export default async function BlogPostPage(props) {
  const params = await props.params;
  const { slug } = params;

  let text;
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.default.join(process.cwd(), 'public', 'content', 'blog', `${slug}.md`);
    text = await fs.default.readFile(filePath, 'utf-8');
  } catch {
    notFound();
  }

  const { data, content } = parseFrontmatter(text);
  const html = renderMarkdown(content);

  return (
    <section className="blog-section">
      <div className="blog-post-detail">
        <a href="/blog" className="back-btn">← Back</a>
        <article>
          <h1 className="post-title">{data.title || slug}</h1>
          {data.date && (
            <div className="post-meta">
              <span>{data.date}</span>
              {data.readTime && <><span>·</span><span>{data.readTime}</span></>}
            </div>
          )}
          {data.tags && Array.isArray(data.tags) && (
            <div className="post-tags">
              {data.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </div>
    </section>
  );
}
