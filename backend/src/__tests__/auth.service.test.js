import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import bcrypt from 'bcryptjs';

const mocks = vi.hoisted(() => ({
    findOne: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
    sendResetPasswordEmail: vi.fn().mockResolvedValue(true),
    tokenBlacklistUpsert: vi.fn().mockResolvedValue(true),
}));

vi.mock('../models/user.model.js', () => ({
    default: {
        findOne: mocks.findOne,
        findByPk: mocks.findByPk,
        create: mocks.create,
    },
}));

vi.mock('../models/user_address.model.js', () => ({
    default: {
        findOne: vi.fn(),
        create: vi.fn(),
    },
}));

vi.mock('../models/token_blacklist.model.js', () => ({
    default: {
        upsert: mocks.tokenBlacklistUpsert,
    },
}));

vi.mock('../utils/mail.js', () => ({
    sendResetPasswordEmail: mocks.sendResetPasswordEmail,
}));

// Không cho unit test ghi thông báo thật vào DB dev khi chạy đăng ký/đặt đơn...
vi.mock('../services/notification.service.js', () => ({
    default: {
        notifyUser: vi.fn(),
        notifyAdmins: vi.fn(),
        notifyAdminsOnce: vi.fn(),
        listForUser: vi.fn(),
        markRead: vi.fn(),
        markAllRead: vi.fn(),
    },
}));

import authService from '../services/auth.service.js';

beforeAll(() => {
    process.env.JWT_SECRET = 'test-jwt-secret';
});

beforeEach(() => {
    vi.clearAllMocks();
});

describe('authService', () => {
    describe('register', () => {
        it('UTC_AUTH_01: nên mã hóa mật khẩu và tạo người dùng mới', async () => {
            mocks.findOne.mockResolvedValue(null);
            mocks.create.mockImplementation(async (data) => ({ id: 1, ...data }));

            const result = await authService.register({
                username: 'newuser',
                email: 'new@example.com',
                password: 'secret123',
            });

            expect(mocks.findOne).toHaveBeenCalled();
            expect(mocks.create).toHaveBeenCalled();

            const createdData = mocks.create.mock.calls[0][0];
            expect(createdData.password).not.toBe('secret123');
            expect(await bcrypt.compare('secret123', createdData.password)).toBe(true);
            expect(result.id).toBe(1);
        });

        it('UTC_AUTH_02: nên báo lỗi khi username hoặc email đã tồn tại', async () => {
            mocks.findOne.mockResolvedValue({ id: 2, username: 'existing' });

            await expect(
                authService.register({
                    username: 'existing',
                    email: 'a@b.com',
                    password: 'x',
                })
            ).rejects.toThrow('Tài khoản hoặc Email đã tồn tại');
        });
    });

    describe('login', () => {
        it('UTC_AUTH_03: nên trả token và thông tin user khi đăng nhập đúng', async () => {
            const hashed = await bcrypt.hash('correct-password', 10);
            mocks.findOne.mockResolvedValue({
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                role: 'customer',
                status: 'active',
                password: hashed,
            });

            const result = await authService.login('testuser', 'correct-password');

            expect(result.token).toBeTruthy();
            expect(result.user.role).toBe('customer');
        });

        it('UTC_AUTH_04: nên báo lỗi khi sai mật khẩu', async () => {
            const hashed = await bcrypt.hash('correct-password', 10);
            mocks.findOne.mockResolvedValue({
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                role: 'customer',
                status: 'active',
                password: hashed,
            });

            await expect(authService.login('testuser', 'wrong-password')).rejects.toThrow(
                'Mật khẩu không chính xác'
            );
        });

        it('UTC_AUTH_05: nên từ chối tài khoản bị khóa (banned)', async () => {
            const hashed = await bcrypt.hash('password', 10);
            mocks.findOne.mockResolvedValue({
                id: 1,
                username: 'banneduser',
                email: 'b@c.com',
                role: 'customer',
                status: 'banned',
                password: hashed,
            });

            await expect(authService.login('banneduser', 'password')).rejects.toThrow(
                'Tài khoản đã bị khóa'
            );
        });
    });

    describe('changePassword', () => {
        it('UTC_AUTH_06: nên báo lỗi khi mật khẩu cũ sai', async () => {
            const hashed = await bcrypt.hash('old-password', 10);
            const user = { id: 1, password: hashed, save: vi.fn() };
            mocks.findByPk.mockResolvedValue(user);

            await expect(
                authService.changePassword(1, 'wrong-old', 'new-password')
            ).rejects.toThrow('Mật khẩu cũ không chính xác');
        });

        it('UTC_AUTH_07: nên cập nhật mật khẩu mới khi mật khẩu cũ đúng', async () => {
            const hashed = await bcrypt.hash('old-password', 10);
            const user = { id: 1, password: hashed, save: vi.fn().mockResolvedValue(true) };
            mocks.findByPk.mockResolvedValue(user);

            const result = await authService.changePassword(1, 'old-password', 'new-password');

            expect(result).toBe(true);
            expect(user.password).not.toBe(hashed);
            expect(await bcrypt.compare('new-password', user.password)).toBe(true);
            expect(user.save).toHaveBeenCalled();
        });
    });

    describe('forgotPassword', () => {
        it('UTC_AUTH_08: nên gửi email và không trả token ra ngoài', async () => {
            const user = {
                id: 1,
                email: 'test@example.com',
                reset_password_token: null,
                reset_password_expires: null,
                save: vi.fn().mockResolvedValue(true),
            };
            mocks.findOne.mockResolvedValue(user);

            const result = await authService.forgotPassword('test@example.com');

            expect(mocks.sendResetPasswordEmail).toHaveBeenCalled();
            expect(result).not.toHaveProperty('reset_token');
            expect(user.reset_password_token).toBeTruthy();
        });
    });

    describe('logout', () => {
        it('UTC_AUTH_09: nên blacklist token khi logout', async () => {
            const jwt = await import('jsonwebtoken');
            const token = jwt.sign({ id: 1, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '1h' });

            const result = await authService.logout(1, token);

            expect(result).toBe(true);
            expect(mocks.tokenBlacklistUpsert).toHaveBeenCalled();
            const upsertArg = mocks.tokenBlacklistUpsert.mock.calls[0][0];
            expect(upsertArg).toHaveProperty('token_hash');
            expect(upsertArg).toHaveProperty('expires_at');
        });
    });

    describe('resetPassword', () => {
        it('UTC_AUTH_10: đổi mật khẩu thành công và vô hiệu hóa reset_token sau khi dùng', async () => {
            const user = {
                id: 1,
                password: 'old-hashed-password',
                reset_password_token: 'valid_reset_token',
                reset_password_expires: Date.now() + 3600000,
                save: vi.fn().mockResolvedValue(true),
            };
            mocks.findOne.mockResolvedValue(user);

            const result = await authService.resetPassword('valid_reset_token', 'NewPassword@123');

            expect(result).toBe(true);
            expect(user.reset_password_token).toBeNull();
            expect(user.reset_password_expires).toBeNull();
            expect(await bcrypt.compare('NewPassword@123', user.password)).toBe(true);
            expect(user.save).toHaveBeenCalled();
        });

        it('UTC_AUTH_11: ném lỗi AppError 400 khi token đặt lại mật khẩu không hợp lệ hoặc hết hạn', async () => {
            mocks.findOne.mockResolvedValue(null);

            await expect(
                authService.resetPassword('invalid_token', 'NewPassword@123')
            ).rejects.toThrow('Token không hợp lệ hoặc đã hết hạn');
        });
    });

    describe('updateProfile', () => {
        it('UTC_AUTH_12: cập nhật thông tin họ tên, số điện thoại người dùng thành công', async () => {
            const user = {
                id: 1,
                full_name: 'Old Name',
                phone: '0123456789',
                save: vi.fn().mockResolvedValue(true),
            };
            mocks.findByPk.mockResolvedValue(user);

            const result = await authService.updateProfile(1, {
                full_name: 'Ngô Văn Test',
                phone: '0988888888',
            });

            expect(result.full_name).toBe('Ngô Văn Test');
            expect(result.phone).toBe('0988888888');
            expect(user.save).toHaveBeenCalled();
        });
    });
});
