const https = require('https');
const fs = require('fs');
const path = require('path');

const urls = [
  "https://www.daraz.pk/products/2026-2027-i1968712352.html",
  "https://www.daraz.pk/products/2027-i1968704277.html",
  "https://www.daraz.pk/products/2026-2027-i1968702689.html",
  "https://www.daraz.pk/products/2026-fcb-i1968700453.html",
  "https://www.daraz.pk/products/2026-i1968698505.html",
  "https://www.daraz.pk/products/-i1968696684.html",
  "https://www.daraz.pk/products/mbappe-2026-i1968692723.html",
  "https://www.daraz.pk/products/-i1968560443.html",
  "https://www.daraz.pk/products/202627-10-i1968402373.html",
  "https://www.daraz.pk/products/202627-7-i1968396890.html"
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });
}

async function run() {
  console.log('Fetching first URL to inspect structure...');
  const html = await fetchUrl(urls[0]);
  fs.writeFileSync(path.join(__dirname, 'test_daraz_pdp.html'), html);
  console.log('Saved test_daraz_pdp.html, length:', html.length);

  // Look for JSON or pdpData
  const scripts = html.match(/<script[\s\S]*?<\/script>/gi) || [];
  console.log('Total script tags:', scripts.length);
  for (const s of scripts) {
    if (s.includes('pdpTrackingData') || s.includes('app.run') || s.includes('window.pageData') || s.includes('itemGalley') || s.includes('skuGalleries') || s.includes('skuInfos')) {
      console.log('Found promising script tag:', s.substring(0, 300));
    }
  }
}

run().catch(console.error);
