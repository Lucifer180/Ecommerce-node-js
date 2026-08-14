import { LogOut01, Package } from "@untitledui/icons";

import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { useCurrentUser, useLogout } from "@features/auth";
import { useMyOrders } from "@features/orders";
import { ROUTES } from "@routes/paths";
import { PageSpinner } from "@shared/components/states";
import { formatDate } from "@shared/lib/format";

export default function ProfilePage() {
    const { user, isPending } = useCurrentUser();
    const { data: orders = [] } = useMyOrders();
    const logout = useLogout();

    if (isPending || !user) return <PageSpinner className="min-h-[60vh]" />;

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
            <h1 className="text-display-sm font-semibold text-primary">Your account</h1>

            <section className="flex flex-col gap-6 rounded-2xl border border-secondary bg-primary p-6">
                <div className="flex items-center gap-4">
                    <Avatar size="xl" alt={user.name} initials={user.name?.slice(0, 2).toUpperCase()} />
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-primary">{user.name}</h2>
                            {user.role === "admin" && (
                                <Badge type="pill-color" color="brand" size="sm">
                                    Admin
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-tertiary">{user.email}</p>
                    </div>
                </div>

                <dl className="grid grid-cols-1 gap-4 border-t border-secondary pt-6 sm:grid-cols-2">
                    <div>
                        <dt className="text-sm text-tertiary">Member since</dt>
                        <dd className="text-md font-medium text-primary">{formatDate(user.createdAt)}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-tertiary">Orders placed</dt>
                        <dd className="text-md font-medium text-primary">{orders.length}</dd>
                    </div>
                </dl>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" color="secondary" iconLeading={Package} href={ROUTES.ORDERS}>
                    View orders
                </Button>
                <Button
                    size="lg"
                    color="secondary-destructive"
                    iconLeading={LogOut01}
                    isLoading={logout.isPending}
                    isDisabled={logout.isPending}
                    onPress={() => logout.mutate()}
                >
                    Sign out
                </Button>
            </div>
        </div>
    );
}
