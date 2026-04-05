import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Search, 
    ChevronRight, 
    ArrowRight, 
    Clock, 
    ShieldCheck, 
    Package, 
    Award,
    Gem,
    History
} from 'lucide-react';
import brandApi from '../../api/brand.api';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

const BrandListPage = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const response = await brandApi.getAll();
            setBrands(Array.isArray(response) ? response : response.data || []);
        } catch (error) {
            console.error('Lỗi lấy danh sách thương hiệu:', error);
            toast.error('Không thể tải danh sách thương hiệu');
        } finally {
            setLoading(false);
        }
    };

    const filteredBrands = brands.filter(brand => 
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        brand.isActive !== false
    );

    if (loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] animate-pulse">Đang giải mã di sản...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            
            {/* HERO SECTION - LUXURY REDESIGN */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950">
                <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] block mb-4">Chronos Heritage</span>
                        <h1 className="text-5xl md:text-7xl font-serif font-medium text-zinc-900 dark:text-white tracking-tight leading-none italic">
                            Tinh Hoa <span className="text-zinc-400 dark:text-zinc-600">Thế Giới</span>
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 font-light max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                            Khám phá di sản của những nhà chế tác đồng hồ vĩ đại nhất hành tinh. Tại Chronos, chúng tôi chỉ tuyển chọn những tuyệt tác mang tính biểu tượng nhất.
                        </p>
                    </div>
                    
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mx-auto mt-12"></div>
                </div>

                {/* Decorative background logo or pattern */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] -z-0">
                    <Award size={600} strokeWidth={0.5} />
                </div>
            </section>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto py-24 px-6 space-y-16">
                
                {/* Search & Stats */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="relative w-full md:w-[450px] group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-amber-500 transition-colors duration-500" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm thương hiệu di sản..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/5 transition-all duration-500 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-amber-500 text-xl font-medium">{brands.length}</span>
                            <span className="italic">Thương Hiệu</span>
                        </div>
                        <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800"></div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-emerald-500 text-xl font-medium">100%</span>
                            <span className="italic">Chính Hãng</span>
                        </div>
                    </div>
                </div>

                {/* Brand Grid */}
                {filteredBrands.length === 0 ? (
                    <div className="text-center py-32 bg-white dark:bg-zinc-900 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                        <History size={64} className="mx-auto mb-6 text-zinc-200" />
                        <h3 className="text-xl font-serif text-zinc-900 dark:text-white">Không tìm thấy di sản này</h3>
                        <p className="text-zinc-500 mt-2 font-light">Vui lòng thử tìm kiếm với tên khác.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {filteredBrands.map((brand) => (
                            <div 
                                key={brand.id}
                                onClick={() => navigate(`/products?brand=${brand.id}`)}
                                className="group relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-10 transition-all duration-700 cursor-pointer overflow-hidden hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-none hover:-translate-y-2"
                            >
                                {/* Background Glow */}
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                                <div className="space-y-10 relative z-10">
                                    <div className="h-32 w-full flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-[2rem] border border-zinc-50 dark:border-zinc-800/50 group-hover:bg-white dark:group-hover:bg-zinc-900 transition-colors duration-700">
                                        <img 
                                            src={brand.logo_url} 
                                            alt={brand.name}
                                            className="max-h-full max-w-full object-contain grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                                        />
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-2xl font-serif font-medium text-zinc-900 dark:text-white group-hover:text-amber-600 transition-colors duration-500">
                                                {brand.name}
                                            </h3>
                                            <span className="h-2 w-2 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        </div>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed line-clamp-2">
                                            {brand.description || "Thương hiệu đồng hồ cao cấp với lịch sử phát triển hàng thế kỷ, mang đậm dấu ấn tinh hoa và chính xác."}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-zinc-50 dark:border-zinc-800 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Xem bộ sưu tập</span>
                                        <div className="h-10 w-10 bg-zinc-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-zinc-950 group-hover:bg-amber-600 dark:group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Alpha code background */}
                                <div className="absolute top-4 left-4 text-[60px] font-serif font-black text-zinc-50 dark:text-zinc-800 opacity-[0.2] -z-0 pointer-events-none group-hover:text-amber-500/5 transition-colors duration-700 uppercase leading-none">
                                    {brand.name.charAt(0)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CURATED SECTION - EXTRA LUXURY */}
            <section className="max-w-7xl mx-auto pb-32 px-6">
                <div className="bg-zinc-900 dark:bg-zinc-100 rounded-[4rem] p-12 md:p-24 overflow-hidden relative group">
                    <div className="grid md:grid-cols-2 items-center gap-16 relative z-10">
                        <div className="space-y-8">
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Chronos Commitment</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-medium text-white dark:text-zinc-900 leading-[1.1]">
                                Di Sản Của <br /> <span className="italic text-zinc-500">Thời Gian Thực Phẩm</span>
                            </h2>
                            <p className="text-zinc-400 dark:text-zinc-500 font-light text-base leading-relaxed max-w-md">
                                Mỗi thương hiệu tại Chronos đều phải trải qua quy trình kiểm định khắt khe về độ chính xác, lịch sử và tính nghệ thuật của bộ máy.
                            </p>
                            <div className="flex gap-10">
                                <div className="space-y-2">
                                    <Clock size={20} className="text-amber-500" />
                                    <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Độ chính xác tuyệt đối</p>
                                </div>
                                <div className="space-y-2">
                                    <ShieldCheck size={20} className="text-amber-500" />
                                    <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Hậu mãi đặc quyền</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/5] bg-zinc-800 dark:bg-zinc-200 rounded-[3rem] overflow-hidden rotate-3 group-hover:rotate-0 transition-transform duration-1000 shadow-[20px_20px_60px_rgba(0,0,0,0.4)]">
                                <img src="https://images.unsplash.com/photo-1547996160-81dfa63595dd?auto=format&fit=crop&q=80&w=600" alt="Luxury Watch" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
                            </div>
                            <div className="absolute -bottom-8 -left-8 h-32 w-32 bg-amber-600 rounded-[2.5rem] flex items-center justify-center -rotate-12 animate-bounce-slow">
                                <Gem size={40} className="text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0) rotate(-12deg); }
                    50% { transform: translateY(-20px) rotate(-12deg); }
                }
                .animate-bounce-slow { animation: bounce-slow 5s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default BrandListPage;
