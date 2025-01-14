import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { update_app_user } from "../../services/apiAppUsers";

import useQueryParams from "../../hooks/useQueryParams";
import useUpdateUser from "../../hooks/useUpdateUser";

import { convertFileToImageURL, handleMutationError } from "../../lib/healpers";
import { AppUser } from "../../lib/interfaces";
import { dataTableStyle, PrimaryButtonStyle, secondaryButtonStyle, tableRowStyle, userDataInputs } from "../../lib/constants";

import { labelStyle } from "../Truck/AddTruckForm";
import TrucksList from "../Truck/TrucksList";
import AppUserAddresses from "./AppUserAddress";

import Column from "../../ui/Column";
import FormInput from "../../ui/FormInput";
import ProfileHeader from "../../ui/ProfileHeader";
import Row from "../../ui/Row";
import ProfileImage from "../../ui/ProfileImage";
import DataTable from "../../ui/DataTable";
import TableRow from "../../ui/TableRow";
import FormError from "../../ui/FormError";
import Button from "../../ui/Button";
import UploadFileIcon from "../../icons/UploadFileIcon";
import ApproveUserButton from "./ApproveUserButton";
import DisapproveUserButton from "./DisapproveUserButton";


interface OwnerCompanyProfileProps {
    user: Partial<AppUser>;
    isEditing: boolean;
    setIsEditing: (state: boolean) => void;
    children: ReactNode;
}

interface FormInputs {
    name: string;
    email: string;
    phone: string;
    profileImage: FileList | File;
    commercialRegister: FileList | File;
    taxCard: FileList | File;
}

export default function OwnerCompanyProfile({
    user,
    isEditing,
    setIsEditing,
    children,
}: OwnerCompanyProfileProps): JSX.Element {

    const { id, email, phone, profileImage, name, userType, userSubtype, commercialRegister, taxCard, approvalStatus } = user;
    const [newImage, setNewImage] = useState<string>(profileImage as string);
    const [newCommercialRegister, setNewCommercialRegister] = useState<string>(commercialRegister as string);
    const [newTaxCard, setNewTaxCard] = useState<string>(taxCard as string);
    const [vewTrucksList, setViewTrucksList] = useState<boolean>(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            name, phone, email,
        }
    });

    const { isPending, mutate } = useUpdateUser({ userId: id as string, updateFn: update_app_user });
    const params = useQueryParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const labelProfileImage = (
        <ProfileImage
            src={newImage}
            alt={`${name}'s profile picture`}
        />
    );

    // handle image preview when user selects a new image
    const watchedProfileImage = watch('profileImage');
    useEffect(() => {
        if ((watchedProfileImage as FileList)?.[0])
            setNewImage(
                convertFileToImageURL((watchedProfileImage as FileList)?.[0])
            );
    }, [watchedProfileImage]);

    const watchedCommercialRegister = watch('commercialRegister');
    useEffect(() => {
        if ((watchedCommercialRegister as FileList)?.[0])
            setNewCommercialRegister(
                convertFileToImageURL((watchedCommercialRegister as FileList)?.[0])
            );
    }, [watchedCommercialRegister]);

    const watchedtaxcard = watch('taxCard');
    useEffect(() => {
        if ((watchedtaxcard as FileList)?.[0])
            setNewTaxCard(
                convertFileToImageURL((watchedtaxcard as FileList)?.[0])
            );
    }, [watchedtaxcard]);


    const handleAddTruckClick = () => {
        navigate('/add-truck');
    }

    const handleViewTruckList = () => {
        setViewTrucksList(true);
    }

    const onSubmit: SubmitHandler<FormInputs> = (formData: FormInputs) => {
        // prepare the data to be sent to the backend
        const { profileImage, commercialRegister, taxCard, ...rest } = formData;

        let newUserData: Partial<AppUser> = (profileImage as FileList)?.[0] ? { ...rest, profileImage: (profileImage as FileList)?.[0] } : { ...rest };
        newUserData = (commercialRegister as FileList)?.[0] ? { ...newUserData, commercialRegister: (commercialRegister as FileList)?.[0] } : { ...newUserData };
        newUserData = (taxCard as FileList)?.[0] ? { ...newUserData, taxCard: (taxCard as FileList)?.[0] } : { ...newUserData };
        newUserData.userSubtype = userSubtype;
        newUserData.userType = userType;

        // mutate the user data
        mutate(newUserData, {
            onSuccess: (data) => {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ['app-users', params] });
                setIsEditing(false);
            },
            onError: (error) => {
                handleMutationError(error, "Failed to update user");
            }
        })
    }

    return (
        <Column className="gap-4 bg-white p-[38px] rounded-xl md:w-[493px]">
            {!vewTrucksList ?
                <>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-6">
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
                            {
                                userDataInputs.map(({ id, name, label, type, validation }) => {
                                    return <TableRow
                                        key={id}
                                        label={label}
                                        value={
                                            <Row>
                                                <input
                                                    type={type}
                                                    className="p-1"
                                                    disabled={!isEditing}
                                                    {...register(name as keyof FormInputs, validation)}
                                                />

                                                {errors[name as keyof FormInputs] && <FormError message={errors[name as keyof FormInputs]?.message} />}
                                            </Row>
                                        }
                                        {...tableRowStyle}
                                        className={tableRowStyle.className + " grid-cols-[5rem_2fr]"}
                                    />
                                })
                            }
                        </DataTable>

                        <Column className="gap-4">
                            <FormInput
                                id="commercialRegister"
                                type="file"
                                label={
                                    <Column className="h-[150px] items-center justify-center gap-2 text-grey-2 text-[14px] border border-grey-2 border-dashed overflow-hidden rounded-lg cursor-pointer">
                                        {newCommercialRegister ?
                                            <img src={newCommercialRegister} alt="commercial register image" className="w-full  object-fill" />
                                            : <><UploadFileIcon /><span>Upload the commercial register</span></>}
                                    </Column>
                                }
                                labelClassName={labelStyle + " ms-0"}
                                hidden={true}
                                disabled={!isEditing}
                                accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
                                {...register("commercialRegister")}
                            />


                            <FormInput
                                id="taxCard"
                                type="file"
                                label={
                                    <Column className="h-[150px] items-center justify-center gap-2 text-grey-2 text-[14px] border border-grey-2 border-dashed overflow-hidden rounded-lg cursor-pointer">
                                        {newTaxCard ?
                                            <img src={newTaxCard} alt="tax card image" className="w-full  object-fill" />
                                            : <><UploadFileIcon /><span>Upload the tax card</span></>}
                                    </Column>
                                }
                                labelClassName={labelStyle + " ms-0"}
                                hidden={true}
                                disabled={!isEditing}
                                accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
                                {...register("taxCard")}
                            />

                        </Column>

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

                    <AppUserAddresses userId={id as string} isEditing={isEditing} setIsEditing={setIsEditing} />

                    {!isEditing && <Row className="gap-4">
                        <Button
                            onClick={handleAddTruckClick}
                            className={PrimaryButtonStyle}>Add truck</Button>
                        <Button
                            onClick={handleViewTruckList}
                            className={secondaryButtonStyle}>View trucks</Button>
                    </Row>}

                    {(!isEditing && (approvalStatus === "Pending" || approvalStatus === "Disapproved")) && <Row className="gap-4">
                        <ApproveUserButton userId={id as string} />
                        <DisapproveUserButton userId={id as string} />
                    </Row>}
                </>
                :

                <TrucksList userId={id as string} goBack={() => setViewTrucksList(false)} />
            }

        </Column>
    );
}
