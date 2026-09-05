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

import { errorHandler } from '../middlewares/errorHandler.js';

describe('errorHandler middleware', () => {
    it('nên xử lý MulterError LIMIT_FILE_SIZE và trả về 400', () => {
        const err = new Error('File too large');
        err.name = 'MulterError';
        err.code = 'LIMIT_FILE_SIZE';

        const req = {};
        let status = 0;
        let jsonResponse = null;
        const res = {
            status: (s) => { status = s; return res; },
            json: (j) => { jsonResponse = j; return res; }
        };
        const next = () => {};

        errorHandler(err, req, res, next);
        expect(status).toBe(400);
        expect(jsonResponse.message).toContain('5MB');
    });
});
