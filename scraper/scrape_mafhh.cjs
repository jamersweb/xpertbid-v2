const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function fetchHtml(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
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

function cleanHtml(html) {
  if (!html) return '';
  return html.replace(/&#038;/g, '&').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#8211;/g, '–').replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"');
}

async function scrapeMafhh() {
  const imagesDir = path.join(__dirname, 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  console.log('Fetching products from Mafhh Trader WooCommerce Store API...');
  const wcProducts = await fetchJson('https://mafhhtrader.com/wp-json/wc/store/v1/products?per_page=100');

  if (!Array.isArray(wcProducts) || wcProducts.length === 0) {
    console.error('Failed to fetch products or empty response.');
    return;
  }

  console.log(`Found ${wcProducts.length} products. Extracting details & downloading images...`);
  const finalProducts = [];

  for (let i = 0; i < wcProducts.length; i++) {
    const p = wcProducts[i];
    const productNum = i + 1;
    const title = cleanHtml(p.name);
    console.log(`[${productNum}/${wcProducts.length}] Processing: ${title}`);

    // Permalink & Handle
    const permalink = p.permalink || '';
    const handle = p.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Category
    const categories = (p.categories || []).map(c => cleanHtml(c.name));
    const mainCategory = categories.length > 0 ? categories.join(' > ') : 'Home & Living';

    // Pricing
    const minorUnit = p.prices?.currency_minor_unit || 2;
    const rawSalePrice = p.prices?.price ? parseFloat(p.prices.price) / Math.pow(10, minorUnit) : 0;
    const rawRegularPrice = p.prices?.regular_price ? parseFloat(p.prices.regular_price) / Math.pow(10, minorUnit) : rawSalePrice;

    const hasDiscount = rawRegularPrice > rawSalePrice && rawSalePrice > 0;
    const discountPercentage = hasDiscount ? Math.round(((rawRegularPrice - rawSalePrice) / rawRegularPrice) * 100) : 0;

    // Descriptions
    const descriptionHtml = cleanHtml(p.description || '');
    const shortDescriptionHtml = cleanHtml(p.short_description || '');
    const plainDescription = descriptionHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || shortDescriptionHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    // Images
    const imagesUrl = (p.images || []).map(img => img.src).filter(Boolean);
    const localImages = [];

    for (let imgIdx = 0; imgIdx < imagesUrl.length; imgIdx++) {
      const imgUrl = imagesUrl[imgIdx];
      const parsedUrl = new URL(imgUrl);
      const ext = path.extname(parsedUrl.pathname) || '.jpg';
      const cleanExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext.toLowerCase()) ? ext.toLowerCase() : '.jpg';
      const filename = `mafhh_${p.id}_img_${imgIdx + 1}${cleanExt}`;
      const destPath = path.join(imagesDir, filename);

      const relPath = `images/${filename}`;
      if (!fs.existsSync(destPath)) {
        await downloadImage(imgUrl, destPath);
      }
      localImages.push(relPath);
    }

    // Check Variations on single page if variable product
    let variationsByPrice = [];
    const options = [];

    if (p.type === 'variable' && permalink) {
      const pageHtml = await fetchHtml(permalink);
      const vMatch = pageHtml.match(/data-product_variations="([^"]+)"/);

      if (vMatch) {
        try {
          const unescaped = vMatch[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#8211;/g, '-');
          const pageVars = JSON.parse(unescaped);

          pageVars.forEach((pv, vIdx) => {
            const vSale = pv.display_price || rawSalePrice;
            const vReg = pv.display_regular_price || rawRegularPrice;
            const vHasDiscount = vReg > vSale && vSale > 0;
            const vDiscPercent = vHasDiscount ? Math.round(((vReg - vSale) / vReg) * 100) : 0;

            const attrValues = Object.values(pv.attributes || {});
            const variantTitle = attrValues.length > 0 ? attrValues.join(' / ') : `Variant ${vIdx + 1}`;

            variationsByPrice.push({
              variant_id: pv.variation_id,
              sku: pv.sku || `${p.id}_VAR_${pv.variation_id}`,
              title: variantTitle,
              price: `Rs. ${vSale.toLocaleString()}`,
              raw_price: vSale,
              compare_at_price: `Rs. ${vReg.toLocaleString()}`,
              raw_compare_at_price: vReg,
              available: pv.is_in_stock ?? true,
              option1: attrValues[0] || null,
              option2: attrValues[1] || null,
              option3: attrValues[2] || null,
              discount_type: vDiscPercent > 0 ? 'percent' : null,
              discount_value: vDiscPercent > 0 ? vDiscPercent : null
            });
          });
        } catch(e) {
          console.error(`Error parsing variations for ${p.id}:`, e.message);
        }
      }
    }

    // If no variations or simple product, create standard single variation
    if (variationsByPrice.length === 0) {
      variationsByPrice.push({
        variant_id: p.id,
        sku: p.sku || `MAFHH_${p.id}`,
        title: "Standard",
        price: `Rs. ${rawSalePrice.toLocaleString()}`,
        raw_price: rawSalePrice,
        compare_at_price: `Rs. ${rawRegularPrice.toLocaleString()}`,
        raw_compare_at_price: rawRegularPrice,
        available: p.is_in_stock ?? true,
        option1: "Standard",
        option2: null,
        option3: null,
        discount_type: discountPercentage > 0 ? 'percent' : null,
        discount_value: discountPercentage > 0 ? discountPercentage : null
      });
    }

    // Extract attributes for options array
    if (Array.isArray(p.attributes)) {
      p.attributes.forEach(attr => {
        options.push({
          name: attr.name,
          values: (attr.terms || []).map(t => t.name)
        });
      });
    }

    finalProducts.push({
      id: p.id,
      title: title,
      handle: handle,
      product_url: permalink,
      price: `Rs. ${rawSalePrice.toLocaleString()}`,
      raw_price: rawSalePrice,
      compare_at_price: `Rs. ${rawRegularPrice.toLocaleString()}`,
      raw_compare_at_price: rawRegularPrice,
      discount_percentage: discountPercentage,
      brand: "Mafhh Trader",
      category: mainCategory,
      categories_list: categories,
      description: plainDescription,
      description_html: descriptionHtml,
      short_description_html: shortDescriptionHtml,
      images_url: imagesUrl,
      local_images: localImages,
      options: options,
      variations_by_price: variationsByPrice
    });
  }

  const outputPath = path.join(__dirname, 'mafhh_trader_products.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalProducts, null, 2), 'utf8');
  console.log(`\n🎉 Successfully saved all ${finalProducts.length} products to ${outputPath}`);
}

scrapeMafhh().catch(console.error);
