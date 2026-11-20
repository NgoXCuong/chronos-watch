// Tên và ảnh đơn hàng được đọc qua products; giá và thời hạn bảo hành vẫn lưu riêng.
export async function removeOrderProductSnapshots(sequelize) {
    const qi = sequelize.getQueryInterface();
    const columns = await qi.describeTable('order_details');
    for (const column of ['product_name', 'product_image']) {
        if (columns[column]) await qi.removeColumn('order_details', column);
    }
}
