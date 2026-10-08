/** Renders schema.org structured data as a JSON-LD script tag. */
export const JsonLd = ({ data }: { data: Record<string, unknown> }) => {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD built from our own build-time data; "<" is escaped below so the payload can't close the script tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
};
