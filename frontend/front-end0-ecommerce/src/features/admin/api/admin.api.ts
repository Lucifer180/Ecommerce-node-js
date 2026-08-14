import { client } from "@shared/api/client";
import type { User } from "@features/auth";
import type { Product } from "@features/products/types";

export interface ProductInput {
    name: string;
    description?: string;
    price: number;
    stock: number;
    category?: string;
}

export interface NotificationInput {
    subject: string;
    message: string;
    /** Empty or omitted means every user. */
    userIds?: string[];
}

class AdminApi {
    async createProduct(payload: ProductInput): Promise<Product> {
        const { data } = await client.post<{ success: boolean; data: Product }>("/products", payload);
        return data.data;
    }

    async updateProduct(id: string, payload: Partial<ProductInput>): Promise<Product> {
        const { data } = await client.put<{ success: boolean; data: Product }>(`/products/${id}`, payload);
        return data.data;
    }

    async deleteProduct(id: string) {
        const { data } = await client.delete<{ success: boolean; message: string }>(`/products/${id}`);
        return data;
    }

    async listUsers(): Promise<User[]> {
        const { data } = await client.get<{ success: boolean; data: User[] }>("/auth");
        return data.data ?? [];
    }

    async updateUserRole(userId: string, role: User["role"]) {
        const { data } = await client.put<{ success: boolean; data: User }>("/auth", { userId, role });
        return data.data;
    }

    async sendNotification(payload: NotificationInput) {
        const { data } = await client.post<{ success: boolean; message: string; data: { queued: number } }>("/notifications", payload);
        return data;
    }
}

export const adminApi = new AdminApi();
