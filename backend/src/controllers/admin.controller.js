import adminService from "../services/admin.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const adminController = {
    getDashboard: asyncHandler(async (req, res) => {
        const stats = await adminService.getDashboardStats();
        res.json(stats);
    }),

    getAllUsers: asyncHandler(async (req, res) => {
        const users = await adminService.getAllUsers(req.query);
        res.json(users);
    }),

    getAllOrders: asyncHandler(async (req, res) => {
        const orders = await adminService.getAllOrders(req.query);
        res.json(orders);
    }),

    getOrderDetail: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const order = await adminService.getOrderDetail(id);
        res.json(order);
    }),

    getNotifications: asyncHandler(async (req, res) => {
        const notifications = await adminService.getNotifications();
        res.json(notifications);
    }),

    getAllReviews: asyncHandler(async (req, res) => {
        const reviews = await adminService.getAllReviews();
        res.json(reviews);
    }),

    updateReviewStatus: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { is_active } = req.body;
        const review = await adminService.updateReviewStatus(id, is_active);
        res.json(review);
    }),

    replyToReview: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { reply } = req.body;
        const review = await adminService.replyToReview(id, reply);
        res.json(review);
    }),

    getRevenueStats: asyncHandler(async (req, res) => {
        const { start_date, end_date } = req.query;
        const data = await adminService.getRevenueStats(start_date, end_date);
        res.json(data);
    }),

    updateUserStatus: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        const user = await adminService.updateUserStatus(id, status);
        res.json(user);
    }),

    updateUserRole: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { role } = req.body;
        const user = await adminService.updateUserRole(id, role);
        res.json(user);
    })
};

export default adminController;
