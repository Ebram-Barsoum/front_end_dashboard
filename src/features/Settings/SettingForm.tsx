import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { get_app_settings, update_app_settings } from "../../services/apiSetting";

import { handleMutationError } from "../../lib/healpers";
import { Settings } from "../../lib/interfaces";

import Button from "../../ui/Button";
import Column from "../../ui/Column";
import FormInput from "../../ui/FormInput";
import FormPartition from "../../ui/FormPartition";
import { labelStyle } from "../Truck/AddTruckForm";

import Loader from "../../ui/Loader";
import Message from "../../ui/Message";

const settingInputs = [
    {
        type: "number",
        label: "SMS shipment daily limit",
        name: "shipmentSMSLimit",
        placeholder: "Enter shipment SMS daily limit",
        validation: {
            required: "This field is required",
            min: "Minimum value is 1",
        }
    },
    {
        type: "number",
        label: "SMS user daily limit",
        name: "userSMSLimit",
        placeholder: "Enter user SMS daily limit",
        validation: {
            required: "This field is required",
            min: "Minimum value is 1",
        }
    },
    {
        type: "number",
        label: "Negotiation limit",
        name: "offerNegotiationLimit",
        placeholder: "Enter offer negotiation daily limit",
        validation: {
            required: "This field is required",
            min: "Minimum value is 1",
        }
    }
]

export default function SettingForm(): JSX.Element {

    const { data, isLoading, isError, error } = useQuery({ queryKey: ['app-settings'], queryFn: () => get_app_settings() });

    const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<Settings>();
    const { isPending, mutate } = useMutation({ mutationFn: (newSettings: Settings) => update_app_settings(newSettings) })
    const queryClient = useQueryClient();

    useEffect(() => {
        if (data) reset(data);
    }, [data, reset]);

    if (isLoading) return <Loader />;
    if (isError) return <Message type="error" message={error.message} />;


    const onSubmit: SubmitHandler<Settings> = (formData: Settings) => {
        if (!isDirty) {
            toast.info("No changes detected");
            return;
        }

        formData.userSMSLimit = Number(formData.userSMSLimit);
        formData.offerNegotiationLimit = Number(formData.offerNegotiationLimit);
        formData.shipmentSMSLimit = Number(formData.shipmentSMSLimit);


        mutate(formData, {
            onSuccess: () => {
                toast.success("Settings updated successfully");
                queryClient.invalidateQueries({ queryKey: ['app-settings'] });
            },
            onError: (error) => {
                handleMutationError(error, "Failed to update settings");
            }
        });
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
        >
            <FormPartition title="Settings" isAccordion={true}>
                <Column className="w-full gap-4">
                    {
                        settingInputs.map(({ type, name, label, placeholder, validation }) => {
                            return <FormInput
                                key={name}
                                type={type}
                                label={label}
                                labelClassName={labelStyle + " capitalize"}
                                placeholder={placeholder}
                                {...register(name as keyof Settings, validation)}
                                error={errors[name as keyof Settings]}
                            />
                        })
                    }

                    <Button
                        disabled={isPending}
                        type="submit"
                        className="bg-primary h-[48px] rounded-lg text-white w-full font-bold"
                    >Save changes</Button>

                </Column>
            </FormPartition>
        </form>
    )
}
