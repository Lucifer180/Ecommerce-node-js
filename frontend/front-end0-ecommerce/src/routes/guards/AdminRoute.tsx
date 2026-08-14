import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useCurrentUser } from "@features/auth";
import { ROUTES } from "@routes/paths";
import { PageSpinner } from "@shared/components/states";

export default function AdminRoute() {
    const { data: user, isPending } = useCurrentUser();
    const location = useLocation();

    if (isPending) {
        return <PageSpinner className="min-h-[60vh]" />;
    }

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return <Outlet />;
}
