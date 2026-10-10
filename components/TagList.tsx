import Link from "next/link";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";

interface Tag {
  slug: string;
  name: string;
  count?: number;
}

/** Links to the tag pages. Pass `count` to show how many posts use each tag. */
export const TagList = ({ tags }: { tags: Tag[] }) => {
  if (tags.length === 0) return null;
  return (
    <ul aria-label="Tags" className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag.slug}>
          <Link
            href={`/blog/tags/${tag.slug}`}
            className={`inline-flex gap-1.5 rounded-md border border-zinc-400 px-2 py-0.5 text-xs dark:border-zinc-600 ${HOVER_TRANSITION_CLASS}`}
          >
            {tag.name}
            {tag.count !== undefined && (
              <span className="text-zinc-600 dark:text-zinc-400">
                {tag.count}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
};
