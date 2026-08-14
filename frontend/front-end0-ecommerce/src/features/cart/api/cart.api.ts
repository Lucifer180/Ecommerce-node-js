import { client } from "@shared/api/client";

import type { AddToCartRequest, Cart, UpdateCartItemRequest } from "../types";

type CartResponse = { success: boolean; data: Cart | null };

class CartApi {
    async get(): Promise<Cart | null> {
        const { data } = await client.get<CartResponse>("/cart");
        return data.data;
    }

    async add(payload: AddToCartRequest): Promise<Cart | null> {
        const { data } = await client.post<CartResponse>("/cart", payload);
        return data.data;
    }

    async update(payload: UpdateCartItemRequest): Promise<Cart | null> {
        const { data } = await client.put<CartResponse>("/cart", payload);
        return data.data;
    }

    async remove(productId: string): Promise<Cart | null> {
        // The backend reads `productId` from the body, so it goes in `data`.
        const { data } = await client.delete<CartResponse>("/cart", { data: { productId } });
        return data.data;
    }
}

export const cartApi = new CartApi();
