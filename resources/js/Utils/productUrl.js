export const buildProductHref = (slug) => {
       if (!slug) {
              return '#';
       }

       const url = new URL(`/product/${slug}`, 'http://localhost');

       return `${url.pathname}${url.search}${url.hash}`;
};
