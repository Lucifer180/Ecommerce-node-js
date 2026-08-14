export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    password: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    createdAt?: string;
}

/** `POST /auth/login` and `/auth/register` — note the backend's `acesstoken` spelling. */
export interface AuthTokenResponse {
    success: boolean;
    acesstoken: string;
    refreshToken: string;
    role: User["role"];
    user: User;
}

/** `GET /auth/me` */
export interface CurrentUserResponse {
    success: boolean;
    user: User;
}

export interface MessageResponse {
    success: boolean;
    message: string;
}
