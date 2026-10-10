import { ImageResponse } from "next/og";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { DEFAULT_METADATA } from "@/lib/consts";
import { formatDate, formatReadingTime } from "@/lib/dates";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

const MAX_TITLE_CHARS = 110;

/** Shrinks the type as the title gets longer so it always fits the card. */
const titleSize = (title: string) =>
  title.length <= 40 ? 76 : title.length <= 75 ? 64 : 52;

export default async function PostOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const raw = post?.title ?? DEFAULT_METADATA.title;
  const title =
    raw.length > MAX_TITLE_CHARS
      ? `${raw.slice(0, MAX_TITLE_CHARS - 1)}…`
      : raw;
  const meta = post
    ? `${formatDate(post.date)} · ${formatReadingTime(post.readingMinutes)}`
    : "";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#18181B",
        padding: "72px 80px",
      }}
    >
      <div style={{ display: "flex", fontSize: 34, fontWeight: 800 }}>
        <span style={{ color: "#D4D4D8" }}>Jason&nbsp;</span>
        <span style={{ color: "#fb7185" }}>Michael</span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: titleSize(title),
          fontWeight: 800,
          lineHeight: 1.15,
          color: "#FAFAFA",
          maxWidth: 1040,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 28,
          color: "#A1A1AA",
        }}
      >
        <span>{meta}</span>
        <span>{DEFAULT_METADATA.url.replace("https://", "")}</span>
      </div>
    </div>,
    { ...size },
  );
}
