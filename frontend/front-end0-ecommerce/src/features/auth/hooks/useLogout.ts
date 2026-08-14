import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { tokenStorage } from "@shared/api/tokens";
import { ROUTES } from "@routes/paths";

import { authApi } from "../api/auth.api";

export function useLogout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => authApi.logout(),
        // Whether or not the server call succeeds, the client session is over.
        onSettled: async () => {
            tokenStorage.clear();
            queryClient.clear();
            navigate(ROUTES.HOME, { replace: true });
        },
    });
}
