import User from "../models/user.model.js";
import UserAddress from "../models/user_address.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

import { sendResetPasswordEmail } from "../utils/mail.js";

const authService = {
    register: async (userData) => {
        const { username, email, password, full_name, phone } = userData;

        const existingUser = await User.findOne({
            where: { [Op.or]: [{ username }, { email }] }
        });
        if (existingUser) {
            throw new Error('Tài khoản hoặc Email đã tồn tại');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username, email, password: hashedPassword, full_name, phone
        });

        return newUser;
    },

    login: async (account, password) => {
        const user = await User.findOne({
            where: { [Op.or]: [{ username: account }, { email: account }] }
        });

        if (!user) {
            throw new Error('Tài khoản không chính xác');
        }

        if (user.status === 'banned') {
            throw new Error('Tài khoản đã bị khóa');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Mật khẩu không chính xác');
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        };
    },

    getProfile: async (userId) => {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password', 'reset_password_token', 'reset_password_expires'] }
        });
        if (!user) throw new Error('Người dùng không tồn tại');
        return user;
    },

    changePassword: async (userId, oldPassword, newPassword) => {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('Người dùng không tồn tại');

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw new Error('Mật khẩu cũ không chính xác');

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return true;
    },

    forgotPassword: async (email) => {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error('Email không tồn tại');

        const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.reset_password_token = resetToken;
        user.reset_password_expires = Date.now() + 3600000; // 1h
        await user.save();

        // Gửi email thật
        await sendResetPasswordEmail(email, resetToken);

        return resetToken;
    },

    resetPassword: async (token, newPassword) => {
        const user = await User.findOne({
            where: {
                reset_password_token: token,
                reset_password_expires: { [Op.gt]: Date.now() }
            }
        });
        if (!user) throw new Error('Token không hợp lệ hoặc đã hết hạn');

        user.password = await bcrypt.hash(newPassword, 10);
        user.reset_password_token = null;
        user.reset_password_expires = null;
        await user.save();
        return true;
    },

    updateProfile: async (userId, updateData) => {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('Người dùng không tồn tại');

        const { full_name, phone, address, avatar_url } = updateData;

        if (full_name) user.full_name = full_name;
        if (phone) user.phone = phone;
        if (avatar_url) user.avatar_url = avatar_url;

        // Xử lý address (theo yêu cầu của bạn là một trường address trong request)
        // Vì SQL dùng bảng user_addresses nên nếu user truyền 'address' lên, ta sẽ cập nhật vào bảng đo.
        if (address) {
            // Chiến lược đơn giản: Cập nhật hoặc tạo mới address mặc định cho user.
            let userAddress = await UserAddress.findOne({ where: { user_id: userId, is_default: true } });
            if (!userAddress) {
                userAddress = await UserAddress.findOne({ where: { user_id: userId } });
            }

            if (userAddress) {
                userAddress.address_line = address;
                await userAddress.save();
            } else {
                await UserAddress.create({
                    user_id: userId,
                    recipient_name: full_name || user.full_name || user.username,
                    recipient_phone: phone || user.phone || '0000000000',
                    address_line: address,
                    city: 'Chưa cập nhật',
                    is_default: true
                });
            }
        }

        await user.save();
        return await User.findByPk(userId, { include: ['addresses'] });
    },

    logout: async (userId) => {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('Người dùng không tồn tại');
        user.reset_password_token = null;
        user.reset_password_expires = null;
        await user.save();
        return true;
    },
};

export default authService;
