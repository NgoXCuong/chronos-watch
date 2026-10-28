import { Op } from 'sequelize';
import FlashSale from '../models/flash_sale.model.js';
import FlashSaleItem from '../models/flash_sale_item.model.js';
import Product from '../models/product.model.js';
import AppError from '../utils/AppError.js';
import { FLASH_SALE_STATUSES } from '../utils/flashSale.js';

// Tách khỏi admin-flash-sale.service.js để file admin ở dưới ngưỡng 300 dòng (Rule 1).
// Đây là phần "đại tu" của một đợt: validate lịch + nạp danh sách sản phẩm flash.

export const NAME_MAX = 120;
export const DESC_MAX = 2000;

const toInt = (value, fallback = 0) => {
    const n = Math.trunc(Number(value));
    return Number.isFinite(n) ? Math.max(0, n) : fallback;
};

// Ràng buộc lấy theo cột CSDL: name NOT NULL ≤120, start/end NOT NULL và start < end,
// status đúng ENUM active|inactive. PUT một phần chỉ validate field có gửi.
export const normalizeFlashSaleInput = (data = {}, { partial = false } = {}) => {
    const out = {};

    if (data.name !== undefined || !partial) {
        const name = String(data.name ?? '').trim();
        if (!name) throw new AppError(400, 'Tên đợt Flash Sale không được để trống.');
        if (name.length > NAME_MAX) throw new AppError(400, `Tên đợt tối đa ${NAME_MAX} ký tự.`);
        out.name = name;
    }
    if (data.description !== undefined) {
        const desc = String(data.description ?? '').trim();
        if (desc.length > DESC_MAX) throw new AppError(400, `Mô tả tối đa ${DESC_MAX} ký tự.`);
        out.description = desc || null;
    }
    if (data.start_date !== undefined || data.end_date !== undefined || !partial) {
        if (!data.start_date || !data.end_date) {
            throw new AppError(400, 'Đợt Flash Sale bắt buộc có mốc bắt đầu và kết thúc.');
        }
        const startTime = new Date(data.start_date).getTime();
        const endTime = new Date(data.end_date).getTime();
        if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) {
            throw new AppError(400, 'Mốc thời gian không hợp lệ (định dạng YYYY-MM-DDTHH:mm).');
        }
        if (startTime >= endTime) throw new AppError(400, 'Mốc bắt đầu phải trước mốc kết thúc.');
        out.start_date = new Date(startTime);
        out.end_date = new Date(endTime);
    }

    if (data.status !== undefined) {
        if (!FLASH_SALE_STATUSES.includes(data.status)) throw new AppError(400, 'Trạng thái đợt không hợp lệ.');
        out.status = data.status;
    }
    return out;
};

// Một sản phẩm chỉ tra được giá flash trong MỘT đợt đang chạy (getEffectivePrices
// lấy đợt có start sớm nhất), nên hai đợt cùng bật không được chồng lịch.
export const assertNoOverlap = async (start, end, status, selfId = null) => {
    if (status !== 'active') return;
    const where = {
        status: 'active',
        start_date: { [Op.lt]: end },
        end_date: { [Op.gt]: start },
    };
    if (selfId) where.id = { [Op.ne]: selfId };
    const clash = await FlashSale.findOne({ where, attributes: ['id', 'name'] });
    if (clash) {
        throw new AppError(400, `Lịch trùng với đợt "${clash.name}" (đang bật). Một sản phẩm chỉ nên thuộc một đợt Flash Sale tại một thời điểm.`);
    }
};

// Nạp danh sách sản phẩm theo product_id — KHÔNG replace-all: dòng đã bán phải giữ
// nguyên id (order_details đang tham chiếu) và sold_count đã lũy kế. Chỉ gỡ được
// dòng chưa bán ai, vì mất suất đã bán thì không hoàn lại cho khách nào được nữa.
export const syncFlashSaleItems = async (saleId, items, transaction) => {
    if (items === undefined || items === null) return;
    if (!Array.isArray(items)) throw new AppError(400, 'Danh sách sản phẩm flash không hợp lệ.');

    const existing = await FlashSaleItem.findAll({
        where: { flash_sale_id: saleId },
        include: [{ model: Product, as: 'product', attributes: ['id', 'name'] }],
        transaction,
    });
    const byProduct = new Map(existing.map((row) => [Number(row.product_id), row]));
    const seen = new Set();

    for (const raw of items) {
        const productId = toInt(raw?.product_id);
        if (!productId) throw new AppError(400, 'Thiếu sản phẩm trong dòng Flash Sale.');
        if (seen.has(productId)) throw new AppError(400, 'Sản phẩm bị lặp trong danh sách Flash Sale.');
        seen.add(productId);

        const product = await Product.findByPk(productId, { attributes: ['id', 'name', 'price', 'status'], transaction });
        if (!product) throw new AppError(400, `Không tìm thấy sản phẩm #${productId}.`);
        // Trang chủ lọc items theo product.status — đưa SP đang ngừng bán vào thì
        // admin thấy suất trong form nhưng khách không bao giờ thấy trên web.
        if (product.status !== 'active') {
            throw new AppError(400, `${product.name} đang Ngừng bán — mở bán lại rồi mới đưa vào Flash Sale.`);
        }

        const flashPrice = Math.round(Number(raw?.flash_price));
        if (!Number.isFinite(flashPrice) || flashPrice <= 0) {
            throw new AppError(400, `Giá Flash của ${product.name} phải lớn hơn 0.`);
        }
        if (flashPrice >= Number(product.price)) {
            throw new AppError(400, `Giá Flash của ${product.name} phải thấp hơn giá niêm yết (${Number(product.price)}đ).`);
        }

        const quota = toInt(raw?.quota);
        if (quota <= 0) throw new AppError(400, `Số suất Flash của ${product.name} phải lớn hơn 0.`);
        const perUser = [undefined, null, ''].includes(raw?.per_user_limit) ? 1 : toInt(raw.per_user_limit);

        const row = byProduct.get(productId);
        if (row) {
            if (quota < row.sold_count) {
                throw new AppError(400, `${product.name} đã bán ${row.sold_count} suất — số suất mới không được nhỏ hơn.`);
            }
            await row.update({ flash_price: flashPrice, quota, per_user_limit: perUser }, { transaction });
        } else {
            await FlashSaleItem.create({
                flash_sale_id: saleId,
                product_id: productId,
                flash_price: flashPrice,
                quota,
                per_user_limit: perUser,
            }, { transaction });
        }
    }

    for (const row of existing) {
        if (seen.has(Number(row.product_id))) continue;
        if (row.sold_count > 0) {
            throw new AppError(400, `Không gỡ được ${row.product?.name || `sản phẩm #${row.product_id}`}: đã bán ${row.sold_count} suất.`);
        }
        await row.destroy({ transaction });
    }
};
