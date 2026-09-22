const fs = require('fs');
const path = require('path');

const pricesMap = {
  937357748: { sale: 449, original: 1950, discount: 77 },
  936994144: { sale: 299, original: 499, discount: 40 },
  936945223: { sale: 1050, original: 2250, discount: 53 },
  936771768: { sale: 1637, original: 3987, discount: 59 },
  935349787: { sale: 345, original: 799, discount: 57 },
  935252684: { sale: 1800, original: 2400, discount: 25 },
  934941031: { sale: 444, original: 1717, discount: 74 },
  933545400: { sale: 1099, original: 4000, discount: 73 },
  794769116: { sale: 519, original: 1199, discount: 57 },
  590412841: { sale: 653, original: 2500, discount: 74 }
};

const jsonPath = path.join(__dirname, 'daraz_perfumes_products.json');
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
console.log('Successfully updated daraz_perfumes_products.json with exact sale prices & discounts!');
