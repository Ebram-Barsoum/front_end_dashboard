import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import DateIcon from "../icons/DateIcon";

interface MonthFilterProps {
    label?: string;
}

export default function MonthFilter({ label }: MonthFilterProps): JSX.Element {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedMonth, setSelectedMonth] = useState<string>(searchParams.get("date") || '');
    const [displayPicker, setDisplaPicker] = useState<boolean>(false);

    useEffect(() => {
        if (selectedMonth && selectedMonth !== searchParams.get("date")) {
            searchParams.set('date', selectedMonth);
            searchParams.set("page", "1");
            setSearchParams(searchParams);
        }

    }, [selectedMonth, searchParams, setSearchParams]);

    const handleMonthChange = (date: Date) => {
        const formattedMonth = new Intl.DateTimeFormat('en-US', { month: '2-digit', year: 'numeric', formatMatcher: 'basic' }).format(date);

        setSelectedMonth(formattedMonth);
    };

    return (
        <div className={`month-filter h-[42px] flex flex-nowrap items-center gap-2 px-2 py-1 rounded-xl ${selectedMonth ? 'bg-light' : 'border border-stroke'}`}>
            <DateIcon />

            {
                displayPicker === true ? <DayPicker
                    mode="single"
                    selected={new Date(selectedMonth)}
                    captionLayout="dropdown"
                    onMonthChange={handleMonthChange}
                    fromYear={2020}
                /> :
                    <p className="cursor-pointer" onClick={() => setDisplaPicker(true)}>{label ? label : 'Date joined'}</p>
            }
        </div>
    )
}
