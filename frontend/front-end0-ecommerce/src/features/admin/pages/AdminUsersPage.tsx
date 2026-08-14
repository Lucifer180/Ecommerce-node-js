import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Select } from "@/components/base/select/select";
import { useCurrentUser } from "@features/auth";
import { Alert } from "@shared/components/alert";
import { ErrorState, PageSpinner } from "@shared/components/states";
import { getApiErrorMessage } from "@shared/lib/errors";
import { formatDate } from "@shared/lib/format";

import { useUpdateUserRole, useUsers } from "../hooks/useAdmin";

const roleItems = [
    { id: "user", label: "Customer" },
    { id: "admin", label: "Admin" },
];

export default function AdminUsersPage() {
    const { data: users = [], isPending, isError, refetch } = useUsers();
    const { user: currentUser } = useCurrentUser();
    const updateRole = useUpdateUserRole();

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-display-xs font-semibold text-primary">Customers</h1>
                <p className="text-md text-tertiary">{users.length} registered {users.length === 1 ? "account" : "accounts"}</p>
            </div>

            {updateRole.isError && <Alert>{getApiErrorMessage(updateRole.error, "We couldn't change that role.")}</Alert>}

            {isPending ? (
                <PageSpinner />
            ) : isError ? (
                <ErrorState description="We couldn't load the customer list." onRetry={() => refetch()} />
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-secondary bg-primary">
                    <table className="w-full min-w-2xl border-collapse">
                        <thead>
                            <tr className="border-b border-secondary">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-quaternary">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-quaternary">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-quaternary">Joined</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-quaternary">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary">
                            {users.map((user) => {
                                const isSelf = user._id === currentUser?._id;

                                return (
                                    <tr key={user._id}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar size="sm" alt={user.name} initials={user.name?.slice(0, 2).toUpperCase()} />
                                                <span className="text-sm font-medium text-primary">{user.name}</span>
                                                {isSelf && (
                                                    <Badge type="pill-color" color="gray" size="sm">
                                                        You
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-tertiary">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-tertiary">{formatDate(user.createdAt)}</td>
                                        <td className="px-6 py-4">
                                            <div className="w-40">
                                                <Select
                                                    aria-label={`Role for ${user.name}`}
                                                    items={roleItems}
                                                    selectedKey={user.role}
                                                    // Demoting yourself would lock you out of this page mid-session.
                                                    isDisabled={isSelf || updateRole.isPending}
                                                    onSelectionChange={(key) =>
                                                        updateRole.mutate({ userId: user._id, role: key as "user" | "admin" })
                                                    }
                                                >
                                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                                </Select>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
