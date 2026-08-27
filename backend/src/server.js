import express from "express";
import sequelize from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import router from "./routes/index.routes.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";


dotenv.config();

const app = express();

// CORS - chỉ cho phép các origin trong whitelist
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim());
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

// Rate limiting chung cho toàn bộ API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút." },
});

// Rate limiting chặt hơn cho Auth (chống brute force)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 15 phút." },
});

app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

// 404 handler - bắt mọi route không tồn tại
app.use(notFoundHandler);

// Global error handler - tập trung xử lý lỗi
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
