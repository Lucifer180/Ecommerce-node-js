import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import axios from "axios";

import { tokenStorage } from "./tokens";

type RetriableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

/** Fired when the refresh flow fails, so the app can drop its cached user. */
export const AUTH_EXPIRED_EVENT = "auth:expired";

/**
 * A single in-flight refresh shared by every 401 that lands while it runs,
 * so a burst of parallel requests does not trigger a burst of refreshes.
 */
let refreshRequest: Promise<string> | null = null;

const refreshAccessToken = async (baseURL?: string): Promise<string> => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    // A bare axios call, so this request never re-enters these interceptors.
    const { data } = await axios.post<{ accessToken: string; role?: string }>(
        `${baseURL ?? ""}/auth/refreshToken`,
        { refreshToken },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    if (!data?.accessToken) throw new Error("Refresh response had no access token");

    tokenStorage.setAccessToken(data.accessToken, data.role);
    return data.accessToken;
};

export function attachInterceptors(instance: AxiosInstance) {
    instance.interceptors.request.use(
        (config) => {
            const token = tokenStorage.getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const original = error.config as RetriableRequest | undefined;

            const isAuthError = error.response?.status === 401;
            const isRefreshCall = original?.url?.includes("/auth/refreshToken");

            if (!isAuthError || !original || original._retry || isRefreshCall) {
                return Promise.reject(error);
            }

            // Nothing to refresh with — let the caller treat this as logged out.
            if (!tokenStorage.getRefreshToken()) {
                tokenStorage.clear();
                window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
                return Promise.reject(error);
            }

            original._retry = true;

            try {
                refreshRequest ??= refreshAccessToken(instance.defaults.baseURL).finally(() => {
                    refreshRequest = null;
                });

                const accessToken = await refreshRequest;

                original.headers.Authorization = `Bearer ${accessToken}`;
                return instance(original);
            } catch (refreshError) {
                tokenStorage.clear();
                window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
                return Promise.reject(refreshError);
            }
        }
    );
}
