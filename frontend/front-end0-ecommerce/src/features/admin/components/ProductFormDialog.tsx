import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";

import { Button } from "@/components/base/buttons/button";
import type { Product } from "@features/products/types";
import { Alert } from "@shared/components/alert";
import { FormInput, FormTextArea } from "@shared/components/form-field";
import { getApiErrorMessage } from "@shared/lib/errors";

import { useCreateProduct, useUpdateProduct } from "../hooks/useAdmin";
import { productSchema, type ProductFormValues } from "../schemas/product.schema";

type ProductFormDialogProps = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    /** Present when editing; absent when creating. */
    product?: Product | null;
};

const emptyValues: ProductFormValues = { name: "", description: "", price: "", stock: "", category: "" };

export const ProductFormDialog = ({ isOpen, onOpenChange, product }: ProductFormDialogProps) => {
    const isEditing = Boolean(product);
    const createProduct = useCreateProduct();
    const updateProduct = useUpdateProduct();
    const mutation = isEditing ? updateProduct : createProduct;

    const { control, handleSubmit, reset, formState } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: emptyValues,
    });

    // Refill the form whenever a different product is opened.
    useEffect(() => {
        if (!isOpen) return;

        reset(
            product
                ? {
                      name: product.name,
                      description: product.description ?? "",
                      price: String(product.price),
                      stock: String(product.stock),
                      category: product.category ?? "",
                  }
                : emptyValues
        );
        mutation.reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, product, reset]);

    const onSubmit = (values: ProductFormValues) => {
        const payload = {
            name: values.name,
            price: Number(values.price),
            stock: Number(values.stock),
            description: values.description || undefined,
            category: values.category || undefined,
        };

        const onSuccess = () => onOpenChange(false);

        if (product) {
            updateProduct.mutate({ id: product._id, ...payload }, { onSuccess });
        } else {
            createProduct.mutate(payload, { onSuccess });
        }
    };

    return (
        <ModalOverlay
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable
            className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/70 p-4 backdrop-blur-[6px]"
        >
            <Modal className="w-full max-w-lg">
                <Dialog className="flex max-h-[85vh] flex-col gap-6 overflow-y-auto rounded-2xl bg-primary p-6 shadow-xl outline-hidden">
                    <Heading slot="title" className="text-lg font-semibold text-primary">
                        {isEditing ? "Edit product" : "Add product"}
                    </Heading>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
                        {mutation.isError && <Alert>{getApiErrorMessage(mutation.error, "We couldn't save the product.")}</Alert>}

                        <FormInput control={control} name="name" label="Name" placeholder="Wireless headphones" isRequired />

                        <FormTextArea
                            control={control}
                            name="description"
                            label="Description"
                            placeholder="What is it, and why would someone want it?"
                            rows={3}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormInput control={control} name="price" label="Price (₹)" type="number" placeholder="0" isRequired />
                            <FormInput control={control} name="stock" label="Stock" type="number" placeholder="0" isRequired />
                        </div>

                        <FormInput control={control} name="category" label="Category" placeholder="Electronics" />

                        <div className="flex justify-end gap-3 border-t border-secondary pt-5">
                            <Button color="secondary" size="lg" onPress={() => onOpenChange(false)} isDisabled={mutation.isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" size="lg" isLoading={mutation.isPending} isDisabled={mutation.isPending || formState.isSubmitting}>
                                {isEditing ? "Save changes" : "Create product"}
                            </Button>
                        </div>
                    </form>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};
