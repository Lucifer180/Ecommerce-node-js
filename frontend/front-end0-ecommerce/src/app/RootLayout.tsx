import { useEffect } from "react";
import { Outlet, useNavigate, useHref } from "react-router-dom";
import { RouterProvider as AriaRouterProvider } from "react-aria-components";
import { useQueryClient } from "@tanstack/react-query";

import { AUTH_EXPIRED_EVENT } from "@shared/api/interceptors";

/**
 * Sits at the root of the route tree so it can use router hooks.
 *
 * Teaching react-aria about the router makes every Untitled UI `href`
 * (buttons, links, menu items) a client-side navigation instead of a full
 * page load.
 */
export default function RootLayout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // When the refresh flow gives up, drop the cached user so guards re-evaluate.
    useEffect(() => {
        const onExpired = () => queryClient.clear();
        window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
        return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
    }, [queryClient]);

    return (
        <AriaRouterProvider navigate={navigate} useHref={useHref}>
            <Outlet />
        </AriaRouterProvider>
    );
}
