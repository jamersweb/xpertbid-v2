const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const SCRAPER_DIR = path.join(__dirname);
const IMAGES_DIR = path.join(SCRAPER_DIR, 'images');
const OUTPUT_JSON_PATH = path.join(SCRAPER_DIR, 'sofa_covers_products.json');

// Ensure directories exist
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Helper to fetch URL content with headers
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Request failed with status code ${res.statusCode}`));
      }
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
  });
}

// Helper to download an image file
function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    // If file already exists, skip downloading
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
      return resolve(destPath);
    }
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download image ${url}, status: ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(() => resolve(destPath));
      });
      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    });
    req.on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

// Strip HTML helper
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function scrapeSofaCovers() {
  console.log('Starting scraper for Sofa Covers on ctexs.pk...');
  let allProducts = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const collectionUrl = `https://ctexs.pk/collections/sofa-covers/products.json?limit=250&page=${page}`;
    console.log(`Fetching page ${page}: ${collectionUrl}`);

    try {
      const response = await fetchJson(collectionUrl);
      const products = response.products || [];

      if (products.length === 0) {
        hasMore = false;
        break;
      }

      allProducts = allProducts.concat(products);
      console.log(`Fetched ${products.length} products from page ${page}. Total so far: ${allProducts.length}`);
      
      if (products.length < 250) {
        hasMore = false;
      } else {
        page++;
      }
    } catch (err) {
      console.error(`Error fetching page ${page}:`, err.message);
      hasMore = false;
    }
  }

  console.log(`\nProcessing ${allProducts.length} total products...`);

  const structuredProducts = [];

  for (let i = 0; i < allProducts.length; i++) {
    const prod = allProducts[i];
    console.log(`[${i + 1}/${allProducts.length}] Processing product: "${prod.title}" (ID: ${prod.id})`);

    // Process variations by price
    const variations = (prod.variants || []).map(v => ({
      variant_id: v.id,
      title: v.title,
      price: v.price ? `Rs. ${v.price}` : null,
      raw_price: parseFloat(v.price) || 0,
      compare_at_price: v.compare_at_price ? `Rs. ${v.compare_at_price}` : null,
      raw_compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
      sku: v.sku || '',
      available: v.available ?? true,
      option1: v.option1 || null,
      option2: v.option2 || null,
      option3: v.option3 || null
    }));

    // Minimum price
    const minPrice = variations.length > 0
      ? Math.min(...variations.map(v => v.raw_price))
      : 0;

    // Image URLs & Local saving
    const imagesUrl = (prod.images || []).map(img => img.src);
    const localImages = [];

    for (let imgIndex = 0; imgIndex < imagesUrl.length; imgIndex++) {
      const imgUrl = imagesUrl[imgIndex];
      // Generate clean filename
      const urlExtMatch = imgUrl.match(/\.(jpg|jpeg|png|webp|gif)/i);
      const ext = urlExtMatch ? urlExtMatch[1].toLowerCase() : 'jpg';
      const filename = `product_${prod.id}_img_${imgIndex + 1}.${ext}`;
      const destPath = path.join(IMAGES_DIR, filename);

      try {
        await downloadImage(imgUrl, destPath);
        localImages.push(`images/${filename}`);
      } catch (dlErr) {
        console.error(`Failed downloading image ${imgUrl}: ${dlErr.message}`);
        localImages.push(null);
      }
    }

    structuredProducts.push({
      id: prod.id,
      title: prod.title,
      handle: prod.handle,
      product_url: `https://ctexs.pk/products/${prod.handle}`,
      price: `Rs. ${minPrice}`,
      raw_price: minPrice,
      description: stripHtml(prod.body_html),
      description_html: prod.body_html || '',
      variations_by_price: variations,
      images_url: imagesUrl,
      local_images: localImages,
      created_at: prod.created_at,
      published_at: prod.published_at
    });
  }

  // Save JSON
  fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(structuredProducts, null, 2), 'utf8');
  console.log(`\n✅ Successfully scraped ${structuredProducts.length} Sofa Cover products!`);
  console.log(`📁 Saved product JSON to: ${OUTPUT_JSON_PATH}`);
  console.log(`🖼️ Saved downloaded images to: ${IMAGES_DIR}`);
}

scrapeSofaCovers().catch(err => {
  console.error('Fatal error during scraping:', err);
  process.exit(1);
});
