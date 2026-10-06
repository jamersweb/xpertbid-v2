import { useEffect } from 'react';
import { extractSchemaMarkupBlocks } from '@/Utils/schemaMarkup';

export default function JsonLdScripts({ markup, idPrefix = 'jsonld' }) {
       const blocks = extractSchemaMarkupBlocks(markup);
       const serializedBlocks = JSON.stringify(blocks);

       useEffect(() => {
              document.querySelectorAll('script[data-inertia-jsonld]').forEach((node) => node.remove());

              const nodes = blocks.map((schemaMarkup, index) => {
                     const el = document.createElement('script');
                     el.type = 'application/ld+json';
                     el.setAttribute('data-inertia-jsonld', `${idPrefix}-${index}`);
                     el.text = schemaMarkup;
                     document.head.appendChild(el);
                     return el;
              });

              return () => {
                     nodes.forEach((node) => node.remove());
              };
       }, [idPrefix, serializedBlocks]);

       return null;
}
