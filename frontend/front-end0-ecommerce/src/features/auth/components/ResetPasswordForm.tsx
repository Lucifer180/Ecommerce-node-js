import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/base/buttons/button";
import { Alert } from "@shared/components/alert";
import { FormInput } from "@shared/components/form-field";
import { getApiErrorMessage } from "@shared/lib/errors";
import { ROUTES } from "@routes/paths";

import { useResetPassword } from "../hooks/usePasswordReset";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../schemas/password.schema";

const ResetPasswordForm = () => {
    const { token = "" } = useParams();
    const { mutate, isPending, isSuccess, error } = useResetPassword(token);

    const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    if (isSuccess) {
        return (
            <div className="flex w-full flex-col gap-5">
                <Alert type="success">Your password has been reset. You can sign in with it now.</Alert>
                <Button size="lg" href={ROUTES.LOGIN} className="w-full">
                    Continue to sign in
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(({ password }) => mutate({ password }))} className="flex w-full flex-col gap-5" noValidate>
            {error && <Alert>{getApiErrorMessage(error, "That reset link is invalid or has expired.")}</Alert>}

            <FormInput
                control={control}
                name="password"
                label="New password"
                type="password"
                placeholder="••••••••"
                hint="Must be at least 8 characters."
                isRequired
            />
            <FormInput control={control} name="confirmPassword" label="Confirm new password" type="password" placeholder="••••••••" isRequired />

            <Button type="submit" size="lg" isLoading={isPending} isDisabled={isPending} className="w-full">
                Reset password
            </Button>

            <p className="text-center text-sm text-tertiary">
                <Link to={ROUTES.LOGIN} className="font-semibold text-brand-secondary hover:text-brand-secondary_hover">
                    Back to sign in
                </Link>
            </p>
        </form>
    );
};

export default ResetPasswordForm;
