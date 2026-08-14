import { useMutation } from "@tanstack/react-query";

import { authApi } from "../api/auth.api";
import type { ResetPasswordRequest } from "../types";

export function useForgotPassword() {
    return useMutation({
        mutationFn: authApi.forgotPassword,
    });
}

export function useResetPassword(token: string) {
    return useMutation({
        mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(token, data),
    });
}
