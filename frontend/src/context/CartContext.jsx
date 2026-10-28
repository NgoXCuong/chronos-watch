import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import cartApi from '../api/cart.api';
import flashSaleApi from '../api/flashSale.api';
import { indexFlashItemsByProduct } from '../utils/flashSale';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('chronos_cart') || '[]');
      // Giỏ tạm có thể còn sản phẩm vừa bị ngừng bán; loại bỏ ngay khi mở lại trang.
      return Array.isArray(savedCart)
        ? savedCart.filter((item) => item.status !== 'inactive')
        : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync cart with localStorage
  useEffect(() => {
    localStorage.setItem('chronos_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync LOCAL cart with SERVER cart on login
  useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated && cart.length > 0) {
        setIsSyncing(true);
        try {
          // Sync local items to server
          const res = await cartApi.sync(cart);
          // Update local state with the merged server cart
          const serverCart = res.data?.cart || [];
          
          // Map server items to frontend format
          const formattedCart = serverCart.map(item => ({
            id: item.product_id,
            name: item.product?.name,
            price: item.product?.price,
            image_url: item.product?.image_url,
            quantity: item.quantity,
            stock: item.product?.stock,
            slug: item.product?.slug,
            status: item.product?.status
          }));

          setCart(formattedCart);
          // toast.success('Giỏ hàng đã được đồng bộ');
        } catch (err) {
          console.error('Failed to sync cart', err);
        } finally {
          setIsSyncing(false);
        }
      } else if (isAuthenticated) {
        // Just fetch server cart if local is empty
        try {
          const res = await cartApi.getCart();
          const serverCart = res.data || [];
          const formattedCart = serverCart.map(item => ({
            id: item.product_id,
            name: item.product?.name,
            price: item.product?.price,
            image_url: item.product?.image_url,
            quantity: item.quantity,
            stock: item.product?.stock,
            slug: item.product?.slug,
            status: item.product?.status
          }));
          setCart(formattedCart);
        } catch (err) {
          console.error('Failed to fetch cart', err);
        }
      }
    };

    syncCart();
  }, [isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    const productId = product.id || product._id;

    if (product.status && product.status !== 'active') {
      toast.error('Sản phẩm đã ngừng bán');
      return;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (isAuthenticated) {
      try {
        await cartApi.add(productId, quantity);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Lỗi khi cập nhật giỏ hàng trên máy chủ');
        return;
      }
    }

    if (existingItem) {
      toast.info(`Cập nhật số lượng cho ${product.name}`);
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + quantity } : item
        )
      );
    } else {
      toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
      setCart(prevCart => [...prevCart, { ...product, id: productId, quantity }]);
    }
  };

  const removeFromCart = async (productId) => {
    const itemToRemove = cart.find(item => item.id === productId);
    if (itemToRemove) {
      if (isAuthenticated) {
        try {
          await cartApi.remove(productId);
        } catch (err) {
          console.error('Failed to remove from server cart', err);
        }
      }
      toast.error('Đã xóa sản phẩm khỏi giỏ hàng');
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    
    if (isAuthenticated) {
      try {
        await cartApi.update(productId, quantity);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Không cập nhật được số lượng sản phẩm');
        return;
      }
    }

    setCart(prevCart =>
      prevCart.map(item => item.id === productId ? { ...item, quantity } : item)
    );
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartApi.clear();
      } catch (err) {
        console.error('Failed to clear server cart', err);
      }
    }
    setCart([]);
    localStorage.removeItem('chronos_cart');
  };

  // Giá Flash: backend mới là nơi chốt đơn (order.service tra đợt đang chạy), nhưng
  // khách cần thấy ĐÚNG số tiền sẽ trả ngay ở giỏ/checkout thay vì bị bất ngờ ở bước sau.
  const [flashByProduct, setFlashByProduct] = useState({});

  useEffect(() => {
    let alive = true;
    flashSaleApi
      .getCurrent()
      .then((data) => alive && setFlashByProduct(indexFlashItemsByProduct(data?.items || [])))
      .catch(() => {}); // không có đợt / lỗi mạng → giỏ tính giá niêm yết
    return () => {
      alive = false;
    };
  }, [cart.length]);

  const flashOf = (item) => {
    const flash = flashByProduct[String(item.id)];
    return flash && !flash.sold_out ? flash : null;
  };
  const unitPriceOf = (item) => Number(flashOf(item)?.flash_price ?? item.price);

  const cartSubtotal = cart.reduce((total, item) => total + unitPriceOf(item) * item.quantity, 0);
  // Tổng theo GIÁ NIÊM YẾT để bảng tóm tắt trừ ra số tiền tiết kiệm mà không
  // "ăn gian" hai lần (cartSubtotal đã mang giá flash).
  const listSubtotal = cart.reduce((total, item) => total + Number(item.price || 0) * item.quantity, 0);
  const flashSavings = listSubtotal - cartSubtotal;
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const shippingFee = 0; // Miễn phí vận chuyển toàn quốc
  const discountAmount = promoCode ? (cartSubtotal * promoCode.discount / 100) : 0;
  const cartTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartSubtotal,
      listSubtotal,
      cartCount,
      shippingFee,
      cartTotal,
      promoCode,
      setPromoCode,
      discountAmount,
      flashSavings,
      flashOf,
      unitPriceOf,
      isSyncing
    }}>
      {children}
    </CartContext.Provider>
  );
};
