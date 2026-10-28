import warrantyService from '../services/warranty.service.js';
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// req.user chỉ có { id, role } từ JWT — mọi truy vấn đều khóa theo id để không
// đọc/ghi được phiếu của khách khác (chống IDOR ngay ở tầng service).
const customerId = (req) => {
    const id = Number(req.user?.id);
    if (!id) throw new AppError(401, "Không xác định được tài khoản đăng nhập.");
    return id;
};

const warrantyController = {
    getMyWarranties: asyncHandler(async (req, res) => {
        const result = await warrantyService.getMyWarranties(customerId(req), req.query);
        res.json({
            total: result.count,
            page: result.page,
            limit: result.limit,
            warranties: result.rows,
        });
    }),

    getMyWarranty: asyncHandler(async (req, res) => {
        const warranty = await warrantyService.getMyWarranty(req.params.id, customerId(req));
        res.json({ warranty });
    }),

    createRequest: asyncHandler(async (req, res) => {
        const request = await warrantyService.createRequest({
            warrantyId: req.params.id,
            userId: customerId(req),
            issue: req.body?.issue,
        });
        res.status(201).json({
            message: "Đã gửi yêu cầu bảo hành. Chúng tôi sẽ phản hồi trong 24–48 giờ.",
            request,
        });
    }),
};

export default warrantyController;
