import { Link } from "react-router-dom";

import { ROUTES } from "@routes/paths";

import { Logo } from "./Logo";

const footerSections = [
    {
        title: "Shop",
        links: [
            { label: "All products", to: ROUTES.PRODUCTS },
            { label: "Your cart", to: ROUTES.CART },
            { label: "Your orders", to: ROUTES.ORDERS },
        ],
    },
    {
        title: "Account",
        links: [
            { label: "Sign in", to: ROUTES.LOGIN },
            { label: "Create account", to: ROUTES.REGISTER },
            { label: "Reset password", to: ROUTES.FORGOT_PASSWORD },
        ],
    },
];

export const Footer = () => (
    <footer className="border-t border-secondary bg-primary">
        <div className="mx-auto flex w-full max-w-container flex-col gap-10 px-4 py-12 md:px-8">
            <div className="flex flex-col gap-10 md:flex-row md:justify-between">
                <div className="flex max-w-xs flex-col gap-4">
                    <Logo />
                    <p className="text-sm text-tertiary">A small storefront built on the Aurora commerce API.</p>
                </div>

                <div className="grid grid-cols-2 gap-8 sm:gap-16">
                    {footerSections.map((section) => (
                        <div key={section.title} className="flex flex-col gap-3">
                            <h3 className="text-sm font-semibold text-quaternary">{section.title}</h3>
                            <ul className="flex flex-col gap-2">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link to={link.to} className="text-sm font-medium text-tertiary hover:text-secondary">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <p className="border-t border-secondary pt-8 text-sm text-quaternary">© {new Date().getFullYear()} Aurora. All rights reserved.</p>
        </div>
    </footer>
);
