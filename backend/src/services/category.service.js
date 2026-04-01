import Category from "../models/category.model.js";

const categoryService = {
    getAll: async (query = {}) => {
        // Trả về toàn bộ danh mục, có thể lồng nhau
        const where = { parent_id: null };
        if (!query.all) {
            where.is_active = true;
        }
        return await Category.findAll({ 
            where, // Lấy danh mục gốc
            include: [{ model: Category, as: 'children', include: ['children'] }] // Lồng tối đa 3 cấp
        });
    },

    getDetail: async (id_or_slug) => {
        const where = isNaN(id_or_slug) ? { slug: id_or_slug } : { id: id_or_slug };
        const category = await Category.findOne({ 
            where,
            include: ['children', 'parent']
        });
        if (!category) throw new Error("Danh mục không tồn tại");
        return category;
    },

    create: async (data) => {
        if (data.parent_id) {
            const parent = await Category.findByPk(data.parent_id);
            if (!parent) throw new Error("Danh mục cha không tồn tại");
        }
        return await Category.create(data);
    },

    update: async (id, data) => {
        const category = await Category.findByPk(id);
        if (!category) throw new Error("Danh mục không tồn tại");
        
        if (data.parent_id) {
            if (data.parent_id === id) throw new Error("Danh mục không thể làm cha của chính nó");
            const parent = await Category.findByPk(data.parent_id);
            if (!parent) throw new Error("Danh mục cha không tồn tại");
        }

        return await category.update(data);
    },

    delete: async (id) => {
        const category = await Category.findByPk(id);
        if (!category) throw new Error("Danh mục không tồn tại");
        await category.destroy();
        return true;
    },

    toggleStatus: async (id) => {
        const category = await Category.findByPk(id);
        if (!category) throw new Error("Danh mục không tồn tại");
        category.is_active = !category.is_active;
        await category.save();
        return category;
    }
};

export default categoryService;
