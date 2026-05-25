import ReactMarkdown from 'react-markdown';

// about / privacy など Markdown コンテンツの共通レンダラ。
// prose + UTokyo トークンで全ドキュメントページを統一スタイルに。
const proseClass =
  'prose prose-lg max-w-none ' +
  'prose-headings:text-[var(--ds-fg)] prose-headings:[font-family:var(--ds-font-serif)] ' +
  'prose-p:text-[var(--ds-fg-muted)] prose-li:text-[var(--ds-fg-muted)] ' +
  'prose-a:text-[var(--ds-primary)] prose-strong:text-[var(--ds-fg)]';

export function MarkdownContent({ content }: { content: string }) {
  return (
    <article className={proseClass}>
      <ReactMarkdown
        components={{
          a: ({ href, children }) => {
            const external = !!href && /^https?:\/\//.test(href);
            return (
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
