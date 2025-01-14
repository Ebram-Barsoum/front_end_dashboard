/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { create_app_user } from "../../services/apiAppUsers";
import { cities, EMAIL_REGEX, PHONE_REGEX, PWD_REGEX, STREET_REGEX } from "../../lib/constants";
import { handleMutationError } from '../../lib/healpers';
import { AppUser } from "../../lib/interfaces";

import Column from "../../ui/Column";
import FormHeader from "../../ui/FormHeader";
import InputGroup from "../../ui/InputGroup";
import UserRoleInput from "../../ui/UserRoleInput";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import FormTruckIcon from "../../icons/FormTruckIcon";
import FormUserIcon from "../../icons/FormUserIcon";
import CustomeDropDown from "../../ui/CustomDropDownMenu";
import DropDownIcon from "../../icons/DropDownIcon";
import UploadFileIcon from "../../icons/UploadFileIcon";
import FormError from '../../ui/FormError';

interface FormInputs {
    name: string;
    email: string;
    password: string;
    role: string;
    type: string;
    city: string;
    street: string;
    area: string;
    district: string;
    phone: string;
    confirmPassword: string;
}

const labelStyle = "text-[12px] ms-2";
export const menuStyle = "border border-grey-2 text-grey-2 text-[12px] text-start px-4 rounded-lg flex items-center justify-between focus:ring-1 focus:ring-grey-2 focus:outline-none";
export const fileInputstyle = "border border-grey-2 border-dashed rounded-lg h-[100px] cursor-pointer w-full grid place-items-center";


export default function AddAppUserForm(): JSX.Element {
    const { register, handleSubmit, watch, formState: { errors }, control, reset } = useForm<FormInputs>();
    const [driverLicense, setDriverLicense] = useState<File | null>(null);
    const [taxCard, setTaxCard] = useState<File | null>(null);
    const [commercialRegister, setCommercialRegister] = useState<File | null>(null);

    const { isPending, mutate } = useMutation({ mutationFn: (user: AppUser) => create_app_user(user) });

    const inputFields = [
        {
            id: "name",
            name: "name",
            label: "Name",
            placeholder: "Write your name",
            type: "text",
            validation: {
                required: "Name is required",
                validate: (val: string) => val.trim() !== "" || "Name is required",
            }
        },
        {
            id: "area",
            name: "area",
            label: "Area",
            placeholder: "Write your area",
            type: "text",
            validation: {
                required: (watch("city")?.trim()) ? "Area is required" : false,
            }
        },
        {
            id: "district",
            name: "district",
            label: "District",
            placeholder: "Write your district",
            type: "text",
            validation: {
                required: (watch("city")?.trim()) ? "District is required" : false,
            }
        },
        {
            id: "street",
            name: "street",
            label: "Street",
            placeholder: "Write your street",
            type: "text",
            validation: {
                required: (watch("city")?.trim()) ? "Street is required" : false,
                pattern: {
                    value: STREET_REGEX,
                    message: "street must have a number"
                }
            }
        },
        {
            id: "landmark",
            name: "landmark",
            label: "Landmark",
            placeholder: "Write your landmark",
            type: "text",
            validation: {
                required: (watch("city")?.trim()) ? "Landmark is required" : false,
            }
        },
        {
            id: "email",
            name: "email",
            label: "Email",
            placeholder: "Write your email",
            type: "email",
            validation: {
                required: "Email is required",
                pattern: {
                    value: EMAIL_REGEX,
                    message: "Invalid email address"
                }
            }
        },
        {
            id: "phone",
            name: "phone",
            label: "Phone",
            placeholder: "Write your phone number",
            type: "tel",
            validation: {
                required: "Phone number is required",
                pattern: {
                    value: PHONE_REGEX,
                    message: "Invalid phone number"
                }
            }
        },
        {
            id: "password",
            name: "password",
            label: "Password",
            placeholder: "Write your password",
            type: "password",
            validation: {
                required: "Password is required",
                pattern: {
                    value: PWD_REGEX,
                    message: "Password must be at least 8 characters long, contain a lowercase, uppercase, number, and special character"
                }
            }
        },
        {
            id: "confirmPassword",
            name: "confirmPassword",
            label: "Confirm Password",
            placeholder: "Confirm your password",
            type: "password",
            validation: {
                required: "Confirm password is required",
                validate: (value: string) => value === watch("password") || "Passwords do not match"
            }
        },
    ];

    const handleDriverLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setDriverLicense(file);
        }
    }

    const handleChangeTaxCard = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setTaxCard(file);
        }
    }

    const handleCommercialRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCommercialRegister(file);
        }
    }

    const onSubmit: SubmitHandler<FormInputs> = (data: FormInputs) => {
        const { confirmPassword, ...rest } = Object.fromEntries(
            Object.entries(data).filter(([, value]) => typeof value === "string" && value.trim() !== "")
        );

        let user = driverLicense ? { ...rest, driverLicense } : { ...rest };
        user = taxCard ? { ...user, taxCard } : user;
        user = commercialRegister ? { ...user, commercialRegister } : user;


        mutate(user as AppUser, {
            onSuccess: (data) => {
                reset();
                toast.success(data.message);
            },
            onError: (error) => {
                console.log(error);
                const fallbackError = "Failed to add user";
                handleMutationError(error, fallbackError);

            }
        })
    };


    useEffect(() => {
        if (watch("type") === "CORPORATION") {
            setDriverLicense(null);
        }

        if (watch("type") === "INDIVIDUAL") {
            setTaxCard(null);
            setCommercialRegister(null);
        }
    }, [watch("role"), watch("type"), watch]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-auto bg-white rounded-xl p-5 md:w-[40rem]"
        >
            <FormHeader className="mt-6 mb-8">Add New User</FormHeader>

            <Column className="px-3 gap-4">
                <Column className="gap-2">
                    <InputGroup className="grid-cols-2">
                        <UserRoleInput
                            label={
                                <Column className="text-[14px] justify-start gap-2">
                                    {" "}
                                    <FormTruckIcon />{" "}
                                    <span>
                                        Owner, looking to operate your vehicle in logistics and
                                        product shipping
                                    </span>
                                </Column>
                            }
                            className=""
                            id="owner"
                            value="OWNER"
                            {...register("role", { required: "This field is required" })}
                        />

                        <UserRoleInput
                            label={
                                <Column className="text-[14px] justify-start gap-2">
                                    {" "}
                                    <FormUserIcon />{" "}
                                    <span>
                                        Customer, looking for logistics services to ship your products
                                    </span>
                                </Column>
                            }
                            className="text-[14px] flex-col justify-start gap-2"
                            id="cutomer"
                            value="CUSTOMER"
                            {...register("role", { required: "This field is required" })}

                        />
                    </InputGroup>
                    {errors.role && <FormError message={errors.role.message} />}
                </Column>


                <Column className="gap-2">
                    <InputGroup className="grid-cols-2">
                        <UserRoleInput
                            label="Company"
                            className="text-xs flex items-center justify-center"
                            id="company"
                            value="CORPORATION"
                            {...register("type", { required: "This field is required" })}
                        />

                        <UserRoleInput
                            label="Individual"
                            className="text-xs flex items-center justify-center"
                            id="individual"
                            value="INDIVIDUAL"
                            {...register("type", { required: "This field is required" })}
                        />
                    </InputGroup>
                    {errors.type && <FormError message={errors.type.message} />}
                </Column>

                <InputGroup className="grid-cols-2 ">
                    <Controller
                        name="city"
                        control={control}
                        defaultValue=""

                        render={({ field }) => (
                            <Column className="gap-2">
                                <CustomeDropDown
                                    options={[...cities]}
                                    label="City"
                                    labelStyle="text-[12px]"
                                    placeholder="Select your city"
                                    placeholderIcon={<DropDownIcon />}
                                    value={field.value}
                                    onChange={field.onChange}
                                    className={menuStyle}
                                    width="100%"
                                />
                                {errors.city && <FormError message={errors.city.message} />}
                            </Column>
                        )}
                    />


                    {inputFields.map((input) => (
                        <FormInput
                            type={input.type}
                            key={input.id}
                            id={input.id}
                            label={input.label}
                            placeholder={input.placeholder}
                            labelClassName={labelStyle}
                            {...register(input.name as keyof FormInputs, {
                                ...input.validation
                            })
                            }
                            error={errors[input.name as keyof FormInputs]}
                        />
                    ))}
                </InputGroup>

                {(watch('role') === "OWNER" && watch("type") === "INDIVIDUAL")
                    &&
                    <InputGroup className="gap-0">
                        <FormInput
                            type="file"
                            id="licence"
                            accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
                            label={<Column className="items-center justify-center gap-2 text-grey-2 text-[14px]">
                                {driverLicense ? "Your license uploaded" : <><UploadFileIcon /><span>Upload driver's license</span></>}
                            </Column>}
                            labelClassName={fileInputstyle}
                            hidden={true}
                            onChange={handleDriverLicenseChange}
                        />
                    </InputGroup>
                }

                {
                    watch("type") === "CORPORATION" && <InputGroup className="grid-cols-2">
                        <FormInput
                            type="file"
                            id="taxCard"
                            accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
                            label={<Column className="items-center justify-center gap-2 text-grey-2 text-[14px]">
                                {taxCard ? "Your tax card uploaded" : <><UploadFileIcon /><span>Upload your tax card</span></>}
                            </Column>}
                            labelClassName={fileInputstyle}
                            hidden={true}
                            onChange={handleChangeTaxCard}
                        />

                        <FormInput
                            type="file"
                            id="commerRegistration"
                            accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
                            label={<Column className="items-center justify-center gap-2 text-grey-2 text-[14px]">
                                {commercialRegister ? "Commercial register uploaded" : <><UploadFileIcon /><span>Upload the commercial register</span></>}
                            </Column>}
                            labelClassName={fileInputstyle}
                            hidden={true}
                            onChange={handleCommercialRegisterChange}
                        />
                    </InputGroup>
                }

                <Button disabled={isPending} type="submit" className="w-full bg-primary text-white font-bold rounded-lg">
                    Create
                </Button>
            </Column>
        </form>
    );
}
