import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Package, ShieldTick, ShoppingCart01, Truck01 } from "@untitledui/icons";

import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { useAddToCart } from "@features/cart/hooks/useCart";
import { ROUTES } from "@routes/paths";
import { Alert } from "@shared/components/alert";
import { ErrorState, PageSpinner } from "@shared/components/states";
import { getApiErrorMessage } from "@shared/lib/errors";
import { formatPrice } from "@shared/lib/format";

import { ProductImage } from "../components/ProductImage";
import { useProduct } from "../hooks/useProducts";

const guarantees = [
    { icon: Truck01, title: "Free delivery", description: "On orders over ₹999" },
    { icon: ShieldTick, title: "Secure checkout", description: "Payments handled by Razorpay" },
    { icon: Package, title: "Easy returns", description: "30-day return window" },
];

export default function ProductDetailPage() {
    const { id } = useParams();
    const { data: product, isPending, isError, refetch } = useProduct(id);
    const addToCart = useAddToCart();
    const [quantity, setQuantity] = useState(1);

    if (isPending) return <PageSpinner className="min-h-[60vh]" />;

    if (isError || !product) {
        return (
            <div className="mx-auto w-full max-w-container px-4 py-16">
                <ErrorState title="Product not found" description="It may have been removed from the catalogue." onRetry={() => refetch()} />
            </div>
        );
    }

    const isOutOfStock = product.stock <= 0;
    const maxQuantity = Math.max(1, product.stock);

    return (
        <div className="mx-auto flex w-full max-w-container flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
            <Link to={ROUTES.PRODUCTS} className="flex w-max items-center gap-2 text-sm font-semibold text-tertiary hover:text-secondary">
                <ArrowLeft className="size-4" />
                Back to products
            </Link>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                <div className="aspect-square overflow-hidden rounded-2xl border border-secondary bg-secondary">
                    <ProductImage product={product} />
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        {product.category && (
                            <Badge type="pill-color" color="brand" size="md">
                                {product.category}
                            </Badge>
                        )}
                        <h1 className="text-display-sm font-semibold text-primary">{product.name}</h1>
                        <p className="text-display-xs font-semibold text-primary">{formatPrice(product.price)}</p>
                    </div>

                    {product.description && <p className="text-md text-tertiary">{product.description}</p>}

                    <div className="flex items-center gap-2 text-sm">
                        {isOutOfStock ? (
                            <span className="font-medium text-error-primary">Out of stock</span>
                        ) : (
                            <>
                                <CheckCircle className="size-4 text-fg-success-primary" />
                                <span className="text-tertiary">
                                    In stock — <span className="font-medium text-secondary">{product.stock} available</span>
                                </span>
                            </>
                        )}
                    </div>

                    {addToCart.isError && <Alert>{getApiErrorMessage(addToCart.error, "We couldn't add that to your cart.")}</Alert>}
                    {addToCart.isSuccess && <Alert type="success">Added to your cart.</Alert>}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-1 rounded-lg border border-primary p-1">
                            <Button
                                color="tertiary"
                                size="sm"
                                isDisabled={quantity <= 1}
                                onPress={() => setQuantity((value) => Math.max(1, value - 1))}
                                aria-label="Decrease quantity"
                            >
                                −
                            </Button>
                            <span className="w-10 text-center text-md font-medium text-primary">{quantity}</span>
                            <Button
                                color="tertiary"
                                size="sm"
                                isDisabled={quantity >= maxQuantity}
                                onPress={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
                                aria-label="Increase quantity"
                            >
                                +
                            </Button>
                        </div>

                        <Button
                            size="xl"
                            iconLeading={ShoppingCart01}
                            className="flex-1"
                            isDisabled={isOutOfStock || addToCart.isPending}
                            isLoading={addToCart.isPending}
                            onPress={() => addToCart.mutate({ productId: product._id, quantity })}
                        >
                            {isOutOfStock ? "Out of stock" : "Add to cart"}
                        </Button>
                    </div>

                    <ul className="flex flex-col gap-4 border-t border-secondary pt-6">
                        {guarantees.map(({ icon: Icon, title, description }) => (
                            <li key={title} className="flex items-start gap-3">
                                <Icon className="mt-0.5 size-5 text-fg-brand-primary" />
                                <div>
                                    <p className="text-sm font-semibold text-primary">{title}</p>
                                    <p className="text-sm text-tertiary">{description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
