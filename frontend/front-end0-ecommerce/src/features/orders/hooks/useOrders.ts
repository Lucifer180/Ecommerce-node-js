import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useCurrentUser, useHasSession } from "@features/auth";
import { queryKeys } from "@shared/lib/queryKeys";

import { ordersApi } from "../api/orders.api";
import { loadRazorpayCheckout, razorpayKeyId, type RazorpayHandlerResponse } from "../lib/razorpay";

export function useMyOrders() {
    const hasSession = useHasSession();

    const query = useQuery({
        queryKey: queryKeys.orders.mine,
        queryFn: () => ordersApi.listMine(),
        enabled: hasSession,
    });

    return { ...query, isPending: hasSession && query.isPending };
}

/**
 * Places the order, then hands off to Razorpay Checkout and verifies the
 * signature server-side. Without VITE_RAZORPAY_KEY_ID the order is still
 * created and left `pending`, so the flow is usable before payments are set up.
 */
export function useCheckout() {
    const queryClient = useQueryClient();
    const { user } = useCurrentUser();

    return useMutation({
        mutationFn: async (amount: number) => {
            const order = await ordersApi.create();

            // Narrowed to a local so TypeScript keeps it defined inside the callback below.
            const keyId = razorpayKeyId;
            if (!keyId) {
                return { order, paid: false as const };
            }

            await loadRazorpayCheckout();
            const paymentOrder = await ordersApi.createPaymentOrder(amount);

            const paid = await new Promise<boolean>((resolve, reject) => {
                const checkout = new window.Razorpay!({
                    key: keyId,
                    amount: paymentOrder.amount,
                    currency: paymentOrder.currency,
                    name: "Aurora",
                    description: `Order ${order._id}`,
                    order_id: paymentOrder.id,
                    prefill: { name: user?.name, email: user?.email },
                    handler: async (response: RazorpayHandlerResponse) => {
                        try {
                            await ordersApi.verifyPayment(response);
                            resolve(true);
                        } catch (error) {
                            reject(error);
                        }
                    },
                    modal: { ondismiss: () => resolve(false) },
                });

                checkout.open();
            });

            return { order, paid };
        },
        onSettled: () => {
            // The server empties the cart as part of creating the order.
            queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.mine });
        },
    });
}
