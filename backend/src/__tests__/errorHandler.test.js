import { describe, it, expect } from 'vitest';
import formatSequelizeError from '../utils/errorHandler.js';

describe('formatSequelizeError', () => {
    it('nên format lỗi validation notNull', () => {
        const err = {
            name: 'SequelizeValidationError',
            errors: [{ validatorKey: 'notNull', path: 'name' }],
        };
        expect(formatSequelizeError(err)).toContain('name');
        expect(formatSequelizeError(err)).toContain('không được để trống');
    });

    it('nên format lỗi unique constraint', () => {
        const err = {
            name: 'SequelizeUniqueConstraintError',
            errors: [{ path: 'email' }],
        };
        expect(formatSequelizeError(err)).toContain('email');
        expect(formatSequelizeError(err)).toContain('đã tồn tại');
    });

    it('nên trả về message gốc cho lỗi không phải Sequelize', () => {
        const err = new Error('Lỗi nghiệp vụ');
        expect(formatSequelizeError(err)).toBe('Lỗi nghiệp vụ');
    });
});
