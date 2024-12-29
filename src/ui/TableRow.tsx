import { ReactNode } from "react";

interface TableRowProps {
    className?: string;
    label: string;
    labelStyle?: string;
    value: ReactNode;
    valueStyle?: string;
}

export default function TableRow({ className, label, labelStyle, value, valueStyle }: TableRowProps): JSX.Element {
    return (
        <div role="row" className={`text-xs grid   ${className}`}>
            <div role="cell" className={`capitalize border-r border-r-grey-2 ${labelStyle}`}>
                {label}
            </div>

            <div role="cell" className={` px-[10px] overflow-hidden text-ellipsis whitespace-nowrap ${valueStyle}`}>
                {value}
            </div>
        </div>
    )
}
