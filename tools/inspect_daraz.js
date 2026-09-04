import { spawn } from 'node:child_process';
import fs from 'node:fs';

const url = 'https://www.daraz.pk/products/new-arrival-2-pc-printed-summer-tracksuit-for-men-_-soft-and-comfortable-fabric-summer-tracksuit-for-men-_tracksuit-for-men_-premium-t-shirt-and-trouser-set-printed-summer-tracksuit-for-men_tracksuit-for-boys-multiple-colors-i948318028-s14025771684.html?';

const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

const chromePath = chromePaths.find((p) => fs.existsSync(p));

const port = 9222 + Math.floor(Math.random() * 500);

const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--lang=en-US',
    'about:blank'
], { stdio: 'ignore' });

async function getWsUrl(port, retries = 30) {
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

        const { targetId } = await send('Target.createTarget', { url });
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

        await new Promise((r) => setTimeout(r, 6000));

        const extractScript = `
        (() => {
            const getPrice = (sel) => document.querySelector(sel)?.innerText;
            return {
                pdp_normal: getPrice('.pdp-price_type_normal'),
                pdp_deleted: getPrice('.pdp-price_type_deleted'),
                pdp_discount: getPrice('.pdp-product-price__discount'),
                price_nodes: Array.from(document.querySelectorAll('.pdp-price, .pdp-product-price, [class*="pdp-price"]')).map(el => ({
                    className: el.className,
                    text: el.innerText.trim()
                }))
            };
        })()
        `;

        const evalResult = await sendPage('Runtime.evaluate', {
            expression: extractScript,
            returnByValue: true
        });

        console.log('DOM Evaluation Result:', JSON.stringify(evalResult?.result?.value, null, 2));

        pageWs.close();
        ws.close();
    } catch (e) {
        console.error('Error:', e);
    } finally {
        chrome.kill();
    }
}

run();
