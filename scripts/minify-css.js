import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import esbuild from 'esbuild';

const CONTENT_DIRS = [
    path.resolve('resources/views'),
    path.resolve('resources/js'),
    path.resolve('app/Support'),
];

const CONTENT_EXTS = /\.(blade\.php|php|js|jsx|ts|tsx)$/i;

// Dynamic / runtime-injected classes safelist (zero broken pages)
const SAFELIST_EXACT = new Set([
    'show', 'active', 'fade', 'collapse', 'collapsing', 'open', 'opened', 'closed',
    'disabled', 'selected', 'checked', 'hiding', 'visible', 'hidden',
    'is-active', 'is-open', 'is-rtl', 'is-compact', 'is-valid', 'is-invalid', 'was-validated',
    'row', 'container', 'container-fluid', 'clearfix', 'img-fluid', 'rounded-circle',
    'modal-open', 'modal-backdrop', 'locale-rtl', 'locale-ur',
    'qlwapp', 'qlwapp-toggle', 'gameon',
    'fa', 'fas', 'far', 'fab', 'fa-solid', 'fa-regular', 'fa-brands',
    'sr-only', 'visually-hidden', 'visually-hidden-focusable',
    'pagination', 'page-item', 'page-link',
    'btn', 'btn-close', 'badge', 'alert', 'table', 'card', 'card-body', 'toast',
    'shadow', 'shadow-sm', 'shadow-lg', 'shadow-none',
    'text-muted', 'text-danger', 'text-success', 'text-warning', 'text-primary', 'text-dark', 'text-white',
    'bg-white', 'bg-light', 'bg-dark', 'bg-danger', 'bg-success', 'bg-warning', 'bg-primary', 'bg-transparent',
    'app', 'mainNavbar', 'navbarSupportedContent', 'userProfileSettingPopup', 'SignupModal', 'LoginModal', 'qlwapp',
]);

const SAFELIST_PATTERNS = [
    /^swiper/,
    /^modal-(open|backdrop|dialog|content|header|body|footer|title|lg|sm|xl|dialog-centered|dialog-scrollable)$/,
    /^dropdown-(menu|item|toggle|divider|header|menu-end)$/,
    /^nav-(item|link|tabs|pills)$/,
    /^navbar-(brand|nav|collapse|toggler|toggler-icon|expand-lg|light)$/,
    /^btn-(primary|secondary|success|danger|warning|info|light|dark|link|close|sm|lg|outline-(primary|secondary|success|danger|warning|dark|light))$/,
    /^col(-(sm|md|lg|xl))?(-([1-9]|1[0-2]|auto))?$/,
    /^row$/,
    /^g[xy]?-[0-5]$/,
    /^d(-(sm|md|lg|xl))?-(none|block|inline|inline-block|flex|inline-flex|grid)$/,
    /^fa-/,
    /^alert(-(primary|secondary|success|danger|warning|info|light|dark|dismissible))?$/,
    /^badge$/,
    /^spinner-(border|grow)(-sm)?$/,
    /^toast/,
    /^ql-/,
    /^leaflet/,
    /^swal2/,
    /^xb-/,
    /^xp-/,
    /^content-visibility-auto$/,
    /^notification-toast--/,
    /^otp-input-/,
    /^forgot-phone-otp-input-/,
    /^dynamic-radio-/,
    /^variation-/,
    /^preview-variation-/,
    /^method-/,
    /^state-/,
    /^chip-/,
    /^doc-/,
    /^loc-/,
    /^alpha-/,
];

function isSafelisted(token) {
    if (SAFELIST_EXACT.has(token)) return true;
    for (const pattern of SAFELIST_PATTERNS) {
        if (pattern.test(token)) return true;
    }
    return false;
}

function collectUsedTokens() {
    const tokens = new Set();

    function walk(dir) {
        if (!fs.existsSync(dir)) return;
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath);
            } else if (CONTENT_EXTS.test(entry.name)) {
                const content = fs.readFileSync(fullPath, 'utf8');
                const matches = content.match(/[A-Za-z0-9_-]+/g);
                if (matches) {
                    for (const token of matches) {
                        tokens.add(token);
                    }
                }
            }
        }
    }

    for (const dir of CONTENT_DIRS) {
        walk(dir);
    }

    return tokens;
}

function isTokenUsed(token, usedTokens) {
    return usedTokens.has(token) || isSafelisted(token);
}

function isSelectorUsed(selectorNode, usedTokens) {
    let keep = true;

    function walkNodes(container) {
        if (!container.nodes) return;
        for (const node of container.nodes) {
            if (!keep) return;

            // Skip tokens inside :not(...), :where(...), :is(...) negation/optional wrappers safely
            if (node.type === 'pseudo') {
                const val = node.value.toLowerCase();
                if (val === ':not' || val === ':where' || val === ':has') {
                    continue;
                }
                walkNodes(node);
                continue;
            }

            if (node.type === 'class' || node.type === 'id') {
                if (!isTokenUsed(node.value, usedTokens)) {
                    keep = false;
                    return;
                }
            } else if (node.nodes) {
                walkNodes(node);
            }
        }
    }

    walkNodes(selectorNode);
    return keep;
}

function purgeCss(cssContent, usedTokens) {
    const root = postcss.parse(cssContent);

    root.walkRules((rule) => {
        // Keep rules inside @keyframes intact (0%, 50%, 100%, from, to)
        if (rule.parent && rule.parent.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) {
            return;
        }

        const survivingSelectors = [];
        try {
            selectorParser((selectors) => {
                selectors.each((selector) => {
                    if (isSelectorUsed(selector, usedTokens)) {
                        survivingSelectors.push(selector.toString().trim());
                    }
                });
            }).processSync(rule.selector);
        } catch {
            // If selector cannot be parsed cleanly, keep it conservatively
            return;
        }

        if (survivingSelectors.length === 0) {
            rule.remove();
        } else {
            rule.selector = survivingSelectors.join(',');
        }
    });

    // Remove empty @media / @supports / @layer blocks bottom-up
    let removedAny = true;
    while (removedAny) {
        removedAny = false;
        root.walkAtRules((atRule) => {
            if (/^(media|supports|layer)$/i.test(atRule.name)) {
                if (!atRule.nodes || atRule.nodes.length === 0) {
                    atRule.remove();
                    removedAny = true;
                }
            }
        });
    }

    return root.toString();
}

function formatSize(bytes) {
    return `${(bytes / 1024).toFixed(2)} KiB`;
}

function processStylesheet(srcRel, destRel, usedTokens) {
    const srcPath = path.resolve(srcRel);
    const destPath = path.resolve(destRel);

    if (!fs.existsSync(srcPath)) {
        console.warn(`Source CSS file not found: ${srcPath}`);
        return;
    }

    const rawSrc = fs.readFileSync(srcPath, 'utf8');
    const rawMinified = esbuild.transformSync(rawSrc, { loader: 'css', minify: true }).code;
    const beforeRaw = Buffer.byteLength(rawMinified, 'utf8');
    const beforeGzip = zlib.gzipSync(rawMinified).length;

    const purged = purgeCss(rawSrc, usedTokens);
    const finalMinified = esbuild.transformSync(purged, { loader: 'css', minify: true }).code;
    const afterRaw = Buffer.byteLength(finalMinified, 'utf8');
    const afterGzip = zlib.gzipSync(finalMinified).length;

    fs.writeFileSync(destPath, finalMinified);

    const savedPct = (((beforeGzip - afterGzip) / beforeGzip) * 100).toFixed(1);
    console.log(
        `[CSS Purge+Minify] ${srcRel} -> ${destRel}\n` +
        `  Raw:  ${formatSize(beforeRaw)} -> ${formatSize(afterRaw)}\n` +
        `  Gzip: ${formatSize(beforeGzip)} -> ${formatSize(afterGzip)} (-${savedPct}%)`
    );
}

const usedTokens = collectUsedTokens();
console.log(`[CSS Purge] Scanned ${usedTokens.size} unique tokens across views, React components, and helpers.`);

processStylesheet('public/assets/css/bootstrap.min.css', 'public/assets/css/bootstrap.purged.min.css', usedTokens);
processStylesheet('public/assets/css/style.css', 'public/assets/css/style.min.css', usedTokens);
