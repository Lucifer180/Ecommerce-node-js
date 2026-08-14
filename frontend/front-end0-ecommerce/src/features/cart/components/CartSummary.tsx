import type { ReactNode } from "react";

import { formatPrice } from "@shared/lib/format";

import { FREE_SHIPPING_THRESHOLD, getShippingFee } from "../lib/cart-utils";

type CartSummaryProps = {
    subtotal: number;
    itemCount: number;
    footer?: ReactNode;
};

export const CartSummary = ({ subtotal, itemCount, footer }: CartSummaryProps) => {
    const shipping = getShippingFee(subtotal);
    const total = subtotal + shipping;
    const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

    return (
        <aside className="flex h-max flex-col gap-5 rounded-2xl border border-secondary bg-primary p-6">
            <h2 className="text-lg font-semibold text-primary">Order summary</h2>

            <dl className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                    <dt className="text-tertiary">
                        Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                    </dt>
                    <dd className="font-medium text-primary">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-tertiary">Shipping</dt>
                    <dd className="font-medium text-primary">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
                </div>
            </dl>

            {subtotal > 0 && remainingForFreeShipping > 0 && (
                <p className="rounded-lg bg-secondary px-3 py-2 text-xs text-tertiary">
                    Add {formatPrice(remainingForFreeShipping)} more for free delivery.
                </p>
            )}

            <div className="flex justify-between border-t border-secondary pt-4">
                <span className="text-md font-semibold text-primary">Total</span>
                <span className="text-lg font-semibold text-primary">{formatPrice(total)}</span>
            </div>

            {footer}
        </aside>
    );
};
