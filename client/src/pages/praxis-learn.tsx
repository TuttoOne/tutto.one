import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ── Table parser ──────────────────────────────────────────────────────────────

function parseTableBlock(block: string): { headers: string[]; rows: string[][] } | null {
  const lines = block.trim().split("\n");
  if (lines.length < 3) return null;
  if (!lines.every((l) => l.trim().startsWith("|"))) return null;
  const sep = lines[1].trim();
  if (!/^\|[\s|:-]+\|?\s*$/.test(sep)) return null;
  const parseRow = (line: string) =>
    line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
  return {
    headers: parseRow(lines[0]),
    rows: lines.slice(2).map(parseRow),
  };
}

function GfmTable({ block }: { block: string }) {
  const table = parseTableBlock(block);
  if (!table) return <ReactMarkdown remarkPlugins={[remarkGfm]}>{block}</ReactMarkdown>;
  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {table.headers.map((h, i) => (
              <th key={i} className="text-left border-b-2 border-gray-200 pb-2 pr-6 font-semibold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-100">
              {row.map((cell, j) => (
                <td key={j} className="py-2 pr-6 align-top">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Content renderer (handles table blocks + regular markdown) ────────────────

function ContentRenderer({
  content,
  linkRenderer,
}: {
  content: string;
  linkRenderer: React.ComponentType<any>;
}) {
  const blocks = content.split(/\n{2,}/);

  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.trim().split("\n");
        const isTable =
          lines.length >= 3 && lines.every((l) => l.trim().startsWith("|"));
        if (isTable) return <GfmTable key={i} block={block} />;
        return (
          <ReactMarkdown
            key={i}
            remarkPlugins={[remarkGfm]}
            components={{ a: linkRenderer }}
          >
            {block}
          </ReactMarkdown>
        );
      })}
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PraxisLearn() {
  const { course, lesson } = useParams<{ course: string; lesson?: string }>();
  const [, navigate] = useLocation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["/api/courses", course, lesson ?? "index"],
    queryFn: async () => {
      const url = lesson ? `/api/courses/${course}/${lesson}` : `/api/courses/${course}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("not found");
      return res.json() as Promise<{ meta: Record<string, any>; content: string }>;
    },
  });

  const LinkRenderer = ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    if (href && href.endsWith(".md")) {
      const slug = href.replace(/^\.\//, "").replace(/\.md$/, "");
      const to = `/praxis/learn/${course}/${slug}`;
      return (
        <a href={to} onClick={(e) => { e.preventDefault(); navigate(to); }} className="underline cursor-pointer">
          {children}
        </a>
      );
    }
    return (
      <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
        {children}
      </a>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Loading…
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Lesson not found.</p>
        <Link href="/praxis" className="text-sm underline">← Back to Praxis</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* breadcrumb */}
        <p className="text-xs text-gray-400 mb-10 space-x-1">
          <Link href="/praxis" className="hover:text-gray-700">Praxis</Link>
          <span>/</span>
          <Link href={`/praxis/learn/${course}`} className="hover:text-gray-700 capitalize">
            {course?.replace(/-/g, " ")}
          </Link>
          {lesson && (
            <>
              <span>/</span>
              <span className="text-gray-600">{data.meta.title}</span>
            </>
          )}
        </p>

        {/* title */}
        <h1 className="text-2xl font-semibold mb-2 text-gray-900">{data.meta.title}</h1>
        {data.meta.description && (
          <p className="text-gray-500 mb-10">{data.meta.description}</p>
        )}

        {/* content */}
        <div className="text-gray-800 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_ol]:mb-4 [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-sm [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre]:mb-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_a]:underline [&_a]:hover:no-underline [&_hr]:border-gray-200 [&_hr]:my-8">
          <ContentRenderer content={data.content} linkRenderer={LinkRenderer} />
        </div>

        {/* back */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <Link href={`/praxis/learn/${course}`} className="text-sm text-gray-400 hover:text-gray-700">
            ← Back to course overview
          </Link>
        </div>
      </div>
    </div>
  );
}
