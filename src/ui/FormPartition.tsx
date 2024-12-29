import { ReactNode, useState } from "react";

import OpenedIcon from "../icons/OpenedIcon";
import RadioIcon from "../icons/RadioIcon";

import Column from "./Column";
import Row from './Row';

interface FormPartitionProps {
    title: string;
    isAccordion?: boolean;
    children: ReactNode;
}

export default function FormPartition({ title, children, isAccordion = false }: FormPartitionProps): JSX.Element {
    const [open, setOpen] = useState(true);
    const toggleAccordion = isAccordion ? () => setOpen((state) => !state) : undefined;

    return <Column className="self-start  border border-grey-2 rounded-lg w-full" >
        <Row onClick={toggleAccordion} className={`w-full bg-[#F9FAFB] p-4 justify-between rounded-lg ${isAccordion && 'cursor-pointer'}`}>
            <Row className="items-center gap-2">
                {isAccordion && <RadioIcon />}
                <Row as={'h2'} className="text-primary text-[14px] font-bold">{title}</Row>
            </Row>

            {isAccordion && <OpenedIcon />}
        </Row>

        {open && <Row className="p-4">{children}</Row>}
    </Column>
}