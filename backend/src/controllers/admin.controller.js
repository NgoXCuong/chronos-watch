import adminService from "../services/admin.service.js";

const adminController = {
    getDashboard: async (req, res) => {
        try {
            const stats = await adminService.getDashboardStats();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await adminService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAllOrders: async (req, res) => {
        try {
            const orders = await adminService.getAllOrders();
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getOrderDetail: async (req, res) => {
        try {
            const { id } = req.params;
            const order = await adminService.getOrderDetail(id);
            res.json(order);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getNotifications: async (req, res) => {
        try {
            const notifications = await adminService.getNotifications();
            res.json(notifications);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAllReviews: async (req, res) => {
        try {
            const reviews = await adminService.getAllReviews();
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateReviewStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { is_active } = req.body;
            const review = await adminService.updateReviewStatus(id, is_active);
            res.json(review);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    replyToReview: async (req, res) => {
        try {
            const { id } = req.params;
            const { reply } = req.body;
            const review = await adminService.replyToReview(id, reply);
            res.json(review);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getRevenueStats: async (req, res) => {
        try {
            const { start_date, end_date } = req.query;
            const data = await adminService.getRevenueStats(start_date, end_date);
            res.json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateUserStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const user = await adminService.updateUserStatus(id, status);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateUserRole: async (req, res) => {
        try {
            const { id } = req.params;
            const { role } = req.body;
            const user = await adminService.updateUserRole(id, role);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

export default adminController;
