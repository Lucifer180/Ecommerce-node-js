import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@shared/lib/queryKeys";

import { productsApi } from "../api/products.api";
import type { ProductListParams } from "../types";

export function useProducts(params: ProductListParams) {
    return useQuery({
        queryKey: queryKeys.products.list(params),
        queryFn: () => productsApi.list(params),
        // Keeps the grid on screen while a new page or filter loads.
        placeholderData: keepPreviousData,
    });
}

export function useProduct(id?: string) {
    return useQuery({
        queryKey: queryKeys.products.detail(id ?? ""),
        queryFn: () => productsApi.getById(id!),
        enabled: Boolean(id),
    });
}
