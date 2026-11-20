import jwt from "jsonwebtoken";
import crypto from "crypto";
import TokenBlacklist from "../models/token_blacklist.model.js";
import User from "../models/user.model.js";

const verifyToken = async (req, res, next) => {
    const token =
        (req.headers["authorization"] &&
            req.headers["authorization"].split(" ")[1]) ||
        (req.headers["x-test-no-token"] ? null : req.cookies?.token);

    if (!token) {
        return res.status(401).json({ message: "Không tìm thấy token. Vui lòng đăng nhập!" });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
    if (!Number.isSafeInteger(decoded?.id) || decoded.id < 1 || !['admin', 'customer'].includes(decoded.role)) {
        return res.status(401).json({ message: "Token không hợp lệ!" });
    }
    try {

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const blacklisted = await TokenBlacklist.findByPk(tokenHash);
        if (blacklisted) {
            return res.status(401).json({ message: "Token đã bị vô hiệu hóa. Vui lòng đăng nhập lại!" });
        }

        const user = await User.findByPk(decoded.id, { attributes: ['id', 'role', 'status'] });
        if (!user) return res.status(401).json({ message: "Tài khoản không còn tồn tại" });
        if (user.status !== 'active') return res.status(403).json({ message: "Tài khoản đã bị khóa" });
        req.user = { ...decoded, id: user.id, role: user.role };
        next();
    } catch (err) {
        next(err);
    }
};

export default verifyToken;
