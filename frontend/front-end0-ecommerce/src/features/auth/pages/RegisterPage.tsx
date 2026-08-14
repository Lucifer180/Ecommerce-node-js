import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="flex w-full flex-col gap-8">
            <header className="flex flex-col gap-2">
                <h1 className="text-display-xs font-semibold text-primary">Create your account</h1>
                <p className="text-md text-tertiary">Save your cart, track orders, and check out faster.</p>
            </header>
            <RegisterForm />
        </div>
    );
}
