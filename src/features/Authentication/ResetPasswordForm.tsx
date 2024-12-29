import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { reset_password } from "../../services/apiAuth";
import { PWD_REGEX } from "../../lib/constants";

import Button from "../../ui/Button";
import Column from "../../ui/Column";
import FormInput from "../../ui/FormInput";

interface FormData {
    password: string;
    confirmPassword: string;
}

export default function ResetPasswordForm(): JSX.Element {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<FormData>();

    const { isPending, mutate } = useMutation({
        mutationKey: ["reset-password"],
        mutationFn: ({
            password,
            resetToken,
        }: {
            password: string;
            resetToken: string;
        }) => reset_password(password, resetToken),
    });

    const navigate = useNavigate();
    const [searchParams,] = useSearchParams();
    const resetToken = searchParams.get("reset") || '';
    console.log(resetToken);

    const handleChangePassword: SubmitHandler<FormData> = (data: FormData) => {
        console.log(data);
        const { password } = data;

        mutate(
            { password, resetToken },
            {
                onSuccess: (data) => {
                    console.log(data);
                    toast.success("Password reset successfully");
                    navigate("/auth/login", { replace: true });
                },
                onError: (error) => {
                    toast.error(error.message);
                },
            }
        );
    };

    const inputCustomStyle: string =
        "placeholder:text-stroke border-stroke h-[56px]";

    return (
        <form
            onSubmit={handleSubmit(handleChangePassword)}
            className="w-full px-3 sm:px-0 sm:w-[380px]"
        >
            <Column className="gap-4">
                <FormInput
                    type="password"
                    placeholder="Enter password"
                    className={inputCustomStyle}
                    {...register("password", {
                        required: "Password is required",
                        pattern: {
                            value: PWD_REGEX,
                            message:
                                "Password must be at least 8 characters long, contain a lowercase, uppercase, number and a special character",
                        },
                    })}
                    error={errors.password}
                />
                <FormInput
                    type="password"
                    placeholder="Confirm password"
                    className={inputCustomStyle}
                    {...register("confirmPassword", {
                        required: "Confirm password is required",
                        validate: (value) =>
                            value === watch("password") || "Passwords must match",
                    })}
                    error={errors.confirmPassword}
                />

                <Button disabled={isPending} className="text-[18px] bg-primary text-white font-bold h-[56px] rounded-lg">
                    Change
                </Button>
            </Column>
        </form>
    );
}
