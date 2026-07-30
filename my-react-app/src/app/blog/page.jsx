import { parseFrontmatter } from '../../lib/markdown';
import Blog from '../../sections/Blog/Blog';

async function getBlogPosts() {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.default.join(process.cwd(), 'public', 'content', 'blog', 'my-first-blog.md');
    const text = await fs.default.readFile(filePath, 'utf-8');
    const { data } = parseFrontmatter(text);
    return [{
      id: 'my-first-blog',
      ...data,
    }];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return <Blog initialPosts={posts} />;
}
