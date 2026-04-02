import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import productApi from '../../../api/product.api';
import { toast } from 'sonner';
import AdminHeader from '../../../components/admin/Common/AdminHeader';
import SearchBanner from '../../../components/admin/Common/SearchBanner';
import ProductTable from '../../../components/admin/Product/ProductTable';

const ProductListPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const formatCurrency = (amt) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amt || 0);

    const [selectedIds, setSelectedIds] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await productApi.getAll({ search: searchTerm, limit: 50 });
            setProducts(data.rows || []);
            setCount(data.count || 0);
            setSelectedIds([]);
            setIsAllSelected(false);
        } catch {
            toast.error('Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(products.map(p => p.id));
        }
        setIsAllSelected(!isAllSelected);
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    useEffect(() => { fetchProducts(); }, [searchTerm]);

    const handleDelete = async (product) => {
        if (!window.confirm(`Xóa sản phẩm "${product.name}"?`)) return;
        try {
            await productApi.delete(product.id);
            toast.success('Đã xóa sản phẩm');
            fetchProducts();
        } catch {
            toast.error('Không thể xóa sản phẩm');
        }
    };

    return (
        <div className="space-y-6 pb-10 pill-roboto">
            <AdminHeader
                title="Quản lý sản phẩm"
                subtitle="Quản lý toàn bộ kho hàng đồng hồ"
                actions={
                    <Button
                        onClick={() => navigate('/admin/products/create')}
                        className="bg-amber-600 hover:bg-amber-700 text-white gap-2 h-11 px-6 rounded-xl font-bold shadow-lg shadow-amber-600/20 transition-all active:scale-95"
                    >
                        <Plus className="h-4 w-4" /> Thêm sản phẩm mới
                    </Button>
                }
            />

            <SearchBanner
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Tìm kiếm sản phẩm..."
                onRefresh={fetchProducts}
                loading={loading}
                count={count}
                countLabel="Sản phẩm"
            >
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-100 animate-in fade-in slide-in-from-left-2 transition-all">
                        <span className="text-xs font-bold text-amber-700">Đã chọn {selectedIds.length}</span>
                        <div className="w-px h-3 bg-amber-200 mx-1" />
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded-md px-2">Xóa bỏ</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-slate-600 hover:bg-white rounded-md px-2">Ẩn đi</Button>
                    </div>
                )}
            </SearchBanner>

            <ProductTable
                products={products}
                loading={loading}
                selectedIds={selectedIds}
                toggleSelect={toggleSelect}
                toggleSelectAll={toggleSelectAll}
                isAllSelected={isAllSelected}
                formatCurrency={formatCurrency}
                onEdit={(id) => navigate(`/admin/products/edit/${id}`)}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default ProductListPage;

