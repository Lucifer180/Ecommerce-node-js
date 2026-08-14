import { Outlet } from "react-router-dom";
import { CreditCard02, Package, ShieldTick } from "@untitledui/icons";

import { Logo } from "./components/Logo";

const highlights = [
    { icon: Package, title: "Track every order", description: "See what you've bought and where it is." },
    { icon: CreditCard02, title: "Faster checkout", description: "Your cart is saved to your account." },
    { icon: ShieldTick, title: "Secure by default", description: "Payments handled by Razorpay." },
];

export default function AuthLayout() {
    return (
        <div className="flex min-h-screen bg-primary">
            <div className="flex flex-1 flex-col px-4 py-8 md:px-8">
                <Logo />
                <div className="flex flex-1 items-center justify-center py-12">
                    <div className="w-full max-w-sm">
                        <Outlet />
                    </div>
                </div>
            </div>

            {/* Decorative panel — hidden on small screens where it would just push the form down. */}
            <aside className="hidden w-1/2 max-w-2xl flex-col justify-center gap-10 bg-linear-to-br from-brand-800 to-brand-600 p-16 lg:flex">
                <h2 className="text-display-md font-semibold text-white">Everything you need, in one place.</h2>
                <ul className="flex flex-col gap-6">
                    {highlights.map(({ icon: Icon, title, description }) => (
                        <li key={title} className="flex items-start gap-4">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                                <Icon className="size-5 text-white" />
                            </span>
                            <div>
                                <p className="font-semibold text-white">{title}</p>
                                <p className="text-md text-white/70">{description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
}
