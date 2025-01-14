import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { create_user_address, get_user_addresses, update_user_address } from "../../services/apiAddress";

import { Address } from "../../lib/interfaces";
import { addressInputs, cities, dataTableStyle, tableRowStyle } from "../../lib/constants";
import { handleMutationError } from "../../lib/healpers";

import DataTable from "../../ui/DataTable";
import TableRow from "../../ui/TableRow";
import Row from "../../ui/Row";
import FormError from "../../ui/FormError";
import Button from "../../ui/Button";
import Column from "../../ui/Column";
import CustomeDropDown from "../../ui/CustomDropDownMenu";
import DropDownIcon from "../../icons/DropDownIcon";
import Loader from "../../ui/Loader";
import Message from "../../ui/Message";

interface AppUserAddressProps {
    userId: string;
    isEditing: boolean;
    setIsEditing: (state: boolean) => void;
}

export default function AppUserAddresses({
    userId,
    isEditing,
    setIsEditing,
}: AppUserAddressProps): JSX.Element {

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["app-user-address", userId],
        queryFn: () => get_user_addresses(userId),
    });

    const addressId = data?.[0]?.id;
    const mutFunc = data?.length !== 0 ? update_user_address : create_user_address;

    const { isPending, mutate } = useMutation({ mutationFn: ({ id, newAddress }: { id: string, newAddress: Address }) => mutFunc(id, newAddress) })

    const { register, handleSubmit, setValue, formState: { errors }, control, watch } = useForm<Address>();


    useEffect(() => {
        if (data) {
            setValue("city", data[0]?.city || '');
            setValue("area", data[0]?.area || '');
            setValue("district", data[0]?.district || '');
            setValue("street", data[0]?.street || '');
            setValue("landmark", data[0]?.landmark || '');
        }
    }, [data, setValue]);

    const onSubmit: SubmitHandler<Address> = (formData: Address) => {
        mutate({ id: addressId || userId, newAddress: formData }, {
            onSuccess: (data) => {
                setIsEditing(false);
                toast.success(data.message || "Address updated successfully!");
            },
            onError(error) {
                console.log(error);
                const fallbackError = "Failed to update address";
                handleMutationError(error, fallbackError);
            },
        });
    }

    if (isLoading) return <Loader />
    if (isError) return <Message type="error" message={error.message} />


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Column className="gap-6">

                <DataTable className={dataTableStyle}>
                    {isEditing ? <div className="grid grid-cols-[6rem_1fr] text-[12px] items-center border-b border-b-stroke my-0">
                        <div className="border-r border-r-stroke ps-[10px] m-0">
                            City
                        </div>
                        <Row className="px-[10px] gap-2  whitespace-nowrap text-ellipsis">
                            <Controller
                                name="city"
                                control={control}
                                rules={{
                                    required: "City is required",
                                }}
                                render={({ field }) => {
                                    return (
                                        <CustomeDropDown
                                            placeholder="Choose days off"
                                            className="border-none p-0 flex items-center justify-between"
                                            width="10rem"
                                            options={[...cities]}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholderIcon={<DropDownIcon />}
                                        />
                                    );
                                }}
                            />
                            {errors.city && (
                                <FormError message={errors.city.message} />
                            )}
                        </Row>
                    </div> :
                        <TableRow
                            label="city"
                            value={watch("city")}
                            {...tableRowStyle}
                            valueStyle={tableRowStyle.valueStyle + " px-[14px]"}
                            className={tableRowStyle.className + " grid-cols-[6rem_1fr]"} />
                    }


                    {addressInputs.map(({ id, name, type, label, validation }) => {
                        return <TableRow
                            key={id}
                            label={label}
                            value={
                                <Row className="gap-4">
                                    <input
                                        id={id}
                                        type={type}
                                        disabled={!isEditing}
                                        {...register(name as keyof Address, validation)}
                                        className="p-1"
                                    />
                                    {errors[name as keyof Address] && <FormError message={errors[name as keyof Address]?.message} />}
                                </Row>
                            }
                            {...tableRowStyle}
                            className={tableRowStyle.className + " grid-cols-[6rem_1fr]"} />
                    })}
                </DataTable>

                {isEditing && (
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-primary rounded-lg text-white font-bold"
                    >
                        Save address
                    </Button>
                )}
            </Column>
        </form>
    );
}
