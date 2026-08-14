import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { EmptyState, ErrorState } from "@shared/components/states";

import { ProductCard, ProductCardSkeleton } from "../components/ProductCard";
import { ProductFilters } from "../components/ProductFilters";
import { useProducts } from "../hooks/useProducts";
import type { ProductListParams } from "../types";

const PAGE_SIZE = 12;

/** Filters live in the URL so results are shareable and the back button works. */
const readFilters = (params: URLSearchParams): ProductListParams => ({
    keyword: params.get("keyword") || undefined,
    category: params.get("category") || undefined,
    minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : undefined,
    maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined,
    page: params.get("page") ? Number(params.get("page")) : 1,
    limit: PAGE_SIZE,
});

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = useMemo(() => readFilters(searchParams), [searchParams]);
    const { data, isPending, isError, refetch, isPlaceholderData } = useProducts(filters);

    const applyFilters = useCallback(
        (next: Partial<ProductListParams>) => {
            setSearchParams(
                (current) => {
                    const params = new URLSearchParams(current);
                    Object.entries(next).forEach(([key, value]) => {
                        if (value === undefined || value === "" || value === null) params.delete(key);
                        else params.set(key, String(value));
                    });
                    // Any filter change invalidates the current page position.
                    if (!("page" in next)) params.delete("page");
                    return params;
                },
                { replace: true }
            );
        },
        [setSearchParams]
    );

    const products = data?.items ?? [];

    return (
        <div className="mx-auto flex w-full max-w-container flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
            <header className="flex flex-col gap-2">
                <h1 className="text-display-sm font-semibold text-primary">All products</h1>
                <p className="text-md text-tertiary">
                    {data ? `${data.totalProducts} ${data.totalProducts === 1 ? "product" : "products"} available` : "Browse the full catalogue"}
                </p>
            </header>

            <ProductFilters filters={filters} onChange={applyFilters} onReset={() => setSearchParams({}, { replace: true })} />

            {isError ? (
                <ErrorState description="We couldn't load the catalogue." onRetry={() => refetch()} />
            ) : isPending ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <EmptyState title="No products match those filters" description="Try widening your price range or clearing the search." />
            ) : (
                <div className={isPlaceholderData ? "opacity-60 transition-opacity" : "transition-opacity"}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>
            )}

            {data && data.totalPages > 1 && (
                <PaginationPageMinimalCenter
                    page={data.currentPage}
                    total={data.totalPages}
                    onPageChange={(page) => {
                        applyFilters({ page });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                />
            )}
        </div>
    );
}
