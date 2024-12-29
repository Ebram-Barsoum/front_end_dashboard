import { ReactNode } from "react";

interface InputGroupProps {
    className?: string
    children: ReactNode;
}

export default function InputGroup({ children, className }: InputGroupProps): JSX.Element {
    return (
        <div className={`grid gap-4 ${className}`}>{children}</div>
    )
}
