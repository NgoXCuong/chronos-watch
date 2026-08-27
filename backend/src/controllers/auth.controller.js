import authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const authController = {
    register: asyncHandler(async (req, res) => {
        const user = await authService.register(req.body);
        res.status(201).json({
            message: "Đăng ký thành công!",
            user: { id: user.id, username: user.username, email: user.email }
        });
    }),

    login: asyncHandler(async (req, res) => {
        const { account, email, username, password } = req.body;
        const loginAccount = account || email || username;

        if (!loginAccount) {
            throw new AppError(400, "Vui lòng nhập tài khoản (Email hoặc Username)");
        }

        const result = await authService.login(loginAccount, password);
        res.json({
            message: "Đăng nhập thành công!",
            ...result
        });
    }),

    logout: asyncHandler(async (req, res) => {
        await authService.logout(req.user.id);
        res.json({ message: "Đăng xuất thành công!" });
    }),

    getProfile: asyncHandler(async (req, res) => {
        const user = await authService.getProfile(req.user.id);
        res.json(user);
    }),

    updateProfile: asyncHandler(async (req, res) => {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.avatar_url = req.file.path;
        }

        const user = await authService.updateProfile(req.user.id, updateData);
        res.json({
            message: "Cập nhật hồ sơ thành công!",
            user
        });
    }),

    changePassword: asyncHandler(async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        await authService.changePassword(req.user.id, oldPassword, newPassword);
        res.json({ message: "Đổi mật khẩu thành công!" });
    }),

    forgotPassword: asyncHandler(async (req, res) => {
        await authService.forgotPassword(req.body.email);
        res.json({ message: "Link đặt lại mật khẩu đã được gửi qua email!" });
    }),

    resetPassword: asyncHandler(async (req, res) => {
        const { token, newPassword } = req.body;
        await authService.resetPassword(token, newPassword);
        res.json({ message: "Đặt lại mật khẩu thành công!" });
    })
};

export default authController;
