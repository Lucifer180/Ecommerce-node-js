export const ROUTES = {
    HOME: "/",

    PRODUCTS: "/products",
    PRODUCT_DETAIL: (id: string) => `/products/${id}`,

    CART: "/cart",
    CHECKOUT: "/checkout",
    ORDERS: "/orders",
    PROFILE: "/account",

    ADMIN: "/admin",
    ADMIN_PRODUCTS: "/admin/products",
    ADMIN_USERS: "/admin/users",
    ADMIN_NOTIFICATIONS: "/admin/notifications",

    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: (token: string) => `/reset-password/${token}`,
} as const;

/**
 * Where a user lands once they are authenticated. Both the login flow and the
 * guest guard read this, so the two can never disagree — that mismatch is what
 * used to bounce people to "/" instead of their intended destination.
 */
export const AUTHENTICATED_LANDING = ROUTES.HOME;
