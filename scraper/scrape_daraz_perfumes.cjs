const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const productUrls = [
  "https://www.daraz.pk/products/100-i937357748.html",
  "https://www.daraz.pk/products/dirham-perfume-for-men-long-lasting-eau-de-perfume-35ml-dirham-perfume-i936994144.html",
  "https://www.daraz.pk/products/100-i936945223.html",
  "https://www.daraz.pk/products/pm-pm-i936771768.html",
  "https://www.daraz.pk/products/100-i935349787.html",
  "https://www.daraz.pk/products/100-i935252684.html",
  "https://www.daraz.pk/products/120-i934941031.html",
  "https://www.daraz.pk/products/100-i933545400.html",
  "https://www.daraz.pk/products/2-edu-i794769116.html",
  "https://www.daraz.pk/products/100-i590412841.html"
];

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = 'https://www.daraz.pk' + redirectUrl;
        }
        return fetchHtml(redirectUrl).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(25000, () => {
      req.destroy();
      reject(new Error('Timeout fetching ' + url));
    });
  });
}

function downloadImage(imgUrl, destPath) {
  return new Promise((resolve) => {
    if (!imgUrl) return resolve(false);
    if (!imgUrl.startsWith('http')) {
      imgUrl = 'https:' + imgUrl;
    }
    const client = imgUrl.startsWith('https') ? https : http;
    const req = client.get(imgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
    req.on('error', () => resolve(false));
    req.setTimeout(15000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function parsePrice(str) {
  if (!str) return 0;
  const cleaned = str.toString().replace(/Rs\.?/gi, '').replace(/PKR/gi, '').replace(/,/g, '').trim();
  const match = cleaned.match(/[\d]+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}

async function parseProductData(html, url, imagesDir) {
  let moduleData = null;
  let pdpTrackingData = null;
  let schemaData = null;

  // 1. Try __moduleData__
  const moduleMatch = html.match(/var __moduleData__ = ([\s\S]*?);\s*var __googleBot__/);
  if (moduleMatch) {
    try {
      moduleData = JSON.parse(moduleMatch[1].trim());
    } catch (e) {
      console.error('Failed to parse __moduleData__:', e.message);
    }
  }

  // 2. Try pdpTrackingData
  const trackMatch = html.match(/var pdpTrackingData = ("[\s\S]*?");/);
  if (trackMatch) {
    try {
      pdpTrackingData = JSON.parse(JSON.parse(trackMatch[1]));
    } catch (e) {}
  }

  // 3. Try schema.org JSON-LD
  const schemaMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (schemaMatch) {
    try {
      schemaData = JSON.parse(schemaMatch[1]);
    } catch (e) {}
  }

  const rootFields = moduleData?.data?.root?.fields || {};
  const productObj = rootFields.product || {};
  const trackingObj = rootFields.tracking || pdpTrackingData || {};
  const skuInfos = rootFields.skuInfos || {};
  const skuGalleries = rootFields.skuGalleries || {};
  const productOption = rootFields.productOption || {};
  const skuBase = productOption.skuBase || {};

  // Extract ID
  const itemIdMatch = url.match(/i(\d+)\.html/) || [];
  const id = parseInt(itemIdMatch[1] || trackingObj.pdt_sku || (schemaData ? schemaData.mpn : Date.now()), 10);

  // Title
  const title = productObj.title || trackingObj.pdt_name || (schemaData ? schemaData.name : 'Perfume Product');

  // Handle / Slug
  const handle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Category
  const categoryArr = trackingObj.pdt_category || [];
  const category = categoryArr.join(' > ') || (schemaData ? schemaData.category : "Health & Beauty > Fragrances > Men");

  // Brand
  const brand = (typeof productObj.brand === 'object' ? productObj.brand?.name : productObj.brand) || trackingObj.brand_name || 'No Brand';

  // Price parsing
  let rawPrice = parsePrice(trackingObj.pdt_price);
  if (!rawPrice && html) {
    const pMatch = html.match(/Rs\.\s*([\d,]+)/);
    if (pMatch) {
      rawPrice = parsePrice(pMatch[1]);
    }
  }

  // Raw compare at price / discount
  let rawCompareAtPrice = rawPrice;
  let discountPercentage = 0;
  if (trackingObj.pdt_discount) {
    const discNum = parsePrice(trackingObj.pdt_discount);
    if (discNum > 0 && discNum < 100) {
      discountPercentage = discNum;
      rawCompareAtPrice = Math.round(rawPrice / (1 - (discNum / 100)));
    }
  }

  // Description & Highlights
  const descriptionHtml = productObj.desc || (schemaData ? `<p>${schemaData.description}</p>` : '');
  const highlightsHtml = productObj.highlights || '';
  const plainDescription = (schemaData ? schemaData.description : '') || descriptionHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  // Collect All High-Res Images
  const imagesSet = new Set();
  if (trackingObj.pdt_photo) {
    imagesSet.add(trackingObj.pdt_photo.replace(/_\d+x\d+.*$/, ''));
  }
  if (schemaData && schemaData.image) {
    (Array.isArray(schemaData.image) ? schemaData.image : [schemaData.image]).forEach(img => {
      imagesSet.add(img.replace(/_\d+x\d+.*$/, ''));
    });
  }

  // Add from skuGalleries
  Object.values(skuGalleries).forEach(gallery => {
    if (Array.isArray(gallery)) {
      gallery.forEach(item => {
        const src = item.src || item.poster;
        if (src && !src.includes('video')) {
          imagesSet.add(src.replace(/_\d+x\d+.*$/, ''));
        }
      });
    }
  });

  // Add from productOption options
  if (Array.isArray(productOption.options)) {
    productOption.options.forEach(opt => {
      if (opt.image) {
        imagesSet.add(opt.image.replace(/_\d+x\d+.*$/, ''));
      }
    });
  }

  const imagesUrl = Array.from(imagesSet);
  const localImages = [];

  // Download images locally
  for (let idx = 0; idx < imagesUrl.length; idx++) {
    const imgUrl = imagesUrl[idx];
    const ext = path.extname(new URL(imgUrl.startsWith('http') ? imgUrl : 'https:' + imgUrl).pathname) || '.jpg';
    const cleanExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext.toLowerCase()) ? ext.toLowerCase() : '.jpg';
    const filename = `perfume_${id}_img_${idx + 1}${cleanExt}`;
    const destPath = path.join(imagesDir, filename);

    const relPath = `images/${filename}`;
    if (!fs.existsSync(destPath)) {
      await downloadImage(imgUrl, destPath);
    }
    localImages.push(relPath);
  }

  // Parse Options
  const options = [];
  const propertyMap = {};

  if (Array.isArray(skuBase.properties)) {
    skuBase.properties.forEach(prop => {
      const propName = prop.name || 'Option';
      const valMap = {};
      const valList = [];

      if (Array.isArray(prop.values)) {
        prop.values.forEach(v => {
          if (v.name && v.vid) {
            valMap[v.vid] = v.name;
            valList.push(v.name);
          } else if (Array.isArray(v.value)) {
            v.value.forEach(subV => {
              valMap[subV.vid] = subV.name;
              valList.push(subV.name);
            });
          }
        });
      }

      propertyMap[prop.pid] = { name: propName, values: valMap };
      options.push({
        name: propName,
        values: valList
      });
    });
  }

  // Parse Variations
  const variations = [];
  if (Array.isArray(skuBase.skus) && skuBase.skus.length > 0) {
    skuBase.skus.forEach((skuItem, idx) => {
      const skuId = skuItem.skuId || skuItem.cartSkuId || String(idx + 1);
      const innerSku = skuItem.innerSkuId || `${id}_PK-${skuId}`;
      const propPath = skuItem.propPath || '';
      
      const optionValues = [];
      if (propPath) {
        const pairs = propPath.split(';');
        pairs.forEach(pair => {
          const [pid, vid] = pair.split(':');
          if (propertyMap[pid] && propertyMap[pid].values[vid]) {
            optionValues.push(propertyMap[pid].values[vid]);
          }
        });
      }

      const variantTitle = optionValues.length > 0 ? optionValues.join(' / ') : `Standard / Variant ${idx + 1}`;
      
      variations.push({
        variant_id: skuId,
        sku: innerSku,
        title: variantTitle,
        price: `Rs. ${rawPrice.toLocaleString()}`,
        raw_price: rawPrice,
        compare_at_price: `Rs. ${rawCompareAtPrice.toLocaleString()}`,
        raw_compare_at_price: rawCompareAtPrice,
        available: true,
        option1: optionValues[0] || null,
        option2: optionValues[1] || null,
        option3: optionValues[2] || null,
        discount_type: discountPercentage > 0 ? 'percent' : null,
        discount_value: discountPercentage > 0 ? discountPercentage : null
      });
    });
  } else {
    variations.push({
      variant_id: String(id),
      sku: `${id}_PK-1`,
      title: "Default",
      price: `Rs. ${rawPrice.toLocaleString()}`,
      raw_price: rawPrice,
      compare_at_price: `Rs. ${rawCompareAtPrice.toLocaleString()}`,
      raw_compare_at_price: rawCompareAtPrice,
      available: true,
      option1: "Default",
      option2: null,
      option3: null,
      discount_type: discountPercentage > 0 ? 'percent' : null,
      discount_value: discountPercentage > 0 ? discountPercentage : null
    });
  }

  return {
    id: id,
    title: title,
    handle: handle,
    product_url: url,
    price: `Rs. ${rawPrice.toLocaleString()}`,
    raw_price: rawPrice,
    compare_at_price: `Rs. ${rawCompareAtPrice.toLocaleString()}`,
    raw_compare_at_price: rawCompareAtPrice,
    discount_percentage: discountPercentage,
    brand: brand,
    category: category,
    description: plainDescription,
    description_html: descriptionHtml,
    highlights_html: highlightsHtml,
    images_url: imagesUrl,
    local_images: localImages,
    options: options,
    variations_by_price: variations
  };
}

async function scrapeAll() {
  const imagesDir = path.join(__dirname, 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  console.log(`Starting to scrape ${productUrls.length} Daraz perfume products...`);
  const results = [];

  for (let i = 0; i < productUrls.length; i++) {
    const url = productUrls[i];
    console.log(`[${i + 1}/${productUrls.length}] Fetching ${url}...`);
    try {
      const html = await fetchHtml(url);
      const product = await parseProductData(html, url, imagesDir);
      console.log(`  ✓ Success: "${product.title}" (${product.price}, ${product.images_url.length} images, ${product.variations_by_price.length} variations)`);
      results.push(product);
    } catch (e) {
      console.error(`  ✗ Error on ${url}:`, e.message);
    }
    await new Promise(r => setTimeout(r, 600));
  }

  const outputPath = path.join(__dirname, 'daraz_perfumes_products.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n🎉 Successfully saved ${results.length} products to ${outputPath}`);
}

scrapeAll().catch(console.error);
