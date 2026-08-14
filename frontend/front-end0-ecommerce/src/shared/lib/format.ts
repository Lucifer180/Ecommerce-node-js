/** The payments module creates Razorpay orders in INR, so the storefront follows. */
const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
});

export const formatPrice = (value?: number | null) => currencyFormatter.format(value ?? 0);

export const formatDate = (value?: string | Date | null) => {
    if (!value) return "—";
    const date = typeof value === "string" ? new Date(value) : value;
    return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
};
