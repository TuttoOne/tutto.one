import { Layout } from "@/components/layout/Layout";
import { Link, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import { BLOG_POSTS } from "@/lib/chat-data";

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-2xl font-serif font-bold text-foreground mt-12 mb-4">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      let j = i;
      while (j < lines.length && lines[j].startsWith("- ")) {
        items.push(lines[j].slice(2));
        j++;
      }
      elements.push(
        <ul key={key++} className="list-disc list-outside pl-6 space-y-2 my-4">
          {items.map((item, idx) => (
            <li key={idx} className="text-muted-foreground leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      i = j - 1;
    } else if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      let j = i;
      while (j < lines.length && /^\d+\.\s/.test(lines[j])) {
        items.push(lines[j].replace(/^\d+\.\s/, ""));
        j++;
      }
      elements.push(
        <ol key={key++} className="list-decimal list-outside pl-6 space-y-2 my-4">
          {items.map((item, idx) => (
            <li key={idx} className="text-muted-foreground leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      i = j - 1;
    } else if (line.trim() === "") {
      continue;
    } else {
      elements.push(
        <p key={key++} className="text-muted-foreground leading-relaxed mb-6">
          {renderInline(line)}
        </p>
      );
    }
  }

  return elements;
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(
      <strong key={key++} className="text-foreground font-semibold">
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : [text];
}

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">This article doesn't exist.</p>
          <Link href="/blog" className="text-primary font-medium hover:underline">
            Back to Blog
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Blog
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 font-mono">
            <span>{post.date}</span>
            <span className="text-border">|</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        <div className="border-t border-border/40 pt-10 font-serif text-[17px]">
          {renderMarkdown(post.content)}
        </div>

        <footer className="mt-16 pt-8 border-t border-border/40">
          <div className="bg-secondary/30 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-serif font-bold mb-2">Want to discuss this?</h3>
            <p className="text-muted-foreground mb-6">Book a free 15-minute intro call.</p>
            <a
              href="https://cal.com/tuttoone/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Book a Call
            </a>
          </div>
        </footer>
      </article>
    </Layout>
  );
}
