const fs = require('fs');
const path = require('path');

const pricesMap = {
  1968704277: { sale: 1719, original: 2999, discount: 43 },
  1968698505: { sale: 1176, original: 1999, discount: 41 },
  1968696684: { sale: 1243, original: 1999, discount: 38 },
  1968692723: { sale: 1222, original: 1999, discount: 39 },
  1968402373: { sale: 1123, original: 3500, discount: 68 },
  1968171071: { sale: 1176, original: 1999, discount: 41 },
  1968167110: { sale: 1176, original: 1999, discount: 41 },
  1968153489: { sale: 1176, original: 1999, discount: 41 },
  1968145815: { sale: 1399, original: 1599, discount: 13 },
  1967989311: { sale: 2700, original: 2700, discount: 0 }
};

const jsonPath = path.join(__dirname, 'daraz_football_shirts_products.json');
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

products.forEach(p => {
  const pInfo = pricesMap[p.id];
  if (pInfo) {
    p.price = `Rs. ${pInfo.sale.toLocaleString()}`;
    p.raw_price = pInfo.sale;
    p.compare_at_price = `Rs. ${pInfo.original.toLocaleString()}`;
    p.raw_compare_at_price = pInfo.original;
    p.discount_percentage = pInfo.discount;

    if (Array.isArray(p.variations_by_price)) {
      p.variations_by_price.forEach(v => {
        v.price = `Rs. ${pInfo.sale.toLocaleString()}`;
        v.raw_price = pInfo.sale;
        v.compare_at_price = `Rs. ${pInfo.original.toLocaleString()}`;
        v.raw_compare_at_price = pInfo.original;
        v.discount_type = pInfo.discount > 0 ? 'percent' : null;
        v.discount_value = pInfo.discount > 0 ? pInfo.discount : null;
      });
    }
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2), 'utf8');
console.log('Successfully updated daraz_football_shirts_products.json with exact sale prices & discounts!');
