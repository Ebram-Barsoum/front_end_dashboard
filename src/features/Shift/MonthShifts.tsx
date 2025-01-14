import { useQuery } from "@tanstack/react-query";

import { get_system_shifts } from "../../services/apiShifts";

import { generateShiftToColorMap, getDaysInCurrentMonth, prepareMonthShifts } from "../../lib/healpers"

import DayShifts from "./DayShifts";

import Loader from "../../ui/Loader";
import Message from "../../ui/Message";
import { useMemo } from "react";

const days = getDaysInCurrentMonth();

export default function MonthShifts(): JSX.Element {
    const { data: shifts, isLoading, isError, error } = useQuery({ queryKey: ["shifts"], queryFn: () => get_system_shifts() });

    // prepare month shifts
    const daysWithShifts = useMemo(() => prepareMonthShifts(days, shifts || []), [shifts]);

    // generate shift to color mapper to display shifts in different colors
    const shiftsToColorMapper = useMemo(() => generateShiftToColorMap(shifts), [shifts]);

    if (isLoading) return <Loader />
    if (isError) return <Message type="error" message={error.message || "An unexpected error occured"} />

    return (
        <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4 lg:grid-cols-5 lg:px-[38px] xl:grid-cols-6">
            {
                daysWithShifts.map((day, index) => {
                    return <DayShifts key={index} day={day} shiftsToColorMapper={shiftsToColorMapper} />
                })
            }
        </div>
    )
}
