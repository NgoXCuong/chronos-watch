import { describe, it, expect, beforeAll } from 'vitest';
import crypto from 'crypto';

beforeAll(() => {
    process.env.VNPAY_TMN_CODE = 'TESTTMN';
    process.env.VNPAY_SECRET_KEY = 'test-secret-key';
    process.env.VNPAY_URL = 'https://sandbox.vnpay.vn/paymentv2/vpcpay.html';
    process.env.VNPAY_RETURN_URL = 'http://localhost:5173/payment/return';
});

import vnpayService from '../services/vnpay.service.js';

describe('vnpayService', () => {
    describe('createPaymentUrl', () => {
        it('nên tạo URL chứa các tham số VNPay bắt buộc', () => {
            const order = { id: 1, total_amount: 100000 };
            const url = vnpayService.createPaymentUrl(order, '127.0.0.1');

            expect(url).toContain('https://sandbox.vnpay.vn');
            expect(url).toContain('vnp_TxnRef=1');
            expect(url).toContain('vnp_Amount=10000000'); // 100000 * 100
            expect(url).toContain('vnp_SecureHash=');
        });

        it('nên hoạt động với VNPAY_HASH_SECRET thay cho VNPAY_SECRET_KEY', () => {
            const oldSecret = process.env.VNPAY_SECRET_KEY;
            delete process.env.VNPAY_SECRET_KEY;
            process.env.VNPAY_HASH_SECRET = 'test-hash-secret';

            const order = { id: 2, total_amount: 50000 };
            const url = vnpayService.createPaymentUrl(order, '127.0.0.1');

            expect(url).toContain('vnp_TxnRef=2');
            expect(url).toContain('vnp_SecureHash=');

            const queryPart = url.split('?')[1];
            const params = Object.fromEntries(new URLSearchParams(queryPart));
            expect(vnpayService.validateResponse(params)).toBe(true);

            // Restore
            delete process.env.VNPAY_HASH_SECRET;
            process.env.VNPAY_SECRET_KEY = oldSecret;
        });
    });

    describe('validateResponse', () => {
        it('nên chấp nhận chữ ký hợp lệ do chính service tạo ra (round-trip)', () => {
            const order = { id: 42, total_amount: 250000 };
            const url = vnpayService.createPaymentUrl(order, '127.0.0.1');

            const queryPart = url.split('?')[1];
            const params = Object.fromEntries(new URLSearchParams(queryPart));

            expect(vnpayService.validateResponse({ ...params })).toBe(true);
        });

        it('nên trả false khi chữ ký bị chỉnh sửa (tampered)', () => {
            const baseParams = {
                vnp_TmnCode: 'TESTTMN',
                vnp_Amount: '10000000',
                vnp_TxnRef: '1',
                vnp_ResponseCode: '00',
            };

            const querystring = Object.keys(baseParams)
                .map((key) => `${key}=${baseParams[key]}`)
                .join('&');
            const hash = crypto
                .createHmac('sha512', 'test-secret-key')
                .update(Buffer.from(querystring, 'utf-8'))
                .digest('hex');

            // Giữ chữ ký gốc nhưng sửa số tiền -> chữ ký không còn khớp
            const tampered = { ...baseParams, vnp_Amount: '999', vnp_SecureHash: hash };

            expect(vnpayService.validateResponse(tampered)).toBe(false);
        });
    });
});
