import Product from "../models/product.model.js";
import Brand from "../models/brand.model.js";
import Category from "../models/category.model.js";
import { Op, col, fn, Sequelize } from "sequelize";
import AppError from "../utils/AppError.js";
import { parseBulkIds } from "../utils/bulkOps.js";
import { SPEC_FILTER_KEYS, specFilterWhere, collectSpecFacets } from "../utils/specFilters.js";

// Cột được phép sort — không nối thẳng query param vào `order:` (SQL injection)
const SORTABLE_PRODUCT_COLUMNS = ['name', 'price', 'stock', 'status', 'sold_count', 'views', 'created_at'];

// Token sort cũ của trang client — giữ nguyên để không vỡ API hiện có
const LEGACY_SORTS = {
    price_asc: ['price', 'ASC'],
    price_desc: ['price', 'DESC'],
    popular: ['views', 'DESC'],
    newest: ['created_at', 'DESC'],
    oldest: ['created_at', 'ASC'],
    // "Giảm giá sâu nhất" — Flash SalePanel hứa link này nên phải có nghiệp vụ thật.
    // old_price NULL/0 hoặc giá đã bằng giá cũ → -1, bị đẩy xuống cuối.
    // Hướng DESC viết BÊN TRONG chuỗi literal: Sequelize.literal(val, dialect) chỉ nhận
    // 2 tham số, tham số thứ hai KHÔNG phải hướng sort (thiếu DESC là thành ASC).
    discount: [
        Sequelize.literal(
            "CASE WHEN old_price IS NOT NULL AND old_price > price THEN (old_price - price) / old_price ELSE -1 END DESC",
        ),
    ],
};

const buildProductSort = (sort, dir) => {
    if (LEGACY_SORTS[sort]) return [LEGACY_SORTS[sort]];
    const key = SORTABLE_PRODUCT_COLUMNS.includes(sort) ? sort : 'created_at';
    return [[key, String(dir).toLowerCase() === 'asc' ? 'ASC' : 'DESC']];
};

const listProducts = async (filters = {}, { includeInactive = false } = {}) => {
    const { category_id, brand_id, search, sort, dir, min_price, max_price, status, ...rest } = filters;
    const pageNum = parseInt(filters.page, 10);
    const limitNum = parseInt(filters.limit, 10);
    const page = isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
    const limit = isNaN(limitNum) || limitNum < 1 ? 10 : Math.min(limitNum, 50);
    const offset = Math.max(0, (page - 1) * limit);

    // Khách chỉ thấy hàng đang bán. Trang quản trị được lọc theo trạng thái,
    // mặc định lấy cả active lẫn inactive để còn mở bán lại.
    const where = includeInactive
        ? (['active', 'inactive'].includes(status) ? { status } : {})
        : { status: 'active' };

    // brand_id nhận một id hoặc danh sách `1,4` (bộ lọc thương hiệu chọn nhiều)
    const brandIds = String(brand_id ?? '').split(',').map((v) => v.trim()).filter(Boolean);
    if (brandIds.length > 1) where.brand_id = { [Op.in]: brandIds };
    else if (brandIds.length === 1) where.brand_id = brandIds[0];
    if (search) {
        const like = { [Op.like]: `%${search}%` };
        // Ô tìm kiếm của admin hứa tìm cả mã SKU
        where[Op.or] = [{ name: like }, { sku: like }];
    }

    // Lọc theo giá
    if (min_price || max_price) {
        where.price = {};
        if (min_price) where.price[Op.gte] = min_price;
        if (max_price) where.price[Op.lte] = max_price;
    }

    // Lọc theo thông số kỹ thuật. Data thật đang lưu key TIẾNG VIỆT ('Loại máy'),
    // còn bản cũ viết `where['specifications.movement']` — kiểu đó không khớp dòng
    // nào, nghĩa là bộ lọc thông số chưa từng hoạt động. Xem utils/specFilters.js.
    const specClauses = SPEC_FILTER_KEYS
        .map(({ key }) => specFilterWhere(key, rest[key]))
        .filter(Boolean);
    if (specClauses.length) where[Op.and] = specClauses;

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

    const order = buildProductSort(sort, dir);

    const attributes = {
        include: [
            [col('avg_rating'), 'average_rating']
        ]
    };

    return await Product.findAndCountAll({
        attributes,
        where,
        include,
        order,
        limit,
        offset,
        distinct: true
    });
};

const productService = {
    getAll: async (filters = {}) => listProducts(filters),
    // Trang quản trị cần thấy cả sản phẩm ngừng bán để mở bán lại.
    getAdminAll: async (filters = {}) => listProducts(filters, { includeInactive: true }),

    /**
     * Giá trị lọc thật đang có trong CSDL (kèm số sản phẩm), để UI trang /products chỉ
     * mời người mua chọn bộ lọc nào trả về kết quả. Đếm trên hàng đang bán, cùng tập
     * điều kiện với getAll.
     */
    getFacets: async () => {
        const rows = await Product.findAll({
            where: { status: 'active' },
            attributes: ['specifications'],
            raw: true,
        });
        // Khoảng giá thật để UI chia bậc lọc theo dữ liệu, không hardcode "50–200 triệu"
        // trong khi cả catalog chỉ có giá cao nhất 27 triệu (lọc sẽ luôn trả 0 kết quả).
        const price = await Product.findOne({
            attributes: [
                [fn('MIN', col('price')), 'min'],
                [fn('MAX', col('price')), 'max'],
            ],
            where: { status: 'active' },
            raw: true,
        });
        return {
            total: rows.length,
            specs: collectSpecFacets(rows),
            price: { min: Number(price?.min ?? 0), max: Number(price?.max ?? 0) },
        };
    },

    getDetail: async (id_or_slug, { includeInactive = false } = {}) => {
        const where = isNaN(id_or_slug) ? { slug: id_or_slug } : { id: id_or_slug };
        // Khách chỉ xem được sản phẩm đang bán. Admin xem để sửa thì lấy cả inactive.
        if (!includeInactive) where.status = 'active';

        const product = await Product.findOne({
            attributes: {
                include: [
                    [col('avg_rating'), 'average_rating']
                ]
            },
            where,
            include: [
                { model: Brand, as: 'brand' },
                { model: Category, as: 'categories', through: { attributes: [] } }
            ]
        });
        if (!product) throw new AppError(404, "Sản phẩm không tồn tại");

        // Chỉ lượt xem công khai mới được tính; admin mở form sửa không làm tăng views.
        if (!includeInactive) await product.increment('views');

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
        if (!product) throw new AppError(404, "Sản phẩm không tồn tại");

        await product.update(data);

        if (category_ids) {
            await product.setCategories(category_ids);
        }

        return product;
    },

    delete: async (id) => {
        const product = await Product.findByPk(id);
        if (!product) throw new AppError(404, "Sản phẩm không tồn tại");
        await product.update({ status: 'inactive' });
        return true;
    },

    // Sản phẩm không bao giờ xóa hẳn (đơn hàng cũ còn tham chiếu) → hàng loạt chỉ đổi trạng thái bán.
    // Một câu UPDATE cho cả danh sách, không vòng lặp từng id.
    bulkUpdateStatus: async (ids, status) => {
        const list = parseBulkIds(ids);
        if (!['active', 'inactive'].includes(status)) {
            throw new AppError(400, "Trạng thái sản phẩm không hợp lệ");
        }
        const [updated] = await Product.update({ status }, { where: { id: { [Op.in]: list } } });
        return { updated, status, requested: list.length };
    },

    getRelated: async (id_or_slug, limit = 4) => {
        const where = isNaN(id_or_slug) ? { slug: id_or_slug } : { id: id_or_slug };
        const product = await Product.findOne({ where });
        if (!product) throw new AppError(404, "Sản phẩm không tồn tại");

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
