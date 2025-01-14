import { ReactNode } from "react"
import Column from "./Column"

interface ViewProps {
    children: ReactNode;
    className?: string;
}

export default function View({ children, className }: ViewProps): JSX.Element {
    return <Column as={'section'} className={`p-4 md:px-[38px] md:py-[32px] ${className}`}>{children}</Column>
}