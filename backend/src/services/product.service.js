import Product from "../models/product.model.js";
import Brand from "../models/brand.model.js";
import Category from "../models/category.model.js";
import { Op, fn, col, literal } from "sequelize";

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
            { 
                model: Brand, 
                as: 'brand', 
                attributes: ['name', 'slug'],
                required: false 
            },
            { 
                model: Category, 
                as: 'categories', 
                attributes: ['id', 'name', 'slug'],
                where: category_id ? { id: category_id } : {},
                through: { attributes: [] },
                required: category_id ? true : false 
            }
        ];

        let order = [['created_at', 'DESC']];
        if (sort === 'price_asc') order = [['price', 'ASC']];
        if (sort === 'price_desc') order = [['price', 'DESC']];
        if (sort === 'popular') order = [['views', 'DESC']];
        if (sort === 'oldest') order = [['created_at', 'ASC']];

        const attributes = {
            include: [
                [
                    literal(`(
                        SELECT COALESCE(AVG(rating), 0)
                        FROM reviews
                        WHERE reviews.product_id = Product.id
                        AND reviews.is_active = 1
                    )`),
                    'average_rating'
                ],
                [
                    literal(`(
                        SELECT COUNT(*)
                        FROM reviews
                        WHERE reviews.product_id = Product.id
                        AND reviews.is_active = 1
                    )`),
                    'review_count'
                ]
            ]
        };

        return await Product.findAndCountAll({
            attributes,
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
            attributes: {
                include: [
                    [
                        literal(`(
                            SELECT COALESCE(AVG(rating), 0)
                            FROM reviews
                            WHERE reviews.product_id = Product.id
                            AND reviews.is_active = 1
                        )`),
                        'average_rating'
                    ],
                    [
                        literal(`(
                            SELECT COUNT(*)
                            FROM reviews
                            WHERE reviews.product_id = Product.id
                            AND reviews.is_active = 1
                        )`),
                        'review_count'
                    ]
                ]
            },
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
        await product.update({ status: 'inactive' });
        return true;
    },

    getRelated: async (id_or_slug, limit = 4) => {
        const where = isNaN(id_or_slug) ? { slug: id_or_slug } : { id: id_or_slug };
        const product = await Product.findOne({ where });
        if (!product) throw new Error("Sản phẩm không tồn tại");

        return await Product.findAll({
            where: {
                status: 'active',
                id: { [Op.ne]: product.id },
                brand_id: product.brand_id
            },
            include: [
                { model: Brand, as: 'brand', attributes: ['name', 'slug'] }
            ],
            limit: parseInt(limit),
            order: [['views', 'DESC']]
        });
    }
};

export default productService;
