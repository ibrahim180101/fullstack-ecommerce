import Spinner from "../components/Spinner";
import CartItemCard from "../components/Cart/CartItemCard";
import { useCart } from "../context/CartContext";
import OrderSummary from "../components/Cart/OrderSummary";
import { Link } from "react-router-dom";

function Cart() {
    const { cartItems, loading, subTotal } = useCart();

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-10">
            {loading ? (
                <Spinner />
            ) : (
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Shopping Bag</p>
                            <h1 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">Your Shopping Bag</h1>
                            <p className="mt-2 text-slate-500 dark:text-slate-400">
                                Review your items before moving to secure checkout.
                            </p>
                        </div>
                        {cartItems.length > 0 && (
                            <span className="w-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                            </span>
                        )}
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl dark:bg-blue-500/10">🛒</div>
                            <h2 className="mt-6 text-2xl font-black">Your bag is empty</h2>
                            <p className="mx-auto mt-2 max-w-md text-slate-500 dark:text-slate-400">
                                Looks like you haven't added anything yet. Explore our electronics collection and find something you like.
                            </p>
                            <Link to="/products" className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500">
                                Continue Shopping →
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
                            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-6">
                                <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-white/10">
                                    <h2 className="text-lg font-bold">Items in your bag</h2>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">Saved to your account</span>
                                </div>
                                <ul className="space-y-4">
                                    {cartItems.map((item) => (
                                        <CartItemCard key={item.id} item={item} />
                                    ))}
                                </ul>
                            </section>

                            <OrderSummary cartItems={cartItems} subTotal={subTotal} />
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}

export default Cart;
