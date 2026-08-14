import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button } from "@/components/base/buttons/button";
import { Alert } from "@shared/components/alert";
import { FormInput } from "@shared/components/form-field";
import { getApiErrorMessage } from "@shared/lib/errors";
import { ROUTES } from "@routes/paths";

import { useForgotPassword } from "../hooks/usePasswordReset";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../schemas/password.schema";

const ForgotPasswordForm = () => {
    const { mutate, isPending, isSuccess, error } = useForgotPassword();

    const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    if (isSuccess) {
        return (
            <div className="flex w-full flex-col gap-5">
                <Alert type="success">If an account exists for that email, we've sent a reset link. It expires in 15 minutes.</Alert>
                <Button size="lg" color="secondary" href={ROUTES.LOGIN} className="w-full">
                    Back to sign in
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit((values) => mutate(values))} className="flex w-full flex-col gap-5" noValidate>
            {error && <Alert>{getApiErrorMessage(error)}</Alert>}

            <FormInput control={control} name="email" label="Email" type="email" placeholder="you@example.com" isRequired />

            <Button type="submit" size="lg" isLoading={isPending} isDisabled={isPending} className="w-full">
                Send reset link
            </Button>

            <p className="text-center text-sm text-tertiary">
                <Link to={ROUTES.LOGIN} className="font-semibold text-brand-secondary hover:text-brand-secondary_hover">
                    Back to sign in
                </Link>
            </p>
        </form>
    );
};

export default ForgotPasswordForm;
