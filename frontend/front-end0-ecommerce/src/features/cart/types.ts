import type { Product } from "@features/products/types";

export interface CartItem {
    _id: string;
    /** Populated by `GET /cart`; a bare id on the write endpoints' responses. */
    product: Product | string;
    quantity: number;
}

export interface Cart {
    _id: string;
    user: string;
    items: CartItem[];
    createdAt?: string;
    updatedAt?: string;
}

export interface AddToCartRequest {
    productId: string;
    quantity: number;
}

export interface UpdateCartItemRequest {
    productId: string;
    quantity: number;
}
