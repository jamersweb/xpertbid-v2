const fs = require('fs');
const html = fs.readFileSync('scraper/test_daraz_pdp.html', 'utf8');

const match = html.match(/var __moduleData__ = ([\s\S]*?);\s*var __googleBot__/);
if (match) {
  const data = JSON.parse(match[1].trim());
  console.log('root.fields keys:', Object.keys(data.data.root.fields));
  console.log('product:', data.data.root.fields.product);
  console.log('skuInfos sample:', Object.values(data.data.root.fields.skuInfos)[0]);
  console.log('tracking:', data.data.root.fields.tracking);
}

const trackMatch = html.match(/var pdpTrackingData = ("[\s\S]*?");/);
if (trackMatch) {
  try {
    const parsed = JSON.parse(JSON.parse(trackMatch[1]));
    console.log('pdpTrackingData:', parsed);
  } catch(e) {
    console.log('pdpTrackingData parse err:', e.message);
  }
}

// Let's check where price appears in HTML
const priceMatches = html.match(/Rs\.\s*[0-9,]+/g);
console.log('Price matches in HTML:', priceMatches);
