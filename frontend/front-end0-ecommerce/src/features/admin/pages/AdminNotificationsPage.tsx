import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Send01 } from "@untitledui/icons";

import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Alert } from "@shared/components/alert";
import { FormInput, FormTextArea } from "@shared/components/form-field";
import { PageSpinner } from "@shared/components/states";
import { getApiErrorMessage } from "@shared/lib/errors";

import { useSendNotification, useUsers } from "../hooks/useAdmin";
import { notificationSchema, type NotificationFormValues } from "../schemas/notification.schema";

export default function AdminNotificationsPage() {
    const { data: users = [], isPending } = useUsers();
    const sendNotification = useSendNotification();

    const [sendToAll, setSendToAll] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const { control, handleSubmit, reset } = useForm<NotificationFormValues>({
        resolver: zodResolver(notificationSchema),
        defaultValues: { subject: "", message: "" },
    });

    const recipientCount = sendToAll ? users.length : selectedIds.length;

    const toggleUser = (userId: string, isSelected: boolean) =>
        setSelectedIds((current) => (isSelected ? [...current, userId] : current.filter((id) => id !== userId)));

    const onSubmit = (values: NotificationFormValues) => {
        if (recipientCount === 0) return;

        // Bulk email is hard to take back, so confirm the blast radius first.
        const confirmed = window.confirm(
            `Send "${values.subject}" to ${recipientCount} ${recipientCount === 1 ? "person" : "people"}? This cannot be undone.`
        );
        if (!confirmed) return;

        sendNotification.mutate(
            { ...values, userIds: sendToAll ? undefined : selectedIds },
            {
                onSuccess: () => {
                    reset();
                    setSelectedIds([]);
                },
            }
        );
    };

    if (isPending) return <PageSpinner className="min-h-[60vh]" />;

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-display-xs font-semibold text-primary">Notifications</h1>
                <p className="text-md text-tertiary">Email your customers. Messages are queued and delivered in the background.</p>
            </div>

            {sendNotification.isError && <Alert>{getApiErrorMessage(sendNotification.error, "We couldn't queue those emails.")}</Alert>}
            {sendNotification.isSuccess && <Alert type="success">{sendNotification.data?.message ?? "Emails queued."}</Alert>}

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]" noValidate>
                <div className="flex flex-col gap-5 rounded-2xl border border-secondary bg-primary p-6">
                    <FormInput control={control} name="subject" label="Subject" placeholder="Your order is on the way" isRequired />
                    <FormTextArea
                        control={control}
                        name="message"
                        label="Message"
                        placeholder="Write the email your customers will receive…"
                        rows={10}
                        isRequired
                    />

                    <div className="flex items-center justify-between gap-4 border-t border-secondary pt-5">
                        <p className="text-sm text-tertiary">
                            Sending to <span className="font-semibold text-primary">{recipientCount}</span>{" "}
                            {recipientCount === 1 ? "person" : "people"}
                        </p>
                        <Button
                            type="submit"
                            size="lg"
                            iconLeading={Send01}
                            isLoading={sendNotification.isPending}
                            isDisabled={sendNotification.isPending || recipientCount === 0}
                        >
                            Send
                        </Button>
                    </div>
                </div>

                <aside className="flex h-max flex-col gap-4 rounded-2xl border border-secondary bg-primary p-6">
                    <h2 className="text-lg font-semibold text-primary">Recipients</h2>

                    <Checkbox isSelected={sendToAll} onChange={setSendToAll} label="Everyone" hint="Send to all registered accounts" />

                    {!sendToAll && (
                        <ul className="flex max-h-96 flex-col gap-3 overflow-y-auto border-t border-secondary pt-4">
                            {users.map((user) => (
                                <li key={user._id}>
                                    <Checkbox
                                        isSelected={selectedIds.includes(user._id)}
                                        onChange={(isSelected) => toggleUser(user._id, isSelected)}
                                        label={user.name}
                                        hint={user.email}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </aside>
            </form>
        </div>
    );
}
