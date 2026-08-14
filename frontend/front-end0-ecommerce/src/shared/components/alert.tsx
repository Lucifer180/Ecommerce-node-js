import type { ReactNode } from "react";
import { AlertCircle, CheckCircle } from "@untitledui/icons";

import { cx } from "@/utils/cx";

type AlertProps = {
    type?: "error" | "success";
    children: ReactNode;
    className?: string;
};

export const Alert = ({ type = "error", children, className }: AlertProps) => {
    const Icon = type === "error" ? AlertCircle : CheckCircle;

    return (
        <div
            role="alert"
            className={cx(
                "flex items-start gap-3 rounded-lg border p-4 text-sm",
                type === "error" ? "border-error bg-error-primary text-error-primary" : "border-success bg-success-primary text-success-primary",
                className
            )}
        >
            <Icon className="mt-0.5 size-4 shrink-0" />
            <span>{children}</span>
        </div>
    );
};
