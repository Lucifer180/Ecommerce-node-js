import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useCurrentUser } from "@features/auth";
import { ROUTES } from "@routes/paths";
import { PageSpinner } from "@shared/components/states";

export default function ProtectedRoute() {
    const { data: user, isPending } = useCurrentUser();
    const location = useLocation();

    if (isPending) {
        return <PageSpinner className="min-h-[60vh]" />;
    }

    if (!user) {
        // Remember where they were headed so GuestRoute can send them back.
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    return <Outlet />;
}
