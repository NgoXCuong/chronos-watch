import formatSequelizeError from "../utils/errorHandler.js";

const notFoundHandler = (req, res, next) => {
    const error = new Error(`Không tìm thấy API: ${req.method} ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Lỗi máy chủ nội bộ";

    if (
        err.name === "SequelizeValidationError" ||
        err.name === "SequelizeUniqueConstraintError" ||
        err.name === "SequelizeForeignKeyConstraintError"
    ) {
        statusCode = 400;
        message = formatSequelizeError(err);
    }

    if (statusCode >= 500) {
        console.error("❌ Lỗi không xác định:", err);
    }

    res.status(statusCode).json({ message });
};

export { notFoundHandler, errorHandler };
