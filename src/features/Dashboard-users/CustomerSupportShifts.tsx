/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import { get_user_shifts } from "../../services/apiShifts";

import { formatTimeTo12 } from "../../lib/healpers";
import { ShiftDay } from "../../lib/interfaces";

import Column from "../../ui/Column";
import Row from "../../ui/Row";
import MenuIcon from "../../icons/MenuIcon";
import DataFetcher from "../../ui/DataFetcher";

interface CustomerSupportShiftsProps {
    cutomerSupportId: string;
}

export default function CustomerSupportShifts({
    cutomerSupportId,
}: CustomerSupportShiftsProps): JSX.Element {
    const [showShifts, setShowShifts] = useState<boolean>(false);

    const toggleShiftsList = () => {
        setShowShifts((state) => !state);
    };

    return (
        <Column className="rounded-lg border border-stroke overflow-hidden">
            <Row
                onClick={toggleShiftsList}
                className="justify-between bg-card px-[16px] py-[18px] cursor-pointer"
            >
                <Row as={"h2"} className="text-xs">
                    Work Shifts
                </Row>

                <span
                    className={`${!showShifts ? "rotate-180" : ""
                        } transition-all duration-100 ease-in-out`}
                >
                    <MenuIcon />
                </span>
            </Row>

            {showShifts && (
                <DataFetcher
                    dataKey={["shifts", `user: ${cutomerSupportId}`]}
                    fetcher={() => get_user_shifts(cutomerSupportId)}
                    render={(shift: any) => {

                        return (
                            <Column className="p-4 gap-2">
                                <Row className="gap-2">
                                    <Row as={'span'}>From</Row>
                                    <Row as={'span'} className="font-bold">{formatTimeTo12(shift.startTime)}</Row> <Row as={'span'}>To</Row>{" "}
                                    <Row as={'span'} className="font-bold">{formatTimeTo12(shift.endTime)}</Row>
                                </Row>

                                <Row as={'p'} className="gap-2">
                                    <Row as={'span'} className="font-bold">Days : </Row>
                                    {
                                        shift.days.map((day: ShiftDay) => {
                                            return (
                                                <Row key={day.id} as={'span'} className="bg-card px-3 py-1 rounded-full text-sm ">{day.day}</Row>
                                            )
                                        })
                                    }
                                </Row>
                            </Column>
                        );
                    }}
                />
            )}
        </Column>
    );
}
