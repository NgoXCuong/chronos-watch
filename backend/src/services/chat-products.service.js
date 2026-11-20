import { Op } from 'sequelize';
import Product from '../models/product.model.js';

// Resolve only catalog links explicitly mentioned by the assistant.
export async function getChatProducts(content) {
    const slugs = [...new Set([...content.matchAll(/\]\(\/products\/([^\s)]+)\)/g)]
        .map(match => match[1]))].slice(0, 8);
    if (!slugs.length) return [];
    const products = await Product.findAll({
        where: { status: 'active', stock: { [Op.gt]: 0 }, slug: { [Op.in]: slugs } },
        attributes: ['id', 'name', 'slug', 'image_url', 'price', 'stock'],
    });
    return slugs.flatMap(slug => products.filter(product => product.slug === slug && Number(product.stock) > 0)).slice(0, 3);
}

export async function getFallbackResponse() {
    return 'Tư vấn AI đang tạm gián đoạn nên tôi chưa thể chọn mẫu phù hợp với yêu cầu của Quý khách. Quý khách vui lòng thử lại hoặc xem danh mục [đồng hồ đang bán](/products) và kiểm tra tình trạng còn hàng tại trang sản phẩm.';
}

// Kiểm tra lại SAU khi AI trả lời: sản phẩm có thể vừa hết hàng trong lúc chờ model.
// Thay cả đoạn tư vấn khi có link sai, tránh để tên/giá mẫu hết hàng trong lời dẫn.
export async function validateChatRecommendation(content) {
    const links = [...content.matchAll(/\]\(\/products\/([^\s)]+)\)/g)].map((match) => match[1]);
    const products = await getChatProducts(content);
    if (links.every((slug) => products.some((p) => p.slug === slug))) return { content, products };
    const text = 'Một số mẫu trong gợi ý không còn khả dụng tại thời điểm kiểm tra. '
        + (products.length ? 'Các mẫu còn hàng trong danh sách:\n\n' + products.map((p) => `- [${p.name}](/products/${p.slug})`).join('\n')
            : 'Tôi chưa xác nhận được mẫu còn hàng phù hợp. Quý khách muốn tìm theo ngân sách và thương hiệu nào để tôi kiểm tra lại?');
    return { content: text, products };
}
