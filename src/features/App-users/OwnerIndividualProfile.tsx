import { ReactNode, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { update_app_user } from "../../services/apiAppUsers";
import useUpdateUser from "../../hooks/useUpdateUser";
import useQueryParams from "../../hooks/useQueryParams";

import { convertFileToImageURL, handleMutationError } from "../../lib/healpers";
import { AppUser } from "../../lib/interfaces";
import { dataTableStyle, tableRowStyle, userDataInputs } from "../../lib/constants";

import { labelStyle } from "../Truck/AddTruckForm";
import AppUserAddress from "./AppUserAddress";

import DisapproveUserButton from "./DisapproveUserButton";
import ApproveUserButton from "./ApproveUserButton";

import ProfileHeader from "../../ui/ProfileHeader";
import Column from "../../ui/Column";
import Row from "../../ui/Row";
import FormInput from "../../ui/FormInput";
import FormError from "../../ui/FormError";
import ProfileImage from "../../ui/ProfileImage";
import DataTable from "../../ui/DataTable";
import TableRow from "../../ui/TableRow";
import Button from "../../ui/Button";
import UploadFileIcon from "../../icons/UploadFileIcon";


interface OwnerIndividualProfileProps {
    user: Partial<AppUser>;
    isEditing: boolean;
    children: ReactNode;
    setIsEditing: (isEditing: boolean) => void;
}

interface FormInputs {
    name: string;
    phone: string;
    email: string;
    profileImage: FileList | File;
    driverLicense: FileList | File;
}

export default function OwnerIndividualProfile({ user, children, isEditing, setIsEditing }: OwnerIndividualProfileProps): JSX.Element {
    const { id, email, phone, profileImage, name, userType, userSubtype, driverLicense, createdAt, approvalStatus } = user;

    const [newImage, setNewImage] = useState<string>('');
    const [newDriverLicense, setNewDriverLicense] = useState<string>('');

    const { register, watch, formState: { errors }, handleSubmit } = useForm<FormInputs>({
        defaultValues: {
            email: email,
            phone: phone,
            name: name
        }
    });

    const { isPending, mutate } = useUpdateUser({ userId: id as string, updateFn: update_app_user });

    const queryClient = useQueryClient();
    const params = useQueryParams();

    const labelProfileImage = (
        <ProfileImage
            src={newImage || (profileImage as string)}
            alt={`${name}'s profile picture`}
        />
    );

    // Those two use Effects are used to update the image preview when the user selects a new image
    const watchedProfileImage = watch('profileImage');
    const watchedDriverLicense = watch('driverLicense');

    useEffect(() => {
        if ((watchedProfileImage as FileList)?.[0])
            setNewImage(
                convertFileToImageURL((watchedProfileImage as FileList)?.[0])
            );
    }, [watchedProfileImage]);


    useEffect(() => {
        if ((watchedDriverLicense as FileList)?.[0]) {
            setNewDriverLicense(
                convertFileToImageURL((watchedDriverLicense as FileList)?.[0]));
        }
    }, [watchedDriverLicense]);

    const onSubmit: SubmitHandler<FormInputs> = (formData: FormInputs) => {
        // prepare data for update
        const { profileImage, driverLicense, ...rest } = formData;
        let newUserData: Partial<AppUser> = {
            userType,
            userSubtype,
            ...rest
        };

        newUserData = profileImage ? { ...newUserData, profileImage: (profileImage as FileList)?.[0] } : newUserData;
        newUserData = driverLicense ? { ...newUserData, driverLicense: (driverLicense as FileList)?.[0] } : newUserData;

        // Update user data
        mutate(newUserData, {
            onSuccess: (data) => {
                toast.success(data.message);
                setIsEditing(false);
                queryClient.invalidateQueries({ queryKey: ['app-users', params] });
            },
            onError: (error) => {
                const fallbackError = "Failed to update user!";
                handleMutationError(error, fallbackError);
            }
        })
    }

    return (
        <Column className="bg-white p-[38px] rounded-xl md:w-[493px]">
            <Column className="gap-6">
                {/*form to update user data*/}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    <Column className="gap-2">
                        <FormInput
                            id="profileImage"
                            type="file"
                            label={labelProfileImage}
                            hidden={true}
                            disabled={!isEditing}
                            accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
                            {...register("profileImage")}
                        />
                        <ProfileHeader name={name} type={(userType + " " + userSubtype).toLowerCase()} />

                        <Row className="justify-center gap-4 mt-2">{children}</Row>
                    </Column>

                    <DataTable className={dataTableStyle}>
                        {userDataInputs.map(({ id, name, type, label, validation }) => {
                            return <TableRow
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
                                className={tableRowStyle.className + " grid-cols-[6rem_1fr]"}
                            />
                        })}

                        {
                            !isEditing &&
                            <TableRow
                                label="Date Joined"
                                value={createdAt}
                                {...tableRowStyle}
                                className={tableRowStyle.className + " grid-cols-[6rem_1fr]"}
                            />
                        }
                    </DataTable>

                    <FormInput
                        id="driverLicense"
                        type="file"
                        label={
                            <Column className="h-[150px] items-center justify-center gap-2 text-grey-2 text-[14px] border border-grey-2 border-dashed overflow-hidden rounded-lg cursor-pointer">
                                {driverLicense || newDriverLicense ?
                                    <img src={newDriverLicense || driverLicense as string} alt="driver license image" className="w-full object-fill" />
                                    : <><UploadFileIcon /><span>Upload the driver's license</span></>}
                            </Column>
                        }
                        labelClassName={labelStyle + " ms-0"}
                        hidden={true}
                        disabled={!isEditing}
                        accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
                        {...register("driverLicense")}
                    />

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


                <AppUserAddress userId={id as string} isEditing={isEditing} setIsEditing={setIsEditing} />

                {(!isEditing && (approvalStatus === "Pending" || approvalStatus === "Disapproved")) && <Row className="gap-4">
                    <ApproveUserButton userId={id as string} />
                    <DisapproveUserButton userId={id as string} />
                </Row>}

            </Column>
        </Column>
    )
}
