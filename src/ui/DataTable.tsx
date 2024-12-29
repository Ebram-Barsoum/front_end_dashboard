import { ReactNode } from "react";

interface DataTableProps {
    className?: string;
    children: ReactNode;
    label?: string;
}

export default function DataTable({
    className,
    children,
    label,
}: DataTableProps): JSX.Element {
    return (
        <div
            role="table"
            aria-label={label || "Data table"}
            className={`border-t border-grey-2 ${className}`}>

            {children}
        </div>
    );
}
