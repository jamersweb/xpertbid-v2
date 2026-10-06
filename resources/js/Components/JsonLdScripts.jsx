import { extractSchemaMarkupBlocks } from '@/Utils/schemaMarkup';

export default function JsonLdScripts({ markup, idPrefix = 'jsonld' }) {
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
