import ProductListHeader from "../components/Product/ProductListHeader";
import ProductGrid from "../components/Product/ProductGrid";
import { useCallback, useState } from "react";

function ProductList() {
    const [headerProducts, setHeaderProducts] = useState([]);
    const [filters, setFilters] = useState({
        category: "",
        minPrice: "",
        maxPrice: "",
        sort: "",
    });

    const onDataLoaded = useCallback((products) => {
        setHeaderProducts(products);
    }, []);

    const onFilterChange = useCallback((key, value) => {
        setFilters((prev) => {
            if (key === "reset") {
                return { category: "", minPrice: "", maxPrice: "", sort: "" };
            }
            return { ...prev, [key]: value };
        });
    }, []);

    return (
        <>
            <ProductListHeader
                slideProducts={headerProducts.length >= 5 ? headerProducts.slice(1, 5) : []}
                filters={filters}
                onFilterChange={onFilterChange}
            />
            <ProductGrid onDataLoaded={onDataLoaded} filters={filters} />
        </>
    );
}

export default ProductList;
