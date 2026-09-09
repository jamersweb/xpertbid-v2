const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const SCRAPER_DIR = path.join(__dirname);
const IMAGES_DIR = path.join(SCRAPER_DIR, 'images');
const OUTPUT_JSON_PATH = path.join(SCRAPER_DIR, 'bathrobes_products.json');

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

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

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
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

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function runConcurrently(tasks, limit = 20) {
  const results = [];
  const executing = [];
  for (const task of tasks) {
    const p = Promise.resolve().then(() => task());
    results.push(p);
    if (limit <= tasks.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(results);
}

async function scrapeBathrobes() {
  console.log('Starting scraper for Bathrobes on ctexs.pk...');
  let allProducts = [];
  
  // Try collection handles: bathrobe, bathrobes
  const collectionHandles = ['bathrobe', 'bathrobes', 'bath-robe', 'bath-robes'];

  for (const handle of collectionHandles) {
    let page = 1;
    let hasMore = true;
    let collectionProducts = [];

    while (hasMore) {
      const collectionUrl = `https://ctexs.pk/collections/${handle}/products.json?limit=250&page=${page}`;
      console.log(`Trying endpoint: ${collectionUrl}`);

      try {
        const response = await fetchJson(collectionUrl);
        const products = response.products || [];

        if (products.length === 0) {
          hasMore = false;
          break;
        }

        collectionProducts = collectionProducts.concat(products);
        console.log(`Fetched ${products.length} products from ${handle} (page ${page}).`);
        
        if (products.length < 250) {
          hasMore = false;
        } else {
          page++;
        }
      } catch (err) {
        console.log(`Endpoint ${handle} failed: ${err.message}`);
        hasMore = false;
      }
    }

    if (collectionProducts.length > 0) {
      console.log(`Found ${collectionProducts.length} products in collection handle: "${handle}"`);
      allProducts = collectionProducts;
      break;
    }
  }

  console.log(`\nProcessing ${allProducts.length} total Bathrobe products...`);

  const downloadTasks = [];
  const structuredProducts = [];

  for (let i = 0; i < allProducts.length; i++) {
    const prod = allProducts[i];

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

    const minPrice = variations.length > 0
      ? Math.min(...variations.map(v => v.raw_price))
      : 0;

    const imagesUrl = (prod.images || []).map(img => img.src);
    const localImages = [];

    imagesUrl.forEach((imgUrl, imgIndex) => {
      const urlExtMatch = imgUrl.match(/\.(jpg|jpeg|png|webp|gif)/i);
      const ext = urlExtMatch ? urlExtMatch[1].toLowerCase() : 'jpg';
      const filename = `bathrobe_${prod.id}_img_${imgIndex + 1}.${ext}`;
      const destPath = path.join(IMAGES_DIR, filename);
      const relativePath = `images/${filename}`;

      localImages.push(relativePath);

      downloadTasks.push(async () => {
        try {
          await downloadImage(imgUrl, destPath);
        } catch (dlErr) {
          console.error(`Failed downloading image ${imgUrl}: ${dlErr.message}`);
        }
      });
    });

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

  console.log(`Downloading ${downloadTasks.length} images concurrently...`);
  await runConcurrently(downloadTasks, 25);

  fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(structuredProducts, null, 2), 'utf8');
  console.log(`\n✅ Successfully scraped ${structuredProducts.length} Bathrobe products!`);
  console.log(`📁 Saved product JSON to: ${OUTPUT_JSON_PATH}`);
  console.log(`🖼️ Saved downloaded images to: ${IMAGES_DIR}`);
}

scrapeBathrobes().catch(err => {
  console.error('Fatal error during scraping:', err);
  process.exit(1);
});
