import Banner from "../models/banner.model.js";

const bannerService = {
    getAll: async (params = {}) => {
        const where = {};
        if (params.position) where.position = params.position;
        if (params.active !== undefined) where.is_active = params.active === 'true';
        
        return await Banner.findAll({
            where,
            order: [['sort_order', 'ASC'], ['id', 'DESC']]
        });
    },

    getById: async (id) => {
        const banner = await Banner.findByPk(id);
        if (!banner) throw new Error("Banner không tồn tại");
        return banner;
    },

    create: async (data) => {
        return await Banner.create(data);
    },

    update: async (id, data) => {
        const banner = await Banner.findByPk(id);
        if (!banner) throw new Error("Banner không tồn tại");
        return await banner.update(data);
    },

    delete: async (id) => {
        const banner = await Banner.findByPk(id);
        if (!banner) throw new Error("Banner không tồn tại");
        return await banner.destroy();
    },

    toggleStatus: async (id) => {
        const banner = await Banner.findByPk(id);
        if (!banner) throw new Error("Banner không tồn tại");
        banner.is_active = banner.is_active ? 0 : 1;
        await banner.save();
        return banner;
    }
};

export default bannerService;
