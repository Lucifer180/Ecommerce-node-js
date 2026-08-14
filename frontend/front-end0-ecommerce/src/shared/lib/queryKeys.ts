import type { ProductListParams } from "@features/products/types";

export const queryKeys = {
    auth: {
        me: ["auth", "me"] as const,
    },
    products: {
        all: ["products"] as const,
        list: (params: ProductListParams) => ["products", "list", params] as const,
        detail: (id: string) => ["products", "detail", id] as const,
    },
    cart: {
        all: ["cart"] as const,
    },
    orders: {
        mine: ["orders", "mine"] as const,
    },
    admin: {
        users: ["admin", "users"] as const,
    },
};
