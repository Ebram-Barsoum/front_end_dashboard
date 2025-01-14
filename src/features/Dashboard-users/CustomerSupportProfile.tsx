import {
    Dispatch,
    ReactNode,
    SetStateAction,
    useEffect,
    useMemo,
    useState,
} from "react";

import { CSAvailablity, SuperUser } from "../../lib/interfaces";
import Column from "../../ui/Column";
import FormInput from "../../ui/FormInput";
import ProfileHeader from "../../ui/ProfileHeader";
import ProfileImage from "../../ui/ProfileImage";
import { dataTableStyle, EMAIL_REGEX, PHONE_REGEX, PWD_REGEX, tableRowStyle } from "../../lib/constants";
import DataTable from "../../ui/DataTable";
import TableRow from "../../ui/TableRow";
import { SubmitHandler, useForm } from "react-hook-form";
import Row from "../../ui/Row";
import Button from "../../ui/Button";
import FormError from "../../ui/FormError";
import useUpdateUser from "../../hooks/useUpdateUser";
import { update_super_user } from "../../services/apiSuperUsers";
import { toast } from "react-toastify";
import { convertFileToImageURL, handleMutationError } from "../../lib/healpers";
import { useQueryClient } from "@tanstack/react-query";
import useQueryParams from "../../hooks/useQueryParams";
import CustomerSupportAvailablity from "./CustomerSupportAvailablity";
import SystemShifts from "./SystemShifts";

interface CustomerSupportProfileProps {
    customerSupport: Partial<SuperUser>;
    children?: ReactNode;
    isEditing: boolean;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
}

interface FormInputs {
    phone: string;
    email: string;
    city: string;
    profileImage: File | FileList;
    password: string;
    confirmPassword: string;
}


export default function CustomerSupportProfile({
    customerSupport,
    children,
    isEditing,
    setIsEditing,
}: CustomerSupportProfileProps): JSX.Element {

    const {
        id,
        firstName,
        lastName,
        email,
        phone,
        city,
        type,
        profileImage,
        createdAt,
        breakTimeStart,
        breakTimeEnd,
        primaryBreakDay,
        secondaryBreakDay,
    } = customerSupport;

    const availabilityData = {
        breakTimeEnd,
        breakTimeStart,
        primaryBreakDay,
        secondaryBreakDay,
    };

    const [newImage, setNewImage] = useState<string>("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<FormInputs>({
        defaultValues: {
            phone: phone,
            email: email,
            city: city,
        },
    });

    const { isPending, mutate } = useUpdateUser({
        userId: id as string,
        updateFn: update_super_user,
    });

    const queryClient = useQueryClient();
    const params = useQueryParams();

    const labelImage = (
        <ProfileImage
            src={newImage || (profileImage as string)}
            alt={`${firstName} ${lastName}'s profile picture`}
        />
    );

    const personalInputs = useMemo(() => [
        {
            id: "phone",
            name: "phone",
            type: "tel",
            label: "phone",
            validation: {
                required: "Phone is required",
                pattern: {
                    value: PHONE_REGEX,
                    message: "Invalid phone number",
                },
            },
        },
        {
            id: "email",
            name: "email",
            type: "email",
            label: "email",
            validation: {
                required: "Email is required",
                pattern: {
                    value: EMAIL_REGEX,
                    message: "Invalid email address",
                },
            },
        },
        {
            id: "city",
            name: "city",
            type: "text",
            label: "city",
            validation: {
                required: "City is required",
            },
        },
    ], []);

    const passwordInputs = useMemo(() => [
        {
            id: "password",
            name: "password",
            type: "password",
            label: "password",
            validatation: {
                required: "Password is required",
                pattern: {
                    value: PWD_REGEX,
                    message: "Invalid password",
                },
            },
        },
        {
            id: "confirmPassword",
            name: "confirmPassword",
            type: "password",
            label: "confirm password",
            validatation: {
                required: "Password is required",
                pattern: {
                    value: PWD_REGEX,
                    message: "Invalid password",
                },
                validate: (value: unknown) => {
                    if (typeof value === "string") {
                        return value === watch("password") || "Passwords must match";
                    }
                    return "Invalid value";
                },
            },
        },
    ], [watch]);

    const onSubmit: SubmitHandler<FormInputs> = (formData: FormInputs) => {
        // prepare data for mutation
        const { profileImage, ...rest } = formData;
        const newUser = (profileImage as FileList)?.[0]
            ? { ...formData, profileImage: (profileImage as FileList)?.[0] }
            : { ...rest };

        // Update customer support profile
        mutate(newUser, {
            onSuccess: (data) => {
                toast.success(data.message);
                setIsEditing(false);
                queryClient.invalidateQueries({
                    queryKey: ["dashboard-users", params],
                });
            },
            onError: (error) => {
                const fallbackError = "Failed to update user";
                handleMutationError(error, fallbackError);
            },
        });
    };

    const watchedProfileImage = watch("profileImage") as FileList;

    useEffect(() => {
        if (profileImage && watchedProfileImage?.[0])
            setNewImage(
                convertFileToImageURL(watchedProfileImage?.[0])
            );
    }, [profileImage, watchedProfileImage]);

    return (
        <Column className="bg-white px-[37px] py-[35px] rounded-xl md:w-[491px]">
            <Column className="gap-6">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    <Column className="gap-2">
                        <FormInput
                            id="profileImage"
                            type="file"
                            label={labelImage}
                            hidden={true}
                            disabled={!isEditing}
                            accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
                            {...register("profileImage")}
                        />
                        <ProfileHeader name={firstName + " " + lastName} type={type} />

                        <Row className="justify-center gap-4 mt-2">{children}</Row>
                    </Column>


                    <DataTable className={dataTableStyle}>
                        {personalInputs.map(({ id, name, type, label, validation }) => (
                            <TableRow
                                key={id}
                                label={label as string}
                                value={
                                    <Row className="gap-2">
                                        <input
                                            id={id}
                                            type={type}
                                            disabled={!isEditing}
                                            {...register(name as keyof FormInputs, validation)}
                                            className="p-1"
                                        />
                                        {errors[name as keyof FormInputs] && (
                                            <FormError
                                                message={
                                                    errors[name as keyof FormInputs]?.message as string
                                                }
                                            />
                                        )}
                                    </Row>
                                }
                                {...tableRowStyle}
                                className={tableRowStyle.className + " grid-cols-[7rem_1fr]"}
                            />
                        ))}

                        {isEditing ? (
                            <>
                                {passwordInputs.map(
                                    ({ id, label, type, name, validatation }) => (
                                        <TableRow
                                            key={id}
                                            label={label}
                                            value={
                                                <Row className="gap-2">
                                                    <input
                                                        id={id}
                                                        type={type}
                                                        disabled={!isEditing}
                                                        {...register(
                                                            name as keyof FormInputs,
                                                            validatation
                                                        )}
                                                        className="p-1"
                                                    />
                                                    {errors[name as keyof FormInputs] && (
                                                        <FormError
                                                            message={
                                                                errors[name as keyof FormInputs]
                                                                    ?.message as string
                                                            }
                                                        />
                                                    )}
                                                </Row>
                                            }
                                            {...tableRowStyle}
                                            className={
                                                tableRowStyle.className + " grid-cols-[7rem_1fr]"
                                            }
                                        />
                                    )
                                )}
                            </>
                        ) : (
                            <TableRow
                                key={"DateJoined"}
                                label="Date Joined"
                                value={createdAt}
                                {...tableRowStyle}
                                className={tableRowStyle.className + " grid-cols-[7rem_1fr]"}
                            />
                        )}
                    </DataTable>

                    {isEditing && (
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-primary rounded-lg text-white font-bold"
                        >
                            Save
                        </Button>
                    )}
                </form>

                <SystemShifts user={{ id, primaryBreakDay, secondaryBreakDay, breakTimeStart, breakTimeEnd }} />

                <CustomerSupportAvailablity
                    customerSupportId={id as string}
                    availabilityData={availabilityData as CSAvailablity}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    params={params}
                />
            </Column>
        </Column>
    );
}
