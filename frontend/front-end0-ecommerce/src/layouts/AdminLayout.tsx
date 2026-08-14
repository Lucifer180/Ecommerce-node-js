import { NavLink, Outlet } from "react-router-dom";
import { ArrowLeft, Mail01, Package, Users01 } from "@untitledui/icons";

import { cx } from "@/utils/cx";
import { ROUTES } from "@routes/paths";

import { Logo } from "./components/Logo";

const adminNav = [
    { label: "Products", to: ROUTES.ADMIN_PRODUCTS, icon: Package },
    { label: "Customers", to: ROUTES.ADMIN_USERS, icon: Users01 },
    { label: "Notifications", to: ROUTES.ADMIN_NOTIFICATIONS, icon: Mail01 },
];

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-secondary lg:flex-row">
            <aside className="flex shrink-0 flex-col gap-6 border-b border-secondary bg-primary p-4 lg:w-64 lg:border-r lg:border-b-0 lg:p-6">
                <Logo />

                <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
                    {adminNav.map(({ label, to, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                cx(
                                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap transition",
                                    isActive ? "bg-active text-secondary_hover" : "text-secondary hover:bg-primary_hover"
                                )
                            }
                        >
                            <Icon className="size-5 shrink-0" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <NavLink
                    to={ROUTES.HOME}
                    className="mt-auto flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-tertiary transition hover:bg-primary_hover"
                >
                    <ArrowLeft className="size-5 shrink-0" />
                    Back to storefront
                </NavLink>
            </aside>

            <main className="flex-1 overflow-x-hidden">
                <Outlet />
            </main>
        </div>
    );
}
