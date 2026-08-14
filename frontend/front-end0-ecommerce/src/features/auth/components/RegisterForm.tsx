import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button } from "@/components/base/buttons/button";
import { Alert } from "@shared/components/alert";
import { FormInput } from "@shared/components/form-field";
import { getApiErrorMessage } from "@shared/lib/errors";
import { ROUTES } from "@routes/paths";

import { useRegister } from "../hooks/useRegister";
import { registerSchema, type RegisterFormValues } from "../schemas/register.schema";

const RegisterForm = () => {
    const { mutate, isPending, error } = useRegister();

    const { control, handleSubmit } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    });

    // `confirmPassword` is a client-side check only — the API takes name/email/password.
    const onSubmit = ({ name, email, password }: RegisterFormValues) => mutate({ name, email, password });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-5" noValidate>
            {error && <Alert>{getApiErrorMessage(error, "We couldn't create your account.")}</Alert>}

            <FormInput control={control} name="name" label="Name" placeholder="Jane Doe" isRequired />
            <FormInput control={control} name="email" label="Email" type="email" placeholder="you@example.com" isRequired />
            <FormInput
                control={control}
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                hint="Must be at least 8 characters."
                isRequired
            />
            <FormInput control={control} name="confirmPassword" label="Confirm password" type="password" placeholder="••••••••" isRequired />

            <Button type="submit" size="lg" isLoading={isPending} isDisabled={isPending} className="w-full">
                Create account
            </Button>

            <p className="text-center text-sm text-tertiary">
                Already have an account?{" "}
                <Link to={ROUTES.LOGIN} className="font-semibold text-brand-secondary hover:text-brand-secondary_hover">
                    Sign in
                </Link>
            </p>
        </form>
    );
};

export default RegisterForm;
