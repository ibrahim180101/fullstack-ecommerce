import { Link } from "react-router-dom";
import AddToCartControls from "../Cart/AddToCartControls";

function ProductCard({ id, img, description, name, price }) {
    const fallback = "https://images.unsplash.com/photo-1599481238640-4c1288750d7a?auto=format&fit=crop&w=900&q=80";

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-blue-900/20">
            <Link to={`/product/${id}`} className="block">
                <div className="relative flex h-64 items-center justify-center overflow-hidden bg-slate-50 p-5 dark:bg-slate-900">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-violet-50 opacity-80 dark:from-blue-950/30 dark:to-violet-950/20" />
                    <img
                        src={img || fallback}
                        alt={name}
                        className="relative z-10 h-full w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 z-20 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-700 shadow-sm backdrop-blur dark:bg-slate-800/90 dark:text-slate-200">
                        Electronics
                    </span>
                </div>
            </Link>

            <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-start justify-between gap-3">
                    <h2 className="line-clamp-2 text-lg font-extrabold leading-6 text-slate-900 dark:text-white">
                        {name}
                    </h2>
                </div>

                <p className="line-clamp-2 min-h-10 text-sm leading-5 text-slate-500 dark:text-slate-400">
                    {description}
                </p>

                <div className="mt-auto pt-5">
                    <div className="mb-4 flex items-end justify-between">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Price</p>
                            <p className="mt-0.5 text-2xl font-black text-slate-950 dark:text-white">₹{Number(price || 0).toLocaleString("en-IN")}</p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            In stock
                        </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-1.5 dark:bg-slate-900/70">
                        <AddToCartControls id={id} />
                    </div>
                </div>
            </div>
        </article>
    );
}

export default ProductCard;
