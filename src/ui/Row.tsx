import { ElementType, ReactNode } from "react";

interface RowProps {
    className?: string;
    as?: ElementType;
    children: ReactNode;
    onClick?: () => void
}

export default function Row({ className, children, onClick, as: Component = "div" }: RowProps) {

    return (
        <Component onClick={onClick} className={`flex items-center ${className}`}>{children}</Component>
    );
}
