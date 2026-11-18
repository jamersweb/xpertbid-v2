import fs from 'fs';
import path from 'path';
import esbuild from 'esbuild';

const srcPath = path.resolve('public/assets/css/style.css');
const destPath = path.resolve('public/assets/css/style.min.css');

if (fs.existsSync(srcPath)) {
    const src = fs.readFileSync(srcPath, 'utf8');
    const result = esbuild.transformSync(src, { loader: 'css', minify: true });
    fs.writeFileSync(destPath, result.code);
    console.log(`Minified ${srcPath} -> ${destPath} (${src.length} bytes -> ${result.code.length} bytes)`);
} else {
    console.warn(`Source CSS file not found: ${srcPath}`);
}

