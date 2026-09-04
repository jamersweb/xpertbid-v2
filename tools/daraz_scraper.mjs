import { spawn } from 'node:child_process';
import fs from 'node:fs';

const targetUrl = process.argv[2];

if (!targetUrl) {
    console.error(JSON.stringify({ error: 'Missing target URL argument' }));
    process.exit(1);
}

const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

const chromePath = chromePaths.find((p) => fs.existsSync(p));

if (!chromePath) {
    console.error(JSON.stringify({ error: 'Chrome/Edge binary not found' }));
    process.exit(1);
}

const port = 9222 + Math.floor(Math.random() * 500);

const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    `--remote-debugging-port=${port}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--lang=en-US',
    'about:blank'
], { stdio: 'ignore' });

async function getWsUrl(port, retries = 25) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(`http://127.0.0.1:${port}/json/version`);
            if (res.ok) {
                const data = await res.json();
                return data.webSocketDebuggerUrl;
            }
        } catch (e) {}
        await new Promise((r) => setTimeout(r, 200));
    }
    throw new Error('Failed to connect to Chrome remote debugger');
}

async function run() {
    try {
        const wsUrl = await getWsUrl(port);
        const ws = new WebSocket(wsUrl);

        let msgId = 1;
        const pending = new Map();

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.id && pending.has(msg.id)) {
                const { resolve, reject } = pending.get(msg.id);
                pending.delete(msg.id);
                if (msg.error) reject(msg.error);
                else resolve(msg.result);
            }
        };

        await new Promise((resolve) => ws.onopen = resolve);

        function send(method, params = {}) {
            return new Promise((resolve, reject) => {
                const id = msgId++;
                pending.set(id, { resolve, reject });
                ws.send(JSON.stringify({ id, method, params }));
            });
        }

        const { targetId } = await send('Target.createTarget', { url: targetUrl });
        const pageWsUrl = `ws://127.0.0.1:${port}/devtools/page/${targetId}`;
        const pageWs = new WebSocket(pageWsUrl);

        let pageMsgId = 1;
        const pagePending = new Map();

        pageWs.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.id && pagePending.has(msg.id)) {
                const { resolve, reject } = pagePending.get(msg.id);
                pagePending.delete(msg.id);
                if (msg.error) reject(msg.error);
                else resolve(msg.result);
            }
        };

        await new Promise((resolve) => pageWs.onopen = resolve);

        function sendPage(method, params = {}) {
            return new Promise((resolve, reject) => {
                const id = pageMsgId++;
                pagePending.set(id, { resolve, reject });
                pageWs.send(JSON.stringify({ id, method, params }));
            });
        }

        await sendPage('Page.enable');
        await sendPage('Runtime.enable');

        // Wait 6 seconds for page to completely stabilize and hydrate
        await new Promise((r) => setTimeout(r, 6000));

        const extractScript = `
        (() => {
            const cleanNumber = (str) => {
                if (!str) return null;
                const m = String(str).replace(/,/g, '').match(/(\\d+(?:\\.\\d+)?)/);
                return m ? m[1] : null;
            };

            const getPriceBySelector = (selectors) => {
                for (const sel of selectors) {
                    const el = document.querySelector(sel);
                    if (el && el.innerText) {
                        const val = cleanNumber(el.innerText);
                        if (val) return val;
                    }
                }
                return null;
            };

            const salePrice = getPriceBySelector([
                '.pdp-price_type_normal',
                '.pdp-price_color_orange',
                '.pdp-product-price',
                '.notranslate.pdp-price',
                '[class*="pdp-price_type_normal"]',
                '[class*="pdp-price_color_orange"]'
            ]);

            const originalPrice = getPriceBySelector([
                '.pdp-price_type_deleted',
                '.pdp-price_color_lightgray',
                '[class*="pdp-price_type_deleted"]'
            ]);

            // Title
            const titleNode = document.querySelector('.pdp-mod-product-badge-title') 
                || document.querySelector('h1.pdp-mod-product-badge-title')
                || document.querySelector('h1')
                || document.querySelector('title');
            let title = titleNode?.innerText?.trim() || document.title || '';
            title = title.replace(/\\s+/g, ' ').trim();

            // Images
            const images = [];
            const imgNodes = document.querySelectorAll('.item-gallery__thumbnail-image, .pdp-mod-common-image, .gallery-preview-panel__image, .pdp-block__gallery img');
            imgNodes.forEach(img => {
                let src = img.getAttribute('src') || img.getAttribute('data-src') || '';
                if (src) {
                    if (src.startsWith('//')) src = 'https:' + src;
                    src = src.replace(/_\\d+x\\d+[^.]*\\./, '_720x720q80.');
                    if (!images.includes(src)) images.push(src);
                }
            });

            let moduleData = window.__moduleData__?.data?.root?.fields || null;
            if (images.length === 0 && moduleData?.skuGalleries) {
                Object.values(moduleData.skuGalleries).forEach(gallery => {
                    if (Array.isArray(gallery)) {
                        gallery.forEach(item => {
                            let src = item.src || item.path || '';
                            if (src) {
                                if (src.startsWith('//')) src = 'https:' + src;
                                if (!images.includes(src)) images.push(src);
                            }
                        });
                    }
                });
            }

            // Description
            const descNode = document.querySelector('.pdp-product-desc') 
                || document.querySelector('.pdp-mod-specification')
                || document.querySelector('#module_product_detail');
            let description = descNode?.innerText?.trim() || moduleData?.product?.desc || '';
            description = description.replace(/\\r\\n|\\r/g, '\\n').trim();

            // Variations
            const skus = moduleData?.productOption?.skuBase?.skus || [];
            const properties = moduleData?.productOption?.skuBase?.properties || [];
            const propertyValuesById = {};
            properties.forEach(prop => {
                (prop.values || []).forEach(val => {
                    propertyValuesById[String(val.vid)] = val.name || val.text || '';
                });
            });

            const finalPrice = salePrice || originalPrice || '';
            const variations = [];
            if (skus.length > 0) {
                skus.forEach(sku => {
                    const propPath = String(sku.propPath || '');
                    const names = [];
                    propPath.split(';').forEach(pair => {
                        const parts = pair.split(':');
                        if (parts[1] && propertyValuesById[parts[1]]) {
                            names.push(propertyValuesById[parts[1]]);
                        }
                    });
                    const varName = names.length > 0 ? names.join(' / ') : (sku.skuName || 'Variation');
                    variations.push({
                        name: varName,
                        price: finalPrice,
                        discount_type: '',
                        discount_value: ''
                    });
                });
            }

            return {
                title,
                price: finalPrice,
                original_price: originalPrice || '',
                description,
                images,
                variations
            };
        })()
        `;

        let evalResult = null;
        for (let i = 0; i < 4; i++) {
            try {
                evalResult = await sendPage('Runtime.evaluate', {
                    expression: extractScript,
                    returnByValue: true
                });
                if (evalResult?.result?.value?.price) break;
            } catch (e) {}
            await new Promise((r) => setTimeout(r, 1000));
        }

        const result = evalResult?.result?.value;
        console.log(JSON.stringify(result));

        pageWs.close();
        ws.close();
    } catch (e) {
        console.error(JSON.stringify({ error: e.message }));
    } finally {
        chrome.kill();
    }
}

run();
