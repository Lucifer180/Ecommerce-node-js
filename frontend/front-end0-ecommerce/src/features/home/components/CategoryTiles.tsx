import { Link } from "react-router-dom";
import { ArrowUpRight } from "@untitledui/icons";

import { useCategories } from "@features/products";
import { ROUTES } from "@routes/paths";

/** Hidden entirely when the catalogue has no categories yet, rather than showing an empty band. */
export const CategoryTiles = () => {
    const { data: categories = [], isPending } = useCategories();

    if (isPending || categories.length === 0) return null;

    return (
        <section className="border-b border-secondary bg-primary">
            <div className="mx-auto flex w-full max-w-container flex-col gap-8 px-4 py-16 md:px-8">
                <h2 className="text-display-sm font-semibold text-primary">Shop by category</h2>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {categories.slice(0, 8).map((category) => (
                        <Link
                            key={category}
                            to={`${ROUTES.PRODUCTS}?category=${encodeURIComponent(category)}`}
                            className="group flex items-center justify-between gap-2 rounded-xl border border-secondary bg-primary p-5 transition hover:border-brand hover:shadow-md"
                        >
                            <span className="text-md font-semibold text-primary capitalize">{category}</span>
                            <ArrowUpRight className="size-5 text-fg-quaternary transition group-hover:text-fg-brand-primary" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
