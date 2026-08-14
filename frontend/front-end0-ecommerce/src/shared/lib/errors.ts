import { isAxiosError } from "axios";

type ApiErrorBody = {
    message?: string;
    error?: string;
    errors?: Array<{ msg?: string; message?: string; path?: string }>;
};

/**
 * The backend answers with `{ message }`, and express-validator failures with
 * an `errors` array. This flattens both into one string for the UI.
 */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
    if (!isAxiosError(error)) {
        return error instanceof Error ? error.message : fallback;
    }

    const data = error.response?.data as ApiErrorBody | undefined;

    if (data?.errors?.length) {
        const messages = data.errors.map((item) => item.msg ?? item.message).filter(Boolean);
        if (messages.length) return messages.join(", ");
    }

    return data?.message ?? data?.error ?? error.message ?? fallback;
}
