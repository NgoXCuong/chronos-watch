import { Op } from 'sequelize';
import Product from '../models/product.model.js';

// Resolve only catalog links explicitly mentioned by the assistant.
export async function getChatProducts(content) {
    const slugs = [...new Set([...content.matchAll(/\]\(\/products\/([^\s)]+)\)/g)]
        .map(match => match[1]))].slice(0, 8);
    if (!slugs.length) return [];
    const products = await Product.findAll({
        where: { status: 'active', slug: { [Op.in]: slugs } },
        attributes: ['id', 'name', 'slug', 'image_url', 'price'],
    });
    return slugs.flatMap(slug => products.filter(product => product.slug === slug));
}

export async function getFallbackResponse() {
    const products = await Product.findAll({
        where: { status: 'active' },
        attributes: ['name', 'slug'],
        order: [['sold_count', 'DESC'], ['id', 'ASC']],
        limit: 3,
    });
    if (!products.length) return 'Tư vấn AI đang tạm gián đoạn. Quý khách vui lòng thử lại sau.';
    return 'Tư vấn AI đang tạm gián đoạn. Quý khách có thể tham khảo một số mẫu tại cửa hàng:\n\n'
        + products.map(product => `- [${product.name}](/products/${product.slug})`).join('\n');
}
