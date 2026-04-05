import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

function formatDate(date) {
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let seconds = ("0" + date.getSeconds()).slice(-2);
    return year + month + day + hours + minutes + seconds;
}

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[decodeURIComponent(str[key])]).replace(/%20/g, "+");
    }
    return sorted;
}

const vnpayService = {
    createPaymentUrl: (order, ipAddr) => {
        let tmnCode = process.env.VNPAY_TMN_CODE;
        let secretKey = process.env.VNPAY_HASH_SECRET;
        let vnpUrl = process.env.VNPAY_URL;
        let returnUrl = process.env.VNPAY_RETURN_URL;

        let date = new Date();
        let createDate = formatDate(date);

        let orderId = order.id;
        let amount = order.total_amount;
        let orderInfo = `Thanh toan don hang ${orderId}`;
        let orderType = 'billpayment';
        let locale = 'vn';
        let currCode = 'VND';

        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100; // Multiply by 100 as per VNPay standard
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;

        vnp_Params = sortObject(vnp_Params);

        let querystring = Object.keys(vnp_Params).map((key) => {
            return key + '=' + vnp_Params[key];
        }).join('&');

        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(querystring, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        let finalUrl = vnpUrl + '?' + Object.keys(vnp_Params).map((key) => {
            return key + '=' + vnp_Params[key];
        }).join('&');

        return finalUrl;
    },

    validateResponse: (vnp_Params) => {
        let secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        let secretKey = process.env.VNPAY_HASH_SECRET;
        let querystring = Object.keys(vnp_Params).map((key) => {
            return key + '=' + vnp_Params[key];
        }).join('&');

        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(querystring, 'utf-8')).digest("hex");

        if (secureHash === signed) {
            return true;
        } else {
            return false;
        }
    }
};

export default vnpayService;
