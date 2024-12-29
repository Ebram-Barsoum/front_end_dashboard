import { ReactNode } from "react";
interface FormHeaderProps {
    children: ReactNode;
    className?: string;
}
export default function FormHeader({ children, className }: FormHeaderProps): JSX.Element {
    return (
        <h2 className={`text-center text-[22px] ${className}`}>
            {children}
        </h2>
    )
}
