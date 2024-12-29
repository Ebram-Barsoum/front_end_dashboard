/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

import Button from "../../ui/Button";
import Row from "../../ui/Row";
import Column from "../../ui/Column";
import DataTable from "../../ui/DataTable";
import TableRow from "../../ui/TableRow";
import FormError from "../../ui/FormError";
import FormInput from "../../ui/FormInput";
import ProfileHeader from "../../ui/ProfileHeader";

import useQueryParams from "../../hooks/useQueryParams";
import { convertFileToImageURL, handleMutationError } from "../../lib/healpers";
import { useAuth } from "../../contexts/AuthContext";

import {
    EMAIL_REGEX,
    PHONE_REGEX,
    PWD_REGEX,
} from "../../lib/constants";


import {
    ProfilesValues,
    update_self_profile,
} from "../../services/apiSelfProfile";
import { AuthResponse } from "../../lib/interfaces";

interface FormData {
    profileImage: FileList;
    phone: string;
    email: string;
    city: string;
    password: string;
    confirmPassword: string;
}

interface ProfileProps {
    name: string;
    email: string;
    phone: string;
    city: string;
    createdAt: string;
    type: string;
    profileImage: string;
    onSuccess?: () => void;
}

export default function UpdateSelfProfileForm({
    name,
    email,
    phone,
    city,
    type,
    profileImage,
    onSuccess,
}: Partial<ProfileProps>): JSX.Element {
    const inputStyle = "p-1 bg-card";

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const { isPending, mutate } = useMutation({
        mutationKey: ["self-update"],
        mutationFn: (data: ProfilesValues) => update_self_profile(data),
    });

    const { auth, setAuth } = useAuth();
    const queryClient = useQueryClient();
    const params = useQueryParams();


    const formFileds = [
        {
            label: "phone",
            value: (
                <Row className="gap-2">
                    <input
                        type="tel"
                        className={inputStyle}
                        defaultValue={phone}
                        {...register("phone", {
                            required: "Phone number is required",
                            pattern: { value: PHONE_REGEX, message: "Invalid phone number" },
                        })}
                    />{" "}
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
                        defaultValue={email}
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: EMAIL_REGEX, message: "Invalid phone number" },
                        })}
                    />{" "}
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
                        defaultValue={city}
                        {...register("city", {
                            required: "City is required",
                        })}
                    />{" "}
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
    ];

    const newImage: string = convertFileToImageURL(watch("profileImage")?.[0]);

    const imageLabel = (
        <img
            src={newImage || profileImage || "/user.jpg"}
            alt={name + "'s profile picture"}
            className="object-cover w-[84px] h-[84px] rounded-full mx-auto mb-2"
        />
    );

    const onSubmit: SubmitHandler<FormData> = (data: FormData) => {

        const { confirmPassword, profileImage, ...rest } = data;
        const newData = newImage ? { ...rest, profileImage: profileImage[0] } : { ...rest }

        mutate(newData, {
            onSuccess: (data) => {

                onSuccess?.();
                const newAuth = { ...auth, superUser: { ...auth?.superUser, ...data.user } };
                setAuth(newAuth as AuthResponse);
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ['dashboard-users', params] })
            },
            onError: (error) => {
                const fallback = 'Failed to update profile';
                handleMutationError(error as AxiosError, fallback);
            },
        });
    };

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
                        {...register("profileImage")}
                    />
                    <ProfileHeader
                        name={name}
                        type={type}
                    />
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

                    <Button disabled={isPending} className="font-bold bg-primary text-white rounded-lg">
                        Save
                    </Button>
                </Column>
            </Column>
        </form>
    );
}
