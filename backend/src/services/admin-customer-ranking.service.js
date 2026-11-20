import { QueryTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Gộp số chiếc về từng đơn trước khi JOIN, tránh nhân tổng tiền theo số dòng sản phẩm.
// VIP ở dashboard là xếp hạng theo lịch sử mua, không thay đổi vai trò tài khoản.
const TOP_CUSTOMERS_SQL = `
    SELECT u.id, u.username, u.full_name, u.email, u.avatar_url,
           SUM(items.product_quantity) AS product_quantity,
           COUNT(o.id) AS order_count,
           SUM(o.total_amount) AS total_spent
    FROM users u
    JOIN orders o ON o.user_id = u.id
    JOIN (
        SELECT order_id, SUM(quantity) AS product_quantity
        FROM order_details
        GROUP BY order_id
    ) items ON items.order_id = o.id
    WHERE u.role = 'customer' AND o.status = 'delivered'
    GROUP BY u.id, u.username, u.full_name, u.email, u.avatar_url
    ORDER BY product_quantity DESC, total_spent DESC, order_count DESC, u.id ASC
    LIMIT 5`;

export default async function getTopCustomers() {
    const rows = await sequelize.query(TOP_CUSTOMERS_SQL, { type: QueryTypes.SELECT });
    return rows.map((row) => ({
        ...row,
        product_quantity: Number(row.product_quantity) || 0,
        order_count: Number(row.order_count) || 0,
        total_spent: Number(row.total_spent) || 0,
    }));
}
