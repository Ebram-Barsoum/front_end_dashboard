/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Shift, SuperUser } from "../../lib/interfaces";
import Row from "../../ui/Row";
import { assign_user_to_shift } from "../../services/apiShifts";
import { formatTimeTo12, handleMutationError } from "../../lib/healpers";
import { toast } from "react-toastify";

interface ShiftItemProps {
    shift: Shift;
    user: Partial<SuperUser>;
    currentShiftId?: string;
}

interface BridgeShift {
    user: Partial<SuperUser>;
    shiftId: string;
}

export default function ShiftItem({ shift, currentShiftId, user }: ShiftItemProps): JSX.Element {

    const { isPending, mutate } = useMutation({
        mutationFn: ({ shiftId, user }: BridgeShift) => assign_user_to_shift(shiftId, user),
    });
    const queryClient = useQueryClient();

    const handleAssignShiftToCustomerSupport = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        // prepare user data to be sent to the backend
        const { id, primaryBreakDay, secondaryBreakDay, breakTimeStart, breakTimeEnd } = user;
        const userData = { id, primaryBreakDay, secondaryBreakDay, breakTimeStart, breakTimeEnd };

        // assigning the selected shift to the customer support
        mutate(
            { shiftId: e.target.value, user: userData },
            {
                onSuccess: (data) => {
                    toast.success(data.message);
                    queryClient.invalidateQueries({ queryKey: ['shifts', `user: ${user.id}`] });
                },
                onError: (error) => {
                    handleMutationError(error, "Failed to assign shift to customer support");
                },
            }
        );
    };

    return (
        <Row key={shift.id as string} className="gap-4 text-[14px] w-full">
            <input
                type="radio"
                id={shift.id}
                name="shift"
                checked={shift.id === currentShiftId}
                value={shift.id}
                onChange={handleAssignShiftToCustomerSupport}
                disabled={isPending}

            />
            <label htmlFor={shift.id} className="w-full grid grid-cols-[12rem_1fr] cursor-pointer">
                <Row as={'p'} className="gap-2">
                    From <span className="font-bold text-primary">{formatTimeTo12(shift.startTime)}</span> to <span className="font-bold text-primary"> {formatTimeTo12(shift.endTime)}</span>
                </Row>

                <Row className="gap-2">
                    <span className="font-bold">Days : </span>

                    <Row className="gap-2">
                        {shift.days.map((day: any) => (
                            <span key={day.id}>{day.day}</span>
                        ))}
                    </Row>
                </Row>
            </label>
        </Row>
    );
}
