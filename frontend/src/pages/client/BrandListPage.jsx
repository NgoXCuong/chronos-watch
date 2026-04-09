import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search,
    ArrowRight,
    Clock,
    ShieldCheck,
    Award,
    History
} from 'lucide-react';
import brandApi from '../../api/brand.api';
import { toast } from 'sonner';
import { useTheme } from '../../context/ThemeContext';

const BrandListPage = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { theme } = useTheme();

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
            <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-zinc-50 dark:bg-zinc-950">
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-16 h-16 border-l-2 border-amber-600 rounded-full animate-spin"></div>
                    <Clock size={24} className="text-zinc-300 dark:text-zinc-700" />
                </div>
                <p className="text-xs font-medium  text-zinc-600 uppercase">Đang giải mã di sản...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 selection:bg-amber-500/30">

            {/* HERO SECTION - EDITORIAL LUXURY */}
            <section className="relative pt-6 pb-6 px-6 border-b border-zinc-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950">
                <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
                    <span className="text-xs font-semibold  text-amber-600 dark:text-amber-500 uppercase">
                        The Chronos Archives
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-zinc-900 dark:text-white leading-tight">
                        Tinh Hoa <br className="md:hidden" />
                        <span className="italic font-light text-zinc-700 dark:text-zinc-600">Chế Tác</span>
                    </h1>
                    <p className="text-zinc-700 dark:text-zinc-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        Tập hợp những nhà chế tác vĩ đại nhất. Mỗi thương hiệu là một chương hào hùng trong lịch sử đo lường thời gian của nhân loại.
                    </p>
                </div>

                {/* Background Accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-amber-500/5 dark:bg-amber-500/10 blur-[100px] pointer-events-none"></div>
            </section>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto py-6 px-6 space-y-6">

                {/* Search & Meta */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="relative w-full md:max-w-md group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-amber-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm thương hiệu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-all placeholder:text-zinc-600 shadow-sm"
                        />
                    </div>

                    <div className="flex items-center gap-12 text-center">
                        <div>
                            <p className="text-2xl text-zinc-900 dark:text-white">{brands.length}</p>
                            <p className="text-[10px]  text-zinc-700 uppercase mt-1">Thương Hiệu</p>
                        </div>
                        <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800"></div>
                        <div>
                            <p className="text-2xl  text-zinc-900 dark:text-white">100%</p>
                            <p className="text-[10px] text-zinc-700 uppercase mt-1">Chính Hãng</p>
                        </div>
                    </div>
                </div>

                {/* Brand Grid */}
                {filteredBrands.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                        <History size={48} strokeWidth={1} className="mx-auto mb-4 text-zinc-300 dark:text-zinc-700" />
                        <h3 className="text-lg font-serif text-zinc-900 dark:text-white">Không tìm thấy kết quả</h3>
                        <p className="text-sm text-zinc-700 mt-2">Vui lòng thử lại với từ khóa khác.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBrands.map((brand) => (
                            <div
                                key={brand.id}
                                onClick={() => navigate(`/products?brand=${brand.id}`)}
                                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl cursor-pointer hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:shadow-xl hover:shadow-zinc-200/40 dark:hover:shadow-none transition-all duration-500 flex flex-col justify-between h-full"
                            >
                                <div className="space-y-6">
                                    <div className="h-24 w-full flex items-center justify-center p-2 mb-4">
                                        <img
                                            src={brand.logo_url}
                                            alt={brand.name}
                                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-all duration-500"
                                        />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-xl font-serif text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                                            {brand.name}
                                        </h3>
                                        <p className="text-xs text-zinc-700 leading-relaxed line-clamp-2">
                                            {brand.description || "Thương hiệu đồng hồ cao cấp với bề dày lịch sử và nghệ thuật chế tác đỉnh cao."}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between group-hover:border-amber-100 dark:group-hover:border-amber-900/30 transition-colors">
                                    <span className="text-[10px] font-semibold  uppercase text-zinc-600 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                                        Khám phá
                                    </span>
                                    <ArrowRight size={16} className="text-zinc-300 dark:text-zinc-600 group-hover:text-amber-600 dark:group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CURATED SECTION - EDITORIAL STYLE */}
            <section className="max-w-7xl mx-auto pb-12 px-6">
                <div className="bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col md:flex-row">

                    {/* Content Half */}
                    <div className="p-12 md:p-16 lg:p-20 flex-1 flex flex-col justify-center space-y-8 relative">
                        <Award size={120} className="absolute top-10 right-10 text-zinc-800/50 pointer-events-none" strokeWidth={0.5} />

                        <div className="space-y-4 relative z-10">
                            <span className="text-xs font-semibold  text-amber-500 uppercase">
                                Tiêu Chuẩn Chronos
                            </span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
                                Tôn vinh <br />
                                <span className="italic text-zinc-200">Nghệ thuật đích thực</span>
                            </h2>
                            <p className="text-zinc-200 font-light leading-relaxed max-w-md pt-4">
                                Không chỉ là cỗ máy đếm thời gian, mỗi sản phẩm tại Chronos là một kiệt tác vi cơ học được kiểm định nghiêm ngặt về nguồn gốc và độ hoàn thiện.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-800 relative z-10">
                            <div className="space-y-3">
                                <Clock size={24} className="text-amber-500" />
                                <h4 className="text-white text-sm font-medium">Chính xác tuyệt đối</h4>
                                <p className="text-xs text-zinc-200">Hiệu chuẩn theo tiêu chuẩn Thụy Sĩ</p>
                            </div>
                            <div className="space-y-3">
                                <ShieldCheck size={24} className="text-amber-500" />
                                <h4 className="text-white text-sm font-medium">Bảo chứng toàn cầu</h4>
                                <p className="text-xs text-zinc-200">Đầy đủ giấy tờ chứng nhận quốc tế</p>
                            </div>
                        </div>
                    </div>

                    {/* Image Half */}
                    <div className="w-full md:w-5/12 lg:w-1/2 min-h-[400px] relative">
                        <img
                            src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800"
                            alt="Watchmaking craftsmanship"
                            className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-transparent md:hidden"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BrandListPage;