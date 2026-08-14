import ResetPasswordForm from "../components/ResetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <div className="flex w-full flex-col gap-8">
            <header className="flex flex-col gap-2">
                <h1 className="text-display-xs font-semibold text-primary">Set a new password</h1>
                <p className="text-md text-tertiary">Choose a password you haven't used before.</p>
            </header>
            <ResetPasswordForm />
        </div>
    );
}
