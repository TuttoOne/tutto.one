import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const { data: posts, isLoading, isError } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif font-bold mb-4">Thinking</h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-xl">
          Essays on the intersection of organizational knowledge, AI architecture, and the future of work.
        </p>

        {isLoading && (
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-border/40 pb-12 animate-pulse">
                <div className="flex flex-col md:flex-row gap-6 md:items-baseline">
                  <div className="md:w-32 shrink-0 h-4 bg-muted rounded" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <p className="text-muted-foreground">Failed to load posts. Please try again.</p>
        )}

        {posts && (
          <div className="space-y-12">
            {posts.map((post) => (
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
                      <p className="text-muted-foreground leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
