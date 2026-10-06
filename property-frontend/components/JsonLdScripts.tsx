import { extractSchemaMarkupBlocks } from "@/lib/seo/schemaMarkup";

export function JsonLdScripts({
  markup,
  idPrefix = "jsonld",
}: {
  markup?: string | null;
  idPrefix?: string;
}) {
  const blocks = extractSchemaMarkupBlocks(markup);

  if (!blocks.length) {
    return null;
  }

  return (
    <>
      {blocks.map((schemaMarkup, index) => (
        <script
          key={`${idPrefix}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaMarkup }}
        />
      ))}
    </>
  );
}
