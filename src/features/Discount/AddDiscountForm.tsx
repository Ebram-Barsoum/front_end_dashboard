/* eslint-disable no-extra-boolean-cast */
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { add_discount } from "../../services/apiDiscount";

import { Discount } from "../../lib/interfaces";
import { cities, PrimaryButtonStyle, regions, secondaryButtonStyle } from "../../lib/constants";

import { labelStyle } from "../Truck/AddTruckForm";
import { menuStyle } from "../App-users/AddAppUserForm";
import FormInput from "../../ui/FormInput";
import Row from "../../ui/Row";
import Button from "../../ui/Button";
import TextArea from "../../ui/TextArea";
import CustomeDropDown from "../../ui/CustomDropDownMenu";
import DropDownIcon from "../../icons/DropDownIcon";
import Column from "../../ui/Column";
import FormError from "../../ui/FormError";
import { handleMutationError } from "../../lib/healpers";
import useQueryParams from "../../hooks/useQueryParams";

const today = new Date().toISOString().split('T')[0];
const discountCriterias = ['New Users', 'City To', 'City From', 'Route', 'Region'];



export default function AddDiscountForm(): JSX.Element {
    const [targetedGroup, setTargetedGroup] = useState<string>('');

    const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm<Partial<Discount>>();
    const { isPending, mutate } = useMutation({ mutationFn: (discount: Partial<Discount>) => add_discount(discount) })
    const queryClient = useQueryClient();
    const params = useQueryParams();

    const onSubmit: SubmitHandler<Partial<Discount>> = (formData: Partial<Discount>) => {
        if (!targetedGroup) {
            toast.error('Please select a targeted group');
            return;
        }

        // prepare data to be sent to the server
        // Reset form values if targeted group changes
        const discountCriaterias: Partial<Discount> = {};
        switch (targetedGroup) {
            case 'New Users':
                discountCriaterias.newUsers = true;
                discountCriaterias.shippingTo = undefined;
                discountCriaterias.shippingFrom = undefined;
                discountCriaterias.shippingFromRegion = undefined;
                break;
            case 'City To':
                discountCriaterias.newUsers = undefined;
                discountCriaterias.shippingTo = formData.shippingTo;
                discountCriaterias.shippingFrom = undefined;
                discountCriaterias.shippingFromRegion = undefined;
                break;
            case 'City From':
                discountCriaterias.newUsers = undefined;
                discountCriaterias.shippingTo = undefined;
                discountCriaterias.shippingFrom = formData.shippingFrom;
                discountCriaterias.shippingFromRegion = undefined;
                break;
            case 'Route':
                discountCriaterias.newUsers = undefined;
                discountCriaterias.shippingTo = formData.shippingTo;
                discountCriaterias.shippingFrom = formData.shippingFrom;
                discountCriaterias.shippingFromRegion = undefined;
                break;
            case 'Region':
                discountCriaterias.newUsers = undefined;
                discountCriaterias.shippingTo = undefined;
                discountCriaterias.shippingFrom = undefined;
                discountCriaterias.shippingFromRegion = formData.shippingFromRegion;
        }

        formData = {
            ...formData,
            ...discountCriaterias
        };

        // deleting empty fields
        Object.entries(formData).forEach(([key, value]) => {
            if (!value) delete formData[key as keyof Discount];
        });

        // creating a new discount
        mutate(formData, {
            onSuccess: (data) => {
                toast.success(data.message);
                handleResetForm();
                queryClient.invalidateQueries({ queryKey: ['discounts', params] });
            },
            onError: (error) => {
                handleMutationError(error, "Failed to create discount")
            }
        });
    }

    const handleResetForm = () => {
        reset();
        setTargetedGroup('');
    }

    const percentageValue = watch("percentage");
    const fixedAmountValue = watch("fixedAmount");

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 xl:w-[386px]">
            <FormInput
                id="offer-title"
                type="text"
                label="Offer Title"
                placeholder="Write your offer title"
                labelClassName={labelStyle}
                {...register("title", {
                    required: "Discount title is required"
                })}
                error={errors.title}
            />

            <CustomeDropDown
                label="Targeted Groups"
                placeholder="Select Targeted Groups"
                labelStyle={labelStyle}
                options={discountCriterias}
                className={menuStyle + " w-full"}
                width="100%"
                placeholderIcon={<DropDownIcon />}
                value={targetedGroup}
                onChange={setTargetedGroup}
            />


            {(targetedGroup === 'City To' || targetedGroup === 'Route') &&
                <Controller
                    name="shippingTo"
                    rules={{
                        required: "Shipping to is required"
                    }}
                    control={control}

                    render={({ field }) => (
                        <Column className="gap-2">
                            <CustomeDropDown
                                label="City To"
                                labelStyle={labelStyle}
                                placeholder="Choose Targeted City To"
                                placeholderIcon={<DropDownIcon />}
                                options={[...cities]}
                                className={menuStyle}
                                width="100%"
                                value={field.value}
                                onChange={field.onChange}
                            />
                            {errors.shippingTo && (
                                <FormError message={errors.shippingTo.message} />
                            )}
                        </Column>
                    )}
                />
            }

            {
                (targetedGroup === 'City From' || targetedGroup === 'Route') &&
                <Controller
                    name="shippingFrom"
                    rules={{
                        required: "Shipping From is required"
                    }}
                    control={control}

                    render={({ field }) => (
                        <Column className="gap-2">
                            <CustomeDropDown
                                label="City From"
                                labelStyle={labelStyle}
                                placeholder="Choose Targeted City From"
                                placeholderIcon={<DropDownIcon />}
                                options={[...cities]}
                                className={menuStyle}
                                width="100%"
                                value={field.value}
                                onChange={field.onChange}
                            />
                            {errors.shippingFrom && (
                                <FormError message={errors.shippingFrom.message} />
                            )}
                        </Column>
                    )}
                />
            }

            {
                targetedGroup === 'Region' &&
                <Controller
                    name="shippingFromRegion"
                    rules={{
                        required: "Shipping From Region is required"
                    }}
                    control={control}

                    render={({ field }) => (
                        <Column className="gap-2">
                            <CustomeDropDown
                                label="Shipping From Region"
                                labelStyle={labelStyle}
                                placeholder="Choose Targeted Regions"
                                placeholderIcon={<DropDownIcon />}
                                options={[...regions]}
                                className={menuStyle}
                                width="100%"
                                value={field.value}
                                onChange={field.onChange}
                            />
                            {errors.shippingFromRegion && (
                                <FormError message={errors.shippingFromRegion.message} />
                            )}
                        </Column>
                    )}
                />
            }
            <FormInput
                id="percentage"
                type="number"
                label="Offer percentage"
                placeholder="Enter offer percentage"
                labelClassName={labelStyle}
                {...register("percentage", {
                    required: !!fixedAmountValue ? false : "Percentage is required",
                    min: {
                        value: 1,
                        message: "Percentage should be greater than 0",
                    },
                    max: {
                        value: 100,
                        message: "Percentage should be less than 100",
                    },
                })}
                error={errors.percentage}

                disabled={!!fixedAmountValue}
            />

            <FormInput
                id="fixedAmount"
                type="number"
                label="Offer Amount"
                placeholder="Enter offer amount"
                labelClassName={labelStyle}
                {...register("fixedAmount", {
                    required: !!percentageValue ? false : "Offer amount is required",
                    min: {
                        value: 1,
                        message: "Offer amount should be greater than 0",
                    }
                })}
                error={errors.fixedAmount}
                disabled={!!percentageValue}
            />

            <FormInput
                id="valid-from"
                type="date"
                label="Valid From"
                labelClassName={labelStyle}
                {...register("validFrom", {
                    required: "Valid from date is required",
                })}
                min={today}
                error={errors.validFrom}
            />

            <FormInput
                id="valid-to"
                type="date"
                label="Valid To"
                labelClassName={labelStyle}
                {...register("validTo", {
                    required: "Valid to date is required",
                })}
                min={today}
                error={errors.validTo}
            />

            <FormInput
                id="usage-limit"
                type="number"
                label="Usage Limit"
                placeholder="Enter offer usage limit"
                labelClassName={labelStyle}
                {
                ...register("usageLimit", {
                    required: "Usage limit is required",
                    min: {
                        value: 1,
                        message: "Usage limit must be greater than 0"
                    }
                })
                }

                error={errors.usageLimit}
            />

            <TextArea
                id="offer-description"
                label="Offer Description"
                placeholder="Write your offer description"
                labelClassName={labelStyle}
                className="h-[142px] border-grey-2"
                {...register("description", {
                    required: "Discount description is required"
                })}
                error={errors.description}
            />

            <Row className="gap-4">
                <Button
                    type="submit"
                    disabled={isPending}
                    className={PrimaryButtonStyle}
                >
                    Add Offer
                </Button>

                <Button
                    type="button"
                    disabled={isPending}
                    onClick={handleResetForm}
                    className={secondaryButtonStyle}
                >
                    Reset
                </Button>
            </Row>
        </form>
    )
}
