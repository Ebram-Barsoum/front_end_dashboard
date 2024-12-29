import { ElementType, ReactNode } from "react"

interface ColumnProps {
    children: ReactNode;
    className?: string;
    as?: ElementType,
    onClick?: () => void
}

export default function Column({ children, className, onClick, as: Component = "div" }: ColumnProps): JSX.Element {
    return (
        <Component onClick={() => onClick?.()} className={`flex flex-col ${className}`}>{children}</Component>
    )
}
