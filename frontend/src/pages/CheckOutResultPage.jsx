import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "../api/axios";
import { useCart } from "../context/CartContext";

function CheckOutResultPage({ success }) {
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(true);
    const { clearCart } = useCart();

    useEffect(() => {
        const completeOrder = async () => {
            if (!success) {
                setProcessing(false);
                return;
            }

            const sessionId = searchParams.get("session_id");

            if (!sessionId) {
                setError("Stripe session ID is missing.");
                setProcessing(false);
                return;
            }

            try {
                const response = await axios.post(
                    `/api/v1/stripe/complete-order?sessionId=${encodeURIComponent(sessionId)}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        },
                    }
                );

                setOrder(response.data);

                // The backend has already saved the order and cleared the
                // user's cart in RDS. Clear the frontend cart state too.
                clearCart();
            } catch (err) {
                console.error("Order completion error:", err);
                setError(
                    err.response?.data?.error ||
                    "Payment succeeded, but we could not save the order."
                );
            } finally {
                setProcessing(false);
            }
        };

        completeOrder();
    }, [success, searchParams, clearCart]);

    const isSuccessful = success && !error && !processing && order;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
            {processing ? (
                <>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-blue-600 text-white text-3xl font-bold">
                        ...
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-blue-700">
                        Confirming your order...
                    </h1>
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                        Please wait while we save your order.
                    </p>
                </>
            ) : (
                <>
                    <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white text-3xl font-bold ${
                            isSuccessful ? "bg-green-600" : "bg-red-600"
                        }`}
                    >
                        {isSuccessful ? "✓" : "✗"}
                    </div>

                    <h1
                        className={`text-3xl font-bold mb-2 ${
                            isSuccessful ? "text-green-700" : "text-red-700"
                        }`}
                    >
                        {isSuccessful ? "Order Successful!" : "Order Processing Failed"}
                    </h1>

                    {isSuccessful ? (
                        <>
                            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                                Thank you for your purchase.
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 mb-1">
                                Order ID: <strong>{order.orderId}</strong>
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 mb-6">
                                Total: <strong>${order.totalAmount}</strong>
                            </p>
                        </>
                    ) : (
                        <p className="text-lg text-red-700 dark:text-red-400 mb-6 max-w-lg">
                            {error || "Something went wrong. Please contact support."}
                        </p>
                    )}

                    <Link
                        to="/products"
                        className={`inline-block px-6 py-2 rounded font-semibold transition ${
                            isSuccessful
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                    >
                        Return to Products
                    </Link>
                </>
            )}
        </div>
    );
}

export default CheckOutResultPage;
