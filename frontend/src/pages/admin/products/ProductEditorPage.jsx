import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import productApi from '../../../api/product.api';
import brandApi from '../../../api/brand.api';
import categoryApi from '../../../api/category.api';
import { toast } from 'sonner';

// Import refactored components
import BasicInfo from '../../../components/admin/Product/Editor/BasicInfo';
import ProductDescription from '../../../components/admin/Product/Editor/ProductDescription';
import ProductSpecifications from '../../../components/admin/Product/Editor/ProductSpecifications';
import ProductPricing from '../../../components/admin/Product/Editor/ProductPricing';
import ProductCategorization from '../../../components/admin/Product/Editor/ProductCategorization';
import ProductImages from '../../../components/admin/Product/Editor/ProductImages';

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
        setGalleryFiles(prev => prev.filter((_, i) => i !== (index - (galleryPreviews.length - galleryFiles.length))));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
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
                    <BasicInfo form={form} setForm={setForm} />
                    
                    <ProductDescription 
                        form={form} 
                        setForm={setForm} 
                        quillModules={quillModules} 
                    />

                    <ProductSpecifications form={form} setForm={setForm} />
                </div>

                {/* Sidebar Area */}
                <div className="space-y-6">
                    <ProductPricing form={form} setForm={setForm} />

                    <ProductCategorization 
                        form={form} 
                        setForm={setForm} 
                        brands={brands} 
                        categories={categories} 
                    />

                    <ProductImages 
                        imagePreview={imagePreview}
                        imageRef={imageRef}
                        handleImageChange={handleImageChange}
                        galleryPreviews={galleryPreviews}
                        galleryRef={galleryRef}
                        handleGalleryChange={handleGalleryChange}
                        removeGalleryItem={removeGalleryItem}
                    />
                </div>
            </form>
        </div>
    );
};

export default ProductEditorPage;
