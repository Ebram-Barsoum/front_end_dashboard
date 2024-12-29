import { useEffect, useRef } from "react";

export default function useOutsideClick(callback: () => void) {
    const ref = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        const clickHandler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                callback();
            }
        }

        document.addEventListener("dblclick", clickHandler);

        return () => document.removeEventListener("dblclick", clickHandler);
    }, [callback]);

    return ref;
}