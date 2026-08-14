import { ArrowRight } from "@untitledui/icons";

import { Button } from "@/components/base/buttons/button";
import { ProductCard, ProductCardSkeleton, useProducts } from "@features/products";
import { ROUTES } from "@routes/paths";
import { EmptyState } from "@shared/components/states";

export const FeaturedProducts = () => {
    const { data, isPending, isError } = useProducts({ page: 1, limit: 4 });
    const products = data?.items ?? [];

    return (
        <section className="bg-primary">
            <div className="mx-auto flex w-full max-w-container flex-col gap-10 px-4 py-16 md:px-8 md:py-24">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-display-sm font-semibold text-primary">Fresh in</h2>
                        <p className="text-lg text-tertiary">A few things we've just added to the catalogue.</p>
                    </div>
                    <Button color="link-color" size="lg" href={ROUTES.PRODUCTS} iconTrailing={ArrowRight}>
                        View all
                    </Button>
                </div>

                {isPending ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))}
                    </div>
                ) : isError || products.length === 0 ? (
                    <EmptyState
                        title="No products yet"
                        description={isError ? "We couldn't reach the catalogue right now." : "Once products are added they'll show up here."}
                    />
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
