import { readFile, writeFile, mkdir } from 'node:fs/promises';

const publicRoot = new URL('../../frontend/public/', import.meta.url);
const products = (await Promise.all(['casio', 'seiko', 'tissot'].map(async brand =>
    JSON.parse(await readFile(new URL(`../seed-data/catalog-${brand}.json`, import.meta.url), 'utf8'))))).flat();
await mkdir(new URL('products/catalog/', publicRoot), { recursive: true });
let failed = false;
for (let offset = 0; offset < products.length; offset += 5) {
    await Promise.all(products.slice(offset, offset + 5).map(async product => {
        try {
            const response = await fetch(product.source_image_url, { signal: AbortSignal.timeout(25000) });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = Buffer.from(await response.arrayBuffer());
            if (!response.headers.get('content-type')?.startsWith('image/')
                || data.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
                throw new Error('Không phải ảnh PNG hợp lệ');
            }
            await writeFile(new URL(product.image_url.slice(1), publicRoot), data);
            console.log(`${product.sku}: OK (${Math.round(data.length / 1024)} KB)`);
        } catch (error) {
            failed = true;
            console.error(`${product.sku}: ${error.message}`);
        }
    }));
}
if (failed) process.exitCode = 1;
