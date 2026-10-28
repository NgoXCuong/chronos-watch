import { Op } from "sequelize";
import sequelize from "../config/db.js";
import Brand from "../models/brand.model.js";
import AppError from "../utils/AppError.js";
import { parseBulkIds, runBulk } from "../utils/bulkOps.js";

// Cột sort được phép (Rule 3: sort server-side, whitelist chống chèn ORDER BY)
// product_count là alias của subquery trong SELECT — MySQL cho phép ORDER BY alias.
const SORTABLE_BRAND_COLUMNS = ['name', 'country', 'created_at', 'product_count'];

const buildBrandSort = (sort, dir) => {
    const key = SORTABLE_BRAND_COLUMNS.includes(sort) ? sort : 'name';
    const direction = String(dir).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    return [[key, direction]];
};

const brandService = {
    getAll: async (query = {}) => {
        const { search, all } = query;
        const where = {};
        // Mặc định chỉ hàng đang bật; trang admin gửi all=true để thấy cả thương hiệu ẩn
        if (!all) where.is_active = true;
        if (query.is_active === 'true' || query.is_active === 'false') {
            where.is_active = query.is_active === 'true';
        }
        if (search) {
            const like = { [Op.like]: `%${search}%` };
            where[Op.or] = [{ name: like }, { slug: like }, { country: like }];
        }

        const page = Math.max(1, parseInt(query.page, 10) || 1);
        const limit = Math.max(1, parseInt(query.limit, 10) || 10);
        const offset = Math.max(0, (page - 1) * limit);

        return await Brand.findAndCountAll({ 
            where,
            limit,
            offset,
            order: buildBrandSort(query.sort, query.dir),
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM products AS p
                            WHERE p.brand_id = Brand.id
                        )`),
                        'product_count'
                    ]
                ]
            }
        });
    },

    getDetail: async (id_or_slug) => {
        const where = isNaN(id_or_slug) ? { slug: id_or_slug } : { id: id_or_slug };
        const brand = await Brand.findOne({ where });
        if (!brand) throw new AppError(404, "Thương hiệu không tồn tại");
        return brand;
    },

    create: async (data) => {
        return await Brand.create(data);
    },

    update: async (id, data) => {
        const brand = await Brand.findByPk(id);
        if (!brand) throw new AppError(404, "Thương hiệu không tồn tại");
        return await brand.update(data);
    },

    delete: async (id) => {
        const brand = await Brand.findByPk(id);
        if (!brand) throw new AppError(404, "Thương hiệu không tồn tại");
        await brand.destroy();
        return true;
    },

    // Xóa nhiều: gọi lại delete() từng id để lỗi ràng buộc (còn sản phẩm thuộc thương hiệu)
    // được báo riêng cho từng dòng thay vì fail cả loạt
    bulkDelete: async (ids) => runBulk(parseBulkIds(ids), (id) => brandService.delete(id)),

    toggleStatus: async (id) => {
        const brand = await Brand.findByPk(id);
        if (!brand) throw new AppError(404, "Thương hiệu không tồn tại");
        brand.is_active = !brand.is_active;
        await brand.save();
        return brand;
    },

    // Bật/ẩn hàng loạt: ĐẶT giá trị (không đảo) để một lần chọn nhiều cho kết quả dự đoán được
    bulkSetVisibility: async (ids, is_active) => {
        const list = parseBulkIds(ids);
        const [updated] = await Brand.update(
            { is_active: Boolean(is_active) },
            { where: { id: { [Op.in]: list } } }
        );
        return { updated, is_active: Boolean(is_active), requested: list.length };
    }
};

export default brandService;
