import { client } from "@shared/api/client";

import type { Order, RazorpayOrder, VerifyPaymentRequest } from "../types";

class OrdersApi {
    async create(): Promise<Order> {
        // The server builds the order from the user's cart; no body required.
        const { data } = await client.post<{ success: boolean; data: Order }>("/orders");
        return data.data;
    }

    async listMine(): Promise<Order[]> {
        const { data } = await client.get<{ success: boolean; data: Order[] }>("/orders/my");
        return data.data ?? [];
    }

    async createPaymentOrder(amount: number): Promise<RazorpayOrder> {
        const { data } = await client.post<{ success: boolean; order: RazorpayOrder }>("/payments/create-order", { amount });
        return data.order;
    }

    async verifyPayment(payload: VerifyPaymentRequest) {
        const { data } = await client.post("/payments/verify", payload);
        return data;
    }
}

export const ordersApi = new OrdersApi();
