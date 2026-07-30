/**
 * Parse frontmatter from markdown text.
 * Returns { data: { title, date, readTime, tags, excerpt }, content: string }
 */
export function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content: text };

  const data = {};
  match[1].split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      value = value.replace(/^["'](.*)["']$/, '$1');

      if (value.startsWith('[') && value.endsWith(']')) {
        value = value
          .slice(1, -1)
          .split(',')
          .map((item) => item.trim().replace(/["']/g, ''));
      }

      data[key] = value;
    }
  });

  return { data, content: match[2] };
}

/**
 * Render basic markdown to HTML (client-safe, no deps).
 * Handles: headings, bold, italic, code blocks, inline code, lists, paragraphs, links, horizontal rules.
 */
export function renderMarkdown(content) {
  if (!content) return '';

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
    .map((para) => para.trim())
    .filter((para) => para.length > 0)
    .map((para) => {
      if (para.match(/^<(h[1-6]|ul|ol|pre|hr)/)) {
        return para;
      }
      return `<p>${para.replace(/\n/g, '<br>')}</p>`;
    })
    .join('')
    .replace(/<p>---<\/p>/g, '<hr>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');

  return html;
}
