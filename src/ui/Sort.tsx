import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SortValue } from "../lib/constants";
import Row from "./Row";

interface SortProps {
    types: SortValue[];
}

export default function Sort({ types }: SortProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortOrder, setSortOrder] = useState(searchParams.get("order") || "desc");

    const handleClick = (value: string) => {
        setSortOrder(value);
    };

    useEffect(() => {
        if (searchParams.get("order") !== sortOrder && sortOrder !== '') {
            searchParams.set("order", sortOrder);
            setSearchParams(searchParams);
        }

    }, [sortOrder, searchParams, setSearchParams]);


    return (
        <Row className="gap-2">
            <span className="text-primary font-bold block sm:hidden">Sort :</span>
            {types.map((type) =>
                <button
                    className={`flex items-center gap-1 h-[42px] p-2 rounded-xl ${sortOrder === type.value ? "bg-light" : ""} 2xl:p-3`}
                    key={type.value}
                    onClick={() => handleClick(type.value)}
                    aria-pressed={sortOrder === type.value}
                >
                    {type.icon}
                    <span className="hidden capitalize xl:flex">{type.name}</span>
                    <span className="hidden sm:flex capitalize xl:hidden">{type.value}</span>
                </button>)}
        </Row>
    )
}
