import { GoogleGenAI } from '@google/genai';
import Product from '../models/product.model.js';
import Brand from '../models/brand.model.js';
import Category from '../models/category.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Gemini client
const aiKey = process.env.GEMINI_API_KEY;
const ai = aiKey ? new GoogleGenAI({ apiKey: aiKey }) : null;

const getProductContext = async () => {
    try {
        const products = await Product.findAll({
            where: { status: 'active' },
            include: [
                { model: Brand, as: 'brand', attributes: ['name'] },
                { model: Category, as: 'categories', attributes: ['name'] }
            ],
            attributes: ['name', 'slug', 'price', 'description'],
        });

        // Format into a compact string
        let contextText = 'DANH SÁCH SẢN PHẨM HIỆN CÓ TẠI CHRONOS-WATCH:\n';

        products.forEach(p => {
            const tempDiv = p.description ? p.description.replace(/<[^>]+>/g, '').substring(0, 50) : '';
            const brandName = p.brand ? p.brand.name : 'Unknown';
            const categories = p.categories && p.categories.length > 0 ? p.categories.map(c => c.name).join(', ') : 'Unknown';
            // Price format: VND
            const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price);

            contextText += `- Tên: ${p.name}\n`;
            contextText += `  Thương hiệu: ${brandName} | Danh mục: ${categories}\n`;
            contextText += `  Giá: ${priceFormatted}\n`;
            contextText += `  Link: /products/${p.slug}\n`;
            contextText += `  Mô tả: ${tempDiv}...\n\n`;
        });

        return contextText;
    } catch (error) {
        console.error("Error fetching product context:", error);
        return "Hiện tại không lấy được danh sách sản phẩm.";
    }
};

const generateChatResponse = async (userMessage, history = []) => {
    if (!ai) {
        throw new Error('Gemini API is not configured on the server. Missing GEMINI_API_KEY.');
    }

    try {
        const productContext = await getProductContext();

        const systemInstruction = `
Bạn là "Chronos AI", một trợ lý ảo tư vấn đồng hồ cao cấp của cửa hàng "Chronos-Watch". 
Mục tiêu: Giúp khách hàng tìm kiếm, so sánh và chọn mua đồng hồ phù hợp DỰA TRÊN TỪNG sản phẩm có sẵn tại cửa hàng.

QUY TẮC BẮT BUỘC (NẾU VI PHẠM SẼ GÂY LỖI NGHIÊM TRỌNG):
1. Bạn CHỈ ĐƯỢC TƯ VẤN VÀ GỢI Ý các sản phẩm nằm trong "DANH SÁCH SẢN PHẨM HIỆN CÓ" bên dưới.
2. KHÔNG TỰ BỊA RA TÊN ĐỒNG HỒ KHÔNG CÓ TRONG DANH SÁCH. Nếu khách tìm mẫu không có, hãy xin lỗi và gợi ý mẫu GẦN GIỐNG NHẤT có trong danh sách.
3. Khi nhắc đến tên một sản phẩm, LUÔN ĐƯA KÈM ĐƯỜNG LINK theo đúng cú pháp Markdown chuẩn xác: [Tên sản phẩm](Link) (ví dụ: [Đồng hồ Olym Pianus OP990](/products/dong-ho-olym-pianus-op990-163amk-t)).
4. Văn phong: Sang trọng, lịch sự, chuyên nghiệp. Xưng "tôi" và gọi khách là "Quý khách". 
5. Cố gắng trả lời súc tích, chia gạch đầu dòng rõ ràng để dễ đọc.

---
${productContext}
---`;

        // Map frontend history format to Gemini GenAI SDK format
        // GenAI SDK expects { role: 'user' | 'model', parts: [{ text: '...' }] }
        const formattedHistory = (history || []).map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                ...formattedHistory,
                // Append the current message
                { role: 'user', parts: [{ text: userMessage }] }
            ],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.2, // Low temp for more deterministic, less hallucination
            }
        });

        return response.text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
};

export default {
    generateChatResponse
};
