/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";

interface ButtonProps {
    type?: "submit" | "reset" | "button";
    color?: "primary" | "secondary";
    disabled?: boolean;
    className?: string;
    onClick?: (e: any) => void;
    children: ReactNode;
}

export default function Button({
    type,
    className,
    onClick,
    disabled,
    children,
}: ButtonProps): JSX.Element {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`h-12 p-4 flex items-center justify-center  ${className}`}
        >
            {children}
        </button>
    );
}
