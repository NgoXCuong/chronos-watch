import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import bcrypt from 'bcryptjs';

const mocks = vi.hoisted(() => ({
    findOne: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
    sendResetPasswordEmail: vi.fn().mockResolvedValue(true),
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

vi.mock('../utils/mail.js', () => ({
    sendResetPasswordEmail: mocks.sendResetPasswordEmail,
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
        it('nên mã hóa mật khẩu và tạo người dùng mới', async () => {
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

        it('nên báo lỗi khi username hoặc email đã tồn tại', async () => {
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
        it('nên trả token và thông tin user khi đăng nhập đúng', async () => {
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

        it('nên báo lỗi khi sai mật khẩu', async () => {
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

        it('nên từ chối tài khoản bị khóa (banned)', async () => {
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
        it('nên báo lỗi khi mật khẩu cũ sai', async () => {
            const hashed = await bcrypt.hash('old-password', 10);
            const user = { id: 1, password: hashed, save: vi.fn() };
            mocks.findByPk.mockResolvedValue(user);

            await expect(
                authService.changePassword(1, 'wrong-old', 'new-password')
            ).rejects.toThrow('Mật khẩu cũ không chính xác');
        });

        it('nên cập nhật mật khẩu mới khi mật khẩu cũ đúng', async () => {
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
        it('nên gửi email và không trả token ra ngoài', async () => {
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
});
