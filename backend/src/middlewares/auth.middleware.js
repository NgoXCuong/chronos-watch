import jwt from "jsonwebtoken";
import crypto from "crypto";
import TokenBlacklist from "../models/token_blacklist.model.js";

const verifyToken = async (req, res, next) => {
    const token =
        req.cookies?.token ||
        (req.headers["authorization"] &&
            req.headers["authorization"].split(" ")[1]);

    if (!token) {
        return res.status(403).json({ message: "Không tìm thấy token. Vui lòng đăng nhập!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const blacklisted = await TokenBlacklist.findByPk(tokenHash);
        if (blacklisted) {
            return res.status(401).json({ message: "Token đã bị vô hiệu hóa. Vui lòng đăng nhập lại!" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};

export default verifyToken;