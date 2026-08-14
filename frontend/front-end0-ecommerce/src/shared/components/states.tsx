import type { FC, ReactNode } from "react";
import { AlertCircle, SearchLg } from "@untitledui/icons";

import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";

/** Matches the spinner Untitled UI's Button draws inline, so loading states look alike. */
export const PageSpinner = ({ className }: { className?: string }) => (
    <div role="status" className={cx("flex min-h-60 w-full items-center justify-center", className)}>
        <svg fill="none" viewBox="0 0 20 20" className="size-6 text-fg-brand-primary">
            <circle className="stroke-current opacity-30" cx="10" cy="10" r="8" fill="none" strokeWidth="2" />
            <circle
                className="origin-center animate-spin stroke-current"
                cx="10"
                cy="10"
                r="8"
                fill="none"
                strokeWidth="2"
                strokeDasharray="12.5 50"
                strokeLinecap="round"
            />
        </svg>
        <span className="sr-only">Loading</span>
    </div>
);

type StateProps = {
    icon?: FC<{ className?: string }>;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
};

const State = ({ icon, title, description, action, className }: StateProps) => (
    <div className={cx("flex flex-col items-center justify-center gap-4 px-6 py-16 text-center", className)}>
        <FeaturedIcon icon={icon} size="lg" color="gray" theme="modern" />
        <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold text-primary">{title}</p>
            {description && <p className="max-w-md text-md text-tertiary">{description}</p>}
        </div>
        {action}
    </div>
);

export const EmptyState = ({ icon = SearchLg, ...props }: StateProps) => <State icon={icon} {...props} />;

type ErrorStateProps = Omit<StateProps, "icon" | "action"> & {
    onRetry?: () => void;
};

export const ErrorState = ({ title = "Something went wrong", description, onRetry, className }: Partial<ErrorStateProps>) => (
    <State
        icon={AlertCircle}
        title={title}
        description={description}
        className={className}
        action={
            onRetry ? (
                <Button size="md" color="secondary" onPress={onRetry}>
                    Try again
                </Button>
            ) : undefined
        }
    />
);
