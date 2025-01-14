import { ReactNode, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { update_app_user } from "../../services/apiAppUsers";

import useQueryParams from "../../hooks/useQueryParams";
import useUpdateUser from "../../hooks/useUpdateUser";

import { convertFileToImageURL, handleMutationError } from "../../lib/healpers";
import { Address, AppUser } from "../../lib/interfaces";
import { dataTableStyle, PrimaryButtonStyle, secondaryButtonStyle, tableRowStyle, userDataInputs } from "../../lib/constants";

import { labelStyle } from "../Truck/AddTruckForm";

import Column from "../../ui/Column";
import FormInput from "../../ui/FormInput";
import ProfileHeader from "../../ui/ProfileHeader";
import Row from "../../ui/Row";
import ProfileImage from "../../ui/ProfileImage";
import DataTable from "../../ui/DataTable";
import TableRow from "../../ui/TableRow";
import FormError from "../../ui/FormError";
import AddressesList from "../Addresses/AddressesList";
import AddressForm from "../Addresses/AddressForm";
import Button from "../../ui/Button";

import UploadFileIcon from "../../icons/UploadFileIcon";
import ApproveUserButton from "./ApproveUserButton";
import DisapproveUserButton from "./DisapproveUserButton";


interface CustomerCompanyProfileProps {
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

export default function CustomerCompanyProfile({ user, isEditing, setIsEditing, children }: CustomerCompanyProfileProps): JSX.Element {
    const { id, name, email, phone, userType, userSubtype, profileImage, createdAt, commercialRegister, taxCard, approvalStatus } = user;

    const [newProfileImage, setNewProfileImage] = useState<string>('');
    const [newCommercialRegister, setNewCommercialRegister] = useState<string>(commercialRegister as string);
    const [newTaxCard, setNewTaxCard] = useState<string>(taxCard as string);
    const [addressToBeUpdated, setAddressToBeUpdated] = useState<Address | undefined>(undefined);
    const [showAddressForm, setShowAddressForm] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormInputs>({
        defaultValues: {
            name, email, phone
        }
    });
    const navigate = useNavigate();

    const labelProfileImage = <ProfileImage src={newProfileImage || profileImage as string} alt={`${name}'s profile picture`} />

    const { isPending, mutate } = useUpdateUser({ userId: id as string, updateFn: update_app_user });
    const queryClient = useQueryClient();
    const params = useQueryParams();

    const onSubmit: SubmitHandler<FormInputs> = (formData: FormInputs) => {
        // prepare the data to be sent to the backend
        const { profileImage, commercialRegister, taxCard, ...rest } = formData;

        let newUserData: Partial<AppUser> = (profileImage as FileList)?.[0] ? { ...rest, profileImage: (profileImage as FileList)?.[0] } : { ...rest };
        newUserData = (commercialRegister as FileList)?.[0] ? { ...newUserData, commercialRegister: (commercialRegister as FileList)?.[0] } : { ...newUserData };
        newUserData = (taxCard as FileList)?.[0] ? { ...newUserData, taxCard: (taxCard as FileList)?.[0] } : { ...newUserData };
        newUserData.userSubtype = userSubtype;
        newUserData.userType = userType;

        mutate(newUserData, {
            onSuccess: (data) => {
                toast.success(data.message);
                setIsEditing(false);
                queryClient.invalidateQueries({ queryKey: ['app-users', params] });
            },
            onError: (error) => {
                handleMutationError(error, "Failed to update profile");
            }
        });
    }

    const handleGoToAddPackage = () => {
        navigate('/add-package');
    }

    const handleAddNewAddress = () => {
        setShowAddressForm(true);
    }


    // handle preview new profile image when a user select new one.
    const watchedNewProfileImage: FileList = watch('profileImage') as FileList;
    useEffect(() => {
        if (watchedNewProfileImage?.[0]) {
            setNewProfileImage(convertFileToImageURL(watchedNewProfileImage?.[0]));
        }
    }, [watchedNewProfileImage]);

    // handle preview commercial register image when a user select new one.
    const watchednewCommercialRegister: FileList = watch('commercialRegister') as FileList;
    useEffect(() => {
        if (watchednewCommercialRegister?.[0]) {
            setNewCommercialRegister(convertFileToImageURL(watchednewCommercialRegister?.[0]));
        }
    }, [watchednewCommercialRegister]);

    // handle preview new tax card image when a user select new one.
    const watchednewTaxCard: FileList = watch('taxCard') as FileList;
    useEffect(() => {
        if (watchednewTaxCard?.[0]) {
            setNewTaxCard(convertFileToImageURL(watchednewTaxCard?.[0]));
        }
    }, [watchednewTaxCard]);

    return (
        <Column className="gap-4 bg-white p-[38px] rounded-xl md:w-[493px]">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6">
                <Column>
                    <FormInput
                        id="profileImage"
                        type="file"
                        label={labelProfileImage}
                        className="text-[12px]"
                        hidden={true}
                        disabled={!isEditing}
                        accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
                        {...register("profileImage")}
                    />
                    <ProfileHeader name={name} type={(userType + " " + userSubtype).toLowerCase()} />

                    <Row className="justify-center gap-4 mt-2">{children}</Row>
                </Column>

                <Column className="gap-4">
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
                                valueStyle="ps-3"
                                className={tableRowStyle.className + " grid-cols-[6rem_1fr]"}
                            />
                        }
                    </DataTable>
                </Column>

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


            {(!showAddressForm && !addressToBeUpdated) ? <AddressesList userId={id as string} setAddressToBeUpdated={setAddressToBeUpdated} />
                :
                <AddressForm userId={id as string} addressToBeUpdated={addressToBeUpdated} setAddressToBeUpdated={setAddressToBeUpdated} setShowFormAddress={setShowAddressForm} />}

            {(!showAddressForm && !addressToBeUpdated) && <Row className="gap-4">
                <Button
                    onClick={handleGoToAddPackage}
                    className={PrimaryButtonStyle}>
                    Add Package
                </Button>

                <Button
                    onClick={handleAddNewAddress}
                    className={secondaryButtonStyle}>
                    Add New Address
                </Button>
            </Row>}

            {(!isEditing && (approvalStatus === "Pending" || approvalStatus === "Disapproved")) && <Row className="gap-4">
                <ApproveUserButton userId={id as string} />
                <DisapproveUserButton userId={id as string} />
            </Row>}
        </Column>
    )
}
