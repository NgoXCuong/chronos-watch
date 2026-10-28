import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import OrderDetail from "../models/order_detail.model.js";
import OrderHistory from "../models/order_history.model.js";
import dashboardService from "./admin-dashboard.service.js";
import adminReviewService from "./admin-review.service.js";
import adminUserService from "./admin-user.service.js";
import { Op } from "sequelize";
import AppError from "../utils/AppError.js";

// Cột đơn hàng được phép sort từ bảng admin (whitelist chống SQL injection qua ORDER BY)
const SORTABLE_ORDER_COLUMNS = [
    'id',
    'order_code',
    'full_name',
    'phone_number',
    'total_amount',
    'status',
    'payment_method',
    'created_at'
];

const buildOrderSort = (sort, dir) => {
    const key = SORTABLE_ORDER_COLUMNS.includes(sort) ? sort : 'created_at';
    const direction = String(dir).toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    return [[key, direction]];
};

const adminService = {
    ...dashboardService,
    ...adminReviewService,
    ...adminUserService,

    getAllOrders: async (query = {}) => {
        const { search, status } = query;
        const where = {};
        if (search) {
            const like = { [Op.like]: `%${search}%` };
            // Ô tìm kiếm hứa "mã đơn, khách hàng, email" → tìm trên cả bản ghi đơn lẫn user
            where[Op.or] = [
                { id: like },
                { order_code: like },
                { full_name: like },
                { phone_number: like },
                { '$user.username$': like },
                { '$user.email$': like }
            ];
        }
        if (status) {
            where.status = status;
        }

        const page = Math.max(1, parseInt(query.page, 10) || 1);
        const limit = Math.max(1, parseInt(query.limit, 10) || 10);
        const offset = Math.max(0, (page - 1) * limit);

        return await Order.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username', 'email']
                }
            ],
            order: buildOrderSort(query.sort, query.dir),
            limit,
            offset
        });
    },

    getOrderDetail: async (orderId) => {
        const order = await Order.findByPk(orderId, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username', 'email']
                },
                {
                    model: OrderDetail,
                    as: 'details',
                    include: [{ model: Product, as: 'product', attributes: ['name', 'image_url'] }]
                },
                { model: OrderHistory, as: 'history' }
            ]
        });
        if (!order) throw new AppError(404, 'Đơn hàng không tồn tại');
        return order;
    }
};

export default adminService;
