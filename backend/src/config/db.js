import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false, // Tắt log SQL ra console cho sạch, bật lên nếu muốn debug
    timezone: "+07:00", // Khớp với múi giờ Việt Nam
    define: {
      timestamps: true, // Tự động quản lý created_at, updated_at
      underscored: true, // Chuyển camelCase sang snake_case (ví dụ: createdAt -> created_at)
    },
  },
);

const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối MySQL thành công thông qua Sequelize!");
  } catch (error) {
    console.error("❌ Không thể kết nối database:", error);
  }
};

checkConnection();

export default sequelize;
