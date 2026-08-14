import { Link } from "react-router-dom";
import { Trash01 } from "@untitledui/icons";

import { Button } from "@/components/base/buttons/button";
import { ProductImage } from "@features/products/components/ProductImage";
import { ROUTES } from "@routes/paths";
import { formatPrice } from "@shared/lib/format";

import { useRemoveCartItem, useUpdateCartItem } from "../hooks/useCart";
import { getLineTotal, getProduct } from "../lib/cart-utils";
import type { CartItem } from "../types";

export const CartItemRow = ({ item }: { item: CartItem }) => {
    const product = getProduct(item);
    const updateItem = useUpdateCartItem();
    const removeItem = useRemoveCartItem();

    // Defensive: an item whose product was deleted server-side.
    if (!product) {
        return (
            <li className="flex items-center justify-between gap-4 py-6">
                <p className="text-sm text-tertiary">This product is no longer available.</p>
            </li>
        );
    }

    const isBusy = updateItem.isPending || removeItem.isPending;
    const maxQuantity = Math.max(1, product.stock);

    return (
        <li className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
            <Link to={ROUTES.PRODUCT_DETAIL(product._id)} className="size-24 shrink-0 overflow-hidden rounded-xl border border-secondary bg-secondary">
                <ProductImage product={product} />
            </Link>

            <div className="flex flex-1 flex-col gap-1">
                <Link to={ROUTES.PRODUCT_DETAIL(product._id)} className="text-md font-semibold text-primary hover:underline">
                    {product.name}
                </Link>
                {product.category && <p className="text-sm text-tertiary">{product.category}</p>}
                <p className="text-sm text-tertiary">{formatPrice(product.price)} each</p>
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-primary p-1">
                <Button
                    color="tertiary"
                    size="sm"
                    isDisabled={isBusy || item.quantity <= 1}
                    onPress={() => updateItem.mutate({ productId: product._id, quantity: item.quantity - 1 })}
                    aria-label={`Decrease quantity of ${product.name}`}
                >
                    −
                </Button>
                <span className="w-9 text-center text-sm font-medium text-primary">{item.quantity}</span>
                <Button
                    color="tertiary"
                    size="sm"
                    isDisabled={isBusy || item.quantity >= maxQuantity}
                    onPress={() => updateItem.mutate({ productId: product._id, quantity: item.quantity + 1 })}
                    aria-label={`Increase quantity of ${product.name}`}
                >
                    +
                </Button>
            </div>

            <div className="flex items-center gap-4 sm:w-36 sm:justify-end">
                <span className="text-md font-semibold text-primary">{formatPrice(getLineTotal(item))}</span>
                <Button
                    color="tertiary-destructive"
                    size="sm"
                    iconLeading={Trash01}
                    isDisabled={isBusy}
                    onPress={() => removeItem.mutate(product._id)}
                    aria-label={`Remove ${product.name} from cart`}
                />
            </div>
        </li>
    );
};
