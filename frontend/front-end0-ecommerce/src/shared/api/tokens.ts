const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const ROLE_KEY = "role";

export type Role = "user" | "admin";

/**
 * Reads a value defensively: a failed login can write the string "undefined"
 * into localStorage, which would otherwise be sent as `Bearer undefined`.
 */
const read = (key: string): string | null => {
    const value = localStorage.getItem(key);
    if (!value || value === "undefined" || value === "null") return null;
    return value;
};

const readRole = (): Role | null => {
    const value = read(ROLE_KEY);
    return value === "admin" || value === "user" ? value : null;
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

/** Cached so `useSyncExternalStore` gets a stable snapshot between writes. */
let snapshot = { hasSession: read(ACCESS_TOKEN_KEY) !== null, role: readRole() };

const refreshSnapshot = () => {
    const hasSession = read(ACCESS_TOKEN_KEY) !== null;
    const role = readRole();

    if (hasSession !== snapshot.hasSession || role !== snapshot.role) {
        snapshot = { hasSession, role };
        emit();
    }
};

export const tokenStorage = {
    getAccessToken: () => read(ACCESS_TOKEN_KEY),
    getRefreshToken: () => read(REFRESH_TOKEN_KEY),
    getRole: () => snapshot.role,

    setSession: ({ accessToken, refreshToken, role }: { accessToken?: string | null; refreshToken?: string | null; role?: string | null }) => {
        if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        if (role) localStorage.setItem(ROLE_KEY, role);
        refreshSnapshot();
    },

    setAccessToken: (accessToken: string, role?: string | null) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        if (role) localStorage.setItem(ROLE_KEY, role);
        refreshSnapshot();
    },

    clear: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(ROLE_KEY);
        refreshSnapshot();
    },

    /** Snapshot for `useSyncExternalStore` — must be referentially stable. */
    getSnapshot: () => snapshot,
    hasSession: () => snapshot.hasSession,

    subscribe: (listener: () => void) => {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    },
};

// Keep other tabs in sync when they sign in or out.
window.addEventListener("storage", (event) => {
    if (event.key === ACCESS_TOKEN_KEY || event.key === ROLE_KEY || event.key === null) refreshSnapshot();
});
