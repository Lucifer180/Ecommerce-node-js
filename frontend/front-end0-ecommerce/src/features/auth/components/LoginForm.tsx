import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button } from "@/components/base/buttons/button";
import { Alert } from "@shared/components/alert";
import { FormInput } from "@shared/components/form-field";
import { getApiErrorMessage } from "@shared/lib/errors";
import { ROUTES } from "@routes/paths";

import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";

const LoginForm = () => {
    const { mutate, isPending, error } = useLogin();

    const { control, handleSubmit } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    return (
        <form onSubmit={handleSubmit((values) => mutate(values))} className="flex w-full flex-col gap-5" noValidate>
            {error && <Alert>{getApiErrorMessage(error, "We couldn't sign you in. Check your details and try again.")}</Alert>}

            <FormInput control={control} name="email" label="Email" type="email" placeholder="you@example.com" isRequired />

            <div className="flex flex-col gap-2">
                <FormInput control={control} name="password" label="Password" type="password" placeholder="••••••••" isRequired />
                <Link to={ROUTES.FORGOT_PASSWORD} className="self-end text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover">
                    Forgot password?
                </Link>
            </div>

            <Button type="submit" size="lg" isLoading={isPending} isDisabled={isPending} className="w-full">
                Sign in
            </Button>

            <p className="text-center text-sm text-tertiary">
                Don't have an account?{" "}
                <Link to={ROUTES.REGISTER} className="font-semibold text-brand-secondary hover:text-brand-secondary_hover">
                    Sign up
                </Link>
            </p>
        </form>
    );
};

export default LoginForm;
