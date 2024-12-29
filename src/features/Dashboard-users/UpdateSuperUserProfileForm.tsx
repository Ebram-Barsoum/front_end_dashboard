/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

import { ProfilesValues } from "../../services/apiSelfProfile";
import { update_super_user } from "../../services/apiSuperUsers";
import useQueryParams from "../../hooks/useQueryParams";
import { convertFileToImageURL, handleMutationError } from "../../lib/healpers";
import { EMAIL_REGEX, PHONE_REGEX, PWD_REGEX } from "../../lib/constants";

import Row from "../../ui/Row";
import FormError from "../../ui/FormError";
import Column from "../../ui/Column";
import ProfileHeader from "../../ui/ProfileHeader";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import DataTable from "../../ui/DataTable";
import TableRow from "../../ui/TableRow";
import ProfileImage from "../../ui/ProfileImage";


interface FormFields {
    phone: string;
    email: string;
    city: string;
    password?: string;
    confirmPassword?: string;
    profileImage?: FileList;
}

interface UpdateSuperUserProfileFormProps {
    id: string;
    name: string;
    type: string;
    email: string;
    phone: string;
    city: string;
    profileImage: string;
    onSuccess?: () => void
}

export default function UpdateSuperUserProfileForm({ id, name, type, email, phone, city, profileImage, onSuccess }: UpdateSuperUserProfileFormProps): JSX.Element {
    const defaultValues = { phone, email, city };
    const { register, handleSubmit, watch, formState: { errors, isDirty } } = useForm<FormFields>({ defaultValues });
    const { isPending, mutate } = useMutation({ mutationFn: ({ id, newData }: { id: string, newData: Partial<ProfilesValues> }) => update_super_user(id, newData) })
    const queryClient = useQueryClient();
    const params = useQueryParams();

    const inputStyle = "p-1 bg-card";

    const formFileds = useMemo(() => {
        return [
            {
                label: "phone",
                value: (
                    <Row className="gap-2">
                        <input
                            type="tel"
                            className={inputStyle}
                            {...register("phone", {
                                required: "Phone number is required",
                                pattern: { value: PHONE_REGEX, message: "Invalid phone number" },
                            })}
                        />
                        <FormError message={errors.phone && errors.phone.message} />
                    </Row>
                ),
            },
            {
                label: "email",
                value: (
                    <Row className="gap-2">
                        {" "}
                        <input
                            type="email"
                            className={inputStyle}
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: EMAIL_REGEX, message: "Invalid phone number" },
                            })}
                        />
                        <FormError message={errors.email && errors.email.message} />{" "}
                    </Row>
                ),
            },
            {
                label: "city",
                value: (
                    <Row className="gap-2">
                        {" "}
                        <input
                            type="text"
                            className={inputStyle}
                            {...register("city", {
                                required: "City is required",
                            })}
                        />
                        <FormError message={errors.city && errors.city.message} />{" "}
                    </Row>
                ),
            },
            {
                label: "password",
                value: (
                    <Row className="gap-2">
                        <input
                            type="password"
                            className={inputStyle}
                            {...register("password", {
                                required: "Password is required",
                                pattern: { value: PWD_REGEX, message: "Invalid password" },
                            })}
                        />
                        <FormError message={errors.password && errors.password.message} />{" "}
                    </Row>
                ),
            },
            {
                label: "confirm password",
                value: (
                    <Row className="gap-2">
                        <input
                            type="password"
                            className={inputStyle}
                            {...register("confirmPassword", {
                                required: "Confirm your password",
                                pattern: { value: PWD_REGEX, message: "Invalid password" },
                                validate: (value) =>
                                    value === watch("password") || "Passwords do not match",
                            })}
                        />
                        <FormError
                            message={errors.confirmPassword && errors.confirmPassword.message}
                        />{" "}
                    </Row>
                ),
            },
        ]
    }, [errors, register, watch]);

    const newImage: string = convertFileToImageURL(watch("profileImage")?.[0]);
    const imageLabel = <ProfileImage src={newImage || profileImage} alt={`${name}'s profile`} />;


    const onSubmit: SubmitHandler<FormFields> = (data: FormFields) => {

        const { confirmPassword, profileImage, ...rest } = data;
        const newData = newImage ? { ...rest, profileImage: profileImage?.[0] } : { ...rest }

        mutate({ id, newData }, {
            onSuccess: (data) => {
                onSuccess?.();

                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ['dashboard-users', params] })
            },
            onError: (error) => {
                const fallback = 'Failed to update profile';
                handleMutationError(error as AxiosError, fallback);
            },
        });

    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white px-[37px] py-5 rounded-xl sm:w-[491px]"
        >

            <Column className="gap-4">
                <Column className="gap-2 text-center">
                    <FormInput
                        type="file"
                        accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
                        id={String(imageLabel)}
                        label={imageLabel}
                        hidden={true}
                        labelClassName="self-center cursor-pointer"
                        {...register("profileImage")
                        }
                    />
                    <ProfileHeader name={name} type={type} />
                </Column>

                <Column className="gap-4">
                    <DataTable className="border border-stroke rounded-xl py-3 px-4 bg-card">
                        {formFileds.map((field) => (
                            <TableRow
                                key={field.label}
                                label={field.label}
                                value={field.value}
                                labelStyle="py-2 pr-[10px] border-r-stroke "
                                valueStyle="py-2 text-black"
                                className="border-b border-stroke last:border-b-0 items-center grid-cols-[7rem_1fr]"
                            />
                        ))}
                    </DataTable>

                    <Button disabled={!isDirty || isPending} className="font-bold bg-primary text-white rounded-lg">
                        Save
                    </Button>
                </Column>
            </Column>
        </form>
    )
}
