import MonthShifts from "../features/Shift/MonthShifts";
import CreateShiftButton from "../features/Shift/CreateShiftButton";

import Column from "../ui/Column";
import Row from "../ui/Row";
import ViewActions from "../ui/ViewActions";


export default function Shifts(): JSX.Element {
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    return (
        <Column className="h-full">
            <ViewActions className="lg:px-[38px]">
                <Row className="text-primary font-bold text-[24px] uppercase">
                    <span>{month},</span>
                    <span>{year}</span>
                </Row>

                <CreateShiftButton />
            </ViewActions>

            <MonthShifts />

        </Column>
    )
}
