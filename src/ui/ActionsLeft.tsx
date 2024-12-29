import { ReactNode } from "react";

interface ActionsLeftProps {
    children: ReactNode;
    className?: string;
}

export default function ActionsLeft({ children, className }: ActionsLeftProps): JSX.Element {
    return (
        <div className={`left flex items-center flex-wrap gap-3 gap-y-4  ${className}`}>{children}</div>
    )
}
