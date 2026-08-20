import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const clearError = useCallback(() => setError(null), []);

    const fetchCartItems = useCallback(async () => {
        if (!token) {
            setCartItems([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        clearError();

        try {
            const response = await axios.get("/api/v1/cart");
            setCartItems(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to fetch cart items:", error);
            setError(error.response?.data?.message || "Failed to fetch cart items.");
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    }, [token, clearError]);

    const addCartItem = async (productId, quantity = 1) => {
        if (!token) {
            setError("Please login before adding products to cart.");
            return false;
        }

        clearError();

        try {
            const response = await axios.post("/api/v1/cart/add", {
                productId,
                quantity: Math.max(Number(quantity) || 1, 1),
            });

            setCartItems((prevItems) => {
                const existingIndex = prevItems.findIndex(
                    (item) => item.id === response.data.id
                );

                if (existingIndex !== -1) {
                    const updated = [...prevItems];
                    updated[existingIndex] = response.data;
                    return updated;
                }

                return [...prevItems, response.data];
            });

            return true;
        } catch (error) {
            console.error("Failed to add item to cart:", error);
            setError(error.response?.data?.message || "Failed to add item to cart.");
            return false;
        }
    };

    const removeCartItem = async (cartItemId) => {
        if (!token) {
            setError("Please login before modifying your cart.");
            return false;
        }

        clearError();

        try {
            await axios.delete(`/api/v1/cart/${cartItemId}`);
            setCartItems((prevItems) =>
                prevItems.filter((item) => item.id !== cartItemId)
            );
            return true;
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
            setError(error.response?.data?.message || "Failed to remove item from cart.");
            return false;
        }
    };

    const updateCartItemQuantity = async (cartItemId, quantity) => {
        if (!token) {
            setError("Please login before modifying your cart.");
            return false;
        }

        const requestedQuantity = Math.max(Number(quantity) || 1, 1);
        clearError();

        try {
            const response = await axios.patch(
                `/api/v1/cart/${cartItemId}`,
                { quantity: requestedQuantity }
            );

            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === cartItemId ? response.data : item
                )
            );

            return true;
        } catch (error) {
            console.error("Failed to update item quantity:", error);
            setError(error.response?.data?.message || "Failed to update item quantity.");
            return false;
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    const subTotal = cartItems.reduce(
        (total, item) =>
            total + Number(item.product?.price || 0) * Number(item.quantity || 0),
        0
    );

    const cartCount = cartItems.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                loading,
                error,
                clearError,
                subTotal: subTotal.toFixed(2),
                cartCount,
                fetchCartItems,
                addCartItem,
                removeCartItem,
                updateCartItemQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }

    return context;
};
