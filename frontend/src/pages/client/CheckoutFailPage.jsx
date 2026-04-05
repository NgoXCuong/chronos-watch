import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, ShoppingCart, RefreshCw, PhoneCall } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useTheme } from '../../context/ThemeContext';

const CheckoutFailPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen flex items-center justify-center pt-20 ${isDark ? 'bg-[#080808]' : 'bg-white'}`}>
            <div className="max-w-[500px] w-full px-6 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 text-red-500 mb-8">
                    <XCircle className="w-10 h-10" />
                </div>
                
                <h1 className={`text-3xl font-black uppercase tracking-tight mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    Thanh toán thất bại
                </h1>
                
                <p className={`text-md leading-relaxed mb-10 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Rất tiếc, đã có lỗi xảy ra trong quá trình xử lý thanh toán của bạn. 
                    Mã đơn hàng: <span className="font-bold underline text-amber-500">#{orderId || 'N/A'}</span>
                </p>

                <div className={`p-6 rounded-2xl border mb-10 text-left space-y-4 ${isDark ? 'bg-zinc-900/40 border-white/5' : 'bg-zinc-50 border-zinc-100'}`}>
                    <p className={`text-[11px] uppercase font-bold tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Các lý do có thể xảy ra:</p>
                    <ul className={`text-xs space-y-2 list-disc pl-4 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        <li>Thẻ tín dụng/ghi nợ không đủ số dư.</li>
                        <li>Thông tin thanh toán không chính xác.</li>
                        <li>Giao dịch bị từ chối từ phía ngân hàng.</li>
                        <li>Kết nối bị gián đoạn giữa chừng.</li>
                    </ul>
                </div>

                <div className="flex flex-col gap-4">
                    <Button 
                        onClick={() => navigate('/cart')}
                        variant="primary" 
                        className="h-14 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Thử lại giỏ hàng
                    </Button>
                    
                    <div className="flex gap-4">
                        <Button 
                            onClick={() => window.location.reload()}
                            variant="outline" 
                            className={`flex-1 h-12 rounded-xl text-[10px] uppercase font-bold tracking-widest ${isDark ? 'border-white/5 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Tải lại
                        </Button>
                        <Button 
                            variant="outline" 
                            className={`flex-1 h-12 rounded-xl text-[10px] uppercase font-bold tracking-widest ${isDark ? 'border-white/5 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}
                        >
                            <PhoneCall className="w-4 h-4 mr-2" />
                            Hỗ trợ
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutFailPage;
