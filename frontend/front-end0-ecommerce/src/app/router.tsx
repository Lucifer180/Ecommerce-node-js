import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";

import { authRoutes } from "@features/auth";
import AdminLayout from "@layouts/AdminLayout";
import AuthLayout from "@layouts/AuthLayout";
import MainLayout from "@layouts/MainLayout";
import AdminRoute from "@routes/guards/AdminRoute";
import GuestRoute from "@routes/guards/GuestRoute";
import ProtectedRoute from "@routes/guards/ProtectedRoute";
import { PageSpinner } from "@shared/components/states";

import RootLayout from "./RootLayout";

// The landing page is the common entry point, so it stays in the main bundle.
import LandingPage from "@features/home/pages/LandingPage";

// Everything else is split out — react-aria and the feature pages are heavy.
const ProductsPage = lazy(() => import("@features/products/pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("@features/products/pages/ProductDetailPage"));
const CartPage = lazy(() => import("@features/cart/pages/CartPage"));
const CheckoutPage = lazy(() => import("@features/orders/pages/CheckoutPage"));
const OrdersPage = lazy(() => import("@features/orders/pages/OrdersPage"));
const ProfilePage = lazy(() => import("@features/account/pages/ProfilePage"));
const NotFoundPage = lazy(() => import("@features/home/pages/NotFoundPage"));

const AdminProductsPage = lazy(() => import("@features/admin/pages/AdminProductsPage"));
const AdminUsersPage = lazy(() => import("@features/admin/pages/AdminUsersPage"));
const AdminNotificationsPage = lazy(() => import("@features/admin/pages/AdminNotificationsPage"));

const deferred = (element: ReactNode) => <Suspense fallback={<PageSpinner className="min-h-[60vh]" />}>{element}</Suspense>;

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            // Auth pages: only reachable while signed out.
            {
                element: <GuestRoute />,
                children: [
                    {
                        element: <AuthLayout />,
                        children: authRoutes,
                    },
                ],
            },

            // Admin console — its own shell, gated on a server-verified admin role.
            {
                path: "admin",
                element: <AdminRoute />,
                children: [
                    {
                        element: <AdminLayout />,
                        children: [
                            { index: true, element: deferred(<AdminProductsPage />) },
                            { path: "products", element: deferred(<AdminProductsPage />) },
                            { path: "users", element: deferred(<AdminUsersPage />) },
                            { path: "notifications", element: deferred(<AdminNotificationsPage />) },
                        ],
                    },
                ],
            },

            // The storefront.
            {
                element: <MainLayout />,
                children: [
                    { index: true, element: <LandingPage /> },
                    { path: "products", element: deferred(<ProductsPage />) },
                    { path: "products/:id", element: deferred(<ProductDetailPage />) },

                    // Everything below needs a signed-in user.
                    {
                        element: <ProtectedRoute />,
                        children: [
                            { path: "cart", element: deferred(<CartPage />) },
                            { path: "checkout", element: deferred(<CheckoutPage />) },
                            { path: "orders", element: deferred(<OrdersPage />) },
                            { path: "account", element: deferred(<ProfilePage />) },
                        ],
                    },

                    { path: "*", element: deferred(<NotFoundPage />) },
                ],
            },
        ],
    },
]);
