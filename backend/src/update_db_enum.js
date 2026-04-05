import sequelize from "./config/db.js";

const updateStatusEnum = async () => {
    try {
        console.log("⏳ Đang cập nhật cột 'status' trong bảng 'orders'...");
        // MySQL ALTER command for ENUM
        await sequelize.query(`
            ALTER TABLE orders 
            MODIFY COLUMN status ENUM('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'returned') 
            DEFAULT 'pending';
        `);
        console.log("✅ Đã cập nhật thành công trạng thái 'processing' vào Database!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật Database:", error);
        process.exit(1);
    }
};

updateStatusEnum();
