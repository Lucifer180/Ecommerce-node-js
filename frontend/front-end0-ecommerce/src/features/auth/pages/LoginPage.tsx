import LoginForm from "../components/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex w-full flex-col gap-8">
            <header className="flex flex-col gap-2">
                <h1 className="text-display-xs font-semibold text-primary">Welcome back</h1>
                <p className="text-md text-tertiary">Sign in to pick up where you left off.</p>
            </header>
            <LoginForm />
        </div>
    );
}
