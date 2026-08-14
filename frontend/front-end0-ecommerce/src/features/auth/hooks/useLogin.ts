import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@shared/lib/queryKeys";
import { tokenStorage } from "@shared/api/tokens";

import { authApi } from "../api/auth.api";

/**
 * Signs the user in and stores their tokens.
 *
 * Deliberately does NOT navigate. `GuestRoute` is still mounted at this point
 * and redirects as soon as the user resolves; a `navigate()` here would race
 * that redirect and lose, which is what used to dump people on "/".
 */
export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: async (response) => {
            const { acesstoken, refreshToken, role } = response.data;
            tokenStorage.setSession({ accessToken: acesstoken, refreshToken, role });

            await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
        },
    });
}
