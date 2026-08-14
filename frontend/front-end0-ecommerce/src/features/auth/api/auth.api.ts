import { client } from "@shared/api/client";

import type {
    AuthTokenResponse,
    CurrentUserResponse,
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResetPasswordRequest,
} from "../types";

class AuthApi {
    register(data: RegisterRequest) {
        return client.post<AuthTokenResponse>("/auth/register", data);
    }

    login(data: LoginRequest) {
        return client.post<AuthTokenResponse>("/auth/login", data);
    }

    getCurrentUser() {
        return client.get<CurrentUserResponse>("/auth/me");
    }

    logout() {
        return client.post<MessageResponse>("/auth/logout");
    }

    forgotPassword(data: ForgotPasswordRequest) {
        return client.post<MessageResponse>("/auth/forgot-password", data);
    }

    resetPassword(token: string, data: ResetPasswordRequest) {
        return client.patch<MessageResponse>(`/auth/reset-password/${token}`, data);
    }
}

export const authApi = new AuthApi();
