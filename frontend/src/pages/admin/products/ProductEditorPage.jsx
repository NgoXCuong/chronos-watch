import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Save,
    ArrowLeft,
    Upload,
    X,
    Plus,
    AlertCircle,
    Image as ImageIcon,
    LayoutDashboard,
    Tag,
    Layers,
    DollarSign,
    Box
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import productApi from '../../../api/product.api';
import brandApi from '../../../api/brand.api';
import categoryApi from '../../../api/category.api';
import { toast } from 'sonner';

const EMPTY_FORM = {
    name: '', slug: '', price: '', old_price: '', stock: '', brand_id: '',
    description: '', status: 'active',
    specifications: [],   // [{key: '', value: ''}]
    category_ids: []
};

// convert [{key,value}] -> object
const specsToObj = (arr) => arr.reduce((acc, { key, value }) => {
    if (key.trim()) acc[key.trim()] = value;
    return acc;
}, {});

// convert object -> [{key,value}]
const objToSpecs = (obj) => Object.entries(obj || {}).map(([key, value]) => ({ key, value }));

const Label = ({ children }) => (
    <label className="block text-sm font-semibold text-slate-800 mb-1.5">{children}</label>
);

const SectionTitle = ({ icon: Icon, children }) => (
    <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
        <Icon className="h-4 w-4 text-amber-600" />
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{children}</h3>
    </div>
);

const ProductEditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    // Image states
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    const imageRef = useRef();
    const galleryRef = useRef();

    const fetchOptions = async () => {
        try {
            const [b, c] = await Promise.all([brandApi.getAll(), categoryApi.getAll()]);
            setBrands(Array.isArray(b) ? b : []);
            const flatCats = [];
            const flatten = (list, level = 0) => list.forEach(cat => {
                flatCats.push({ ...cat, level });
                if (cat.children?.length) flatten(cat.children, level + 1);
            });
            flatten(Array.isArray(c) ? c : []);
            setCategories(flatCats);
        } catch { /* silent */ }
    };

    const fetchProduct = async () => {
        if (!isEdit) return;
        try {
            const product = await productApi.getDetail(id);
            setForm({
                name: product.name || '', slug: product.slug || '',
                price: product.price || '', old_price: product.old_price || '',
                stock: product.stock ?? '', brand_id: product.brand_id || '',
                description: product.description || '', status: product.status || 'active',
                specifications: objToSpecs(product.specifications),
                category_ids: product.categories?.map(c => c.id) || []
            });
            setImagePreview(product.image_url || null);
            if (product.image_gallery) {
                setGalleryPreviews(Array.isArray(product.image_gallery) ? product.image_gallery : JSON.parse(product.image_gallery));
            }
        } catch (err) {
            toast.error('Không thể tải thông tin sản phẩm');
            navigate('/admin/products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOptions();
        if (isEdit) fetchProduct();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        setGalleryFiles(prev => [...prev, ...files]);
        const previews = files.map(f => URL.createObjectURL(f));
        setGalleryPreviews(prev => [...prev, ...previews]);
    };

    const removeGalleryItem = (index) => {
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
        // Note: Removing from galleryFiles is tricky because some might be URLs from DB
        setGalleryFiles(prev => prev.filter((_, i) => i !== (index - (galleryPreviews.length - galleryFiles.length))));
    };

    const toggleCategory = (catId) => {
        setForm(f => ({
            ...f,
            category_ids: f.category_ids.includes(catId)
                ? f.category_ids.filter(cid => cid !== catId)
                : [...f.category_ids, catId]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.price) return toast.error('Tên và giá bán là bắt buộc');

        setSaving(true);
        try {
            const fd = new FormData();
            ['name', 'slug', 'price', 'old_price', 'stock', 'brand_id', 'description', 'status'].forEach(k => {
                if (form[k] !== undefined && form[k] !== null) fd.append(k, form[k]);
            });
            fd.append('specifications', JSON.stringify(specsToObj(form.specifications)));
            fd.append('category_ids', JSON.stringify(form.category_ids));

            if (imageFile) fd.append('image', imageFile);
            galleryFiles.forEach(f => fd.append('gallery', f));

            if (isEdit) {
                await productApi.update(id, fd);
                toast.success('Cập nhật sản phẩm thành công!');
            } else {
                await productApi.create(fd);
                toast.success('Thêm sản phẩm thành công!');
            }
            navigate('/admin/products');
        } catch (err) {
            toast.error(err?.message || 'Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    // Quill config
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image'],
            ['clean']
        ],
    };

    if (loading) return (
        <div className="h-96 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/admin/products" className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-amber-600 hover:border-amber-200 transition-all shadow-sm">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                        <p className="text-sm text-slate-500">{isEdit ? 'Cập nhật thông tin chi tiết cho sản phẩm' : 'Tạo một sản phẩm mới vào kho hàng'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate('/admin/products')} className="px-6 rounded-xl border-slate-200">Hủy</Button>
                    <Button onClick={handleSubmit} disabled={saving} className="bg-amber-600 hover:bg-amber-700 text-white px-8 rounded-xl gap-2 shadow-lg shadow-amber-600/20 font-bold">
                        <Save className="h-4 w-4" /> {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                        <SectionTitle icon={LayoutDashboard}>Thông tin cơ bản</SectionTitle>

                        <div className="space-y-4">
                            <div>
                                <Label>Tên sản phẩm *</Label>
                                <Input
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="VD: Rolex Submariner Date Gold"
                                    className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <Label>Đường dẫn mẫu (Slug)</Label>
                                <Input
                                    value={form.slug}
                                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                                    placeholder="VD: rolex-submariner-date-gold"
                                    className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Rich Text Editor - Description */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                        <SectionTitle icon={ImageIcon}>Mô tả chi tiết sản phẩm</SectionTitle>
                        <div className="quill-luxury">
                            <ReactQuill
                                theme="snow"
                                value={form.description}
                                onChange={(val) => setForm(f => ({ ...f, description: val }))}
                                modules={quillModules}
                                placeholder="Viết mô tả sản phẩm ở đây... Bạn có thể chèn hình ảnh minh hoạ vào giữa các dòng."
                            />
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
                            <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-amber-600" />
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Thông số kỹ thuật</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setForm(f => ({ ...f, specifications: [...f.specifications, { key: '', value: '' }] }))}
                                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 transition-colors"
                            >
                                <Plus className="h-3.5 w-3.5" /> Thêm thông số
                            </button>
                        </div>

                        {form.specifications.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-100">
                                <p className="text-sm text-slate-400">Chưa có thông số nào được thiết lập.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {form.specifications.map((spec, idx) => (
                                    <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                                        <Input
                                            value={spec.key}
                                            onChange={e => {
                                                const newSpecs = [...form.specifications];
                                                newSpecs[idx].key = e.target.value;
                                                setForm(f => ({ ...f, specifications: newSpecs }));
                                            }}
                                            placeholder="Tên (VD: Máy)"
                                            className="h-10 rounded-lg bg-slate-50 border-slate-200 text-sm flex-1"
                                        />
                                        <Input
                                            value={spec.value}
                                            onChange={e => {
                                                const newSpecs = [...form.specifications];
                                                newSpecs[idx].value = e.target.value;
                                                setForm(f => ({ ...f, specifications: newSpecs }));
                                            }}
                                            placeholder="Giá trị (VD: Automatic)"
                                            className="h-10 rounded-lg bg-slate-50 border-slate-200 text-sm flex-1"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setForm(f => ({ ...f, specifications: f.specifications.filter((_, i) => i !== idx) }))}
                                            className="h-10 w-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-slate-200 transition-all"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Area */}
                <div className="space-y-6">
                    {/* Price & Stock */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                        <SectionTitle icon={DollarSign}>Giá & Kho hàng</SectionTitle>
                        <div className="space-y-4">
                            <div>
                                <Label>Giá bán (VND) *</Label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        value={form.price}
                                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                        className="h-11 pl-4 rounded-xl bg-slate-50 border-slate-200 font-bold text-amber-700"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Giá gốc (VND)</Label>
                                <Input
                                    type="number"
                                    value={form.old_price}
                                    onChange={e => setForm(f => ({ ...f, old_price: e.target.value }))}
                                    className="h-11 pl-4 rounded-xl bg-slate-50 border-slate-200 text-slate-400"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <Label>Tồn kho</Label>
                                <div className="relative">
                                    <Box className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                    <Input
                                        type="number"
                                        value={form.stock}
                                        onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                                        className="h-11 rounded-xl bg-slate-50 border-slate-200"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Trạng thái</Label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none"
                                >
                                    <option value="active">Đang kinh doanh</option>
                                    <option value="inactive">Tạm ngừng bán</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Organization */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                        <SectionTitle icon={Tag}>Phân loại</SectionTitle>
                        <div className="space-y-4">
                            <div>
                                <Label>Thương hiệu</Label>
                                <select
                                    value={form.brand_id}
                                    onChange={e => setForm(f => ({ ...f, brand_id: e.target.value }))}
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-amber-500"
                                >
                                    <option value="">— Chọn thương hiệu —</option>
                                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label>Danh mục sản phẩm</Label>
                                <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => toggleCategory(cat.id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${form.category_ids.includes(cat.id) ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-100 hover:border-amber-300'}`}
                                            style={{ marginLeft: cat.level * 12 }}
                                        >
                                            <span>{cat.name}</span>
                                            {form.category_ids.includes(cat.id) && <Plus className="h-3 w-3 rotate-45" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                        <SectionTitle icon={ImageIcon}>Hình ảnh</SectionTitle>

                        {/* Main Image */}
                        <div>
                            <Label>Ảnh đại diện (Thumbnail)</Label>
                            <div
                                onClick={() => imageRef.current.click()}
                                className="aspect-square rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all relative group"
                            >
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Thumbnail" className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                            <Upload className="h-6 w-6 text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 text-slate-300 mb-2" />
                                        <span className="text-xs text-slate-400 font-medium tracking-tight">Tải lên ảnh 1x1</span>
                                    </>
                                )}
                            </div>
                            <input ref={imageRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </div>

                        {/* Gallery */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label>Bố sưu tập ảnh</Label>
                                <button type="button" onClick={() => galleryRef.current.click()} className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">+ Thêm ảnh</button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {galleryPreviews.map((url, idx) => (
                                    <div key={idx} className="aspect-square rounded-xl bg-slate-100 border border-slate-200 relative overflow-hidden group">
                                        <img src={url} alt={`Gallery ${idx}`} className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryItem(idx)}
                                            className="absolute top-1 right-1 h-5 w-5 bg-rose-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                <div
                                    onClick={() => galleryRef.current.click()}
                                    className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:text-amber-500 hover:border-amber-300 cursor-pointer transition-all"
                                >
                                    <Plus className="h-5 w-5" />
                                </div>
                            </div>
                            <input ref={galleryRef} type="file" className="hidden" accept="image/*" multiple onChange={handleGalleryChange} />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductEditorPage;
