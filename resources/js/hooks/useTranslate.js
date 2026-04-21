import { usePage } from '@inertiajs/react';

export default function useTranslate() {
       const { translations = {} } = usePage().props;

       const t = (key, replacements = {}) => {
              let value = translations[key] ?? key;

              Object.entries(replacements).forEach(([replacementKey, replacementValue]) => {
                     value = value.replaceAll(`:${replacementKey}`, String(replacementValue));
              });

              return value;
       };

       return {
              t,
       };
}
