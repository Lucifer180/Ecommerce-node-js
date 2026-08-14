import type { Product } from "@features/products/types";

import type { Cart, CartItem } from "../types";

/** `GET /cart` populates `product`; the write endpoints return a bare id. */
export const getProduct = (item: CartItem): Product | null => (typeof item.product === "string" ? null : item.product);

export const getLineTotal = (item: CartItem) => (getProduct(item)?.price ?? 0) * item.quantity;

export const getCartSubtotal = (cart?: Cart | null) => cart?.items?.reduce((total, item) => total + getLineTotal(item), 0) ?? 0;

export const getCartItemCount = (cart?: Cart | null) => cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;

/** Matches the "free delivery over ₹999" promise on the product page. */
export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 79;

export const getShippingFee = (subtotal: number) => (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE);
