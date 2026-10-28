import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import AccountLayout from "@/components/client/AccountLayout";
import NoticeCard from "@/components/client/NoticeCard";
import WishlistCard from "@/components/client/wishlist/WishlistCard";
import { buttonVariants } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

const DiscoverLink = () => (
  <Link
    to="/products"
    className={cn(buttonVariants({ variant: "buy", size: "sm" }), "gap-1.5 print:hidden")}
  >
    Xem bộ sưu tập
    <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
  </Link>
);

const CardSkeleton = () => (
  <div className="aspect-square animate-pulse rounded-xl border border-border bg-muted/40" />
);

/** Danh sách yêu thích: một nguồn dữ liệu (WishlistContext), một đường vào (/wishlist). */
const WishlistPage = () => {
  const { wishlist, loading, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <AccountLayout
      title="Sản phẩm yêu thích"
      subtitle={
        wishlist.length > 0
          ? `${wishlist.length} món đang lưu — bỏ lưu bất cứ lúc nào, giá vẫn cập nhật theo trang sản phẩm.`
          : "Lưu những mẫu bạn đang cân nhắc để quay lại sau."
      }
      actions={<DiscoverLink />}
    >
      {loading && wishlist.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : wishlist.length === 0 ? (
        <NoticeCard
          icon={Heart}
          title="Chưa lưu món nào"
          description="Bấm trái tim ở góc thẻ sản phẩm là món đó sẽ xuất hiện ở đây, kể cả khi bạn chưa sẵn sàng đặt hàng."
        >
          <DiscoverLink />
        </NoticeCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {wishlist.map((product) => (
            <WishlistCard
              key={product.id}
              product={product}
              onAddToCart={(item) => addToCart(item, 1)}
              onRemove={toggleWishlist}
            />
          ))}
        </div>
      )}
    </AccountLayout>
  );
};

export default WishlistPage;
