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
    }
};

export default adminController;
