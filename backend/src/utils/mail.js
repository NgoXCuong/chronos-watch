import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Gửi email đặt lại mật khẩu
 * @param {string} to - Email người nhận
 * @param {string} token - Reset token
 */
export const sendResetPasswordEmail = async (to, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
    const mailOptions = {
        from: `"Chronos Watch" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: 'Khôi phục mật khẩu - Chronos Watch',
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #000; padding: 40px; text-align: center;">
                    <h1 style="color: #fff; margin: 0; font-size: 28px; letter-spacing: 4px; font-weight: 300;">CHRONOS</h1>
                </div>
                <div style="padding: 40px; background-color: #ffffff;">
                    <h2 style="color: #333; margin-top: 0;">Yêu cầu khôi phục mật khẩu</h2>
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">
                        Chào Quý khách,<br><br>
                        Chúng tôi đã nhận được yêu cầu khôi phục mật khẩu cho tài khoản ứng với email này. 
                        Vui lòng nhấn vào nút bên dưới để tiến hành đặt lại mật khẩu. Liên kết này sẽ hết hạn sau 1 giờ.
                    </p>
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="${resetUrl}" style="background-color: #b45309; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                            Đặt lại mật khẩu
                        </a>
                    </div>
                    <p style="color: #999; font-size: 14px; line-height: 1.6;">
                        Nếu Quý khách không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này. Tài khoản của Quý khách vẫn được bảo mật.
                    </p>
                </div>
                <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="color: #aaa; font-size: 12px; margin: 0;">
                        &copy; 2024 Chronos Prestige Group. All rights reserved.
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Không thể gửi mật khẩu qua email. Vui lòng thử lại sau.');
    }
};

export default {
    sendResetPasswordEmail
};
