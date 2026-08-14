import ForgotPasswordForm from "../components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
    return (
        <div className="flex w-full flex-col gap-8">
            <header className="flex flex-col gap-2">
                <h1 className="text-display-xs font-semibold text-primary">Forgot your password?</h1>
                <p className="text-md text-tertiary">Enter your email and we'll send you a link to reset it.</p>
            </header>
            <ForgotPasswordForm />
        </div>
    );
}
