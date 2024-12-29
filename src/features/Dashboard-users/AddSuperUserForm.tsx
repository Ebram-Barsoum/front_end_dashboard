/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "react-toastify";

import { create_super_user } from "../../services/apiSuperUsers";
import { useAuth } from "../../contexts/AuthContext";

import { EMAIL_REGEX, PHONE_REGEX, PWD_REGEX } from '../../lib/constants';
import { handleMutationError } from "../../lib/healpers";

import Button from "../../ui/Button";
import Column from "../../ui/Column";
import FormInput from "../../ui/FormInput";
import InputGroup from "../../ui/InputGroup";
import UserRoleInput from "../../ui/UserRoleInput";
import FormHeader from "../../ui/FormHeader";
import FormError from "../../ui/FormError";


interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    type: string;
}

interface CreateSuprtUserValues {
    superUser: Partial<FormData>;
    token: string;
}

export default function AddSuperUserForm(): JSX.Element {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<FormData>();
    const { auth } = useAuth();
    const role = auth?.superUser.type;

    const { isPending, mutate } = useMutation({
        mutationKey: ["create-super-user"],
        mutationFn: ({ superUser }: CreateSuprtUserValues) => create_super_user(superUser),
    });

    const QueryClient = useQueryClient();

    const onSubmit: SubmitHandler<FormData> = (data: Partial<FormData>) => {
        const { confirmPassword, ...user } = data;

        mutate({ superUser: user, token: auth?.authToken || '' }, {
            onSuccess: (data) => {
                toast.success(data.message);
                QueryClient.invalidateQueries({ queryKey: ["dashboard-users"] });
                reset();
            },
            onError: (error) => {
                const fallbackError = "Failed to create super user";
                handleMutationError(error, fallbackError);
            }
        });
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-auto bg-white rounded-xl p-5 md:w-[40rem]"
        >
            <FormHeader className="mt-6 mb-8">Add New User</FormHeader>

            <Column className="px-3 gap-4">
                <Column className="gap-4">
                    <Column className="gap-2">
                        <InputGroup className={`${role === "Admin" ? 'grid-cols-3' : 'grid-cols-2'}`}>
                            {role === "Admin" && (
                                <UserRoleInput
                                    id="admin"
                                    className="text-xs flex items-center justify-center capitalize"
                                    value="Admin"
                                    label="admin"
                                    {...register("type", {
                                        required: "Please select a role",
                                    })}
                                />
                            )}
                            <UserRoleInput
                                id="manager"
                                className="text-xs flex items-center justify-center capitalize"
                                value="Manager"
                                label="manager"
                                {...register("type", {
                                    required: "Please select a role",
                                })}
                            />
                            <UserRoleInput
                                id="customer-support"
                                className="text-xs flex items-center justify-center capitalize"
                                value="Customer Support"
                                label="cutomer support"
                                {...register("type", {
                                    required: "Please select a role",
                                })}
                            />
                        </InputGroup>
                        {errors.type && <FormError message={errors.type.message} />}
                    </Column>

                    <InputGroup className="grid-cols-2">
                        <FormInput
                            type="text"
                            id="fName"
                            placeholder="Write your first name"
                            label="first name"
                            labelClassName="text-xs capitalize"
                            {...register("firstName", {
                                required: "First name is required",
                                validate: (value) =>
                                    value.trim() !== "" || "First name is required",
                            })}
                            error={errors.firstName}
                        />
                        <FormInput
                            type="text"
                            id="lName"
                            placeholder="Write your last name"
                            label="last name"
                            labelClassName="text-xs capitalize"
                            {...register("lastName", {
                                required: "Last name is required",
                                validate: (value) =>
                                    value.trim() !== "" || "Last name is required",
                            })}
                            error={errors.lastName}
                        />
                    </InputGroup>

                    <InputGroup className="grid-cols-2">
                        <FormInput
                            type="email"
                            id="email"
                            placeholder="Write your email"
                            label="email"
                            labelClassName="text-xs capitalize"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: EMAIL_REGEX,
                                    message: "Invalid email",
                                },
                            })}
                            error={errors.email}
                        />
                        <FormInput
                            type="tel"
                            id="phone"
                            placeholder="Write your number"
                            label="phone"
                            labelClassName="text-xs capitalize"
                            {...register("phone", {
                                required: "Phone is required",
                                pattern: {
                                    value: PHONE_REGEX,
                                    message: "Invalid phone number",
                                },
                            })}
                            error={errors.phone}
                        />
                    </InputGroup>

                    <InputGroup className="grid-cols-2">
                        <FormInput
                            type="password"
                            id="passowrd"
                            placeholder="Write your password"
                            label="password"
                            labelClassName="text-xs capitalize"
                            {...register("password", {
                                required: "Password is required",
                                pattern: {
                                    value: PWD_REGEX,
                                    message: "Invalid password",
                                },
                            })}
                            error={errors.password}
                        />
                        <FormInput
                            type="password"
                            id="confirm-password"
                            placeholder="confirm password"
                            label="confirm password"
                            labelClassName="text-xs capitalize"
                            {...register("confirmPassword", {
                                required: "Confirm password is required",
                                pattern: {
                                    value: PWD_REGEX,
                                    message: "Invalid confirm password",
                                },
                                validate: (value) =>
                                    value === watch("password") || "Passwords do not match",
                            })}
                            error={errors.confirmPassword}
                        />
                    </InputGroup>
                </Column>

                <Button type="submit" disabled={isPending} className="font-bold bg-primary text-white rounded-lg">
                    Create
                </Button>
            </Column>
        </form>
    );
}
