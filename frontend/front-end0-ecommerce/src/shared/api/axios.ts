import axios from "axios";

import { attachInterceptors } from "./interceptors";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

attachInterceptors(api);
