import Link from "next/link";
import type { PostMeta } from "@/lib/blog";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";
import { formatDate, formatReadingTime } from "@/lib/dates";

/** Title, date and description for each post; shared by /blog and the home page. */
export const PostList = ({ posts }: { posts: PostMeta[] }) => {
  return (
    <ul className="flex flex-col gap-8">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/blog/${post.slug}`}
            className={`font-semibold ${HOVER_TRANSITION_CLASS}`}
          >
            {post.title}
          </Link>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {" · "}
            {formatReadingTime(post.readingMinutes)}
            {post.draft && " · draft"}
          </p>
          <p className="pt-2 font-serif">{post.description}</p>
        </li>
      ))}
    </ul>
  );
};
