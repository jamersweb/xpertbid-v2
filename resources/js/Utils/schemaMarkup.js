const normalizeJsonText = (value) => {
       if (typeof value !== 'string') {
              return '';
       }

       return value
              .replace(/^\uFEFF/, '')
              .replace(/<!--[\s\S]*?-->/g, ' ')
              .replace(/<script\b[^>]*>/gi, ' ')
              .replace(/<\/script>/gi, ' ')
              .trim();
};

const readJsonValue = (text, start) => {
       const opener = text[start];
       if (opener !== '{' && opener !== '[') {
              return null;
       }

       const pair = { '{': '}', '[': ']' };
       const stack = [opener];
       let inString = false;
       let escaped = false;

       for (let index = start + 1; index < text.length; index += 1) {
              const char = text[index];

              if (inString) {
                     if (escaped) {
                            escaped = false;
                            continue;
                     }
                     if (char === '\\') {
                            escaped = true;
                            continue;
                     }
                     if (char === '"') {
                            inString = false;
                     }
                     continue;
              }

              if (char === '"') {
                     inString = true;
                     continue;
              }

              if (char === '{' || char === '[') {
                     stack.push(char);
                     continue;
              }

              if (char === '}' || char === ']') {
                     const last = stack[stack.length - 1];
                     if (!last || pair[last] !== char) {
                            return null;
                     }
                     stack.pop();
                     if (stack.length === 0) {
                            const slice = text.slice(start, index + 1);
                            try {
                                   return { value: JSON.parse(slice), end: index + 1 };
                            } catch (error) {
                                   return null;
                            }
                     }
              }
       }

       return null;
};

export const extractSchemaMarkupBlocks = (schemaMarkup) => {
       if (typeof schemaMarkup !== 'string') {
              return [];
       }

       const rawMarkup = schemaMarkup.trim();
       if (!rawMarkup) {
              return [];
       }

       const searchable = normalizeJsonText(rawMarkup);
       if (!searchable) {
              return [];
       }

       const blocks = [];
       let cursor = 0;

       while (cursor < searchable.length) {
              const objectStart = searchable.indexOf('{', cursor);
              const arrayStart = searchable.indexOf('[', cursor);
              const starts = [objectStart, arrayStart].filter((value) => value >= 0);
              if (starts.length === 0) {
                     break;
              }

              const start = Math.min(...starts);
              const parsed = readJsonValue(searchable, start);
              if (!parsed) {
                     cursor = start + 1;
                     continue;
              }

              blocks.push(JSON.stringify(parsed.value).replace(/</g, '\\u003c'));
              cursor = parsed.end;
       }

       return blocks;
};
