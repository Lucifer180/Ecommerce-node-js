import { Button } from "@/components/base/buttons/button";
import { ROUTES } from "@routes/paths";

export default function NotFoundPage() {
    return (
        <div className="mx-auto flex min-h-[60vh] w-full max-w-container flex-col items-center justify-center gap-6 px-4 text-center">
            <p className="text-sm font-semibold text-brand-secondary">404 error</p>
            <div className="flex flex-col gap-3">
                <h1 className="text-display-md font-semibold text-primary">Page not found</h1>
                <p className="text-lg text-tertiary">Sorry, the page you're looking for doesn't exist or has moved.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" color="secondary" href={ROUTES.HOME}>
                    Go home
                </Button>
                <Button size="lg" href={ROUTES.PRODUCTS}>
                    Browse products
                </Button>
            </div>
        </div>
    );
}
