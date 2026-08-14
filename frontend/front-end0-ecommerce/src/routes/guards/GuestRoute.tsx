import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useCurrentUser } from "@features/auth";
import { AUTHENTICATED_LANDING } from "@routes/paths";
import { PageSpinner } from "@shared/components/states";

type LocationState = { from?: { pathname?: string } } | null;

/**
 * Keeps authenticated users out of the auth pages. This guard owns the
 * post-login redirect — the login mutation deliberately does not navigate,
 * so there is only ever one navigation in flight.
 */
export default function GuestRoute() {
    const { data: user, isPending } = useCurrentUser();
    const location = useLocation();

    if (isPending) {
        return <PageSpinner className="min-h-screen" />;
    }

    if (user) {
        const state = location.state as LocationState;
        return <Navigate to={state?.from?.pathname ?? AUTHENTICATED_LANDING} replace />;
    }

    return <Outlet />;
}
