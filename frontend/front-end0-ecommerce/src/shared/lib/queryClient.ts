import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
        },
        mutations: {
            // Retrying a failed POST can double-submit an order — never do it.
            retry: false,
        },
    },
});
