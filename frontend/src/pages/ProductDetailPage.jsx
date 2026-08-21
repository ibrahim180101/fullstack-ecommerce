import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import Spinner from "../components/Spinner";
import AddToCartControls from "../components/Cart/AddToCartControls";

function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        async function fetchProductDetails() {
            setLoading(true);
            try {
                const response = await axios.get(`/api/v1/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        "Content-Type": "application/json"
                    }
                });
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProductDetails();
    }, [id]);

    if (loading) return <Spinner />;

    if (!product) {
        return (
            <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-6">
                <div className="text-center">
                    <div className="text-5xl mb-4">📦</div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product not found</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">This product may no longer be available.</p>
                    <Link to="/products" className="inline-block mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">Back to Products</Link>
                </div>
            </main>
        );
    }

    const name = product.name || "Product Name";
    const description = product.description || "A premium product designed for everyday use. Explore the details below and add it to your shopping bag when you're ready.";
    const img = product.imageUrl;
    const price = Number(product.price || 0);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                <div className="mb-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link to="/products" className="hover:text-blue-600">Products</Link>
                    <span>/</span>
                    <span className="truncate text-gray-700 dark:text-gray-300">{name}</span>
                </div>

                <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-gray-900">
                    <div className="grid lg:grid-cols-2">
                        <div className="relative min-h-[420px] bg-gray-50 p-8 dark:bg-gray-950 sm:p-12 lg:min-h-[650px]">
                            <div className="absolute left-6 top-6 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700 dark:bg-green-500/10 dark:text-green-300">
                                ✓ Available
                            </div>
                            <div className="flex h-full min-h-[380px] items-center justify-center">
                                {img && !imageError ? (
                                    <img
                                        src={img}
                                        loading="eager"
                                        alt={name}
                                        onError={() => setImageError(true)}
                                        className="max-h-[560px] w-full object-contain drop-shadow-2xl transition duration-500 hover:scale-105"
                                    />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <div className="text-7xl">📦</div>
                                        <p className="mt-3">Product image unavailable</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                            <div className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                                Premium Electronics
                            </div>

                            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                                {name}
                            </h1>

                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                                    ★ 4.8
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Trusted choice</span>
                                <span className="h-1 w-1 rounded-full bg-gray-400" />
                                <span className="text-sm text-green-600 dark:text-green-400">In stock</span>
                            </div>

                            <div className="my-7 h-px bg-gray-200 dark:bg-white/10" />

                            <p className="text-base leading-8 text-gray-600 dark:text-gray-300">
                                {description}
                            </p>

                            <div className="mt-8">
                                <span className="text-4xl font-black tracking-tight">₹{price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">Inclusive of product price</span>
                            </div>

                            <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Availability</p>
                                        <p className="mt-1 font-bold text-green-600">In Stock</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Delivery</p>
                                        <p className="mt-1 font-bold">Fast delivery</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Payment</p>
                                        <p className="mt-1 font-bold">Secure Stripe checkout</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Support</p>
                                        <p className="mt-1 font-bold">Customer assistance</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <AddToCartControls id={product.id} />
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-gray-500 dark:text-gray-400">
                                <div className="rounded-xl border border-gray-200 p-3 dark:border-white/10">🔒<br /><span className="mt-1 block">Secure payment</span></div>
                                <div className="rounded-xl border border-gray-200 p-3 dark:border-white/10">🛡️<br /><span className="mt-1 block">Trusted checkout</span></div>
                                <div className="rounded-xl border border-gray-200 p-3 dark:border-white/10">📦<br /><span className="mt-1 block">Fast delivery</span></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-8 grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-gray-900">
                        <div className="text-2xl">✨</div>
                        <h2 className="mt-3 font-bold">Why you'll like it</h2>
                        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">A carefully selected product from our electronics collection, presented with clear pricing and checkout.</p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-gray-900">
                        <div className="text-2xl">💳</div>
                        <h2 className="mt-3 font-bold">Secure checkout</h2>
                        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">Your checkout is handled through the integrated Stripe payment flow.</p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-gray-900">
                        <div className="text-2xl">🛒</div>
                        <h2 className="mt-3 font-bold">Ready when you are</h2>
                        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">Choose your quantity, add the product to your bag and continue shopping whenever you like.</p>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default ProductDetailPage;
