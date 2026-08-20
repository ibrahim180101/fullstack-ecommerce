import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

function AddToCartControls({ id }) {
    const {
        cartItems,
        addCartItem,
        updateCartItemQuantity,
        removeCartItem,
    } = useCart();

    const existingCartItem = cartItems.find(
        (item) => Number(item.product?.id) === Number(id)
    );

    const [quantity, setQuantity] = useState(
        existingCartItem?.quantity || 0
    );

    useEffect(() => {
        setQuantity(existingCartItem?.quantity || 0);
    }, [existingCartItem?.quantity, existingCartItem?.id]);

    const handleAddToCart = async () => {
        const success = await addCartItem(id, 1);
        if (success) {
            setQuantity(1);
        }
    };

    const decreaseQty = async () => {
        if (!existingCartItem) return;

        if (quantity <= 1) {
            const success = await removeCartItem(existingCartItem.id);
            if (success) setQuantity(0);
            return;
        }

        const success = await updateCartItemQuantity(
            existingCartItem.id,
            quantity - 1
        );

        if (success) {
            setQuantity((prev) => Math.max(prev - 1, 1));
        }
    };

    const increaseQty = async () => {
        if (!existingCartItem) {
            const success = await addCartItem(id, 1);
            if (success) setQuantity(1);
            return;
        }

        const success = await updateCartItemQuantity(
            existingCartItem.id,
            quantity + 1
        );

        if (success) {
            setQuantity((prev) => prev + 1);
        }
    };

    return (
        <div className="h-10 flex justify-center items-center gap-1">
            {quantity > 0 ? (
                <div className="flex items-center">
                    <button
                        type="button"
                        className="h-10 w-10 text-red-500 rounded-l hover:text-red-400 font-bold text-lg"
                        onClick={decreaseQty}
                    >
                        −
                    </button>

                    <span className="h-10 w-10 flex items-center justify-center">
                        {quantity}
                    </span>

                    <button
                        type="button"
                        className="h-10 w-10 text-blue-500 rounded-r hover:text-blue-400 font-bold text-lg"
                        onClick={increaseQty}
                    >
                        +
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    className="h-10 px-6 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </button>
            )}
        </div>
    );
}

export default AddToCartControls;
