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
        <>
            <ProductListHeader slideProducts={headerProducts.length >= 5 ? headerProducts.slice(1, 5) : []} />

            <section id="product-filters" className="px-4 md:px-10 py-6 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
                    <span className="font-bold text-gray-800 dark:text-white mr-2">Filter Products:</span>
                    <select value={filters.category} onChange={(e) => updateFilter("category", e.target.value)} className="px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:text-white">
                        <option value="">All Categories</option><option value="Mobile">Mobile</option><option value="Laptop">Laptop</option><option value="Tablet">Tablet</option><option value="Gaming">Gaming</option><option value="TV">TV</option><option value="Accessories">Accessories</option>
                    </select>
                    <input type="number" min="0" placeholder="Min ₹" value={filters.minPrice} onChange={(e) => updateFilter("minPrice", e.target.value)} className="w-24 px-3 py-2 rounded-lg border dark:bg-gray-800 dark:text-white" />
                    <input type="number" min="0" placeholder="Max ₹" value={filters.maxPrice} onChange={(e) => updateFilter("maxPrice", e.target.value)} className="w-24 px-3 py-2 rounded-lg border dark:bg-gray-800 dark:text-white" />
                    <select value={filters.sort} onChange={(e) => updateFilter("sort", e.target.value)} className="px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:text-white">
                        <option value="">Sort Products</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="name">Name: A to Z</option>
                    </select>
                    <button onClick={() => updateFilter("reset", "")} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Clear Filter</button>
                </div>
            </section>

            <ProductGrid onDataLoaded={onDataLoaded} filters={filters} />
        </>
    );
}

export default ProductList;
