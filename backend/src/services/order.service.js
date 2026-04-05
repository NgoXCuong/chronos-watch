import Order from "../models/order.model.js";
import OrderDetail from "../models/order_detail.model.js";
import OrderHistory from "../models/order_history.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import sequelize from "../config/db.js";
import vnpayService from "./vnpay.service.js";
import voucherService from "./voucher.service.js";
import UserAddress from "../models/user_address.model.js";
import User from "../models/user.model.js";

const orderService = {
    checkout: async (userId, orderData, ipAddr) => {
        const transaction = await sequelize.transaction();
        try {
            // 1. Get user info for email
            const user = await User.findByPk(userId);
            if (!user) throw new Error('Người dùng không tồn tại');

            // 2. Get cart items
            const cartItems = await Cart.findAll({
                where: { user_id: userId },
                include: [{ model: Product, as: 'product' }]
            });

            if (cartItems.length === 0) throw new Error('Giỏ hàng trống');

            // 3. Validate stock and calculate subtotal
            let subtotal = 0;
            for (const item of cartItems) {
                if (!item.product) continue;
                if (item.product.stock < item.quantity) {
                    throw new Error(`Sản phẩm ${item.product.name} không đủ tồn kho`);
                }
                subtotal += item.product.price * item.quantity;
            }

            const totalItemsPrice = subtotal;
            let discountAmount = orderData.discount_amount || 0;
            let voucherId = null;

            // 4. Handle Voucher
            if (orderData.voucher_code) {
                const voucher = await voucherService.validateVoucher(orderData.voucher_code, totalItemsPrice);
                discountAmount = voucherService.calculateDiscount(voucher, totalItemsPrice);
                voucherId = voucher.id;

                await voucher.update({ used_count: (voucher.used_count || 0) + 1 }, { transaction });
            }

            const totalAmount = totalItemsPrice + (orderData.shipping_fee || 0) - discountAmount;

            // 5. Build Address Snapshot
            let snapshotData = {
                full_name: orderData.full_name,
                phone_number: orderData.phone_number,
                address_line: orderData.address_line,
                ward: orderData.ward,
                district: orderData.district,
                city: orderData.city,
                email: user.email,
                address_id: orderData.address_id || null,
                order_note: orderData.order_note
            };

            // If address_id is provided, fetch and overwrite snapshot fields to ensure accuracy
            if (orderData.address_id) {
                const savedAddr = await UserAddress.findByPk(orderData.address_id);
                if (savedAddr) {
                    snapshotData.full_name = savedAddr.recipient_name;
                    snapshotData.phone_number = savedAddr.recipient_phone;
                    snapshotData.address_line = savedAddr.address_line;
                    snapshotData.ward = savedAddr.ward;
                    snapshotData.district = savedAddr.district;
                    snapshotData.city = savedAddr.city;
                }
            }

            // 6. Create Order with Snapshot
            const order = await Order.create({
                user_id: userId,
                ...snapshotData,
                subtotal: totalItemsPrice,
                discount_amount: discountAmount,
                total_amount: totalAmount,
                voucher_id: voucherId,
                status: 'pending',
                payment_status: 'unpaid',
                payment_method: orderData.payment_method || 'cod',
                shipping_fee: orderData.shipping_fee || 0
            }, { transaction });

            // 4. Create OrderDetails and Update Stock
            for (const item of cartItems) {
                await OrderDetail.create({
                    order_id: order.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.product.price
                }, { transaction });

                // Reduce stock
                await Product.update(
                    { 
                        stock: item.product.stock - item.quantity,
                        sold_count: (item.product.sold_count || 0) + item.quantity
                    },
                    { where: { id: item.product_id }, transaction }
                );
            }

            // 5. Create History
            await OrderHistory.create({
                order_id: order.id,
                status: 'pending',
                note: orderData.order_note || 'Đơn hàng đã được khởi tạo'
            }, { transaction });

            // 6. Clear Cart
            await Cart.destroy({ where: { user_id: userId }, transaction });

            await transaction.commit();

            // 7. Handle VNPay URL generation if needed
            if (orderData.payment_method === 'vnpay') {
                const paymentUrl = vnpayService.createPaymentUrl(order, ipAddr);
                return { order, paymentUrl };
            }

            return { order };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    finishPayment: async (vnp_Params) => {
        const isValid = vnpayService.validateResponse(vnp_Params);
        const orderId = vnp_Params['vnp_TxnRef'];
        const responseCode = vnp_Params['vnp_ResponseCode'];

        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Đơn hàng không tồn tại');

        // Idempotency check: If already paid or confirmed, just return success
        if (order.payment_status === 'paid' || order.status === 'confirmed') {
            return { success: true, order };
        }

        if (isValid && responseCode === '00') {
            const transaction = await sequelize.transaction();
            try {
                order.payment_status = 'paid';
                order.status = 'confirmed';
                await order.save({ transaction });

                await OrderHistory.create({
                    order_id: orderId,
                    status: 'confirmed',
                    note: 'Thanh toán VNPay thành công. Đơn hàng đã được xác nhận tự động.'
                }, { transaction });

                await transaction.commit();
                return { success: true, order };
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        } else {
            // Payment failed or signature invalid
            return { success: false, order, message: "Thanh toán không thành công" };
        }
    },

    getUserOrders: async (userId) => {
        return await Order.findAll({
            where: { user_id: userId },
            include: [{ model: UserAddress, as: 'shipping_address_ref' }],
            order: [['created_at', 'DESC']]
        });
    },

    getOrderDetail: async (orderId) => {
        const order = await Order.findByPk(orderId, {
            include: [
                { 
                    model: OrderDetail, 
                    as: 'details',
                    include: [{ model: Product, as: 'product', attributes: ['name', 'image_url'] }]
                },
                { model: OrderHistory, as: 'history' },
                { model: UserAddress, as: 'shipping_address_ref' }
            ]
        });
        if (!order) throw new Error('Đơn hàng không tồn tại');
        return order;
    },

    updateOrderStatus: async (orderId, status, note) => {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Đơn hàng không tồn tại');

        const transaction = await sequelize.transaction();
        try {
            order.status = status;
            await order.save({ transaction });

            await OrderHistory.create({
                order_id: orderId,
                status,
                note: note || `Cập nhật trạng thái mới: ${status}`
            }, { transaction });

            await transaction.commit();
            return order;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    markAsPaid: async (orderId) => {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Đơn hàng không tồn tại');
        if (order.payment_status === 'paid') throw new Error('Đơn hàng này đã được thanh toán');

        const transaction = await sequelize.transaction();
        try {
            order.payment_status = 'paid';
            await order.save({ transaction });

            await OrderHistory.create({
                order_id: orderId,
                status: order.status,
                note: 'Admin xác nhận đã thu tiền COD.'
            }, { transaction });

            await transaction.commit();
            return order;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    cancelOrder: async (userId, orderId, note) => {
        const order = await Order.findOne({ where: { id: orderId, user_id: userId } });
        if (!order) throw new Error('Đơn hàng không tồn tại');
        if (!['pending', 'confirmed'].includes(order.status)) {
            throw new Error('Không thể hủy đơn hàng ở trạng thái hiện tại');
        }

        const transaction = await sequelize.transaction();
        try {
            order.status = 'cancelled';
            await order.save({ transaction });

            // Revert stock
            const details = await OrderDetail.findAll({ where: { order_id: orderId } });
            for (const item of details) {
                const product = await Product.findByPk(item.product_id);
                await Product.update(
                    { 
                        stock: product.stock + item.quantity,
                        sold_count: product.sold_count - item.quantity 
                    },
                    { where: { id: item.product_id }, transaction }
                );
            }

            await OrderHistory.create({
                order_id: orderId,
                status: 'cancelled',
                note: note || 'Người dùng yêu cầu hủy đơn hàng'
            }, { transaction });

            await transaction.commit();
            return order;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
};

export default orderService;
