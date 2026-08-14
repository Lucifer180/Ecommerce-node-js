import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@shared/lib/queryKeys";
import { tokenStorage } from "@shared/api/tokens";

import { authApi } from "../api/auth.api";

/** Registration logs the user straight in; `GuestRoute` handles the redirect. */
export function useRegister() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.register,
        onSuccess: async (response) => {
            const { acesstoken, refreshToken, role } = response.data;
            tokenStorage.setSession({ accessToken: acesstoken, refreshToken, role });

            await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
        },
    });
}
