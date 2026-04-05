import api from "./axios";

const wishlistApi = {
    getWishlist: async () => {
        const { data } = await api.get("/wishlist");
        return data;
    },
    toggleWishlist: async (productId) => {
        const { data } = await api.post("/wishlist/toggle", { product_id: productId });
        return data;
    }
};

export default wishlistApi;
