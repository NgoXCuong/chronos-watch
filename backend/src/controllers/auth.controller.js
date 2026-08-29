import authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";

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

        // Lưu token vào httpOnly cookie (an toàn hơn localStorage - chống XSS)
        const decoded = jwt.decode(result.token);
        if (decoded && decoded.exp) {
            const maxAge = Math.max(0, decoded.exp * 1000 - Date.now());
            res.cookie("token", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge
            });
        }

        res.json({
            message: "Đăng nhập thành công!",
            user: result.user
        });
    }),

    logout: asyncHandler(async (req, res) => {
        const token =
            req.cookies?.token ||
            (req.headers["authorization"] &&
                req.headers["authorization"].split(" ")[1]);

        await authService.logout(req.user.id, token);
        res.clearCookie("token");
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
