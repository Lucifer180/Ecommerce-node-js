import { useState } from "react";
import { Edit01, Plus, Trash01 } from "@untitledui/icons";

import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ProductImage, useProducts } from "@features/products";
import type { Product } from "@features/products/types";
import { Alert } from "@shared/components/alert";
import { EmptyState, ErrorState, PageSpinner } from "@shared/components/states";
import { getApiErrorMessage } from "@shared/lib/errors";
import { formatPrice } from "@shared/lib/format";

import { ProductFormDialog } from "../components/ProductFormDialog";
import { useDeleteProduct } from "../hooks/useAdmin";

export default function AdminProductsPage() {
    const { data, isPending, isError, refetch } = useProducts({ page: 1, limit: 100 });
    const deleteProduct = useDeleteProduct();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);

    const openCreate = () => {
        setEditing(null);
        setIsDialogOpen(true);
    };

    const openEdit = (product: Product) => {
        setEditing(product);
        setIsDialogOpen(true);
    };

    const products = data?.items ?? [];

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-display-xs font-semibold text-primary">Products</h1>
                    <p className="text-md text-tertiary">{data ? `${data.totalProducts} in the catalogue` : "Manage your catalogue"}</p>
                </div>
                <Button size="lg" iconLeading={Plus} onPress={openCreate}>
                    Add product
                </Button>
            </div>

            {deleteProduct.isError && <Alert>{getApiErrorMessage(deleteProduct.error, "We couldn't delete that product.")}</Alert>}

            {isPending ? (
                <PageSpinner />
            ) : isError ? (
                <ErrorState description="We couldn't load the catalogue." onRetry={() => refetch()} />
            ) : products.length === 0 ? (
                <EmptyState
                    title="No products yet"
                    description="Add your first product to get the storefront going."
                    action={
                        <Button size="lg" iconLeading={Plus} onPress={openCreate}>
                            Add product
                        </Button>
                    }
                />
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-secondary bg-primary">
                    <table className="w-full min-w-3xl border-collapse">
                        <thead>
                            <tr className="border-b border-secondary">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-quaternary">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-quaternary">Category</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-quaternary">Price</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-quaternary">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-quaternary">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary">
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 shrink-0 overflow-hidden rounded-lg border border-secondary bg-secondary">
                                                <ProductImage product={product} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-primary">{product.name}</span>
                                                {product.description && (
                                                    <span className="line-clamp-1 max-w-xs text-sm text-tertiary">{product.description}</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-tertiary">{product.category ?? "—"}</td>
                                    <td className="px-6 py-4 text-right text-sm font-medium text-primary">{formatPrice(product.price)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Badge type="pill-color" color={product.stock > 0 ? "success" : "error"} size="sm">
                                            {product.stock}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                color="tertiary"
                                                size="sm"
                                                iconLeading={Edit01}
                                                onPress={() => openEdit(product)}
                                                aria-label={`Edit ${product.name}`}
                                            />
                                            <Button
                                                color="tertiary-destructive"
                                                size="sm"
                                                iconLeading={Trash01}
                                                isDisabled={deleteProduct.isPending}
                                                onPress={() => {
                                                    if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
                                                        deleteProduct.mutate(product._id);
                                                    }
                                                }}
                                                aria-label={`Delete ${product.name}`}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ProductFormDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} product={editing} />
        </div>
    );
}
