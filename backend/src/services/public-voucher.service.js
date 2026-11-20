import { Op, col, where, fn, literal } from 'sequelize';
import Voucher from '../models/voucher.model.js';
import VoucherUsage from '../models/voucher_usage.model.js';
import voucherService from './voucher.service.js';
import AppError from '../utils/AppError.js';
import VoucherGrant from '../models/voucher_grant.model.js';

export function voucherAvailability(voucher, total, usedByUser = 0) {
    const missing = Math.max(0, Number(voucher.min_order_value || 0) - total);
    const exhausted = Number(voucher.per_user_limit) > 0 && usedByUser >= Number(voucher.per_user_limit);
    return {
        eligible: !exhausted && missing === 0,
        reason: exhausted ? 'Bạn đã dùng hết lượt của mã này.' : missing > 0 ? `Mua thêm ${missing.toLocaleString('vi-VN')} ₫ để áp dụng.` : null,
        discount_amount: !exhausted && missing === 0 ? voucherService.calculateDiscount(voucher, total) : 0,
    };
}

const unassignedPublic = () => ({ is_public: true, [Op.and]: [literal('NOT EXISTS (SELECT 1 FROM voucher_grants vg WHERE vg.voucher_id = `Voucher`.`id`)')] });

function lifecycleReason(v, now) {
    if (v.status !== 'active') return 'Voucher đang tạm ngưng.';
    if (new Date(v.start_date) > now) return 'Voucher chưa đến thời gian sử dụng.';
    if (new Date(v.end_date) < now) return 'Voucher đã hết hạn.';
    if (v.usage_limit != null && Number(v.used_count) >= Number(v.usage_limit)) return 'Voucher đã hết lượt sử dụng.';
    return null;
}

export default async function listPublicVouchers({ total, userId, scope = 'public' } = {}) {
    const amount = total === undefined ? null : Number(total);
    if (amount !== null && (!Number.isFinite(amount) || amount < 0 || String(total).trim() === '')) throw new AppError(400, 'Giá trị giỏ hàng không hợp lệ.');
    const now = new Date();
    if (scope === 'mine' && !userId) throw new AppError(401, 'Vui lòng đăng nhập.');
    const grants = userId && scope !== 'public' ? await VoucherGrant.findAll({ where: { user_id: userId }, attributes: ['voucher_id', 'granted_at'], raw: true }) : [];
    const grantedIds = grants.map((g) => g.voucher_id);
    const audience = scope === 'mine' ? { id: { [Op.in]: grantedIds } }
        : scope === 'available' && grantedIds.length ? { [Op.or]: [unassignedPublic(), { id: { [Op.in]: grantedIds } }] } : unassignedPublic();
    const criteria = scope === 'mine' ? audience : { ...audience, status: 'active', start_date: { [Op.lte]: now }, end_date: { [Op.gte]: now },
        [Op.and]: [audience, { [Op.or]: [{ usage_limit: null }, where(col('used_count'), Op.lt, col('usage_limit'))] }] };
    const vouchers = await Voucher.findAll({
        attributes: ['id', 'code', 'discount_type', 'discount_value', 'max_discount', 'min_order_value', 'start_date', 'end_date', 'usage_limit', 'used_count', 'per_user_limit', 'status'],
        where: criteria,
        order: [['end_date', 'ASC'], ['id', 'ASC']], raw: true,
    });
    const usages = userId && vouchers.length ? await VoucherUsage.findAll({
        attributes: ['voucher_id', [fn('COUNT', col('id')), 'count']],
        where: { user_id: userId, voucher_id: { [Op.in]: vouchers.map(({ id }) => id) } }, group: ['voucher_id'], raw: true,
    }) : [];
    const used = new Map(usages.map((row) => [Number(row.voucher_id), Number(row.count)]));
    const items = vouchers.map((v) => {
        const usedByUser = used.get(Number(v.id)) || 0;
        const reason = lifecycleReason(v, now) || (Number(v.per_user_limit) > 0 && usedByUser >= Number(v.per_user_limit) ? 'Bạn đã dùng hết lượt của mã này.' : null);
        return { ...v, used_count: undefined, gifted: grantedIds.some((id) => Number(id) === Number(v.id)),
            remaining: v.usage_limit == null ? null : Math.max(0, Number(v.usage_limit) - Number(v.used_count)),
            ...(amount === null ? { eligible: null, discount_amount: null, reason: null } : voucherAvailability(v, amount, usedByUser)),
            ...(reason ? { unavailable: true, eligible: false, discount_amount: 0, reason } : {}),
        };
    });
    if (amount !== null) items.sort((a, b) => Number(b.eligible) - Number(a.eligible) || b.discount_amount - a.discount_amount || new Date(a.end_date) - new Date(b.end_date) || a.id - b.id);
    return { items, server_time: now.toISOString() };
}
