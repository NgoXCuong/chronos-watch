import { Op } from 'sequelize';
import db from '../config/db.js';
import Voucher from '../models/voucher.model.js';
import User from '../models/user.model.js';
import VoucherGrant from '../models/voucher_grant.model.js';
import Notification from '../models/notification.model.js';
import AppError from '../utils/AppError.js';
import { parseBulkIds } from '../utils/bulkOps.js';

export async function assertVoucherRecipient(voucher, userId) {
    // Kiểm tra grant ngay cả khi mã đã bị chuyển công khai: không mở quyền cho người lạ.
    const restricted = !voucher.is_public || await VoucherGrant.count({ where: { voucher_id: voucher.id } }) > 0;
    if (!restricted) return;
    const grant = userId && await VoucherGrant.findOne({ where: { voucher_id: voucher.id, user_id: userId }, attributes: ['id'], raw: true });
    if (!grant) throw new AppError(400, 'Mã ưu đãi không khả dụng cho tài khoản của bạn.');
}

export async function assertNotGifted(ids) {
    if (await VoucherGrant.count({ where: { voucher_id: { [Op.in]: ids } } })) {
        throw new AppError(400, 'Voucher đã tặng riêng không thể chuyển thành công khai.');
    }
}

export async function giftVoucher(voucherId, userIds, actorId) {
    const ids = parseBulkIds(userIds);
    if (!actorId) throw new AppError(401, 'Vui lòng đăng nhập quản trị.');
    return db.transaction(async (transaction) => {
        const voucher = await Voucher.findByPk(voucherId, { transaction, lock: transaction.LOCK.UPDATE });
        if (!voucher) throw new AppError(404, 'Voucher không tồn tại.');
        if (voucher.is_public) throw new AppError(400, 'Hãy chọn voucher ở chế độ mã riêng để tặng.');
        if (voucher.status !== 'active' || new Date(voucher.end_date) < new Date()) throw new AppError(400, 'Voucher đã hết hạn hoặc đang tạm ngưng.');
        if (voucher.usage_limit != null && Number(voucher.used_count) >= Number(voucher.usage_limit)) throw new AppError(400, 'Voucher đã hết lượt sử dụng.');
        const users = await User.findAll({ where: { id: { [Op.in]: ids }, role: 'customer', status: 'active' }, attributes: ['id'], transaction });
        if (users.length !== ids.length) throw new AppError(400, 'Danh sách có khách không tồn tại, bị khóa hoặc không phải khách hàng.');
        let granted = 0;
        for (const userId of ids) {
            const [grant, created] = await VoucherGrant.findOrCreate({ where: { voucher_id: voucher.id, user_id: userId }, defaults: { granted_by: actorId }, transaction });
            if (!created) continue;
            await Notification.create({ user_id: userId, type: 'system', title: 'Bạn được tặng voucher',
                message: `Chronos tặng bạn mã ${voucher.code}. Xem điều kiện và sử dụng trong Voucher của tôi.`,
                link: '/my-vouchers', dedupe_key: `voucher-grant-${grant.id}` }, { transaction });
            granted++;
        }
        return { granted, already_received: ids.length - granted, message: `Đã tặng voucher cho ${granted} khách hàng${ids.length > granted ? `; ${ids.length - granted} khách đã nhận mã này trước đó` : ''}.` };
    });
}
