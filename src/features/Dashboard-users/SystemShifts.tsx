import { useState } from "react";

import Column from '../../ui/Column';
import Row from "../../ui/Row";

import MenuIcon from "../../icons/MenuIcon";
import { useQuery } from "@tanstack/react-query";
import { get_system_shifts, get_user_shifts } from "../../services/apiShifts";
import { Shift, SuperUser } from "../../lib/interfaces";
import Loader from "../../ui/Loader";
import Message from "../../ui/Message";
import ShiftItem from "../Shift/ShiftItem";

interface SystemShiftsProps {
    user: Partial<SuperUser>;
}

export default function SystemShifts({ user }: SystemShiftsProps): JSX.Element {


    const [showShifts, setShowShifts] = useState<boolean>(true);
    const { data: shifts, isLoading, isError, error } = useQuery({ queryKey: ['shifts'], queryFn: () => get_system_shifts() });
    const { data: userShift, isLoading: shiftLoaidng, isError: shiftError, error: shiftErrorData } = useQuery({ queryKey: ['shifts', `user: ${user.id}`], queryFn: () => get_user_shifts(user.id as string) });

    const toggleShiftsList = () => {
        setShowShifts((state) => !state)
    }

    return (
        <Column className="rounded-lg border border-stroke overflow-hidden">
            <Row
                onClick={toggleShiftsList}
                className="justify-between bg-card px-[16px] py-[18px] cursor-pointer" >
                <Row as={'h2'} className="text-xs">Work Shifts</Row>

                <span className={`${!showShifts ? 'rotate-180' : ''} transition-all duration-100 ease-in-out`}>
                    <MenuIcon />
                </span>
            </Row>

            {
                showShifts &&
                <Column className="p-4 gap-2">
                    {
                        (isLoading || shiftLoaidng) && <Loader />
                    }
                    {
                        (isError || shiftError) && <Message type="error" message={error?.message || shiftErrorData?.message as string} />
                    }
                    {
                        (!isLoading && !shiftLoaidng && !shiftError && !isError) && shifts.map((shift: Shift) => {
                            return <ShiftItem key={shift.id} shift={shift} user={user} currentShiftId={userShift.id} />
                        })
                    }
                </Column>

            }
        </Column>
    )
}
