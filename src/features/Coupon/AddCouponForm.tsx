/* eslint-disable @typescript-eslint/no-explicit-any */
import { SubmitHandler, useForm } from "react-hook-form";
import { COUPON_REGEX, PrimaryButtonStyle, secondaryButtonStyle } from "../../lib/constants";
import Button from "../../ui/Button";
import Column from "../../ui/Column";
import FormInput from "../../ui/FormInput";
import FormPartition from "../../ui/FormPartition";
import Row from "../../ui/Row";
import { Coupon } from "../../lib/interfaces";
import { labelStyle } from '../Truck/AddTruckForm';
import TextArea from "../../ui/TextArea";
import { useMutation } from "@tanstack/react-query";
import { add_coupon } from "../../services/apiCoupon";
import { toast } from "react-toastify";
import { handleMutationError } from "../../lib/healpers";

const today = new Date().toISOString().split('T')[0];

const couponInputs = [
    {
        name: "code",
        type: "text",
        label: "Coupon Code",
        placeholder: "Enter Coupon Code here",
        validation: {
            required: false,
            pattern: {
                vale: COUPON_REGEX,
                message: "Invalid Coupon Code"
            }
        }
    },
    {
        name: "validFrom",
        type: "date",
        label: "Valid From",
        placeholder: "Enter Valid From here",
        validation: {
            required: {
                value: true,
                message: "Valid From is required"
            },
        }
    },
    {
        name: "validTo",
        type: "date",
        label: "Valid To",
        placeholder: "Enter Valid To here",
        validation: {
            required: {
                value: true,
                message: "Valid To is required"
            },
        },
        min: new Date().toISOString().split('T')[0]
    },
    {
        name: "usageLimit",
        type: "number",
        label: "Usage Limit",
        placeholder: "Enter Usage Limit here",
        validation: {
            required: false,
        },
        min: new Date().toISOString().split('T')[0],
    },
    {
        name: "usageGlobalLimit",
        type: "number",
        label: "Usage Global Limit",
        placeholder: "Enter Usage Global Limit here",
        validation: {
            required: false,
        }
    },
]



export default function AddCouponForm(): JSX.Element {
    const { register, reset, handleSubmit, formState: { errors }, watch } = useForm<Coupon>();
    const { isPending, mutate } = useMutation({ mutationFn: (coupon: Coupon) => add_coupon(coupon) });

    const onSubmit: SubmitHandler<Coupon> = (formData: Coupon) => {
        Object.keys(formData).forEach((key: string) => {
            if (formData[key as keyof Coupon] === "") {
                delete formData[key as keyof Coupon];
            }
        });

        if (formData.percentage) formData.percentage = Number(formData.percentage);
        if (formData.fixedAmount) formData.fixedAmount = Number(formData.fixedAmount);
        if (formData.usageGlobalLimit) formData.usageGlobalLimit = Number(formData.usageGlobalLimit);
        if (formData.usageLimit) formData.usageLimit = Number(formData.usageLimit);

        mutate(formData,
            {
                onSuccess: (data) => {
                    toast.success(data.message);
                    reset();
                },
                onError: (error) => {
                    handleMutationError(error, "Failed to add coupon");
                }
            });
    }


    const handleResetForm = () => {
        reset();
    }

    const discountInputs = [
        {
            name: "fixedAmount",
            type: "number",
            label: "Fixed Amount",
            placeholder: "Enter Fixed Amount here",
            validation: {
                required: !watch("percentage") ? "Fixed Amount or Percentage is required" : undefined,
                validate: (value: number) => (Number(value) > 0 || watch("percentage") ? true : "Value must be greater than 0")
            },
        },
        {
            name: "percentage",
            type: "number",
            label: "Percentage",
            placeholder: "Enter Percentage here",
            validation: {
                required: !watch("fixedAmount") ? "Percentage or Fixed Amount is required" : undefined,
                validate: (value: number) => (Number(value) >= 1 && Number(value) <= 100 || watch("fixedAmount")) ? true : "Value must be between 1 and 100",
            }
        },
    ]


    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
        >
            <FormPartition title="Coupons" isAccordion={true}>
                <Column className="w-full gap-4">
                    {
                        [...couponInputs, ...discountInputs].map(({ name, type, label, placeholder, validation }) => {
                            return <FormInput
                                key={name}
                                type={type as string}
                                label={label}
                                placeholder={placeholder}
                                error={errors[name as keyof Coupon]}
                                labelClassName={labelStyle}
                                className=" w-full"
                                min={today}
                                {...register(name as keyof Coupon, validation as any)}
                            />
                        })
                    }

                    <TextArea
                        label="Description"
                        placeholder="Enter description"
                        error={errors.description}
                        labelClassName={labelStyle}
                        className="border-grey-2"
                        {...register("description", {
                            required: {
                                value: true,
                                message: "Description is required"
                            }
                        })}
                    />

                    <Row className="w-full gap-4">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className={PrimaryButtonStyle}
                        >Add</Button>

                        <Button
                            type="button"
                            disabled={isPending}
                            onClick={handleResetForm}
                            className={secondaryButtonStyle}
                        >Reset</Button>
                    </Row>
                </Column>
            </FormPartition>
        </form>
    )
}
