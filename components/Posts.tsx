import Link from "next/link";
import { PostList } from "@/components/PostList";
import type { PostMeta } from "@/lib/blog";
import { HOVER_TRANSITION_CLASS } from "@/lib/consts";

/** Home page section: the newest posts, mirroring the Work section. */
export const Posts = ({ posts }: { posts: PostMeta[] }) => {
  if (posts.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex flex-row justify-between">
        <h2 className="font-semibold text-black dark:text-white">Posts</h2>
        <Link
          href="/blog"
          className={`font-sans font-semibold text-sm ${HOVER_TRANSITION_CLASS}`}
        >
          See all posts
        </Link>
      </div>
      <PostList posts={posts} />
    </section>
  );
};
