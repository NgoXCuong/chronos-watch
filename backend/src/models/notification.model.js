import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Thông báo thật (bảng notifications): mỗi dòng là một thông báo cho MỘT người nhận,
// nhờ vậy trạng thái đã đọc của admin A không ảnh hưởng tới admin B hay khách hàng.
// dedupe_key chặn bắn trùng cùng một sự kiện (ví dụ cảnh báo tồn kho mỗi 60s).
const Notification = sequelize.define('Notification', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('order', 'payment', 'stock', 'review', 'warranty', 'system'),
        allowNull: false,
        defaultValue: 'system',
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    dedupe_key: {
        type: DataTypes.STRING(120),
        allowNull: true,
    },
    read_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'notifications',
    underscored: true,
    updatedAt: false,
});

// Không khai báo association với User: mọi truy vấn thông báo đều lọc theo user_id
// và không include user, nên giữ model độc lập giúp unit test mock User không vỡ.
export default Notification;
