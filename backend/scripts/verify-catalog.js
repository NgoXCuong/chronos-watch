import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { Op } from 'sequelize';
import sequelize from '../src/config/db.js';
import Product from '../src/models/product.model.js';
import Brand from '../src/models/brand.model.js';
import Category from '../src/models/category.model.js';

try {
    const manifest = (await Promise.all(['casio', 'seiko', 'tissot'].map(async name =>
        JSON.parse(await readFile(new URL(`../seed-data/catalog-${name}.json`, import.meta.url), 'utf8'))))).flat();
    const products = await Product.findAll({
        where: { sku: { [Op.in]: manifest.map(product => product.sku) } },
        include: [{ model: Brand, as: 'brand' }, { model: Category, as: 'categories' }],
    });
    assert.equal(products.length, 30, 'Phải có đủ 30 sản phẩm mới');
    const byBrand = {};
    for (const product of products) {
        const expected = manifest.find(row => row.sku === product.sku);
        assert.equal(product.status, 'active');
        assert.equal(product.brand.name, expected.brand);
        assert.deepEqual(product.specifications, expected.specifications);
        assert.deepEqual(product.categories.map(row => row.slug).sort(), [...expected.categories].sort());
        assert.equal(product.image_url, expected.image_url);
        assert.equal(Number(product.price), expected.price);
        assert.equal(product.warranty_months, 24);
        assert.ok(product.description.includes(expected.source_url));
        await access(new URL(`../../frontend/public${product.image_url}`, import.meta.url));
        byBrand[product.brand.name] = (byBrand[product.brand.name] || 0) + 1;
    }
    console.log(JSON.stringify({ verified: products.length, byBrand, totals: {
        products: await Product.count(), brands: await Brand.count(), categories: await Category.count(),
    } }));
} catch (error) {
    console.error('Catalog chưa hợp lệ:', error.message);
    process.exitCode = 1;
} finally {
    await sequelize.close();
}
