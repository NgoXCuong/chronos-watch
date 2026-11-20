// Chạy lại an toàn trên cả schema cũ và schema mới không có serial.
export async function removeWarrantySerial(sequelize) {
    const qi = sequelize.getQueryInterface();
    const columns = await qi.describeTable('warranties');
    if (!columns.serial) return;
    // MySQL tự gỡ index một cột khi DROP COLUMN; không tác động dữ liệu phiếu khác.
    await qi.removeColumn('warranties', 'serial');
    console.log('Đã xóa cột serial khỏi warranties.');
}
