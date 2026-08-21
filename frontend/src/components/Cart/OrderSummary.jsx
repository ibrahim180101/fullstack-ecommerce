import { useNavigate } from "react-router-dom";

function OrderSummary({ cartItems, subTotal }) {
    const navigate = useNavigate();
    const itemCount = cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0);

    return (
        <aside className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black">Order Summary</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                    {itemCount} items
                </span>
            </div>

            <div className="mt-6 space-y-4">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                            {item.product?.imageUrl ? (
                                <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full items-center justify-center text-lg">📦</div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">{item.product.name}</p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Qty {item.quantity}</p>
                        </div>
                        <span className="text-sm font-bold">₹{(item.product.price * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                ))}
            </div>

            <div className="my-6 border-t border-slate-200 dark:border-white/10" />

            <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span>₹{Number(subTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Delivery</span>
                    <span className="font-bold text-green-600">FREE</span>
                </div>
            </div>

            <div className="my-5 border-t border-slate-200 dark:border-white/10" />

            <div className="flex items-end justify-between">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
                    <p className="mt-1 text-3xl font-black">₹{Number(subTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                </div>
                <span className="text-xs font-semibold text-slate-400">Taxes included where applicable</span>
            </div>

            <button
                className="mt-6 w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
                onClick={() => navigate("/checkout")}
            >
                Proceed to Secure Checkout →
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>🔒</span>
                <span>Secure checkout powered by Stripe</span>
            </div>
        </aside>
    );
}

export default OrderSummary;
