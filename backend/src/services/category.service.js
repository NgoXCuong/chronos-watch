import Category from "../models/category.model.js";

const categoryService = {
    getAll: async () => {
        // Trả về toàn bộ danh mục, có thể lồng nhau
        return await Category.findAll({ 
            where: { is_active: true, parent_id: null }, // Lấy danh mục gốc
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
        return await Category.create(data);
    },

    update: async (id, data) => {
        const category = await Category.findByPk(id);
        if (!category) throw new Error("Danh mục không tồn tại");
        return await category.update(data);
    },

    delete: async (id) => {
        const category = await Category.findByPk(id);
        if (!category) throw new Error("Danh mục không tồn tại");
        await category.destroy();
        return true;
    }
};

export default categoryService;
