import { ReactNode, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { FilterOption } from "../lib/interfaces";

import Row from "./Row";

interface FilterProps {
    filterBy: string;
    label?: string
    options: FilterOption[];
    icon?: ReactNode;
    iconMapper?: Record<string, ReactNode>;
    className?: string;
}

export default function Filter({
    filterBy,
    label,
    options,
    icon,
    iconMapper,
    className,
}: FilterProps): JSX.Element {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedOption, setSelectedOption] = useState(
        searchParams.get(filterBy) || ""
    );

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        searchParams.set(filterBy, e.target.value);
        setSearchParams(searchParams);
        setSelectedOption(e.target.value);
    };

    return (
        <Row className={`gap-0 ${className} ${selectedOption ? 'bg-light' : 'border border-stroke'}`}>
            {iconMapper?.[selectedOption] || icon}

            <select
                id={`filter-${filterBy}`}
                value={selectedOption}
                onChange={handleSelect}
                className={`capitalize outline-none appearance-none bg-transparent cursor-pointer `}
            >
                <option value="" hidden>
                    {" "}
                    {label || filterBy}{" "}
                </option>

                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        className="flex items-center gap-1"
                    >
                        {option.value}
                    </option>
                ))}
            </select>
        </Row>
    );
}
