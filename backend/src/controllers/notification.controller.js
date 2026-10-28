import notificationService from "../services/notification.service.js";
import adminBadgeService from "../services/admin-badge.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const notificationController = {
    list: asyncHandler(async (req, res) => {
        const data = await notificationService.listForUser(req.user.id, req.query);
        const counts =
            req.user.role === "admin" ? await adminBadgeService.getCounts() : null;
        res.json({ ...data, counts });
    }),

    markRead: asyncHandler(async (req, res) => {
        const result = await notificationService.markRead(req.user.id, req.params.id);
        res.json({ success: true, ...result });
    }),

    markAllRead: asyncHandler(async (req, res) => {
        const result = await notificationService.markAllRead(req.user.id);
        res.json({ success: true, ...result });
    }),
};

export default notificationController;
