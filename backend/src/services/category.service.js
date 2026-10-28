import sequelize from "../config/db.js";
import Category from "../models/category.model.js";
import ProductCategory from "../models/product_category.model.js";
import AppError from "../utils/AppError.js";

// "Thứ tự hiển thị" chỉ có nghĩa nếu mọi cấp đều được ORDER BY
const TREE_ORDER = [['sort_order', 'ASC'], ['name', 'ASC']];

// Đếm sản phẩm theo danh mục rồi gắn vào node: cây có <100 node nên đi 1 query GROUP BY
// (nhanh và an toàn hơn literal subquery trong self-include của Sequelize)
const attachCounts = (nodes, countMap) =>
    nodes.map((node) => {
        const children = attachCounts(node.children || [], countMap);
        const direct = countMap.get(Number(node.id)) || 0;
        return {
            ...node,
            children,
            child_count: children.length,
            product_count: direct,
            subtree_product_count: direct + children.reduce((sum, child) => sum + child.subtree_product_count, 0),
        };
    });

// Ngăn đặt vòng tròn: đi ngược từ cha mới lên gốc, gặp chính node là cycle
const isDescendantOf = async (startId, ancestorId) => {
    let cursor = startId;
    for (let depth = 0; depth < 20 && cursor; depth += 1) {
        if (Number(cursor) === Number(ancestorId)) return true;
        const node = await Category.findByPk(cursor, { attributes: ['parent_id'] });
        cursor = node?.parent_id ?? null;
    }
    return false;
};

const categoryService = {
    getAll: async (query = {}) => {
        // Trả về toàn bộ danh mục, có thể lồng nhau
        const where = { parent_id: null };
        if (!query.all) {
            where.is_active = true;
        }
        const roots = await Category.findAll({
            where, // Lấy danh mục gốc
            include: [{
                model: Category, as: 'children', order: TREE_ORDER,
                include: [{ model: Category, as: 'children', order: TREE_ORDER }]
            }], // Lồng tối đa 3 cấp
            order: TREE_ORDER
        });

        const rows = await ProductCategory.findAll({
            attributes: [[sequelize.fn('COUNT', sequelize.col('product_id')), 'product_count'], 'category_id'],
            group: ['category_id'],
            raw: true
        });
        const countMap = new Map(rows.map((row) => [Number(row.category_id), Number(row.product_count)]));

        return attachCounts(roots.map((row) => row.toJSON()), countMap);
    },

    getDetail: async (id_or_slug) => {
        const where = isNaN(id_or_slug) ? { slug: id_or_slug } : { id: id_or_slug };
        const category = await Category.findOne({ 
            where,
            include: ['children', 'parent']
        });
        if (!category) throw new AppError(404, "Danh mục không tồn tại");
        return category;
    },

    create: async (data) => {
        if (data.parent_id) {
            const parent = await Category.findByPk(data.parent_id);
            if (!parent) throw new AppError(400, "Danh mục cha không tồn tại");
        }
        return await Category.create(data);
    },

    update: async (id, data) => {
        const category = await Category.findByPk(id);
        if (!category) throw new AppError(404, "Danh mục không tồn tại");

        if (data.parent_id) {
            // params luôn là string nên phải so sánh bằng Number
            if (Number(data.parent_id) === Number(id)) throw new AppError(400, "Danh mục không thể làm cha của chính nó");
            const parent = await Category.findByPk(data.parent_id);
            if (!parent) throw new AppError(400, "Danh mục cha không tồn tại");
            if (await isDescendantOf(data.parent_id, id)) throw new AppError(400, "Không thể đặt danh mục con làm danh mục cha");
        }

        return await category.update(data);
    },

    delete: async (id) => {
        const category = await Category.findByPk(id);
        if (!category) throw new AppError(404, "Danh mục không tồn tại");
        await category.destroy();
        return true;
    },

    toggleStatus: async (id) => {
        const category = await Category.findByPk(id);
        if (!category) throw new AppError(404, "Danh mục không tồn tại");
        category.is_active = !category.is_active;
        await category.save();
        return category;
    }
};

export default categoryService;
