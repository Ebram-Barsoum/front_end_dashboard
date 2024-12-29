import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import DateIcon from "../icons/DateIcon";

export default function MonthFilter() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedMonth, setSelectedMonth] = useState<string>(searchParams.get("date") || '');
    const [displayPicker, setDisplaPicker] = useState<boolean>(false);

    useEffect(() => {
        if (selectedMonth && selectedMonth !== searchParams.get("date")) {
            searchParams.set('date', selectedMonth);
            setSearchParams(searchParams);
        }

    }, [selectedMonth, searchParams, setSearchParams]);

    const handleMonthChange = (date: Date) => {
        const formattedMonth = new Intl.DateTimeFormat('en-US', { month: '2-digit', year: 'numeric', formatMatcher: 'basic' }).format(date);
        console.log(formattedMonth);
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
                    <p className="cursor-pointer" onClick={() => setDisplaPicker(true)}>Date joined</p>
            }
        </div>
    )
}
