import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@shared/lib/queryKeys";

import { adminApi, type NotificationInput, type ProductInput } from "../api/admin.api";

/** Every product mutation invalidates the whole product tree — lists, detail, and facets. */
const useProductMutation = <TVariables,>(mutationFn: (variables: TVariables) => Promise<unknown>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
    });
};

export const useCreateProduct = () => useProductMutation((payload: ProductInput) => adminApi.createProduct(payload));

export const useUpdateProduct = () =>
    useProductMutation(({ id, ...payload }: ProductInput & { id: string }) => adminApi.updateProduct(id, payload));

export const useDeleteProduct = () => useProductMutation((id: string) => adminApi.deleteProduct(id));

export function useUsers() {
    return useQuery({
        queryKey: queryKeys.admin.users,
        queryFn: () => adminApi.listUsers(),
    });
}

export function useUpdateUserRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: "user" | "admin" }) => adminApi.updateUserRole(userId, role),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.users }),
    });
}

export function useSendNotification() {
    return useMutation({
        mutationFn: (payload: NotificationInput) => adminApi.sendNotification(payload),
    });
}
