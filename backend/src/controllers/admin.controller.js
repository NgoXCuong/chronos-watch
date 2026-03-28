import adminService from "../services/admin.service.js";

const adminController = {
    getDashboard: async (req, res) => {
        try {
            const stats = await adminService.getDashboardStats();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

export default adminController;
