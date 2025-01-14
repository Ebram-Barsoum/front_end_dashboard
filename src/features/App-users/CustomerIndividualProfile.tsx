import { ReactNode, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { update_app_user } from "../../services/apiAppUsers";

import useUpdateUser from "../../hooks/useUpdateUser";
import useQueryParams from "../../hooks/useQueryParams";

import { convertFileToImageURL, handleMutationError } from "../../lib/healpers";
import { dataTableStyle, PrimaryButtonStyle, secondaryButtonStyle, tableRowStyle, userDataInputs } from "../../lib/constants";
import { Address, AppUser } from "../../lib/interfaces";

import AddressForm from "../Addresses/AddressForm";
import AddressesList from "../Addresses/AddressesList";

import Column from "../../ui/Column";
import FormInput from "../../ui/FormInput";
import Row from "../../ui/Row";
import ProfileHeader from "../../ui/ProfileHeader";
import ProfileImage from "../../ui/ProfileImage";
import DataTable from "../../ui/DataTable";
import TableRow from "../../ui/TableRow";
import FormError from "../../ui/FormError";
import Button from "../../ui/Button";


interface CustomerIndividualProfileProps {
    user: Partial<AppUser>
    isEditing: boolean;
    setIsEditing: (state: boolean) => void;
    children: ReactNode;
}

interface FormInputs {
    name: string;
    phone: string;
    email: string;
    profileImage: FileList | File;
}

export default function CustomerIndividualProfile({ user, isEditing, setIsEditing, children }: CustomerIndividualProfileProps): JSX.Element {
    const { id, name, email, phone, profileImage, userType, userSubtype, createdAt } = user;
    const [newImage, setNewImage] = useState<string>('');
    const [showAddressForm, setShowAddressForm] = useState<boolean>(false);
    const [addressToBeUpdated, setAddressToBeUpdated] = useState<Address | undefined>(undefined);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormInputs>({
        defaultValues: {
            name,
            phone,
            email,
        }
    });

    const { isPending, mutate } = useUpdateUser({ userId: id as string, updateFn: update_app_user });
    const params = useQueryParams();
    const querClient = useQueryClient();
    const navigate = useNavigate();

    const labelProfileImage = (
        <ProfileImage
            src={newImage || (profileImage as string)}
            alt={`${name}'s profile picture`}
        />
    );

    const onSubmit: SubmitHandler<FormInputs> = (formData: FormInputs) => {
        // prepare data for update
        const { profileImage, ...rest } = formData;;
        let newUserData: Partial<AppUser> = profileImage ? { ...rest, profileImage: (profileImage as FileList)?.[0] } : { ...rest };
        newUserData = { ...newUserData, userType, userSubtype };

        // update user
        mutate(newUserData, {
            onSuccess: (data) => {
                toast.success(data.message);
                querClient.invalidateQueries({ queryKey: ["app-users", params] });
                setIsEditing(false);
            },
            onError: (error) => {
                const fallbackError = "Failed to update user profile";
                handleMutationError(error, fallbackError);
            }
        });
    }

    const handleAddPackage = () => {
        navigate('/add-package');
    }

    const handleAddNewAddress = () => {
        setShowAddressForm(true);
    }

    // handle image preview when a usr select a new image
    const watchedProfileImage = watch("profileImage");
    useEffect(() => {
        if ((watchedProfileImage as FileList)?.[0]) {
            setNewImage((convertFileToImageURL((watchedProfileImage as FileList)?.[0])))
        }
    }, [watchedProfileImage]);

    return (

        <Column className="gap-4 bg-white p-4 rounded-xl md:px-[40px] md:py-[28px] md:w-[498px]">

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
            >
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
                                className={tableRowStyle.className + " grid-cols-[6rem_1fr]"}
                            />
                        }
                    </DataTable>
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
                    onClick={handleAddPackage}
                    className={PrimaryButtonStyle}>
                    Add Package
                </Button>

                <Button
                    onClick={handleAddNewAddress}
                    className={secondaryButtonStyle}>
                    Add New Address
                </Button>
            </Row>}
        </Column>
    )
}
