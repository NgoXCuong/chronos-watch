import Brand from "../models/brand.model.js";

const brandService = {
    getAll: async () => {
        return await Brand.findAll({ where: { is_active: true } });
    },

    getDetail: async (id_or_slug) => {
        const where = isNaN(id_or_slug) ? { slug: id_or_slug } : { id: id_or_slug };
        const brand = await Brand.findOne({ where });
        if (!brand) throw new Error("Thương hiệu không tồn tại");
        return brand;
    },

    create: async (data) => {
        return await Brand.create(data);
    },

    update: async (id, data) => {
        const brand = await Brand.findByPk(id);
        if (!brand) throw new Error("Thương hiệu không tồn tại");
        return await brand.update(data);
    },

    delete: async (id) => {
        const brand = await Brand.findByPk(id);
        if (!brand) throw new Error("Thương hiệu không tồn tại");
        await brand.destroy();
        return true;
    },

    toggleStatus: async (id) => {
        const brand = await Brand.findByPk(id);
        if (!brand) throw new Error("Thương hiệu không tồn tại");
        brand.is_active = !brand.is_active;
        await brand.save();
        return brand;
    }
};

export default brandService;
