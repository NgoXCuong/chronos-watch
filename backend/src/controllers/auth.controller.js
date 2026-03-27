import authService from "../services/auth.service.js";
import formatSequelizeError from "../utils/errorHandler.js";

const authController = {
    register: async (req, res) => {
        try {
            const user = await authService.register(req.body);
            res.status(201).json({
                message: "Đăng ký thành công!",
                user: { id: user.id, username: user.username, email: user.email }
            });
        } catch (error) {
            res.status(400).json({ message: formatSequelizeError(error) });
        }
    },

    login: async (req, res) => {
        try {
            const { account, email, username, password } = req.body;
            const loginAccount = account || email || username;

            if (!loginAccount) {
                return res.status(400).json({ message: "Vui lòng nhập tài khoản (Email hoặc Username)" });
            }

            const result = await authService.login(loginAccount, password);
            res.json({
                message: "Đăng nhập thành công!",
                ...result
            });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    },

    logout: async (req, res) => {
        try {
            await authService.logout(req.user.id);
            res.json({ message: "Đăng xuất thành công!" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getProfile: async (req, res) => {
        try {
            const user = await authService.getProfile(req.user.id);
            res.json(user);
        } catch (error) {
            res.status(404).json({ message: formatSequelizeError(error) });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const updateData = { ...req.body };
            if (req.file) {
                updateData.avatar_url = req.file.path;
            }

            const user = await authService.updateProfile(req.user.id, updateData);
            res.json({
                message: "Cập nhật hồ sơ thành công!",
                user
            });
        } catch (error) {
            res.status(400).json({ message: formatSequelizeError(error) });
        }
    },

    changePassword: async (req, res) => {
        try {
            const { oldPassword, newPassword } = req.body;
            await authService.changePassword(req.user.id, oldPassword, newPassword);
            res.json({ message: "Đổi mật khẩu thành công!" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const token = await authService.forgotPassword(req.body.email);
            // Trong thực tế, bạn sẽ gửi email cho người dùng ở đây
            res.json({ message: "Link đặt lại mật khẩu đã được gửi qua email!", token });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { token, newPassword } = req.body;
            await authService.resetPassword(token, newPassword);
            res.json({ message: "Đặt lại mật khẩu thành công!" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

export default authController;
