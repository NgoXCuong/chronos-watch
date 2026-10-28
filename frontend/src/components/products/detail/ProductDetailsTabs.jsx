import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Package, Ruler, ScrollText, Truck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import ProductReviews from './ProductReviews';
import ProductEditorial from './ProductEditorial';
import SpecsPanel from './SpecsPanel';
import SizeGuidePanel from './SizeGuidePanel';
import ShippingPanel from './ShippingPanel';

const TABS = [
    { value: 'story', label: 'Câu chuyện sản phẩm', icon: ScrollText },
    { value: 'specs', label: 'Thông số kỹ thuật', icon: Package },
    { value: 'size', label: 'Chọn cỡ', icon: Ruler },
    { value: 'shipping', label: 'Vận chuyển', icon: Truck },
    { value: 'reviews', label: 'Đánh giá', icon: MessageSquare },
];

/**
 * Tabs dưới trang chi tiết. Tab đang mở lấy từ `#hash` của URL (link "#reviews" từ trang
 * khác nhảy đúng tab) và mỗi lần đổi tab ghi hash lại — không state riêng nên không có
 * hiệu ứng đồng bộ setState trong effect.
 */
const ProductDetailsTabs = ({ product }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const activeTab = TABS.some((tab) => tab.value === location.hash.replace('#', '')) ? location.hash.replace('#', '') : 'story';

    return (
        <section className="mt-10 border-t border-border pt-6 md:mt-14">
            <Tabs value={activeTab} onValueChange={(next) => navigate({ hash: next }, { replace: true })} className="w-full">
                <TabsList className="flex h-auto w-full flex-wrap justify-start gap-x-1 rounded-none border-b border-border bg-transparent p-0 dark:bg-transparent">
                    {TABS.map(({ value, label, icon: Icon }) => (
                        <TabsTrigger
                            key={value}
                            value={value}
                            className="flex min-w-fit flex-1 justify-center gap-1.5 rounded-none border-b-2 border-transparent px-3 py-2.5 text-[13px] data-[state=active]:border-navy-600 data-[state=active]:bg-transparent data-[state=active]:text-navy-700 data-[state=active]:shadow-none dark:data-[state=active]:text-navy-100"
                        >
                            <Icon size={14} strokeWidth={2} aria-hidden="true" />
                            {label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="story">
                    <ProductEditorial product={product} />
                </TabsContent>
                <TabsContent value="specs">
                    <SpecsPanel product={product} />
                </TabsContent>
                <TabsContent value="size">
                    <SizeGuidePanel />
                </TabsContent>
                <TabsContent value="shipping">
                    <ShippingPanel product={product} />
                </TabsContent>
                <TabsContent value="reviews">
                    <ProductReviews productId={product.id} />
                </TabsContent>
            </Tabs>
        </section>
    );
};

export default ProductDetailsTabs;
