import { Package } from "@untitledui/icons";

import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ROUTES } from "@routes/paths";
import { EmptyState, ErrorState, PageSpinner } from "@shared/components/states";
import { formatDate, formatPrice } from "@shared/lib/format";

import { useMyOrders } from "../hooks/useOrders";
import type { OrderStatus } from "../types";

const statusColor: Record<OrderStatus, "gray" | "warning" | "success" | "blue"> = {
    pending: "warning",
    paid: "success",
    shipped: "blue",
    delivered: "gray",
};

export default function OrdersPage() {
    const { data: orders = [], isPending, isError, refetch } = useMyOrders();

    if (isPending) return <PageSpinner className="min-h-[60vh]" />;

    return (
        <div className="mx-auto flex w-full max-w-container flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
            <h1 className="text-display-sm font-semibold text-primary">Your orders</h1>

            {isError ? (
                <ErrorState description="We couldn't load your orders." onRetry={() => refetch()} />
            ) : orders.length === 0 ? (
                <EmptyState
                    icon={Package}
                    title="No orders yet"
                    description="When you place an order it'll appear here."
                    action={
                        <Button size="lg" href={ROUTES.PRODUCTS}>
                            Start shopping
                        </Button>
                    }
                />
            ) : (
                <ul className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <li key={order._id} className="flex flex-col gap-4 rounded-2xl border border-secondary bg-primary p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-col">
                                    <span className="font-mono text-sm text-tertiary">#{order._id.slice(-8)}</span>
                                    <span className="text-sm text-tertiary">Placed {formatDate(order.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge type="pill-color" color={statusColor[order.status] ?? "gray"} size="md">
                                        {order.status}
                                    </Badge>
                                    <span className="text-lg font-semibold text-primary">{formatPrice(order.totalPrice)}</span>
                                </div>
                            </div>

                            <ul className="divide-y divide-secondary border-t border-secondary">
                                {order.items.map((item) => {
                                    // `GET /orders/my` populates `product`, but it may be null if since deleted.
                                    const product = item.product && typeof item.product !== "string" ? item.product : null;
                                    return (
                                        <li key={item._id} className="flex items-center justify-between gap-4 py-3 text-sm">
                                            <span className="text-secondary">
                                                {product?.name ?? "Product"} × {item.quantity}
                                            </span>
                                            <span className="font-medium text-primary">{formatPrice(item.price * item.quantity)}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
