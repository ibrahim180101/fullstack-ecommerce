import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Alert from "../components/Alert";
import axios from "../api/axios";

function CheckOut() {
    const { cartItems, subTotal } = useCart();
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("error");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlertMessage("");

        const formData = new FormData(e.target);
        const billingDetails = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            country: formData.get("country"),
            address: formData.get("address"),
            city: formData.get("city"),
            postal: formData.get("postal")
        };

        for (const [key, value] of Object.entries(billingDetails)) {
            if (!value?.trim()) {
                setAlertType("error");
                setAlertMessage(`Please fill out the ${key} field.`);
                return;
            }
        }

        if (cartItems.length === 0) {
            setAlertType("error");
            setAlertMessage("Your shopping bag is empty.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                "/api/v1/stripe/create-checkout-session",
                {
                    productNames: cartItems.map(item => item.product.name),
                    pricesInCents: cartItems.map(item => Math.round(item.product.price * 100)),
                    quantities: cartItems.map(item => item.quantity),
                    successUrl: `${window.location.origin}/success`,
                    cancelUrl: `${window.location.origin}/cancel`,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    }
                }
            );

            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            setAlertType("error");
            setAlertMessage("We couldn't start checkout. Please try again.");
            console.error("Checkout error:", error);
            setIsSubmitting(false);
        }
    };

    const formatPrice = (value) => Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 });

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-10">
            {alertMessage && (
                <Alert type={alertType} message={alertMessage} onClose={() => setAlertMessage("")} />
            )}

            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Secure Checkout</p>
                    <h1 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">Complete your order</h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">Enter your billing details, then continue to secure Stripe payment.</p>
                </div>

                <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-4">
                    {[["1", "Shopping Bag"], ["2", "Billing Details"], ["3", "Payment"]].map(([number, label], index) => (
                        <div key={number} className="flex items-center gap-2 sm:gap-3">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${index === 1 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300"}`}>{number}</div>
                            <span className={`hidden text-sm font-bold sm:block ${index === 1 ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>{label}</span>
                            {index < 2 && <div className="ml-auto h-px flex-1 bg-slate-200 dark:bg-white/10" />}
                        </div>
                    ))}
                </div>

                <div className="grid gap-8 lg:grid-cols-[1fr_390px] lg:items-start">
                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04] md:p-8">
                        <div className="mb-8 flex items-start justify-between gap-4 border-b border-slate-200 pb-6 dark:border-white/10">
                            <div>
                                <h2 className="text-2xl font-black">Billing Details</h2>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Where should we send your order information?</p>
                            </div>
                            <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700 dark:bg-green-500/10 dark:text-green-300">Secure</span>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label htmlFor="name" className="mb-2 block text-sm font-bold">Full Name</label>
                                    <input name="name" id="name" type="text" autoComplete="name" placeholder="Ibrahim M" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900 dark:focus:bg-slate-950" />
                                </div>

                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-bold">Email Address</label>
                                    <input name="email" id="email" type="email" autoComplete="email" placeholder="you@example.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900 dark:focus:bg-slate-950" />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="mb-2 block text-sm font-bold">Phone Number</label>
                                    <input name="phone" id="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900 dark:focus:bg-slate-950" />
                                </div>

                                <div>
                                    <label htmlFor="country" className="mb-2 block text-sm font-bold">Country</label>
                                    <select name="country" id="country" defaultValue="" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950">
                                        <option value="">Select Country</option>
                                        <option value="India">India</option>
                                        <option value="USA">USA</option>
                                        <option value="UK">UK</option>
                                        <option value="Canada">Canada</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="postal" className="mb-2 block text-sm font-bold">Postal Code</label>
                                    <input name="postal" id="postal" type="text" autoComplete="postal-code" placeholder="600037" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900 dark:focus:bg-slate-950" />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="address" className="mb-2 block text-sm font-bold">Street Address</label>
                                    <input name="address" id="address" type="text" autoComplete="street-address" placeholder="House / Flat number, street and area" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900 dark:focus:bg-slate-950" />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="city" className="mb-2 block text-sm font-bold">City</label>
                                    <input name="city" id="city" type="text" autoComplete="address-level2" placeholder="Chennai" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900 dark:focus:bg-slate-950" />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/5 dark:text-blue-200">
                                <div className="flex gap-3"><span className="text-lg">🔒</span><p><strong>Your payment is secure.</strong> You'll be redirected to Stripe's secure checkout page to complete the payment.</p></div>
                            </div>

                            <button type="submit" disabled={isSubmitting || cartItems.length === 0} className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60">
                                {isSubmitting ? "Redirecting to Stripe..." : "Continue to Secure Payment →"}
                            </button>
                        </form>
                    </section>

                    <aside className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black">Your Order</h2>
                            <Link to="/cart" className="text-sm font-bold text-blue-600 hover:text-blue-500">Edit bag</Link>
                        </div>

                        {cartItems.length === 0 ? (
                            <div className="py-10 text-center">
                                <div className="text-4xl">🛒</div>
                                <p className="mt-3 font-bold">Your bag is empty</p>
                                <Link to="/products" className="mt-4 inline-block text-sm font-bold text-blue-600">Browse products →</Link>
                            </div>
                        ) : (
                            <>
                                <div className="mt-6 max-h-80 space-y-4 overflow-y-auto pr-1">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                                                {item.product?.imageUrl ? <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center">📦</div>}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-bold">{item.product.name}</p>
                                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Qty {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-bold">₹{formatPrice(item.product.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="my-6 border-t border-slate-200 dark:border-white/10" />
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>Subtotal</span><span>₹{formatPrice(subTotal)}</span></div>
                                    <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>Delivery</span><span className="font-bold text-green-600">FREE</span></div>
                                </div>
                                <div className="my-5 border-t border-slate-200 dark:border-white/10" />
                                <div className="flex items-center justify-between"><span className="font-bold">Total</span><span className="text-2xl font-black">₹{formatPrice(subTotal)}</span></div>
                                <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400"><span className="rounded-full bg-slate-100 px-3 py-1.5 dark:bg-white/10">🔒 Secure</span><span className="rounded-full bg-slate-100 px-3 py-1.5 dark:bg-white/10">💳 Stripe</span><span className="rounded-full bg-slate-100 px-3 py-1.5 dark:bg-white/10">✓ Free delivery</span></div>
                            </>
                        )}
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default CheckOut;
