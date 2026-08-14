import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useHasSession } from "@features/auth";
import { queryKeys } from "@shared/lib/queryKeys";

import { cartApi } from "../api/cart.api";
import type { AddToCartRequest, Cart, UpdateCartItemRequest } from "../types";

export function useCart() {
    const hasSession = useHasSession();

    const query = useQuery({
        queryKey: queryKeys.cart.all,
        queryFn: () => cartApi.get(),
        enabled: hasSession,
    });

    return {
        ...query,
        cart: hasSession ? query.data : null,
        isPending: hasSession && query.isPending,
    };
}

/**
 * The write endpoints return the cart with `product` as a bare id rather than a
 * populated document, so we refetch instead of writing their response into the
 * cache — otherwise the cart page would lose product names and prices.
 */
function useCartMutation<TVariables>(mutationFn: (variables: TVariables) => Promise<Cart | null>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.all }),
    });
}

export const useAddToCart = () => useCartMutation((payload: AddToCartRequest) => cartApi.add(payload));

export const useUpdateCartItem = () => useCartMutation((payload: UpdateCartItemRequest) => cartApi.update(payload));

export const useRemoveCartItem = () => useCartMutation((productId: string) => cartApi.remove(productId));

/** Total item count for the header badge. */
export function useCartCount() {
    const { cart } = useCart();
    return cart?.items?.reduce((total, item) => total + (item.quantity ?? 0), 0) ?? 0;
}
