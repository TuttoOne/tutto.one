import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";

export default function PraxisLearn() {
  const { course, lesson } = useParams<{ course: string; lesson?: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["/api/courses", course, lesson ?? "index"],
    queryFn: async () => {
      const url = lesson ? `/api/courses/${course}/${lesson}` : `/api/courses/${course}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("not found");
      return res.json() as Promise<{ meta: Record<string, any>; content: string }>;
    },
  });

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
        <div className="text-gray-800 leading-relaxed space-y-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-sm [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_a]:underline [&_a]:hover:no-underline">
          <ReactMarkdown>{data.content}</ReactMarkdown>
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
