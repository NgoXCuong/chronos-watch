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
import { cn } from '../../../lib/utils';

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
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section - Refined Spacing */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-zinc-300 dark:border-zinc-800/60">
                <div className="space-y-2">
                    <span className="text-[12px] font-black  text-amber-600 dark:text-amber-500 uppercase">
                        Logistics & Destinations
                    </span>
                    <h2 className="text-2xl md:text-3xl font-light text-zinc-900 dark:text-white ">
                        Sổ Địa Chỉ <span className="italic text-zinc-600 dark:text-zinc-700">Giao Nhận</span>
                    </h2>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="group h-11 px-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-sm font-black uppercase text-[12px]  hover:bg-amber-600 dark:hover:bg-amber-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-2"
                >
                    <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
                    Thêm địa chỉ
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                    <div className="w-10 h-10 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase  animate-pulse">Đang định vị sổ địa chỉ...</p>
                </div>
            ) : addresses.length === 0 ? (
                <div className="text-center py-24 bg-zinc-50/50 dark:bg-zinc-950/30 rounded-sm border border-dashed border-zinc-200 dark:border-zinc-800">
                    <MapPin className="w-16 h-16 text-zinc-200 dark:text-zinc-800 mx-auto mb-6" />
                    <h3 className="text-xl font-serif text-zinc-900 dark:text-white mb-3">Chưa có điểm đến</h3>
                    <p className="text-zinc-600 font-light max-w-xs mx-auto mb-10 text-sm italic">Hãy thiết lập địa chỉ để hành trình bàn giao sản phẩm được khởi đầu thuận lợi.</p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-12 py-4 border border-zinc-900 dark:border-white text-zinc-900 dark:text-white rounded-sm hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all font-black text-[10px] uppercase "
                    >
                        Khởi tạo địa chỉ đầu tiên
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className={cn(
                                "group relative bg-white dark:bg-zinc-900 border rounded-sm p-6 transition-all duration-500",
                                addr.is_default
                                    ? "border-amber-500/50 shadow-lg shadow-amber-500/5"
                                    : "border-zinc-100 dark:border-zinc-800 hover:border-amber-500/30 shadow-sm"
                            )}
                        >
                            {/* Certificate Style Badge */}
                            <div className="flex justify-between items-start mb-6">
                                <div className={cn(
                                    "p-2.5 rounded-sm transition-colors duration-500",
                                    addr.is_default ? "bg-amber-500 text-white" : "bg-zinc-50 dark:bg-zinc-950 text-zinc-600 group-hover:bg-amber-500/10 group-hover:text-amber-500"
                                )}>
                                    <MapPin className="w-4 h-4" />
                                </div>
                                {addr.is_default && (
                                    <span className="text-[10px] font-black uppercase  text-amber-600 bg-amber-500/10 px-2 py-1 rounded-sm">
                                        Mặc định
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                {/* Người nhận */}
                                <div className="flex items-baseline gap-2">
                                    <p className="text-[10px] text-zinc-600 uppercase font-black min-w-[70px] shrink-0">
                                        Người nhận:
                                    </p>
                                    <h4 className="text-md font-serif font-medium text-zinc-900 dark:text-white">
                                        {addr.recipient_name}
                                    </h4>
                                </div>

                                {/* Liên hệ */}
                                <div className="flex items-baseline gap-2">
                                    <p className="text-[10px] text-zinc-600 uppercase font-black min-w-[70px] shrink-0">
                                        Liên hệ:
                                    </p>
                                    <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                        {addr.recipient_phone}
                                    </p>
                                </div>

                                {/* Địa chỉ */}
                                <div className="flex items-baseline gap-2">
                                    <p className="text-[10px] text-zinc-600 uppercase font-black min-w-[70px] shrink-0">
                                        Địa chỉ:
                                    </p>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-1">
                                        {addr.address_line}{addr.ward && `, ${addr.ward}`}{addr.district && `, ${addr.district}`}{addr.city && `, ${addr.city}`}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-50 dark:border-zinc-800/60 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {!addr.is_default && (
                                        <button
                                            onClick={() => handleSetDefault(addr.id)}
                                            className="text-[12px] font-black uppercase  text-zinc-600 hover:text-amber-600 transition-colors"
                                        >
                                            Ưu tiên
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handleOpenModal(addr)}
                                        className="p-2 text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all transform hover:scale-110"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        className="p-2 text-zinc-300 hover:text-rose-500 transition-all transform hover:scale-110"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Form - Redesigned for Premium Luxury */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-xl rounded-sm shadow-[0_0_100px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-500">
                        <header className="px-8 py-6 border-b border-zinc-50 dark:border-zinc-800/60 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <span className="text-[10px] font-black  text-amber-600 dark:text-amber-500 uppercase">Registry</span>
                                <h3 className="text-xl font-serif font-light text-zinc-900 dark:text-white">
                                    {editingAddress ? 'Hiệu Chỉnh' : 'Thêm'} <span className="italic text-zinc-600">Địa Chỉ</span>
                                </h3>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-full text-zinc-600 transition-all transform hover:rotate-90"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </header>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-black uppercase  text-zinc-600 dark:text-zinc-700 ml-0.5">Họ và tên</label>
                                    <input
                                        type="text"
                                        name="recipient_name"
                                        value={formData.recipient_name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-200"
                                        placeholder="Tên người nhận"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-black uppercase  text-zinc-600 dark:text-zinc-700 ml-0.5">Số điện thoại</label>
                                    <input
                                        type="text"
                                        name="recipient_phone"
                                        value={formData.recipient_phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-200"
                                        placeholder="0123..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[12px] font-black uppercase  text-zinc-600 dark:text-zinc-700 ml-0.5">Địa chỉ chi tiết</label>
                                <input
                                    type="text"
                                    name="address_line"
                                    value={formData.address_line}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-200"
                                    placeholder="Số nhà, tên đường..."
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-black uppercase  text-zinc-600 dark:text-zinc-700 ml-0.5">Phường/Xã</label>
                                    <input
                                        type="text"
                                        name="ward"
                                        value={formData.ward}
                                        onChange={handleInputChange}
                                        className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-200"
                                        placeholder="Phường/Xã"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-black uppercase  text-zinc-600 dark:text-zinc-700 ml-0.5">Quận/Huyện</label>
                                    <input
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleInputChange}
                                        className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-200"
                                        placeholder="Quận/Huyện"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-black uppercase  text-zinc-600 dark:text-zinc-700 ml-0.5">Tỉnh/Thành</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-zinc-200"
                                        placeholder="Tỉnh/Thành"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 py-2 border-t border-zinc-50 dark:border-zinc-800/40">
                                <label className="relative flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_default"
                                        checked={formData.is_default}
                                        onChange={handleInputChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-8 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-checked:bg-amber-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-[16px]"></div>
                                </label>
                                <span className="text-[12px] font-black uppercase  text-zinc-700 dark:text-zinc-600">Đặt làm mặc định</span>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 h-11 border border-zinc-200 dark:border-zinc-800 text-zinc-600 rounded-sm font-black uppercase text-[12px]  hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-all"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 flex items-center justify-center gap-2 h-11 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-sm font-black uppercase text-[12px]  hover:bg-amber-600 dark:hover:bg-amber-500 hover:text-white transition-all shadow-xl disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Check className="w-3.5 h-3.5" />
                                            {editingAddress ? 'Cập nhật' : 'Xác nhận'}
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
