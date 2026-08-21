import ImageSlider from "./ImageSlider";

function ProductListHeader({ slideProducts }) {
    const src = "https://images.unsplash.com/photo-1599481238640-4c1288750d7a?auto=format&fit=crop&w=1200&q=85";

    return (
        <section className="relative overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-violet-950" />
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 md:py-16 lg:grid-cols-2 lg:px-10 lg:py-20">
                <div>
                    <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-200">
                        Premium electronics store
                    </span>
                    <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
                        Upgrade your
                        <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">everyday tech.</span>
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                        Discover smartphones, laptops, tablets, gaming gear and everyday electronics in one place.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <a href="#product-filters" className="rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-900/30 transition hover:-translate-y-0.5 hover:bg-blue-500">
                            Browse &amp; Filter ↓
                        </a>
                        <span className="rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-slate-200">
                            Secure checkout
                        </span>
                    </div>
                    <div className="mt-7 flex flex-wrap gap-5 text-xs font-semibold text-slate-400">
                        <span>✓ Curated products</span>
                        <span>✓ Easy cart</span>
                        <span>✓ Fast ordering</span>
                    </div>
                </div>
                <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
                    <div className="absolute -inset-5 rounded-3xl bg-blue-500/20 blur-2xl" />
                    <div className="relative rounded-3xl border border-white/10 bg-white/10 p-2 shadow-2xl backdrop-blur">
                        <div className="overflow-hidden rounded-2xl bg-white">
                            <ImageSlider src={src} slideProducts={slideProducts} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductListHeader;
