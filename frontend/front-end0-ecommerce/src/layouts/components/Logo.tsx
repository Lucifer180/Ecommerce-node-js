import { Link } from "react-router-dom";

import { ROUTES } from "@routes/paths";
import { cx } from "@/utils/cx";

export const Logo = ({ className }: { className?: string }) => (
    <Link to={ROUTES.HOME} className={cx("flex items-center gap-2.5", className)}>
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand-solid text-sm font-bold text-white">A</span>
        <span className="text-lg font-semibold text-primary">Aurora</span>
    </Link>
);
