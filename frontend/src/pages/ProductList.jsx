import ProductListHeader from "../components/Product/ProductListHeader";
import ProductGrid from "../components/Product/ProductGrid";
import { useCallback, useState } from "react";

function ProductList() {
    const [headerProducts, setHeaderProducts] = useState([]);
    const [filters, setFilters] = useState({ category: "", minPrice: "", maxPrice: "", sort: "" });

    const onDataLoaded = useCallback((products) => setHeaderProducts(products), []);

    const updateFilter = (key, value) => {
        if (key === "reset") {
            setFilters({ category: "", minPrice: "", maxPrice: "", sort: "" });
            return;
        }
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
            <ProductListHeader
                slideProducts={headerProducts.length >= 5 ? headerProducts.slice(1, 5) : []}
            />

            <section id="product-filters" className="relative px-4 py-8 sm:px-6 md:px-10">
                <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Shop smarter</p>
                            <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Find your perfect product</h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Filter by category, budget or sort by price and name.</p>
                        </div>
                        <button onClick={() => updateFilter("reset", "")} className="self-start rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:text-slate-200">
                            Reset filters
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            Category
                            <select value={filters.category} onChange={(e) => updateFilter("category", e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                                <option value="">All Categories</option>
                                <option value="Mobile">Mobile</option>
                                <option value="Laptop">Laptop</option>
                                <option value="Tablet">Tablet</option>
                                <option value="Gaming">Gaming</option>
                                <option value="TV">TV</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                        </label>

                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            Minimum price
                            <input type="number" min="0" placeholder="₹ 0" value={filters.minPrice} onChange={(e) => updateFilter("minPrice", e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                        </label>

                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            Maximum price
                            <input type="number" min="0" placeholder="₹ 1,00,000" value={filters.maxPrice} onChange={(e) => updateFilter("maxPrice", e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                        </label>

                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            Sort by
                            <select value={filters.sort} onChange={(e) => updateFilter("sort", e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                                <option value="">Recommended</option>
                                <option value="low">Price: Low to High</option>
                                <option value="high">Price: High to Low</option>
                                <option value="name">Name: A to Z</option>
                            </select>
                        </label>
                    </div>
                </div>
            </section>

            <ProductGrid onDataLoaded={onDataLoaded} filters={filters} />
        </main>
    );
}

export default ProductList;
