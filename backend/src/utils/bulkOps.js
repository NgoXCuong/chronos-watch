import AppError from "./AppError.js";

// body.ids → danh sách id hợp lệ, đã loại trùng. Chặn id rác trước khi chạm tới CSDL.
export const parseBulkIds = (ids, { max = 100 } = {}) => {
    const list = [...new Set((Array.isArray(ids) ? ids : []).map(Number)
        .filter((id) => Number.isInteger(id) && id > 0))];
    if (list.length === 0) throw new AppError(400, "Chưa chọn bản ghi nào để xử lý.");
    if (list.length > max) throw new AppError(400, `Chỉ xử lý tối đa ${max} bản ghi mỗi lần.`);
    return list;
};

// Lỗi CSDL thật (FK, ràng buộc) phải dịch ra tiếng Việt — toast cho admin đọc được
export const describeBulkError = (error) => {
    if (error instanceof AppError) return error.message;
    const code = error?.original?.code || error?.parent?.code;
    if (code === "ER_ROW_IS_REFERENCED_2") return "đang được dữ liệu khác tham chiếu";
    if (code === "ER_ROW_IS_REFERENCED_1") return "còn bản ghi phụ thuộc chưa xóa";
    return "không xử lý được";
};

// Chạy lần lượt từng id bằng CHÍNH nghiệp vụ đơn lẻ (giữ nguyên validate của từng entity),
// gom kết quả thay vì transaction: xóa hàng loạt cho phép thành công một phần.
export const runBulk = async (ids, runOne) => {
    const done = [];
    const failed = [];
    for (const id of ids) {
        try {
            await runOne(id);
            done.push(id);
        } catch (error) {
            failed.push({ id, reason: describeBulkError(error) });
        }
    }
    return { done, failed };
};
