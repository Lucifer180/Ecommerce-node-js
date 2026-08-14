import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard02 } from "@untitledui/icons";

import { Button } from "@/components/base/buttons/button";
import { CartSummary, getCartItemCount, getCartSubtotal, getProduct, getShippingFee, useCart } from "@features/cart";
import { ROUTES } from "@routes/paths";
import { Alert } from "@shared/components/alert";
import { EmptyState, PageSpinner } from "@shared/components/states";
import { getApiErrorMessage } from "@shared/lib/errors";
import { formatPrice } from "@shared/lib/format";

import { useCheckout } from "../hooks/useOrders";
import { razorpayKeyId } from "../lib/razorpay";

export default function CheckoutPage() {
    const { cart, isPending } = useCart();
    const checkout = useCheckout();
    const navigate = useNavigate();

    const subtotal = getCartSubtotal(cart);
    const total = subtotal + getShippingFee(subtotal);
    const itemCount = getCartItemCount(cart);
    const items = cart?.items ?? [];

    useEffect(() => {
        if (checkout.isSuccess) {
            navigate(ROUTES.ORDERS, { replace: true });
        }
    }, [checkout.isSuccess, navigate]);

    if (isPending) return <PageSpinner className="min-h-[60vh]" />;

    if (items.length === 0) {
        return (
            <div className="mx-auto w-full max-w-container px-4 py-16">
                <EmptyState
                    title="Nothing to check out"
                    description="Your cart is empty."
                    action={
                        <Button size="lg" href={ROUTES.PRODUCTS}>
                            Browse products
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="mx-auto flex w-full max-w-container flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
            <div className="flex flex-col gap-4">
                <Button color="link-gray" size="md" iconLeading={ArrowLeft} href={ROUTES.CART} className="w-max">
                    Back to cart
                </Button>
                <h1 className="text-display-sm font-semibold text-primary">Checkout</h1>
            </div>

            {checkout.isError && <Alert>{getApiErrorMessage(checkout.error, "We couldn't place your order.")}</Alert>}

            {!razorpayKeyId && (
                <Alert type="success">
                    Payments are not configured. Set <code className="font-mono">VITE_RAZORPAY_KEY_ID</code> to enable Razorpay — until then orders
                    are created with a <span className="font-medium">pending</span> status.
                </Alert>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
                <section className="flex flex-col gap-4 rounded-2xl border border-secondary bg-primary p-6">
                    <h2 className="text-lg font-semibold text-primary">Review your order</h2>
                    <ul className="divide-y divide-secondary">
                        {items.map((item) => {
                            const product = getProduct(item);
                            return (
                                <li key={item._id} className="flex items-center justify-between gap-4 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-md font-medium text-primary">{product?.name ?? "Unavailable product"}</span>
                                        <span className="text-sm text-tertiary">Qty {item.quantity}</span>
                                    </div>
                                    <span className="text-md font-semibold text-primary">{formatPrice((product?.price ?? 0) * item.quantity)}</span>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                <CartSummary
                    subtotal={subtotal}
                    itemCount={itemCount}
                    footer={
                        <Button
                            size="lg"
                            className="w-full"
                            iconLeading={CreditCard02}
                            isLoading={checkout.isPending}
                            isDisabled={checkout.isPending}
                            onPress={() => checkout.mutate(total)}
                        >
                            {razorpayKeyId ? `Pay ${formatPrice(total)}` : "Place order"}
                        </Button>
                    }
                />
            </div>
        </div>
    );
}
