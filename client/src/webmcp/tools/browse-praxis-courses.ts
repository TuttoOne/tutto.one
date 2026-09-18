import { defineTool } from "@nekuda/webmcp-sdk";

type BrowseCoursesInput = {
  course?: string;
  lesson?: string;
};

type LessonEntry = { meta: Record<string, unknown>; path: string };

/** `courses/praxis-foundations/01-the-folder.md` → `01-the-folder` (the reader's lesson slug). */
function lessonSlug(path: string): string {
  return path.split("/").pop()!.replace(/\.md$/, "");
}

export const browsePraxisCourses = defineTool({
  stableKey: "tutto.browse_praxis_courses",
  name: "browse_praxis_courses",
  title: "Browse and read Praxis course material",
  description:
    "Browse the free Praxis course material and read a lesson. Call with no arguments to list every course and its lessons in order; pass `course` for that course's overview; pass `course` and `lesson` to get the full lesson text. Use this when a visitor asks what the Praxis course covers, what is in a particular lesson, or wants to start learning. Returns course and lesson titles with the reader path under /praxis/learn, and the lesson markdown when one is requested.",
  inputSchema: {
    type: "object",
    properties: {
      course: {
        type: "string",
        description: "Course slug, e.g. 'praxis-foundations'. Omit to list all courses.",
        pattern: "^[a-z0-9-]+$",
      },
      lesson: {
        type: "string",
        description: "Lesson slug within the course, as returned by the listing. Requires `course`.",
        pattern: "^[a-z0-9-]+$",
      },
    },
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true },
  async execute({ course, lesson }: BrowseCoursesInput) {
    if (lesson && !course) {
      throw new Error("browse_praxis_courses needs a course when a lesson is given");
    }

    if (!course) {
      const res = await fetch("/api/courses");
      if (!res.ok) throw new Error(`browse_praxis_courses failed: HTTP ${res.status}`);
      const catalogue = (await res.json()) as Record<string, LessonEntry[]>;

      const courses = Object.entries(catalogue).map(([slug, entries]) => {
        // `index.md` is the course overview, already served at the course path.
        const overview = entries.find((entry) => lessonSlug(entry.path) === "index");
        return {
          course: slug,
          title: (overview?.meta.title as string) ?? slug,
          description: (overview?.meta.description as string) ?? null,
          path: `/praxis/learn/${slug}`,
          lessons: entries
            .filter((entry) => lessonSlug(entry.path) !== "index")
            .map((entry) => ({
              lesson: lessonSlug(entry.path),
              title: (entry.meta.title as string) ?? lessonSlug(entry.path),
              path: `/praxis/learn/${slug}/${lessonSlug(entry.path)}`,
            })),
        };
      });

      return {
        courses,
        note:
          courses.length === 0
            ? "The Praxis course catalogue is currently empty."
            : `${courses.length} course(s). Call again with a course and lesson slug to read the text.`,
      };
    }

    const url = lesson ? `/api/courses/${course}/${lesson}` : `/api/courses/${course}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `browse_praxis_courses could not read ${lesson ? `lesson '${lesson}' of ` : ""}course '${course}': HTTP ${res.status}`,
      );
    }
    const { meta, content } = (await res.json()) as {
      meta: Record<string, unknown>;
      content: string;
    };

    return {
      course,
      lesson: lesson ?? null,
      title: (meta.title as string) ?? course,
      path: lesson ? `/praxis/learn/${course}/${lesson}` : `/praxis/learn/${course}`,
      content,
    };
  },
});
