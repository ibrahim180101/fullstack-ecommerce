import { useEffect, useMemo, useState } from "react";
import axios from "../../api/axios";
import Alert from "../Alert";
import ProductCard from "./ProductCard";
import Spinner from "../Spinner";

function ProductGrid({ searchTerm, onDataLoaded, filters = {} }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("error");
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setAlertMessage("");
            try {
                setLoading(true);
                const token = localStorage.getItem("authToken");
                const response = await axios.get("/api/v1/products", {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                    params: { page, size, search: searchTerm || "" },
                });
                const loaded = response.data.products || [];
                setProducts(loaded);
                onDataLoaded?.(loaded);
                setTotalPages(response.data.totalPages || 1);
            } catch (err) {
                const errorMsg = err.response?.data?.error;
                const msgs = typeof errorMsg === "string" ? [errorMsg] : Object.values(errorMsg || {});
                setAlertMessage(msgs.length > 0 ? msgs : "Failed to load products.");
                setAlertType("error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [page, size, searchTerm, onDataLoaded]);

    useEffect(() => {
        setPage(0);
    }, [filters.category, filters.minPrice, filters.maxPrice, filters.sort]);

    const filteredProducts = useMemo(() => {
        let result = [...products];
        const category = (filters.category || "").toLowerCase();
        const min = filters.minPrice === "" ? null : Number(filters.minPrice);
        const max = filters.maxPrice === "" ? null : Number(filters.maxPrice);

        if (category) result = result.filter((product) => String(product.category || "").toLowerCase() === category);
        if (min !== null && !Number.isNaN(min)) result = result.filter((product) => Number(product.price) >= min);
        if (max !== null && !Number.isNaN(max)) result = result.filter((product) => Number(product.price) <= max);
        if (filters.sort === "low") result.sort((a, b) => Number(a.price) - Number(b.price));
        if (filters.sort === "high") result.sort((a, b) => Number(b.price) - Number(a.price));
        if (filters.sort === "name") result.sort((a, b) => String(a.name).localeCompare(String(b.name)));
        return result;
    }, [products, filters]);

    return (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 md:px-10">
            {alertMessage && (
                <div className="mb-6">
                    <Alert type={alertType} message={alertMessage} onClose={() => setAlertMessage("")} />
                </div>
            )}

            {loading ? <Spinner /> : (
                <>
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Our collection</p>
                            <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Latest products</h2>
                        </div>
                        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                            {filteredProducts.length} shown
                        </span>
                    </div>

                    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product) => (
                            <li key={product.id} className="min-w-0">
                                <ProductCard id={product.id} name={product.name} description={product.description} img={product.imageUrl} price={product.price} />
                            </li>
                        ))}
                    </ul>

                    {filteredProducts.length === 0 && (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">⌕</div>
                            <h3 className="text-lg font-black">No products found</h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try a different category or price range.</p>
                        </div>
                    )}

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                        <button onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-white">←</button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i} onClick={() => setPage(i)} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${page === i ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "border border-slate-200 bg-white text-slate-700 hover:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"}`}>{i + 1}</button>
                        ))}
                        <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))} disabled={page >= totalPages - 1} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-white">→</button>
                    </div>
                </>
            )}
        </section>
    );
}

export default ProductGrid;
