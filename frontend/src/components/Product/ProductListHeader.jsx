import ImageSlider from "./ImageSlider";

function ProductListHeader({ slideProducts }) {
    const src =
        "https://images.unsplash.com/photo-1599481238640-4c1288750d7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2664&q=80";

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white py-12 md:py-16 px-4">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-32 right-1/3 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

            <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
                <div className="max-w-2xl">
                    <span className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-1.5 text-sm font-semibold text-blue-200">
                        Latest tech • Great prices • Fast delivery
                    </span>

                    <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight leading-tight">
                        Find the tech that
                        <span className="block text-blue-400">fits your world.</span>
                    </h1>

                    <p className="mt-5 max-w-xl text-base md:text-lg leading-7 text-slate-300">
                        Explore smartphones, laptops, gaming gear and everyday electronics.
                        Use the filters below to quickly find exactly what you want.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">
                        <a
                            href="#product-filters"
                            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 font-bold text-white shadow-lg transition hover:bg-blue-500"
                        >
                            Filter Products
                            <span className="ml-2">↓</span>
                        </a>
                        <span className="inline-flex items-center rounded-lg border border-white/15 bg-white/5 px-5 py-3 font-medium text-slate-200">
                            Secure checkout with Stripe
                        </span>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-xl">
                    <div className="absolute -inset-3 rounded-3xl bg-blue-500/20 blur-2xl" />
                    <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur-sm">
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
