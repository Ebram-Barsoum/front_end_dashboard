import { ElementType } from 'react';

interface GridProps {
    className?: string;
    children: React.ReactNode;
    as?: ElementType;
    onClick?: () => void
}

export default function Grid({ className, children, onClick, as: Component = 'div' }: GridProps) {

    return (
        <Component className={`grid ${className}`} onClick={() => onClick?.()}>
            {children}
        </Component>
    )
}
