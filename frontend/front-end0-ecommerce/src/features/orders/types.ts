import type { Product } from "@features/products/types";

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered";

export interface OrderItem {
    _id: string;
    product: Product | string | null;
    quantity: number;
    /** Price captured at purchase time, not the product's current price. */
    price: number;
}

export interface Order {
    _id: string;
    user: string;
    items: OrderItem[];
    totalPrice: number;
    status: OrderStatus;
    createdAt: string;
    updatedAt?: string;
}

/** `POST /payments/create-order` proxies Razorpay's order object. */
export interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
    receipt?: string;
}

export interface VerifyPaymentRequest {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}
