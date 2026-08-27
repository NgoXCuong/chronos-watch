import { Op } from "sequelize";
import sequelize from "../config/db.js";
import Brand from "../models/brand.model.js";
import AppError from "../utils/AppError.js";

const brandService = {
    getAll: async (query = {}) => {
        const { search, all } = query;
        const where = {};
        if (!all) where.is_active = true;
        if (search) {
            where.name = { [Op.like]: `%${search}%` };
        }
        
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        return await Brand.findAndCountAll({ 
            where,
            limit,
            offset,
            order: [['name', 'ASC']],
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

    toggleStatus: async (id) => {
        const brand = await Brand.findByPk(id);
        if (!brand) throw new AppError(404, "Thương hiệu không tồn tại");
        brand.is_active = !brand.is_active;
        await brand.save();
        return brand;
    }
};

export default brandService;
