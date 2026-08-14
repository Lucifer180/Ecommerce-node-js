import { ShoppingCart01 } from "@untitledui/icons";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/base/buttons/button";
import { ROUTES } from "@routes/paths";
import { EmptyState, ErrorState, PageSpinner } from "@shared/components/states";

import { CartItemRow } from "../components/CartItemRow";
import { CartSummary } from "../components/CartSummary";
import { useCart } from "../hooks/useCart";
import { getCartItemCount, getCartSubtotal } from "../lib/cart-utils";

export default function CartPage() {
    const { cart, isPending, isError, refetch } = useCart();
    const navigate = useNavigate();

    if (isPending) return <PageSpinner className="min-h-[60vh]" />;

    const items = cart?.items ?? [];
    const subtotal = getCartSubtotal(cart);
    const itemCount = getCartItemCount(cart);

    return (
        <div className="mx-auto flex w-full max-w-container flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
            <h1 className="text-display-sm font-semibold text-primary">Your cart</h1>

            {isError ? (
                <ErrorState description="We couldn't load your cart." onRetry={() => refetch()} />
            ) : items.length === 0 ? (
                <EmptyState
                    icon={ShoppingCart01}
                    title="Your cart is empty"
                    description="Once you add something, it'll show up here."
                    action={
                        <Button size="lg" href={ROUTES.PRODUCTS}>
                            Browse products
                        </Button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
                    <ul className="divide-y divide-secondary rounded-2xl border border-secondary bg-primary px-6">
                        {items.map((item) => (
                            <CartItemRow key={item._id} item={item} />
                        ))}
                    </ul>

                    <CartSummary
                        subtotal={subtotal}
                        itemCount={itemCount}
                        footer={
                            <div className="flex flex-col gap-3">
                                <Button size="lg" className="w-full" onPress={() => navigate(ROUTES.CHECKOUT)}>
                                    Proceed to checkout
                                </Button>
                                <Button size="lg" color="secondary" className="w-full" onPress={() => navigate(ROUTES.PRODUCTS)}>
                                    Continue shopping
                                </Button>
                            </div>
                        }
                    />
                </div>
            )}
        </div>
    );
}
