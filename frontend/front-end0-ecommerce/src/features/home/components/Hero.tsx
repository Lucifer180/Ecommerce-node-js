import { ArrowRight, Star01 } from "@untitledui/icons";

import { Button } from "@/components/base/buttons/button";
import heroImage from "@assets/hero.png";
import { ROUTES } from "@routes/paths";

export const Hero = () => (
    <section className="border-b border-secondary bg-primary">
        <div className="mx-auto grid w-full max-w-container grid-cols-1 items-center gap-12 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-2">
            <div className="flex flex-col items-start gap-8">
                <span className="flex items-center gap-2 rounded-full border border-secondary bg-secondary px-3 py-1 text-sm font-medium text-secondary">
                    <Star01 className="size-4 text-fg-brand-primary" />
                    New season, new arrivals
                </span>

                <div className="flex flex-col gap-5">
                    <h1 className="text-display-lg font-semibold text-primary md:text-display-xl">Things worth keeping.</h1>
                    <p className="max-w-lg text-xl text-tertiary">
                        A small, carefully chosen catalogue. Free delivery over ₹999, secure checkout, and returns that don't need a phone call.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button size="xl" href={ROUTES.PRODUCTS} iconTrailing={ArrowRight}>
                        Shop all products
                    </Button>
                    <Button size="xl" color="secondary" href={ROUTES.REGISTER}>
                        Create an account
                    </Button>
                </div>
            </div>

            <div className="relative">
                <div className="overflow-hidden rounded-3xl border border-secondary bg-secondary shadow-xl">
                    <img src={heroImage} alt="" className="aspect-4/3 w-full object-cover" />
                </div>
            </div>
        </div>
    </section>
);
