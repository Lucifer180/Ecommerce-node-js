import { useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@shared/lib/queryKeys";
import { tokenStorage } from "@shared/api/tokens";

import { authApi } from "../api/auth.api";

/** Reactive view of the stored session, so components re-render when it changes. */
const useSession = () => useSyncExternalStore(tokenStorage.subscribe, tokenStorage.getSnapshot, tokenStorage.getSnapshot);

export const useHasSession = () => useSession().hasSession;

/**
 * The role cached in localStorage. Use it only to avoid a UI flash before
 * `/auth/me` resolves — localStorage is user-editable, so it is never a
 * substitute for the server-verified role below or the API's own checks.
 */
export const useCachedRole = () => useSession().role;

/**
 * Resolves the signed-in user.
 *
 * With no token stored there is nothing to ask the server about, so the query
 * stays disabled and reports "not authenticated" immediately. Without this the
 * guards would fire a guaranteed-401 `/auth/me` on every cold page load.
 */
export function useCurrentUser() {
    const { hasSession, role: cachedRole } = useSession();

    const query = useQuery({
        queryKey: queryKeys.auth.me,
        queryFn: async () => {
            const { data } = await authApi.getCurrentUser();
            // Keep the cached role honest if it drifted from the server's answer.
            tokenStorage.setSession({ role: data.user.role });
            return data.user;
        },
        enabled: hasSession,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    const user = hasSession ? query.data : undefined;

    return {
        data: user,
        user,
        // A disabled query sits in `pending` forever, which would hang the guards.
        isPending: hasSession && query.isPending,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        isAuthenticated: Boolean(user),
        /** Server-verified once loaded; falls back to the cached hint meanwhile. */
        role: user?.role ?? cachedRole,
        isAdmin: user ? user.role === "admin" : cachedRole === "admin",
        refetch: query.refetch,
    };
}
