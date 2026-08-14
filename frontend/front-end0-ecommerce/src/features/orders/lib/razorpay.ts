/**
 * Razorpay Checkout runs from their hosted script; there is no npm build of it.
 * The script is loaded lazily so it only ever downloads on the checkout page.
 */
const CHECKOUT_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

export const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;

export interface RazorpayHandlerResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    order_id: string;
    prefill?: { name?: string; email?: string };
    theme?: { color?: string };
    handler: (response: RazorpayHandlerResponse) => void;
    modal?: { ondismiss?: () => void };
}

type RazorpayConstructor = new (options: RazorpayOptions) => { open: () => void };

declare global {
    interface Window {
        Razorpay?: RazorpayConstructor;
    }
}

let loader: Promise<void> | null = null;

export function loadRazorpayCheckout(): Promise<void> {
    if (window.Razorpay) return Promise.resolve();

    loader ??= new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = CHECKOUT_SCRIPT_SRC;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => {
            loader = null;
            reject(new Error("Could not load the Razorpay checkout script."));
        };
        document.body.appendChild(script);
    });

    return loader;
}

export type { RazorpayOptions };
