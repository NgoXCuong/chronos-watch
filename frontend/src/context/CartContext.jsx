import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import cartApi from '../api/cart.api';
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
    const savedCart = localStorage.getItem('chronos_cart');
    return savedCart ? JSON.parse(savedCart) : [];
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
            slug: item.product?.slug
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
            slug: item.product?.slug
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
    const existingItem = cart.find(item => item.id === productId);

    if (isAuthenticated) {
      try {
        await cartApi.add(productId, quantity);
      } catch (err) {
        toast.error('Lỗi khi cập nhật giỏ hàng trên máy chủ');
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
        console.error('Failed to update server quantity', err);
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

  const cartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const shippingFee = cartSubtotal > 5000000 ? 0 : 50000;
  const discountAmount = promoCode ? (cartSubtotal * promoCode.discount / 100) : 0;
  const cartTotal = cartSubtotal + shippingFee - discountAmount;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartSubtotal,
      cartCount,
      shippingFee,
      cartTotal,
      promoCode,
      setPromoCode,
      discountAmount,
      isSyncing
    }}>
      {children}
    </CartContext.Provider>
  );
};
