import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { create_package } from "../../services/apiPackage";

import { AppUser, Package } from "../../lib/interfaces";
import {
    cities,
    PHONE_REGEX,
    ShipmentTypes,
    STREET_REGEX,
    Trucks,
} from "../../lib/constants";

import { fileInputstyle, menuStyle } from "../App-users/AddAppUserForm";
import { labelStyle } from "../Truck/AddTruckForm";
import { handleMutationError } from "../../lib/healpers";

import AppUserSearch from "../../ui/AppUserSearch";
import Column from "../../ui/Column";
import FormPartition from "../../ui/FormPartition";
import Row from "../../ui/Row";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import InputImageLabel from "../../ui/InputImageLabel";
import InputGroup from "../../ui/InputGroup";
import CustomeDropDown from "../../ui/CustomDropDownMenu";
import FormError from "../../ui/FormError";
import TextArea from "../../ui/TextArea";

import DropDownIcon from "../../icons/DropDownIcon";

const today = new Date().toISOString().split("T")[0];

export default function AddPackageForm(): JSX.Element {
    const [customer, setCustomer] = useState<AppUser | null>(null);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        control,
        reset,
    } = useForm<Package>();

    const { isPending, mutate } = useMutation({
        mutationFn: ({
            customerId,
            packageData,
        }: {
            customerId: string;
            packageData: Package;
        }) => create_package(customerId, packageData),
    });

    const onSubmit: SubmitHandler<Package> = (formData: Package) => {
        if (!customer) {
            toast.error("Please select a customer first!");
            return;
        }

        formData.shipmentImage = (formData.shipmentImage instanceof FileList) ? formData.shipmentImage[0] : formData.shipmentImage;
        formData.preferredTruckTypes = (formData.preferredTruckTypes as string).split(',');

        mutate({
            customerId: customer.id as string,
            packageData: formData,
        }, {
            onSuccess: (data) => {
                toast.success(data.message);
                setCustomer(null);
                handleResetForm();
            },
            onError: (error) => {
                const fallback = "Failed to add package!";
                handleMutationError(error, fallback);
            }
        });
    };

    const handleResetForm = () => {
        reset();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col lg:grid grid-cols-2 gap-y-6 gap-x-8"
        >
            <Column className="gap-4">
                <AppUserSearch role="CUSTOMER" user={customer} onSelect={setCustomer} />

                <FormPartition title="Shipment details" isAccordion={false}>
                    <Column className="w-full gap-4">
                        <Column className=" gap-2">
                            <Row className="ml-2 text-[12px]">Shipment Photo</Row>
                            <FormInput
                                id="truckPhoto"
                                label={
                                    <InputImageLabel
                                        label={
                                            (watch("shipmentImage") as FileList)?.[0]
                                                ? "Shipment photo selected"
                                                : "Upload a photo of your shipment"
                                        }
                                        labelStyle={labelStyle}
                                    />
                                }
                                type="file"
                                accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
                                labelClassName={fileInputstyle + " camel-case h-[160px]"}
                                hidden={true}
                                {...register("shipmentImage", {
                                    required: "Shipment image is required",
                                })}
                                error={errors.shipmentImage}
                            />
                        </Column>

                        <InputGroup className="grid-cols-2">
                            <Column className="gap-2">
                                <Controller
                                    name="type"
                                    control={control}
                                    rules={{ required: "Shipment type is required" }}
                                    render={({ field }) => {
                                        return (
                                            <CustomeDropDown
                                                options={[...ShipmentTypes]}
                                                label="Shipment Type"
                                                labelStyle={labelStyle}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Select shipment type"
                                                className={menuStyle}
                                                width="100%"
                                                placeholderIcon={<DropDownIcon />}
                                            />
                                        );
                                    }}
                                />
                                {errors.type && <FormError message={errors.type.message} />}
                            </Column>

                            <FormInput
                                id="weight"
                                type="number"
                                placeholder="Enter shipment weight"
                                label="Weight"
                                labelClassName={labelStyle}
                                {...register("weight", {
                                    required: "Shipment weight is required",
                                    validate: (value) => {
                                        if (value < 0) {
                                            return "Weight cannot be negative";
                                        }
                                    },
                                })}
                                error={errors.weight}
                            />
                        </InputGroup>

                        <InputGroup className="grid-cols-2">
                            <Column className="gap-2">
                                <Controller
                                    name="truckType"
                                    control={control}
                                    rules={{ required: "Truck type is required" }}
                                    render={({ field }) => {
                                        return (
                                            <CustomeDropDown
                                                options={[...Trucks]}
                                                label="Truck Type"
                                                labelStyle={labelStyle}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Select truck type"
                                                className={menuStyle}
                                                width="100%"
                                                placeholderIcon={<DropDownIcon />}
                                            />
                                        );
                                    }}
                                />
                                {errors.truckType && (
                                    <FormError message={errors.truckType.message} />
                                )}
                            </Column>

                            <FormInput
                                id="shippingDate"
                                type="date"
                                label="Shipment Date"
                                labelClassName={labelStyle}
                                min={today}
                                {...register("shippingDate", {
                                    required: "Shipment Date is required",
                                })}
                                error={errors.shippingDate}
                            />
                        </InputGroup>

                        <Column className="gap-2">
                            <Controller
                                name="preferredTruckTypes"
                                control={control}
                                rules={{ required: "You must select at least one truck type" }}
                                render={({ field }) => {
                                    return (
                                        <CustomeDropDown
                                            options={[...Trucks]}
                                            label="Preferred truck Type"
                                            labelStyle={labelStyle}
                                            value={field.value as string}
                                            onChange={field.onChange}
                                            placeholder="Select preferred truck types"
                                            className={menuStyle}
                                            width="100%"
                                            placeholderIcon={<DropDownIcon />}
                                            multiple={true}
                                        />
                                    );
                                }}
                            />
                            {errors.preferredTruckTypes && (
                                <FormError message={errors.preferredTruckTypes.message} />
                            )}
                        </Column>
                        <TextArea
                            id="description"
                            label="Description"
                            labelClassName={labelStyle}
                            placeholder="Enter shipment description"
                            className="border-grey-2"
                            {...register("description", {
                                required: "Description is required",
                            })}
                            error={errors.description}
                        />
                    </Column>
                </FormPartition>
            </Column>

            <Column className="gap-4 justify-between">
                <FormPartition title="Shipment details" isAccordion={false}>
                    <Column className="w-full gap-4">
                        <InputGroup className="grid-cols-2">
                            <FormInput
                                id="customerName"
                                type="text"
                                label="Customer Name"
                                labelClassName={labelStyle}
                                placeholder="Enter customer name"
                                {...register("customerName", {
                                    required: "Customer name is required",
                                })}
                                error={errors.customerName}
                            />

                            <FormInput
                                id="customerPhone"
                                type="tel"
                                label="Customer Phone"
                                labelClassName={labelStyle}
                                placeholder="Enter customer phone"
                                {...register("customerPhone", {
                                    required: "Customer Phone is required",
                                    pattern: {
                                        value: PHONE_REGEX,
                                        message: "Invalid phone number",
                                    },
                                })}
                                error={errors.customerPhone}
                            />
                        </InputGroup>

                        <InputGroup className="grid-cols-2">
                            <FormInput
                                id="clientName"
                                type="text"
                                label="Client Name"
                                labelClassName={labelStyle}
                                placeholder="Enter Client name"
                                {...register("clientName", {
                                    required: "Client name is required",
                                })}
                                error={errors.clientName}
                            />

                            <FormInput
                                id="ClientPhone"
                                type="tel"
                                label="Client Phone"
                                labelClassName={labelStyle}
                                placeholder="Enter client phone"
                                {...register("clientPhone", {
                                    required: "Client Phone is required",
                                    pattern: {
                                        value: PHONE_REGEX,
                                        message: "Invalid phone number",
                                    },
                                })}
                                error={errors.clientPhone}
                            />
                        </InputGroup>

                        <InputGroup className="grid-cols-2">
                            <Column className="gap-2">
                                <Controller
                                    name="shippingFromCity"
                                    control={control}
                                    rules={{ required: "Shipping from city is required" }}
                                    render={({ field }) => {
                                        return (
                                            <CustomeDropDown
                                                options={[...cities]}
                                                label="Shipping From City"
                                                labelStyle={labelStyle}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Select city"
                                                className={menuStyle}
                                                width="100%"
                                                placeholderIcon={<DropDownIcon />}
                                            />
                                        );
                                    }}
                                />
                                {errors.shippingFromCity && (
                                    <FormError message={errors.shippingFromCity.message} />
                                )}
                            </Column>

                            <Column className="gap-2">
                                <Controller
                                    name="shippingToCity"
                                    control={control}
                                    rules={{ required: "Shipping to city is required" }}
                                    render={({ field }) => {
                                        return (
                                            <CustomeDropDown
                                                options={[...cities]}
                                                label="Shipping To City"
                                                labelStyle={labelStyle}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Select city"
                                                className={menuStyle}
                                                width="100%"
                                                placeholderIcon={<DropDownIcon />}
                                            />
                                        );
                                    }}
                                />
                                {errors.shippingToCity && (
                                    <FormError message={errors.shippingToCity.message} />
                                )}
                            </Column>
                        </InputGroup>

                        <InputGroup className="grid-cols-2">
                            <FormInput
                                type="text"
                                id="shippingFromArea"
                                label="Shipping From Area"
                                labelClassName={labelStyle}
                                placeholder="Enter from area"
                                {...register("shippingFromArea", {
                                    required: "Shipping From Area is required",
                                })}
                                error={errors.shippingFromArea}
                            />

                            <FormInput
                                type="text"
                                id="shippingToArea"
                                label="Shipping To Area"
                                labelClassName={labelStyle}
                                placeholder="Enter to area"
                                {...register("shippingToArea", {
                                    required: "Shipping to Area is required",
                                })}
                                error={errors.shippingToArea}
                            />
                        </InputGroup>

                        <InputGroup className="grid-cols-2">
                            <FormInput
                                type="text"
                                id="shippingFromDistrict"
                                label="Shipping From District"
                                labelClassName={labelStyle}
                                placeholder="Enter from district"
                                {...register("shippingFromDistrict", {
                                    required: "Shipping From district is required",
                                })}
                                error={errors.shippingFromDistrict}
                            />

                            <FormInput
                                type="text"
                                id="shippingToDistrict"
                                label="Shipping To District"
                                labelClassName={labelStyle}
                                placeholder="Enter to District"
                                {...register("shippingToDistrict", {
                                    required: "Shipping to district is required",
                                })}
                                error={errors.shippingToDistrict}
                            />
                        </InputGroup>

                        <InputGroup className="grid-cols-2">
                            <FormInput
                                type="text"
                                id="shippingFromStreet"
                                label="Shipping From Street"
                                labelClassName={labelStyle}
                                placeholder="Enter from street"
                                {...register("shippingFromStreet", {
                                    required: "Shipping From street is required",
                                    pattern: {
                                        value: STREET_REGEX,
                                        message: "Street must start with number",
                                    },
                                })}
                                error={errors.shippingFromStreet}
                            />

                            <FormInput
                                type="text"
                                id="shippingToStreet"
                                label="Shipping To Street"
                                labelClassName={labelStyle}
                                placeholder="Enter to street"
                                {...register("shippingToStreet", {
                                    required: "Shipping to street is required",
                                    pattern: {
                                        value: STREET_REGEX,
                                        message: "Street must start with number",
                                    },
                                })}
                                error={errors.shippingToStreet}
                            />
                        </InputGroup>

                        <InputGroup className="grid-cols-2">
                            <FormInput
                                type="text"
                                id="shippingFromLandmark"
                                label="Shipping From Landmark"
                                labelClassName={labelStyle}
                                placeholder="Enter from Landmark"
                                {...register("shippingFromLandmark", {
                                    required: "Shipping From landmark is required",
                                })}
                                error={errors.shippingFromLandmark}
                            />

                            <FormInput
                                type="text"
                                id="shippingToLandmark"
                                label="Shipping To Landmark"
                                labelClassName={labelStyle}
                                placeholder="Enter to landmark"
                                {...register("shippingToLandmark", {
                                    required: "Shipping to landmark is required",
                                })}
                                error={errors.shippingToLandmark}
                            />
                        </InputGroup>
                    </Column>
                </FormPartition>

                <Row className="gap-4 flex-wrap">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-primary rounded-lg font-bold text-base text-white h-[48px] w-[146px] flex-1 shrink"
                    >
                        Add
                    </Button>

                    <Button
                        onClick={handleResetForm}
                        disabled={isPending}
                        type="reset"
                        className="border border-warn rounded-lg font-bold text-warn h-[48px] w-[146px] flex-1 shrink"
                    >
                        Reset
                    </Button>
                </Row>
            </Column>
        </form>
    );
}
