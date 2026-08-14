import { api } from "./axios";

/**
 * Thin facade over the axios instance. Axios binds its own methods, so
 * destructuring them here is safe.
 */
export const client = {
    get: api.get,
    post: api.post,
    put: api.put,
    patch: api.patch,
    delete: api.delete,
};

export { api };
