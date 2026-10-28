import { Op } from "sequelize";
import Warranty from "../models/warranty.model.js";
import WarrantyRequest from "../models/warranty_request.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import { parseBulkIds, runBulk } from "../utils/bulkOps.js";
import notificationService from "./notification.service.js";
import { WARRANTY_REQUEST_STATUS_LABEL, truncateText } from "../constants/notifications.js";
import {
    WARRANTY_STATUSES,
    WARRANTY_REQUEST_STATUSES,
    getWarrantyState,
} from "../utils/warranty.js";
import {
    applyWarrantySearch,
    applyWarrantyStateFilter,
    buildWarrantySort,
    decorateWarranties,
    parseWarrantyPage,
} from "./warranty.service.js";

const OPEN_REQUEST_STATUSES = ['pending', 'processing'];

// Yêu cầu bảo hành sort trên bảng warranty_requests — cột warranties.* không sort được
// ở đây vì table JOIN one-to-many sẽ làm thứ tự/nhân số phân trang sai.
const SORTABLE_REQUEST_COLUMNS = ['created_at', 'status', 'replied_at'];

const buildRequestSort = (sort, dir) => {
    const key = SORTABLE_REQUEST_COLUMNS.includes(sort) ? sort : 'created_at';
    return [[key, String(dir).toLowerCase() === 'asc' ? 'ASC' : 'DESC'], ['id', 'DESC']];
};

const adminWarrantyService = {
    getAllWarranties: async (query = {}) => {
        const now = new Date();
        const where = applyWarrantySearch(
            applyWarrantyStateFilter({}, query.state, now),
            query.search,
            ['$order.order_code$', '$user.username$', '$user.email$']
        );
        const { page, limit, offset } = parseWarrantyPage(query);

        const { count, rows } = await Warranty.findAndCountAll({
            where,
            include: [
                { model: User, as: 'user', attributes: ['id', 'username', 'email', 'full_name', 'phone'] },
                { model: Order, as: 'order', attributes: ['id', 'order_code', 'status'] },
            ],
            order: buildWarrantySort(query.sort, query.dir),
            limit,
            offset,
            distinct: true,
        });

        return { count, rows: decorateWarranties(rows, now), page, limit };
    },

    getWarrantyDetail: async (id) => {
        const warranty = await Warranty.findByPk(id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'username', 'email', 'full_name', 'phone'] },
                { model: Order, as: 'order', attributes: ['id', 'order_code', 'status', 'created_at'] },
                {
                    model: WarrantyRequest,
                    as: 'requests',
                    include: [{ model: User, as: 'handler', attributes: ['id', 'username'] }],
                    separate: true,
                    order: [['created_at', 'DESC']],
                },
            ],
        });
        if (!warranty) throw new AppError(404, "Không tìm thấy phiếu bảo hành");
        return decorateWarranties([warranty])[0];
    },

    updateWarranty: async (id, { status, serial, note }) => {
        if (status && !WARRANTY_STATUSES.includes(status)) throw new AppError(400, "Trạng thái không hợp lệ.");
        const warranty = await Warranty.findByPk(id);
        if (!warranty) throw new AppError(404, "Không tìm thấy phiếu bảo hành");

        if (serial !== undefined) {
            const clean = String(serial).trim();
            if (clean.length > 50) throw new AppError(400, "Số serial tối đa 50 ký tự.");
            if (clean) {
                const clash = await Warranty.findOne({ where: { serial: clean, id: { [Op.ne]: warranty.id } } });
                if (clash) throw new AppError(400, `Serial ${clean} đã thuộc phiếu ${clash.code}.`);
            }
            warranty.serial = clean || null;
        }
        if (status) warranty.status = status;
        if (note !== undefined) warranty.note = String(note).trim() || null;
        await warranty.save();
        return warranty;
    },

    delete: async (id) => {
        const warranty = await Warranty.findByPk(id);
        if (!warranty) throw new AppError(404, "Không tìm thấy phiếu bảo hành");
        await warranty.destroy();
        return true;
    },

    // SET, không toggle: mọi id nhận cùng một trạng thái (Rule 3)
    bulkSetStatus: async (ids, status) => {
        if (!WARRANTY_STATUSES.includes(status)) throw new AppError(400, "Trạng thái không hợp lệ.");
        const list = parseBulkIds(ids);
        const [updated] = await Warranty.update({ status }, { where: { id: { [Op.in]: list } } });
        return { updated, status, requested: list.length };
    },

    bulkDelete: async (ids) => runBulk(parseBulkIds(ids), (id) => adminWarrantyService.delete(id)),

    getRequests: async (query = {}) => {
        const { page, limit, offset } = parseWarrantyPage(query);
        const state = String(query.state ?? '').trim();
        const where = WARRANTY_REQUEST_STATUSES.includes(state)
            ? { status: state }
            : { status: { [Op.in]: OPEN_REQUEST_STATUSES } };

        const search = String(query.search ?? '').trim();
        if (search) {
            const like = { [Op.like]: `%${search}%` };
            where[Op.or] = [
                { issue: like },
                { '$warranty.code$': like },
                { '$warranty.product_name$': like },
                { '$customer.username$': like },
                { '$customer.email$': like },
            ];
        }

        const { count, rows } = await WarrantyRequest.findAndCountAll({
            where,
            include: [
                {
                    model: Warranty,
                    as: 'warranty',
                    attributes: ['id', 'code', 'product_name', 'serial', 'status', 'start_date', 'end_date'],
                },
                { model: User, as: 'customer', attributes: ['id', 'username', 'email', 'phone'] },
            ],
            order: buildRequestSort(query.sort, query.dir),
            limit,
            offset,
            distinct: true,
        });

        // state của phiếu Cha (expired suy từ end_date) để badge "phiếu còn hạn?" cạnh yêu cầu
        const now = new Date();
        return {
            count,
            page,
            limit,
            rows: rows.map((row) => {
                const plain = row.toJSON();
                return { ...plain, warranty_state: getWarrantyState(plain.warranty, now) };
            }),
        };
    },

    replyRequest: async (requestId, { status, admin_reply }, actor) => {
        if (!WARRANTY_REQUEST_STATUSES.includes(status)) throw new AppError(400, "Trạng thái yêu cầu không hợp lệ.");
        const text = String(admin_reply ?? '').trim();
        if (!text) throw new AppError(400, "Cần nội dung phản hồi trước khi chuyển trạng thái.");
        if (text.length > 2000) throw new AppError(400, "Phản hồi tối đa 2000 ký tự.");

        const request = await WarrantyRequest.findByPk(requestId);
        if (!request) throw new AppError(404, "Không tìm thấy yêu cầu bảo hành");

        await request.update({
            status,
            admin_reply: text,
            replied_at: new Date(),
            handled_by: actor?.id ?? null,
        });
        // Phiếu đi theo yêu cầu: tiếp nhận → processing, xong/từ chối → trở về active
        if (status === 'processing') {
            await Warranty.update({ status: 'processing' }, { where: { id: request.warranty_id, status: 'active' } });
        } else if (['done', 'rejected'].includes(status)) {
            await Warranty.update({ status: 'active' }, { where: { id: request.warranty_id, status: 'processing' } });
        }

        const warranty = await Warranty.findByPk(request.warranty_id, { attributes: ['code'] });
        await notificationService.notifyUser(request.user_id, {
            type: 'warranty',
            title: 'Phản hồi bảo hành',
            message: `Phiếu ${warranty?.code || `#${request.warranty_id}`} · ${WARRANTY_REQUEST_STATUS_LABEL[status] || status} — ${truncateText(text, 120)}`,
            link: `/warranties/${request.warranty_id}`,
        });

        return request;
    },

    getStats: async () => {
        const now = new Date();
        const [total, active, expired, processing, voided, closed, openRequests, pendingRequests] =
            await Promise.all([
                Warranty.count(),
                Warranty.count({ where: { status: 'active', end_date: { [Op.gte]: now } } }),
                Warranty.count({ where: { status: 'active', end_date: { [Op.lt]: now } } }),
                Warranty.count({ where: { status: 'processing' } }),
                Warranty.count({ where: { status: 'void' } }),
                Warranty.count({ where: { status: 'closed' } }),
                WarrantyRequest.count({ where: { status: { [Op.in]: OPEN_REQUEST_STATUSES } } }),
                WarrantyRequest.count({ where: { status: 'pending' } }),
            ]);
        return {
            total,
            active_count: active,
            expired_count: expired,
            processing_count: processing,
            closed_count: closed,
            void_count: voided,
            open_request_count: openRequests,
            pending_request_count: pendingRequests,
        };
    },
};

export default adminWarrantyService;
