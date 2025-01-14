import { Day, Shift } from "../../lib/interfaces";
import Column from "../../ui/Column";
import Row from "../../ui/Row";

interface DayShiftsProps {
    day: Day;
    shiftsToColorMapper: Record<string, string>;
}

export default function DayShifts({ day, shiftsToColorMapper }: DayShiftsProps): JSX.Element {
    return (
        <Column className="p-4 border border-grey-3 rounded-lg">
            <Row className="h-[40px]">
                <span className="font-bold text-[42px]">{day.number}</span>
                <span className="self-end">, {day.name.slice(0, 3)}.</span>
            </Row>

            {day?.shifts?.length !== 0 && <div className="grid grid-cols-2 gap-2 mt-4">
                {
                    (day.shifts as Shift[]).map((shift) => {
                        const bg = shiftsToColorMapper[shift.id as string];
                        return <span key={shift.id} className={`h-[40px] rounded-[4px] `} style={{ backgroundColor: bg }}></span>
                    })
                }
            </div>}
        </Column>
    )
}
