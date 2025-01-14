import { useEffect, useState } from "react";
import { Controller, RegisterOptions, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { delete_truck, update_truck } from "../../services/apiTruck";

import { Truck } from "../../lib/interfaces";
import { convertFileToImageURL, handleMutationError } from "../../lib/healpers";
import {
    dataTableStyle,
    PrimaryButtonStyle,
    secondaryButtonStyle,
    TRUCK_NUMBER_REGEX,
    tableRowStyle,
    cities,
    Trucks,
    PHONE_REGEX,
} from "../../lib/constants";

import { labelStyle } from "./AddTruckForm";

import DataTable from "../../ui/DataTable";
import TableRow from "../../ui/TableRow";
import FormError from "../../ui/FormError";
import Column from "../../ui/Column";
import Row from "../../ui/Row";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import CustomeDropDown from "../../ui/CustomDropDownMenu";

import UploadFileIcon from "../../icons/UploadFileIcon";
import DropDownIcon from "../../icons/DropDownIcon";
import GoBackIcon from "../../icons/GoBackIcon";

interface TruckDetailsProps {
    userId: string;
    truck: Truck;
    setTruckToBeDetailed: (truck: Truck | null) => void;
    resetFilter: () => void;
    resetCurrentPage: () => void;
    params: string;
}

interface FormInputs {
    truckType: string;
    truckNumber: string;
    city: string;
    weight: number;
    truckImage: FileList | File;
    drivingLicense: FileList | File;

    driverName: string;
    driverPhone: string;
    driverLicense: FileList | File;
}

const truckDataInputs = [
    {
        id: "truckNumber",
        name: "truckNumber",
        label: "Truck Number",
        type: "text",
        validation: {
            required: "Truck Number is required",
            pattern: {
                value: TRUCK_NUMBER_REGEX,
                message: "Invalid Truck Number",
            },
        },
    },
    {
        id: "weight",
        name: "weight",
        label: "Capacity",
        type: "text",
        validation: {
            required: "Truck capacity is required",
            validate: (value: number) =>
                value > 0 || "Weight must be positive number",
        },
    },
];

const driverDataInputs = [
    {
        id: "driverName",
        label: "Driver Name",
        name: "driverName",
        type: "text",
        validation: {
            required: "Driver Name is required",
        },
    },
    {
        id: "driverPhone",
        label: "Driver Phone",
        name: "driverPhone",
        type: "tel",
        validation: {
            required: "Driver Phone is required",
            pattern: {
                value: PHONE_REGEX,
                message: "Invalid Phone Number",
            },
        },
    },
];

export default function TruckDetails({
    userId,
    truck,
    setTruckToBeDetailed,
    params,
    resetFilter,
    resetCurrentPage
}: TruckDetailsProps): JSX.Element {
    const {
        id,
        city,
        drivingLicense,
        truckType,
        truckNumber,
        weight,
        truckImage,
        driverName,
        driverPhone,
        driverLicense,
    } = truck;

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isDirty },
        watch,
        reset
    } = useForm<FormInputs>();

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [newTruckImage, setNewTruckImage] = useState<string>(
        truckImage as string
    );
    const [newDrivingLicense, setNewDrivingLicense] = useState<string>(
        drivingLicense as string
    );
    const [newDriverLicense, setNewDriverLicense] = useState<string>(
        driverLicense as string
    );

    const { isPending, mutate: update } = useMutation({ mutationFn: (newTruckData: FormInputs) => update_truck(id as string, newTruckData) });
    const { isPending: isPendingDeleting, mutate } = useMutation({ mutationFn: (truckId: string) => delete_truck(truckId) });

    const queryClient = useQueryClient();

    const enableEditTruck = () => {
        setIsEditing(true);
    };

    // deleting a truck
    const handleDeleteTruck = () => {
        mutate(id as string, {
            onSuccess: (data) => {
                toast.success(data?.message);
                queryClient.invalidateQueries({ queryKey: [userId, "trucks", params] });
                queryClient.invalidateQueries({ queryKey: ['truck-types', userId] });
                resetFilter();
                resetCurrentPage();
            },
            onError: (error) => {
                handleMutationError(error, "Failed to delete truck");
            }
        });
    }

    // handle go back
    const goBack = () => {
        setTruckToBeDetailed(null);
    }

    // handle update truck data
    const onSubmit: SubmitHandler<FormInputs> = (formData: FormInputs) => {
        // Don't call the API if the truck data hasn't changed
        if (!isDirty) {
            toast.info("No changes detected");
            setIsEditing(false);
            return;
        }

        // prepare truck data to be updated
        const { truckImage, drivingLicense, driverLicense, ...rest } = formData;
        let newTruckData: Partial<Truck> = (truckImage as FileList)?.[0] ? { ...rest, truckImage: (truckImage as FileList)?.[0] } : { ...rest };
        newTruckData = (drivingLicense as FileList)?.[0] ? { ...newTruckData, drivingLicense: (drivingLicense as FileList)?.[0] } : { ...newTruckData };
        newTruckData = (driverLicense as FileList)?.[0] ? { ...newTruckData, driverLicense: (driverLicense as FileList)?.[0] } : { ...newTruckData };

        // update truck data
        update(newTruckData as FormInputs, {
            onSuccess: (data) => {
                toast.success(data.message);
                setTruckToBeDetailed(data.truckData);
                queryClient.invalidateQueries({ queryKey: [userId, 'trucks', params] });
                queryClient.invalidateQueries({ queryKey: ['truck-types', userId] });

                resetFilter();
                resetCurrentPage();
                setIsEditing(false);
            },
            onError: (error) => {
                handleMutationError(error, "Failed to update truck");
            }
        });
    };

    // handle preview image when user selects a new image
    const watchedTruckImage = watch('truckImage');

    useEffect(() => {
        if ((watchedTruckImage as FileList)?.[0]) {
            setNewTruckImage(
                convertFileToImageURL((watchedTruckImage as FileList)?.[0])
            );
        }
    }, [watchedTruckImage]);

    const watchedDrivingLicense = watch('drivingLicense');
    useEffect(() => {
        if ((watchedDrivingLicense as FileList)?.[0]) {
            setNewDrivingLicense(
                convertFileToImageURL((watchedDrivingLicense as FileList)?.[0])
            );
        }
    }, [watchedDrivingLicense]);

    const watchedDriverLicense = watch('driverLicense');
    useEffect(() => {
        if ((watchedDriverLicense as FileList)?.[0]) {
            setNewDriverLicense(
                convertFileToImageURL((watchedDriverLicense as FileList)?.[0])
            );
        }
    }, [watchedDriverLicense]);


    // initializing form inputs with truck data after the component mounts
    useEffect(() => {
        reset({
            city,
            truckType,
            truckNumber,
            weight,
            driverName,
            driverPhone,
        });
    }, []);

    return (
        <Column className="gap-6">
            <Row onClick={goBack} as={"button"} className="gap-2 w-fit">
                <GoBackIcon />
                <span>Back</span>
            </Row>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <Column className="gap-2">
                    <Row className="text-sm">Truck photo</Row>

                    <FormInput
                        id="truckImage"
                        type="file"
                        label={
                            <Column className="h-[150px] items-center justify-center gap-2 text-grey-2 text-[14px] border border-grey-2 border-dashed overflow-hidden rounded-lg cursor-pointer">
                                {truckImage || newTruckImage ? (
                                    <img
                                        src={newTruckImage || (truckImage as string)}
                                        alt="driver license image"
                                        className="w-full object-fill"
                                    />
                                ) : (
                                    <>
                                        <UploadFileIcon />
                                        <span>Upload the truck image</span>
                                    </>
                                )}
                            </Column>
                        }
                        labelClassName={labelStyle + " ms-0"}
                        hidden={true}
                        disabled={!isEditing}
                        accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
                        {...register("truckImage")}
                    />
                </Column>

                <Column className="gap-4">
                    <Row className="text-sm">Truck information</Row>

                    <DataTable className={dataTableStyle}>
                        {!isEditing ? (
                            <TableRow
                                label="Truck Type"
                                value={truckType}
                                {...tableRowStyle}
                                valueStyle={tableRowStyle.labelStyle + " ps-4"}
                                className={tableRowStyle.className + " grid-cols-[6rem_1fr]"}
                            />
                        ) : (
                            <div className="grid grid-cols-[6rem_1fr] text-[12px] items-center border-b border-b-stroke my-0">
                                <div className="border-r border-r-stroke ps-[10px] m-0">
                                    Truck Type
                                </div>

                                <Row className="px-[10px] gap-2 whitespace-nowrap text-ellipsis">
                                    <Controller
                                        name="truckType"
                                        control={control}
                                        rules={{ required: "Truck type is required" }}
                                        render={({ field }) => {
                                            return (
                                                <CustomeDropDown
                                                    options={[...Trucks]}
                                                    value={field.value as string}
                                                    onChange={field.onChange}
                                                    placeholder="Select truck type"
                                                    width="10rem"
                                                    className={
                                                        "flex items-center justify-between border-none p-1 w-[10rem_!important]"
                                                    }
                                                    placeholderIcon={<DropDownIcon />}
                                                />
                                            );
                                        }}
                                    />

                                    {errors.truckType && (
                                        <FormError message={errors.truckType.message} />
                                    )}
                                </Row>
                            </div>
                        )}

                        {truckDataInputs.map(({ id, label, name, type, validation }) => {
                            return (
                                <TableRow
                                    key={id}
                                    label={label}
                                    value={
                                        <Row>
                                            <input
                                                type={type}
                                                className="p-1"
                                                disabled={!isEditing}
                                                {...register(
                                                    name as keyof FormInputs,
                                                    validation as RegisterOptions<FormInputs, keyof FormInputs>
                                                )}
                                            />

                                            {errors[name as keyof FormInputs] && <FormError message={errors[name as keyof FormInputs]?.message} />}
                                        </Row>
                                    }
                                    {...tableRowStyle}
                                    className={tableRowStyle.className + " grid-cols-[6rem_1fr]"}
                                />
                            );
                        })}

                        {!isEditing ? (
                            <TableRow
                                label="City"
                                value={city}
                                {...tableRowStyle}
                                valueStyle={tableRowStyle.labelStyle + " ps-4"}
                                className={tableRowStyle.className + " grid-cols-[6rem_1fr]"}
                            />
                        ) : (
                            <div className="grid grid-cols-[6rem_1fr] text-[12px] items-center border-b border-b-stroke my-0">
                                <div className="border-r border-r-stroke ps-[10px] m-0">
                                    City
                                </div>

                                <Row className="px-[10px] gap-2 whitespace-nowrap text-ellipsis">
                                    <Controller
                                        name="city"
                                        rules={{ required: "City is required" }}
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <CustomeDropDown
                                                    value={field.value as string}
                                                    onChange={field.onChange}
                                                    options={[...cities]}
                                                    placeholder="Select city"
                                                    className={"flex items-center justify-between border-none p-1"}
                                                    width="10rem"
                                                    placeholderIcon={<DropDownIcon />}
                                                />
                                            );
                                        }}
                                    />

                                    {errors.city && <FormError message={errors.city.message} />}
                                </Row>
                            </div>
                        )}
                    </DataTable>

                    <FormInput
                        id="drivingLicense"
                        type="file"
                        label={
                            <Column className="h-[150px] items-center justify-center gap-2 text-grey-2 text-[14px] border border-grey-2 border-dashed overflow-hidden rounded-lg cursor-pointer">
                                {drivingLicense || newDrivingLicense ? (
                                    <img
                                        src={newDrivingLicense || (drivingLicense as string)}
                                        alt="drivering license image"
                                        className="w-full object-fill"
                                    />
                                ) : (
                                    <>
                                        <UploadFileIcon />
                                        <span>Upload the driving license</span>
                                    </>
                                )}
                            </Column>
                        }
                        labelClassName={labelStyle + " ms-0"}
                        hidden={true}
                        disabled={!isEditing}
                        accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
                        {...register("drivingLicense")}
                    />
                </Column>

                {/*Driver inputs part*/}
                <Column className="gap-4">
                    <Row className="text-[14px]">Driver information</Row>
                    <DataTable className={dataTableStyle}>

                        {
                            driverDataInputs.map(({ id, name, label, type, validation }) => {
                                return <TableRow
                                    key={id}
                                    label={label}
                                    value={
                                        <Row className="gap-2">
                                            <input
                                                type={type}
                                                disabled={!isEditing}
                                                {...register(name as keyof FormInputs, validation)}
                                                className="p-1"
                                            />

                                            {errors[name as keyof FormInputs] && <FormError message={errors[name as keyof FormInputs]?.message} />}
                                        </Row>
                                    }
                                    {...tableRowStyle}
                                    className={tableRowStyle.className + " grid-cols-[6rem_1fr]"}
                                />
                            })
                        }
                    </DataTable>


                    <FormInput
                        id="driverLicense"
                        type="file"
                        label={
                            <Column className="h-[150px] items-center justify-center gap-2 text-grey-2 text-[14px] border border-grey-2 border-dashed overflow-hidden rounded-lg cursor-pointer">
                                {driverLicense || newDriverLicense ? (
                                    <img
                                        src={newDriverLicense || (driverLicense as string)}
                                        alt="driver license image"
                                        className="w-full object-fill"
                                    />
                                ) : (
                                    <>
                                        <UploadFileIcon />
                                        <span>Upload the driver license</span>
                                    </>
                                )}
                            </Column>
                        }
                        labelClassName={labelStyle + " ms-0"}
                        hidden={true}
                        disabled={!isEditing}
                        accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
                        {...register("driverLicense")}
                    />
                </Column>

                {isEditing && (
                    <Button
                        disabled={isPending}
                        type="submit" className={PrimaryButtonStyle}>
                        Save changes
                    </Button>
                )}
            </form>

            {!isEditing && (
                <Row className="gap-4">
                    <Button
                        disabled={isPendingDeleting}
                        onClick={enableEditTruck}
                        className={PrimaryButtonStyle}>
                        Edit
                    </Button>
                    <Button
                        onClick={handleDeleteTruck}
                        disabled={isPendingDeleting}
                        className={secondaryButtonStyle}>Delete</Button>
                </Row>
            )}
        </Column>
    );
}
