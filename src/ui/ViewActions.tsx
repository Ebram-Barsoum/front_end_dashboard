import { ReactNode } from "react";
import Row from "./Row";

interface ViewActionsProps {
    children: ReactNode;
    className?: string;
}
export default function ViewActions({ children, className }: ViewActionsProps): JSX.Element {
    return (
        <Row className={`actions px-3 py-5 flex-wrap justify-between gap-y-4 border-b ${className}`}>{children}</Row>
    )
}
