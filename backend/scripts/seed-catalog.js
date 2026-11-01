import { readFile, access } from 'node:fs/promises';
import { Op } from 'sequelize';
import sequelize from '../src/config/db.js';
import Product from '../src/models/product.model.js';
import Brand from '../src/models/brand.model.js';
import Category from '../src/models/category.model.js';
import { brands, categories } from '../seed-data/catalog-taxonomy.js';

const dryRun = process.argv.includes('--dry-run');
const products = (await Promise.all(['casio', 'seiko', 'tissot'].map(async brand =>
    JSON.parse(await readFile(new URL(`../seed-data/catalog-${brand}.json`, import.meta.url), 'utf8'))))).flat();
const requiredSpecs = ['movement', 'glass', 'water_resistance', 'case_material', 'case_size', 'strap_material', 'dial_color', 'functions'];

async function validate() {
    if (products.length !== 30 || new Set(products.map(product => product.sku)).size !== 30) {
        throw new Error('Bộ dữ liệu phải có đúng 30 mã sản phẩm khác nhau');
    }
    for (const product of products) {
        if (!requiredSpecs.every(key => product.specifications[key]) || product.price <= 0
            || !brands.some(brand => brand.name === product.brand)
            || !product.categories.every(slug => categories.some(category => category.slug === slug))) {
            throw new Error(`Dữ liệu không đầy đủ: ${product.sku}`);
        }
        await access(new URL(`../../frontend/public${product.image_url}`, import.meta.url));
    }
}

async function seed(transaction) {
    const summary = { productsCreated: 0, productsSkipped: 0, brandsCreated: 0, categoriesCreated: 0 };
    const brandIds = new Map();
    const categoryIds = new Map();
    for (const brand of brands) {
        let row = await Brand.findOne({ where: { [Op.or]: [{ slug: brand.slug }, { name: brand.name }] }, transaction });
        if (!row) {
            row = await Brand.create({ ...brand, is_active: true }, { transaction });
            summary.brandsCreated++;
        }
        brandIds.set(brand.name, row.id);
    }
    for (const category of categories) {
        let row = await Category.findOne({ where: { [Op.or]: [{ slug: category.slug }, { name: category.name }] }, transaction });
        if (!row) {
            row = await Category.create({ ...category, is_active: true }, { transaction });
            summary.categoriesCreated++;
        }
        categoryIds.set(category.slug, row.id);
    }
    for (const product of products) {
        const existing = await Product.findOne({ where: { [Op.or]: [{ sku: product.sku }, { slug: product.slug }] }, transaction });
        if (existing) {
            summary.productsSkipped++;
            continue; // Never overwrite stock, price or content of an existing product.
        }
        const { brand, categories: categorySlugs, source_url, source_image_url, ...data } = product;
        // Source URLs remain in the seed manifest and in the product description.
        void source_url;
        void source_image_url;
        const row = await Product.create({ ...data, brand_id: brandIds.get(brand), status: 'active' }, { transaction });
        await row.setCategories(categorySlugs.map(slug => categoryIds.get(slug)), { transaction });
        summary.productsCreated++;
    }
    return summary;
}

try {
    await validate();
    await sequelize.authenticate();
    const transaction = await sequelize.transaction();
    try {
        const summary = await seed(transaction);
        if (dryRun) await transaction.rollback();
        else await transaction.commit();
        console.log(JSON.stringify({ mode: dryRun ? 'dry-run (đã rollback)' : 'applied', ...summary }));
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
} catch (error) {
    console.error('Không nhập được catalog:', error.message);
    process.exitCode = 1;
} finally {
    await sequelize.close();
}
