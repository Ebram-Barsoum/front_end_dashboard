import { ReactNode } from "react";
import { createPortal } from "react-dom";

import useOutsideClick from "../hooks/useOutiseClick";

import Row from "./Row";

interface FixedLayoutProps {
    children: ReactNode,
    outsideClickHandler?: () => void
}

export default function Modal({ children, outsideClickHandler }: FixedLayoutProps) {
    const ref = useOutsideClick(() => outsideClickHandler?.());

    return createPortal(
        <Row className="fixed top-0 left-0 right-0 bottom-0 py-20 px-6 w-[100dvw] bg-[rgba(0,0,0,.2)] flex items-center justify-center overflow-hidden">
            <div ref={ref} className="h-[90dvh] max-h-[auto] grid place-items-center overflow-y-auto scrollbar-none rounded-xl">
                {children}
            </div>
        </Row>
        , document.body);
}
