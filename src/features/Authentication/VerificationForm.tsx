import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { send_verification_email } from "../../services/apiAuth";
import { EMAIL_REGEX } from "../../lib/constants";

import Button from "../../ui/Button";
import Column from "../../ui/Column";
import FormInput from "../../ui/FormInput";

interface FormData {
    email: string;
}

export default function VerificationForm(): JSX.Element {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();
    const { isPending, mutate } = useMutation({
        mutationKey: ["verify-email"],
        mutationFn: (data: FormData) => send_verification_email(data.email),
    });

    const submitForm: SubmitHandler<FormData> = (data: FormData) => {
        console.log(data.email);

        mutate(data, {
            onSuccess: (data) => {
                console.log(data);
                toast.success(data.message);
            },
            onError: (error) => {
                console.log(error);
                toast.error(error.message);
            }

        })
    };

    return (
        <form onSubmit={handleSubmit(submitForm)} className="sm:w-[380px]">
            <h2 className="text-[18px] text-center mb-6">
                Enter your email to change your password
            </h2>

            <Column className="gap-4">
                <FormInput
                    type="email"
                    id="email"
                    placeholder="ahmed20@gmail.com"
                    className="placeholder:text-stroke h-[56px] border-stroke"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: EMAIL_REGEX,
                            message: "Invalid email address",
                        },
                    })}
                    error={errors.email}
                />
                <Button disabled={isPending} className="font-bold bg-primary text-[18px] text-white h-[56px] rounded-lg">Send</Button>
            </Column>
        </form>
    );
}
