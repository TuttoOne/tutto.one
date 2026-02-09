import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/lib/chat-data";

export default function Blog() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif font-bold mb-4">Thinking</h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-xl">
          Essays on the intersection of organizational knowledge, AI architecture, and the future of work.
        </p>

        <div className="space-y-12">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="group cursor-pointer border-b border-border/40 pb-12 last:border-0">
                <div className="flex flex-col md:flex-row gap-6 md:items-baseline">
                  <div className="md:w-32 shrink-0 text-sm text-muted-foreground font-mono">
                    {post.date}
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-semibold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                      Read Article <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
