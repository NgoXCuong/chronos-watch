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

    getUserStats: asyncHandler(async (req, res) => {
        res.json(await adminService.getUserStats());
    }),

    getUserDetail: asyncHandler(async (req, res) => {
        res.json(await adminService.getUserDetail(req.params.id));
    }),

    bulkUpdateUserStatus: asyncHandler(async (req, res) => {
        const result = await adminService.bulkUpdateStatus(req.body?.ids, req.body?.status, req.user);
        res.json({ ...result, message: `Đã cập nhật ${result.updated} tài khoản` });
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

    getAllReviews: asyncHandler(async (req, res) => {
        const reviews = await adminService.getAllReviews(req.query);
        res.json(reviews);
    }),

    getReviewStats: asyncHandler(async (req, res) => {
        const stats = await adminService.getReviewStats();
        res.json(stats);
    }),

    updateReviewStatus: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { is_active } = req.body;
        const review = await adminService.updateReviewStatus(id, is_active);
        res.json(review);
    }),

    replyToReview: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const review = await adminService.replyToReview(id, req.body?.reply);
        res.json(review);
    }),

    deleteReview: asyncHandler(async (req, res) => {
        await adminService.deleteReview(req.params.id);
        res.json({ message: "Xóa đánh giá thành công" });
    }),

    getRevenueStats: asyncHandler(async (req, res) => {
        const { start_date, end_date } = req.query;
        const data = await adminService.getRevenueStats(start_date, end_date);
        res.json(data);
    }),

    updateUserStatus: asyncHandler(async (req, res) => {
        const user = await adminService.updateUserStatus(req.params.id, req.body?.status, req.user);
        res.json(user);
    }),

    updateUserRole: asyncHandler(async (req, res) => {
        const user = await adminService.updateUserRole(req.params.id, req.body?.role, req.user);
        res.json(user);
    }),

    resetUserPassword: asyncHandler(async (req, res) => {
        const result = await adminService.resetUserPassword(req.params.id, req.body?.password, req.user);
        res.json({ ...result, message: `Đã đặt lại mật khẩu cho ${result.username}` });
    })
};

export default adminController;
