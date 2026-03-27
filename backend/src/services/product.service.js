import Product from "../models/product.model.js";
import Brand from "../models/brand.model.js";
import Category from "../models/category.model.js";
import { Op } from "sequelize";

const productService = {
    getAll: async (filters = {}) => {
        const { category_id, brand_id, search, sort, limit = 10, page = 1, min_price, max_price, ...rest } = filters;
        const offset = (page - 1) * limit;

        const where = { status: 'active' };
        if (brand_id) where.brand_id = brand_id;
        if (search) {
            where.name = { [Op.like]: `%${search}%` };
        }

        // Lọc theo giá
        if (min_price || max_price) {
            where.price = {};
            if (min_price) where.price[Op.gte] = min_price;
            if (max_price) where.price[Op.lte] = max_price;
        }

        // Lọc theo thông số kỹ thuật (specifications)
        // Ví dụ: glass=Sapphire, movement=Automatic
        const specFilters = ['glass', 'movement', 'water_resistance', 'case_material'];
        specFilters.forEach(key => {
            if (rest[key]) {
                where[`specifications.${key}`] = rest[key];
            }
        });

        const include = [
            { model: Brand, as: 'brand', attributes: ['name', 'slug'] },
            { 
                model: Category, 
                as: 'categories', 
                attributes: ['id', 'name', 'slug'],
                where: category_id ? { id: category_id } : {},
                through: { attributes: [] }
            }
        ];

        let order = [['created_at', 'DESC']];
        if (sort === 'price_asc') order = [['price', 'ASC']];
        if (sort === 'price_desc') order = [['price', 'DESC']];
        if (sort === 'popular') order = [['views', 'DESC']];
        if (sort === 'oldest') order = [['created_at', 'ASC']];

        return await Product.findAndCountAll({
            where,
            include,
            order,
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true
        });
    },

    getDetail: async (id_or_slug) => {
        const where = isNaN(id_or_slug) ? { slug: id_or_slug } : { id: id_or_slug };
        const product = await Product.findOne({
            where,
            include: [
                { model: Brand, as: 'brand' },
                { model: Category, as: 'categories', through: { attributes: [] } }
            ]
        });
        if (!product) throw new Error("Sản phẩm không tồn tại");
        
        // Tăng lượt xem
        await product.increment('views');
        
        return product;
    },

    create: async (productData) => {
        const { category_ids, ...data } = productData;
        const product = await Product.create(data);

        if (category_ids && category_ids.length > 0) {
            await product.setCategories(category_ids);
        }

        return product;
    },

    update: async (id, productData) => {
        const { category_ids, ...data } = productData;
        const product = await Product.findByPk(id);
        if (!product) throw new Error("Sản phẩm không tồn tại");

        await product.update(data);

        if (category_ids) {
            await product.setCategories(category_ids);
        }

        return product;
    },

    delete: async (id) => {
        const product = await Product.findByPk(id);
        if (!product) throw new Error("Sản phẩm không tồn tại");
        await product.destroy();
        return true;
    }
};

export default productService;
