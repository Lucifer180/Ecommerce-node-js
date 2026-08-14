import { ArrowRight } from "@untitledui/icons";

import { Button } from "@/components/base/buttons/button";
import { useCurrentUser } from "@features/auth";
import { ROUTES } from "@routes/paths";

export const CallToAction = () => {
    const { isAuthenticated } = useCurrentUser();

    return (
        <section className="bg-brand-section">
            <div className="mx-auto flex w-full max-w-container flex-col items-center gap-8 px-4 py-16 text-center md:px-8 md:py-24">
                <div className="flex max-w-2xl flex-col gap-4">
                    <h2 className="text-display-md font-semibold text-primary_on-brand">
                        {isAuthenticated ? "Pick up where you left off" : "Start shopping in under a minute"}
                    </h2>
                    <p className="text-xl text-tertiary_on-brand">
                        {isAuthenticated
                            ? "Your cart is saved to your account, on every device you sign in from."
                            : "Create an account to save your cart, track orders, and check out faster next time."}
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button size="xl" color="secondary" href={ROUTES.PRODUCTS} iconTrailing={ArrowRight}>
                        Browse the catalogue
                    </Button>
                    {!isAuthenticated && (
                        <Button size="xl" href={ROUTES.REGISTER}>
                            Create an account
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
};
