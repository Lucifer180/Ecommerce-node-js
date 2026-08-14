import { Link } from "react-router-dom";
import { ShoppingCart01 } from "@untitledui/icons";

import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { useAddToCart } from "@features/cart/hooks/useCart";
import { ROUTES } from "@routes/paths";
import { formatPrice } from "@shared/lib/format";

import type { Product } from "../types";
import { ProductImage } from "./ProductImage";

export const ProductCard = ({ product }: { product: Product }) => {
    const addToCart = useAddToCart();
    const isOutOfStock = product.stock <= 0;

    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border border-secondary bg-primary transition duration-200 hover:shadow-lg">
            <Link to={ROUTES.PRODUCT_DETAIL(product._id)} className="relative aspect-4/3 overflow-hidden bg-secondary">
                <ProductImage product={product} className="transition duration-300 group-hover:scale-105" />
                {isOutOfStock && (
                    <div className="absolute top-3 left-3">
                        <Badge type="pill-color" color="gray" size="sm">
                            Out of stock
                        </Badge>
                    </div>
                )}
            </Link>

            <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex flex-1 flex-col gap-1">
                    {product.category && <p className="text-xs font-medium text-brand-secondary uppercase">{product.category}</p>}
                    <Link to={ROUTES.PRODUCT_DETAIL(product._id)} className="text-md font-semibold text-primary hover:underline">
                        {product.name}
                    </Link>
                    {product.description && <p className="line-clamp-2 text-sm text-tertiary">{product.description}</p>}
                </div>

                <div className="flex items-center justify-between gap-3">
                    <span className="text-lg font-semibold text-primary">{formatPrice(product.price)}</span>
                    <Button
                        size="sm"
                        color="secondary"
                        iconLeading={ShoppingCart01}
                        isDisabled={isOutOfStock || addToCart.isPending}
                        isLoading={addToCart.isPending}
                        onPress={() => addToCart.mutate({ productId: product._id, quantity: 1 })}
                    >
                        Add
                    </Button>
                </div>
            </div>
        </article>
    );
};

export const ProductCardSkeleton = () => (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-secondary bg-primary">
        <div className="aspect-4/3 animate-pulse bg-secondary" />
        <div className="flex flex-col gap-3 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-secondary" />
            <div className="h-3 w-full animate-pulse rounded bg-secondary" />
            <div className="h-5 w-1/3 animate-pulse rounded bg-secondary" />
        </div>
    </div>
);
