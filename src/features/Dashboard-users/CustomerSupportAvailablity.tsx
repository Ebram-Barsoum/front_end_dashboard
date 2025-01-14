/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { update_customer_support_availablity } from "../../services/apiSuperUsers";

import { formatTime, handleMutationError } from "../../lib/healpers";
import { CSAvailablity } from "../../lib/interfaces";
import {
    dataTableStyle,
    days,
    daysMapper,
    tableRowStyle,
} from "../../lib/constants";

import Column from "../../ui/Column";
import DataTable from "../../ui/DataTable";
import TableRow from "../../ui/TableRow";
import Row from "../../ui/Row";
import Button from "../../ui/Button";
import CustomeDropDown from "../../ui/CustomDropDownMenu";
import DropDownIcon from "../../icons/DropDownIcon";
import FormError from "../../ui/FormError";

interface CustomerSupportAvailabilityProps {
    customerSupportId: string;
    availabilityData: Partial<CSAvailablity>;
    isEditing: boolean;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    params?: string;
}

interface FormInputs extends Partial<CSAvailablity> {
    daysOff: string;
}

const dayOffStyle = "text-xs bg-white px-2 py-1 rounded-xl";

export default function CustomerSupportAvailablity({
    availabilityData,
    customerSupportId,
    isEditing,
    setIsEditing,
    params,
}: CustomerSupportAvailabilityProps): JSX.Element {
    const { breakTimeStart, breakTimeEnd, primaryBreakDay, secondaryBreakDay } =
        availabilityData;

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<FormInputs>({
        defaultValues: {
            breakTimeStart: breakTimeStart?.slice(0, 5),
            breakTimeEnd: breakTimeEnd?.slice(0, 5),
            primaryBreakDay: primaryBreakDay,
            secondaryBreakDay: secondaryBreakDay,
            daysOff: `${daysMapper[primaryBreakDay as string]},${daysMapper[secondaryBreakDay as string]}`,
        },
    });

    const { isPending, mutate } = useMutation({
        mutationFn: ({
            id,
            newData,
        }: {
            id: string;
            newData: Partial<CSAvailablity>;
        }) => update_customer_support_availablity(id, newData),
    });

    const QueryClient = useQueryClient();

    const shiftInputs = [
        {
            id: "breakTimeStart",
            name: "breakTimeStart",
            type: "time",
            label: "break start",
        },
        {
            id: "breakTimeEnd",
            name: "breakTimeEnd",
            type: "time",
            label: "break End",
        },
    ];

    const onSubmit: SubmitHandler<FormInputs> = (formData: FormInputs) => {
        formData.onVacation = false;
        formData.isBusy = false;

        const [first, second] = watch("daysOff").split(",");
        [formData.primaryBreakDay, formData.secondaryBreakDay] = [first.slice(0, 3), second.slice(0, 3)]

        formData.breakTimeEnd = formatTime(formData.breakTimeEnd as string);
        formData.breakTimeStart = formatTime(formData.breakTimeStart as string);

        const { daysOff, ...rest } = formData;

        mutate(
            { id: customerSupportId, newData: rest },
            {
                onSuccess: () => {
                    toast.success("User updated successfully");
                    QueryClient.invalidateQueries({
                        queryKey: ["dashboard-users", params],
                    });
                    setIsEditing(false);
                },
                onError: (error) => {
                    const fallbackError = "Failed to update user";
                    handleMutationError(error, fallbackError);
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Column className="gap-6">
                <DataTable className={dataTableStyle}>
                    {!isEditing ? (
                        <TableRow
                            label="Days off"
                            value={
                                <Row className="gap-1">
                                    {primaryBreakDay && (
                                        <span className={dayOffStyle}>
                                            {daysMapper[primaryBreakDay]}
                                        </span>
                                    )}
                                    {secondaryBreakDay && (
                                        <span className={dayOffStyle}>
                                            {daysMapper[secondaryBreakDay]}
                                        </span>
                                    )}
                                </Row>
                            }
                            {...tableRowStyle}
                            className={tableRowStyle.className + " grid-cols-[6rem_1fr]"}
                        />
                    ) : (
                        <div className="grid grid-cols-[6rem_1fr] text-[12px] items-center border-b border-b-stroke my-0">
                            <div className="border-r border-r-stroke ps-[10px] m-0">
                                days off
                            </div>
                            <Row className="px-[10px] gap-2  whitespace-nowrap text-ellipsis">
                                <Controller
                                    name="daysOff"
                                    control={control}
                                    rules={{
                                        required: "Days off are required",
                                        validate: (value) => value.split(',').length === 2 || "You have to select 2 days"
                                    }}
                                    render={({ field }) => {
                                        return (
                                            <CustomeDropDown
                                                placeholder="Choose days off"
                                                className={"border-none p-0 flex items-center justify-between "}
                                                width="10rem"
                                                options={[...days]}
                                                value={field.value}
                                                onChange={field.onChange}
                                                multiple={true}
                                                max={2}
                                                limitMessage="You can select only 2 days"
                                                placeholderIcon={<DropDownIcon />}
                                            />
                                        );
                                    }}
                                />
                                {errors.daysOff && (
                                    <FormError message={errors.daysOff.message} />
                                )}
                            </Row>
                        </div>
                    )}

                    {shiftInputs.map(({ id, name, type, label }) => (
                        <TableRow
                            key={id}
                            label={label}
                            value={
                                <Row>
                                    <input
                                        id={id}
                                        type={type}
                                        disabled={!isEditing}
                                        className="p-1 cursor-pointer"
                                        {...register(name as keyof CSAvailablity)}
                                    />
                                </Row>
                            }
                            {...tableRowStyle}
                            className={tableRowStyle.className + " grid-cols-[6rem_1fr]"}
                        />
                    ))}
                </DataTable>

                {isEditing && (
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-primary rounded-lg text-white font-bold"
                    >
                        Save
                    </Button>
                )}
            </Column>
        </form>
    );
}
