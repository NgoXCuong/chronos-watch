/**
 * Chuyển đổi các lỗi từ Sequelize sang thông báo lỗi thân thiện với người dùng.
 */
const formatSequelizeError = (error) => {
    if (error.name === 'SequelizeValidationError') {
        return error.errors.map(err => {
            switch (err.validatorKey) {
                case 'notNull':
                    return `${err.path} không được để trống`;
                case 'len':
                    return `${err.path} độ dài không hợp lệ`;
                case 'min':
                    return `${err.path} giá trị quá nhỏ`;
                default:
                    return err.message;
            }
        }).join(', ');
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors[0].path;
        return `${field} đã tồn tại trong hệ thống`;
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
        return "Không thể thực hiện do vi phạm ràng buộc dữ liệu liên quan (Foreign Key)";
    }

    return error.message;
};

export default formatSequelizeError;
