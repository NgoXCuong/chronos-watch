import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import wishlistApi from '../api/wishlist.api';
import { AuthContext } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('chronos_wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('chronos_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync wishlist with server on login
  useEffect(() => {
    const fetchWishlist = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          const res = await wishlistApi.getWishlist();
          // Assuming the API returns an array of products
          const formattedWishlist = res.map(item => ({
            id: item.id || item.product_id,
            name: item.name || item.product?.name,
            price: item.price || item.product?.price,
            image_url: item.image_url || item.product?.image_url,
            slug: item.slug || item.product?.slug
          }));
          setWishlist(formattedWishlist);
        } catch (err) {
          console.error('Failed to fetch wishlist', err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchWishlist();
  }, [isAuthenticated]);

  const toggleWishlist = async (product) => {
    const productId = product.id || product._id;
    const isExist = wishlist.find(item => item.id === productId);

    if (isAuthenticated) {
      try {
        await wishlistApi.toggleWishlist(productId);
      } catch (err) {
        toast.error('Lỗi khi cập nhật danh sách yêu thích trên máy chủ');
        return;
      }
    }

    if (isExist) {
      toast.info(`Đã loại bỏ ${product.name} khỏi danh sách yêu thích`);
      setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== productId));
    } else {
      toast.success(`Đã thêm ${product.name} vào danh sách yêu thích`);
      setWishlist(prevWishlist => [...prevWishlist, { ...product, id: productId }]);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('chronos_wishlist');
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
      wishlistCount: wishlist.length,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
