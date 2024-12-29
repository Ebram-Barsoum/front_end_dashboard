/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { create_truck } from "../../services/apiTruck";

import { cities, PHONE_REGEX, TRUCK_NUMBER_REGEX, Trucks } from "../../lib/constants";
import { handleMutationError } from '../../lib/healpers';
import { AppUser, Truck } from "../../lib/interfaces";

import AppUserSearch from "../../ui/AppUserSearch";
import CustomeDropDown from "../../ui/CustomDropDownMenu";
import { fileInputstyle, menuStyle } from "../App-users/AddAppUserForm";

import Column from "../../ui/Column";
import Row from "../../ui/Row";
import FormInput from "../../ui/FormInput";
import FormPartition from "../../ui/FormPartition";
import InputImageLabel from "../../ui/InputImageLabel";
import FormError from "../../ui/FormError";
import FormHeader from "../../ui/FormHeader";

import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

import DropDownIcon from "../../icons/DropDownIcon";

export const labelStyle = "ml-2 text-[12px]";

interface FormInputs {
    truckType: string;
    truckImage: FileList;
    drivingLicense: FileList;
    truckNumber: string;
    weight: number;
    city: string;

    driverName: string;
    driverPhone: string;
    driverLicense: FileList;

    secondaryDriverName?: string;
    secondaryDriverPhone?: string;
    secondaryDriverDriverLicense?: FileList;
}

export default function AddTruckForm(): JSX.Element {
    const [showAnotherDriverForm, setShowAnotherDriverForm] =
        useState<boolean>(false);
    const [owner, setOwner] = useState<AppUser | null>(null);

    const {
        register,
        formState: { errors },
        reset,
        watch,
        control,
        trigger,
        handleSubmit,
        setValue,
    } = useForm<FormInputs>();

    const { isPending, mutate } = useMutation({
        mutationFn: ({
            ownerId,
            truckData,
        }: {
            ownerId: string;
            truckData: Truck;
        }) => create_truck(ownerId, truckData),
    });

    const onSubmit: SubmitHandler<FormInputs> = (formData: FormInputs) => {
        if (!owner?.id) {
            toast.error("Please select an owner first!");
            return;
        }

        console.log("Owner Id : ", owner?.id);
        const { secondaryDriverName, secondaryDriverPhone, secondaryDriverDriverLicense, ...rest } = formData;

        const truckData = {
            ...(secondaryDriverName ? { ...formData, secondaryDriverDriverLicense: secondaryDriverDriverLicense?.[0] } : rest),
            truckImage: formData.truckImage[0],
            driverLicense: formData.driverLicense[0],
            drivingLicense: formData.drivingLicense[0],
        };

        mutate(
            { ownerId: owner.id, truckData },
            {
                onSuccess: (data) => {
                    toast.success(data.message);
                    reset();
                    setOwner(null);
                },
                onError: (error) => {
                    const fallback = "Failed to add truck!";
                    handleMutationError(error, fallback);
                },
            }
        );
    };

    const handleReset = () => {
        reset();
    };

    const handleShowAnotherDriverForm = () => {
        setShowAnotherDriverForm(true);
    };

    const handleAddingAnotherDriver = async () => {
        // validate secondary driver form
        const valid = await trigger([
            "secondaryDriverName",
            "secondaryDriverPhone",
            "secondaryDriverDriverLicense",
        ]);

        if (valid) {
            setShowAnotherDriverForm(false);
        }
    };

    const handleResetSecondDriver = () => {
        setValue("secondaryDriverName", "");
        setValue("secondaryDriverPhone", "");
        setValue("secondaryDriverDriverLicense", undefined);

        setShowAnotherDriverForm(false);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col md:grid grid-cols-2 gap-y-4 gap-x-8 w-full lg:w-[95%]">
            <Column className="w-full gap-4">
                <AppUserSearch role="OWNER" onSelect={setOwner} user={owner} />

                <FormPartition title="Truck information" isAccordion={false}>
                    <Column className="w-full gap-4">
                        <Column className=" gap-2">
                            <Row className="ml-2 text-[12px]">Truck Photo</Row>
                            <FormInput
                                id="truckPhoto"
                                label={
                                    <InputImageLabel
                                        label={
                                            watch("truckImage")?.[0]
                                                ? "Truck photo selected"
                                                : "Upload a photo of your truck"
                                        }
                                        labelStyle={labelStyle}
                                    />
                                }
                                type="file"
                                accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
                                labelClassName={fileInputstyle + " camel-case h-[160px]"}
                                hidden={true}
                                {...register("truckImage", {
                                    required: "Truck image is required",
                                })}
                                error={errors.truckImage}
                            />
                        </Column>

                        <Controller
                            name="truckType"
                            control={control}
                            defaultValue={watch("truckType")}
                            rules={{ required: "Truck type is required" }}
                            render={({ field }) => (
                                <Column className="gap-2">
                                    <CustomeDropDown
                                        label="Truck Type"
                                        labelStyle={labelStyle}
                                        placeholder="Choose truck type"
                                        placeholderIcon={<DropDownIcon />}
                                        options={[...Trucks]}
                                        className={menuStyle}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                    {errors.truckType && (
                                        <FormError message={errors.truckType.message} />
                                    )}
                                </Column>
                            )}
                        />

                        <FormInput
                            id="truckNumber"
                            label="Truck Number"
                            type="text"
                            placeholder="Enter truck number"
                            labelClassName={labelStyle}
                            {...register("truckNumber", {
                                required: "Truck number is required",
                                pattern: {
                                    value: TRUCK_NUMBER_REGEX,
                                    message: "Invalid truck number",
                                }
                            })}
                            error={errors.truckNumber}
                        />

                        <FormInput
                            id="capacity"
                            label="Capacity"
                            type="number"
                            placeholder="Enter truck capacity"
                            labelClassName={labelStyle}
                            {...register("weight", {
                                required: "Truck capacity is required",
                                validate: (value) =>
                                    Number(value) > 0 || "Capacity should be positive",
                            })}
                            error={errors.weight}
                        />

                        <Controller
                            name="city"
                            control={control}
                            defaultValue={""}
                            rules={{ required: "City is required" }}
                            render={({ field }) => (
                                <Column className="gap-2">
                                    <CustomeDropDown
                                        label="City"
                                        labelStyle={labelStyle}
                                        placeholder="Choose City"
                                        placeholderIcon={<DropDownIcon />}
                                        options={[...cities]}
                                        className={menuStyle}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                    {errors.city && <FormError message={errors.city.message} />}
                                </Column>
                            )}
                        />

                        <FormInput
                            id="drivingLicense"
                            label={
                                <InputImageLabel
                                    label={
                                        watch("drivingLicense")?.[0]
                                            ? "Driving license selected"
                                            : "Upload the driving license"
                                    }
                                    labelStyle={labelStyle}
                                />
                            }
                            type="file"
                            accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
                            labelClassName={fileInputstyle + " camel-case h-[160px]"}
                            hidden={true}
                            {...register("drivingLicense", {
                                required: "Driving license is required",
                            })}
                            error={errors.drivingLicense}
                        />
                    </Column>
                </FormPartition>
            </Column>

            <Column className="gap-4 justify-between">
                <FormPartition title="Driver information" isAccordion={false}>
                    <Column className="w-full gap-4">
                        <FormInput
                            id="driverName"
                            label="Name"
                            type="text"
                            placeholder="Enter driver name"
                            labelClassName={labelStyle}
                            {...register("driverName", {
                                required: "Driver name is required",
                            })}
                            error={errors.driverName}
                        />

                        <FormInput
                            id="driverPhone"
                            label="Phone"
                            type="tel"
                            placeholder="Enter driver phone"
                            labelClassName={labelStyle}
                            {...register("driverPhone", {
                                required: "Driver phone is required",
                                pattern: {
                                    value: PHONE_REGEX,
                                    message: "Invalid phone number",
                                },
                            })}
                            error={errors.driverPhone}
                        />

                        <FormInput
                            id="driverLicense"
                            label={
                                <InputImageLabel
                                    label={
                                        watch("driverLicense")?.[0]
                                            ? "The driver's license selected"
                                            : "Upload the driver's license"
                                    }
                                    labelStyle={labelStyle}
                                />
                            }
                            type="file"
                            accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
                            labelClassName={fileInputstyle + " camel-case h-[160px]"}
                            hidden={true}
                            {...register("driverLicense", {
                                required: "Driver license is required",
                            })}
                            error={errors.driverLicense}
                        />
                    </Column>
                </FormPartition>

                <Row className="gap-4 flex-wrap">
                    <Button
                        onClick={handleShowAnotherDriverForm}
                        disabled={isPending}
                        type="button"
                        className="bg-secondary rounded-lg px-[26px] font-bold text-[14px] text-white h-[48px] flex-1 whitespace-nowrap"
                    >
                        Add another driver
                    </Button>

                    <Button
                        disabled={isPending}
                        type="submit"
                        className="bg-primary rounded-lg font-bold text-base text-white h-[48px] w-[146px] flex-1 shrink"
                    >
                        Save
                    </Button>
                    <Button
                        onClick={handleReset}
                        disabled={isPending}
                        type="reset"
                        className="border border-warn rounded-lg font-bold text-warn h-[48px] w-[146px] flex-1 shrink"
                    >
                        Reset
                    </Button>
                </Row>
            </Column>

            {showAnotherDriverForm && (
                <Modal>
                    <Column className="bg-white gap-4 px-9 py-6 md:w-[433px] rounded-lg ">
                        <FormHeader className="mt-4">Add New Driver</FormHeader>

                        <Column className=" gap-4">
                            <FormInput
                                id="secondaryDriverName"
                                label="Name"
                                type="text"
                                placeholder="Enter driver name"
                                labelClassName={labelStyle}
                                {...register("secondaryDriverName", {
                                    required:
                                        watch("secondaryDriverPhone")?.[0] ||
                                            watch("secondaryDriverDriverLicense")?.[0]
                                            ? "Driver name is required"
                                            : undefined,
                                })}
                                error={errors.secondaryDriverName}
                            />

                            <FormInput
                                id="secondaryDriverPhone"
                                label="Phone"
                                type="tel"
                                placeholder="Enter driver phone"
                                labelClassName={labelStyle}
                                {...register("secondaryDriverPhone", {
                                    required:
                                        watch("secondaryDriverName")?.[0] ||
                                            watch("secondaryDriverDriverLicense")?.[0]
                                            ? "Driver phone is required"
                                            : false,
                                    pattern: {
                                        value: PHONE_REGEX,
                                        message: "Invalid phone number",
                                    },
                                })}
                                error={errors.secondaryDriverPhone}
                            />

                            <FormInput
                                id="secondaryDriverDriverLicense"
                                label={
                                    <InputImageLabel
                                        label={
                                            watch("secondaryDriverDriverLicense")?.[0]
                                                ? "The driver's license selected"
                                                : "Upload the driver's license"
                                        }
                                        labelStyle={labelStyle}
                                    />
                                }
                                type="file"
                                accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
                                labelClassName={fileInputstyle + " camel-case h-[112px]"}
                                hidden={true}
                                {...register("secondaryDriverDriverLicense", {
                                    required:
                                        (watch("secondaryDriverPhone") || watch("secondaryDriverName")) &&
                                            !watch("secondaryDriverDriverLicense")?.[0]
                                            ? "Driver license is required"
                                            : false,
                                })}
                                error={errors.secondaryDriverDriverLicense}
                            />
                        </Column>

                        <Row className="gap-4 justify-end">
                            <Button
                                type="button"
                                onClick={handleAddingAnotherDriver}
                                className="bg-primary rounded-lg text-white font-bold w-[88px] flex-1"
                            >
                                Add
                            </Button>
                            <Button
                                onClick={handleResetSecondDriver}
                                type="button"
                                className="bg-secondary text-white rounded-lg font-bold flex-1"
                            >
                                Reset
                            </Button>
                        </Row>
                    </Column>
                </Modal>
            )}
        </form>
    );
}
