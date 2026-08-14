import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@shared/lib/queryClient";

type Props = {
    children: ReactNode;
};

export function Providers({ children }: Props) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
