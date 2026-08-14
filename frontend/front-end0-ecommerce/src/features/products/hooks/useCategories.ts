import { useQuery } from "@tanstack/react-query";

import { productsApi } from "../api/products.api";

/**
 * The API has no categories endpoint, so the facet list is derived from a
 * single wide product fetch. Swap this for a real endpoint when one exists.
 */
export function useCategories() {
    return useQuery({
        queryKey: ["products", "categories"],
        queryFn: async () => {
            const page = await productsApi.list({ limit: 100, page: 1 });
            const categories = new Set<string>();
            page.items.forEach((product) => {
                if (product.category) categories.add(product.category);
            });
            return [...categories].sort((a, b) => a.localeCompare(b));
        },
        staleTime: 10 * 60 * 1000,
    });
}
