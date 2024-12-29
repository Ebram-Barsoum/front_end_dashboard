import { ReactNode } from "react";
import Row from "./Row";

interface ActionsRightProps {
    children: ReactNode;
    className?: string;
}

export default function ActionsRight({ children, className }: ActionsRightProps): JSX.Element {
    return (
        <Row className={`right w-full justify-end self-start gap-4 sm:w-auto sm: ms-auto  ${className}`}>{children}</Row>
    )
}
