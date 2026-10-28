import { Op } from "sequelize";
import Order from "../models/order.model.js";
import OrderDetail from "../models/order_detail.model.js";
import Product from "../models/product.model.js";
import UserAddress from "../models/user_address.model.js";

/**
 * Đơn của chính khách — danh sách phân trang server-side.
 * Tách khỏi order.service.js (đã 550 dòng) theo Rule 1; controller gọi thẳng ở đây.
 */

const ORDER_STATUSES = [
    "pending",
    "confirmed",
    "processing",
    "shipping",
    "delivered",
    "cancelled",
    "returned",
];

// Khóa `sort` là token logic, không phải tên cột, để UI không cần biết dir;
// mọi giá trị đều được đối chiếu ở đây trước khi vào `order:` (không nối thẳng input).
const SORTS = {
    newest: [["created_at", "DESC"], ["id", "DESC"]],
    oldest: [["created_at", "ASC"], ["id", "ASC"]],
    total_asc: [["total_amount", "ASC"], ["id", "ASC"]],
    total_desc: [["total_amount", "DESC"], ["id", "DESC"]],
    recent: [["updated_at", "DESC"], ["id", "DESC"]],
};

const buildSort = (sort) => SORTS[String(sort || "").toLowerCase()] || SORTS.newest;

const PAGE_SIZE_DEFAULT = 10;
const PAGE_SIZE_MAX = 50;

const LIST_INCLUDES = [
    { model: UserAddress, as: "shipping_address_ref" },
    {
        model: OrderDetail,
        as: "details",
        include: [
            { model: Product, as: "product", attributes: ["id", "slug", "name", "image_url", "status"] },
        ],
    },
];

/** id các đơn có sản phẩm tên khớp `search` — tìm qua bảng chi tiết rồi lọc lại theo id. */
const orderIdsByProductName = async (userId, like) => {
    const rows = await OrderDetail.findAll({
        attributes: ["order_id"],
        include: [
            {
                model: Order,
                as: "order",
                attributes: [],
                where: { user_id: userId },
            },
            {
                model: Product,
                as: "product",
                attributes: [],
                where: { name: { [Op.like]: like } },
                required: true,
            },
        ],
        raw: true,
    });
    return rows.map((row) => row.order_id);
};

const myOrdersService = {
    getMyOrders: async (userId, query = {}) => {
        const pageNum = parseInt(query.page, 10);
        const limitNum = parseInt(query.limit, 10);
        const page = isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
        const limit = isNaN(limitNum) || limitNum < 1
            ? PAGE_SIZE_DEFAULT
            : Math.min(limitNum, PAGE_SIZE_MAX);
        const offset = (page - 1) * limit;

        const where = { user_id: userId };
        // Trạng thái sai chỉ tạo ra trang rỗng vô nghĩa nên bỏ qua, không 400.
        if (ORDER_STATUSES.includes(query.status)) where.status = query.status;

        const search = String(query.search ?? "").trim();
        if (search) {
            const pattern = `%${search}%`;
            const like = { [Op.like]: pattern };
            const byProduct = await orderIdsByProductName(userId, pattern);
            where[Op.or] = [
                { order_code: like },
                { full_name: like },
                { phone_number: like },
                // Không có đơn nào khớp tên sản phẩm thì điều kiện này loại hẳn Op.or,
                // tránh `IN ()` rỗng làm rỗng cả danh sách.
                ...(byProduct.length ? [{ id: { [Op.in]: byProduct } }] : []),
            ];
        }

        const { count, rows } = await Order.findAndCountAll({
            where,
            include: LIST_INCLUDES,
            order: buildSort(query.sort),
            limit,
            offset,
            distinct: true,
        });

        return {
            count,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil(count / limit)),
            orders: rows,
        };
    },

};

export default myOrdersService;
export { ORDER_STATUSES, SORTS };
