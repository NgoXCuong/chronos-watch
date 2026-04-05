import React, { useState, useEffect } from 'react';
import {
    MapPin,
    Plus,
    Edit2,
    Trash2,
    CheckCircle2,
    MoreVertical,
    Phone,
    User,
    X,
    Check
} from 'lucide-react';
import { toast } from 'sonner';
import userAddressApi from '../../../api/user_address.api';

const AddressTab = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        recipient_name: '',
        recipient_phone: '',
        address_line: '',
        ward: '',
        district: '',
        city: '',
        is_default: false
    });

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await userAddressApi.getAll();
            setAddresses(response.data || response);
        } catch (error) {
            console.error('Fetch addresses error:', error);
            toast.error('Không thể tải danh sách địa chỉ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleOpenModal = (address = null) => {
        if (address) {
            setEditingAddress(address);
            setFormData({
                recipient_name: address.recipient_name,
                recipient_phone: address.recipient_phone,
                address_line: address.address_line,
                ward: address.ward || '',
                district: address.district || '',
                city: address.city,
                is_default: address.is_default
            });
        } else {
            setEditingAddress(null);
            setFormData({
                recipient_name: '',
                recipient_phone: '',
                address_line: '',
                ward: '',
                district: '',
                city: '',
                is_default: addresses.length === 0 // Default true if it's the first address
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAddress(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingAddress) {
                await userAddressApi.update(editingAddress.id, formData);
                toast.success('Cập nhật địa chỉ thành công');
            } else {
                await userAddressApi.create(formData);
                toast.success('Thêm địa chỉ mới thành công');
            }
            handleCloseModal();
            fetchAddresses();
        } catch (error) {
            console.error('Save address error:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu địa chỉ');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

        try {
            await userAddressApi.delete(id);
            toast.success('Đã xóa địa chỉ');
            fetchAddresses();
        } catch (error) {
            console.error('Delete address error:', error);
            toast.error('Không thể xóa địa chỉ');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await userAddressApi.setDefault(id);
            toast.success('Đã thay đổi địa chỉ mặc định');
            fetchAddresses();
        } catch (error) {
            console.error('Set default error:', error);
            toast.error('Không thể thiết lập địa chỉ mặc định');
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-serif font-medium text-zinc-900 dark:text-white mb-1 tracking-tight">Sổ địa chỉ</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light">Quản lý các địa chỉ giao hàng của bạn để thanh toán nhanh hơn.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-amber-600/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Thêm địa chỉ mới
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-zinc-500 dark:text-zinc-400 animate-pulse">Đang tải địa chỉ...</p>
                </div>
            ) : addresses.length === 0 ? (
                <div className="text-center py-20 bg-zinc-100/50 dark:bg-zinc-900/30 rounded-3xl border border-zinc-200 dark:border-zinc-800/50 border-dashed">
                    <MapPin className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-serif text-zinc-900 dark:text-white mb-2 font-medium">Bạn chưa lưu địa chỉ nào</h3>
                    <p className="text-zinc-500 font-light max-w-xs mx-auto mb-8">Hãy thêm địa chỉ nhận hàng đầu tiên để dễ dàng đặt mua những chiếc đồng hồ Chronos.</p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-8 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all font-medium text-sm"
                    >
                        Bắt đầu ngay
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className={`group relative bg-white dark:bg-zinc-900/60 border rounded-2xl p-6 transition-all shadow-sm hover:shadow-md dark:shadow-none ${addr.is_default
                                    ? 'border-amber-500/50 ring-1 ring-amber-500/20'
                                    : 'border-zinc-100 dark:border-zinc-800 hover:border-amber-500/30'
                                }`}
                        >
                            {addr.is_default && (
                                <div className="absolute top-5 right-5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Mặc định
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl group-hover:bg-amber-500/10 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                                        <User className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-amber-600 dark:group-hover:text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Người nhận</p>
                                        <p className="text-zinc-900 dark:text-white font-medium">{addr.recipient_name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                                        <Phone className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                                    </div>
                                    <div>
                                        <p className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Liên hệ</p>
                                        <p className="text-zinc-900 dark:text-white font-medium">{addr.recipient_phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                                        <MapPin className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                                    </div>
                                    <div>
                                        <p className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Địa chỉ</p>
                                        <p className="text-zinc-900 dark:text-white font-medium text-sm leading-relaxed">
                                            {addr.address_line}
                                            {addr.ward && `, ${addr.ward}`}
                                            {addr.district && `, ${addr.district}`}
                                            {addr.city && `, ${addr.city}`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1">
                                    {!addr.is_default && (
                                        <button
                                            onClick={() => handleSetDefault(addr.id)}
                                            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
                                        >
                                            Đặt làm mặc định
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleOpenModal(addr)}
                                        className="p-2 text-zinc-400 dark:text-zinc-600 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-500/5 rounded-lg transition-all"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        className="p-2 text-zinc-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all"
                                        title="Xóa"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <header className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                            <h3 className="text-xl font-serif font-medium text-zinc-900 dark:text-white">
                                {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-500 transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </header>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Người nhận</label>
                                    <input
                                        type="text"
                                        name="recipient_name"
                                        value={formData.recipient_name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500/50 transition-all"
                                        placeholder="Họ và tên"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Số điện thoại</label>
                                    <input
                                        type="text"
                                        name="recipient_phone"
                                        value={formData.recipient_phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500/50 transition-all"
                                        placeholder="Số điện thoại"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Địa chỉ cụ thể (Số nhà, tên đường)</label>
                                <input
                                    type="text"
                                    name="address_line"
                                    value={formData.address_line}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500/50 transition-all"
                                    placeholder="Ví dụ: 123 Đường Láng"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Phường/Xã</label>
                                    <input
                                        type="text"
                                        name="ward"
                                        value={formData.ward}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500/50 transition-all"
                                        placeholder="Phường/Xã"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Quận/Huyện</label>
                                    <input
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500/50 transition-all"
                                        placeholder="Quận/Huyện"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Tỉnh/Thành phố</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500/50 transition-all"
                                        placeholder="Tỉnh/Thành phố"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <label className="relative flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_default"
                                        checked={formData.is_default}
                                        onChange={handleInputChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                                </label>
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">Đặt làm địa chỉ mặc định</span>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-6 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-amber-600/20"
                                >
                                    {submitting ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            {editingAddress ? 'Lưu thay đổi' : 'Thêm địa chỉ'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressTab;
