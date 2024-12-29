/* eslint-disable @typescript-eslint/no-explicit-any */
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { handleMutationError } from "../../lib/healpers";

import Button from "../../ui/Button";
import Column from "../../ui/Column";
import Row from "../../ui/Row";
import { useLocation } from "react-router-dom";
import useQueryParams from "../../hooks/useQueryParams";
import TextArea from "../../ui/TextArea";

interface FormInputs {
    reason: string;
}

interface BanFormProps {
    banFn: (id: string, reason: string) => any;
    userId: string;
    onSuccess?: () => void
}

export default function BanForm({ banFn, userId, onSuccess }: BanFormProps): JSX.Element {
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm<FormInputs>();
    const { isPending, mutate } = useMutation({
        mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
            banFn(userId, reason),
    });

    const params = useQueryParams();
    const { pathname } = useLocation();
    const queryClient = useQueryClient();
    const key = pathname.slice(1);

    const onSubmit: SubmitHandler<FormInputs> = (formData: FormInputs) => {
        mutate({ userId, reason: formData.reason }, {
            onSuccess: (data: any) => {
                toast.success(data.message);
                reset();
                onSuccess?.();
                queryClient.invalidateQueries({ queryKey: [key, params] });
            },
            onError: (error) => {
                const fallback = "Failed to ban this user";
                handleMutationError(error, fallback)
            }
        })
    };


    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white w-auto flex flex-col items-center gap-4 py-[22px] px-[33px] rounded-xl sm:w-[500px] sm:py-[42px] sm:px-[63px]"
        >
            <Column className="mb-4">
                <Row as={"p"} className="justify-center text-[24px] font-bold">
                    Please,
                </Row>
                <Row className="justify-center text-[22px]">
                    Add a reason why you ban this user ?
                </Row>
            </Column>

            <Column className="w-full">
                <TextArea
                    id="banReason"
                    className="border-black"
                    {...register("reason", {
                        required: "Ban reason is required",
                    })}
                    error={errors.reason}
                />
            </Column>

            <Button
                disabled={isPending}
                type="submit"
                className="w-full bg-primary text-white font-bold rounded-xl">
                Add
            </Button>
        </form>
    );
}
