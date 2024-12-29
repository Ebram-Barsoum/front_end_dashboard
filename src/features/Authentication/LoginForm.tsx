import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { EMAIL_REGEX, PWD_REGEX } from "../../lib/constants";
import { login } from "../../services/apiAuth";
import { useAuth } from "../../contexts/AuthContext";

import Button from "../../ui/Button";
import Column from "../../ui/Column";
import InputGroup from "../../ui/InputGroup";
import FormInput from "../../ui/FormInput";
import { handleMutationError } from "../../lib/healpers";

interface FormData {
    email: string;
    password: string;
}

export default function LoginForm(): JSX.Element {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const { mutate, isPending } = useMutation({
        mutationKey: ["auth-data"],
        mutationFn: ({ email, password }: FormData) => login(email, password),
    });

    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    if (auth?.authToken) navigate("/");

    const handleLogin: SubmitHandler<FormData> = (data: FormData) => {
        mutate(
            { ...data },
            {
                onSuccess: (response) => {
                    setAuth(response);
                    navigate("/", { replace: true });
                },
                onError: (error) => {
                    const fallbackError = "Failed to login";
                    handleMutationError(error, fallbackError);
                }
            }
        );
    };

    const inputCustomStyle: string = 'placeholder:text-stroke border-stroke h-[56px]';

    return (
        <form
            onSubmit={handleSubmit(handleLogin)}
            className="flex flex-col gap-6 p-4 w-[100%] sm:w-[23.5rem]"
        >
            <Column className="justify-center gap-0 text-center">
                <h1 className="text-secondary text-[26px] font-bold">Sign in</h1>
                <p className="text-lg mb-2">Log in to your account</p>
            </Column>

            <Column className="gap-4">
                <InputGroup>
                    <FormInput
                        id="email"
                        type="email"
                        placeholder="ahmed20@gmail.com"
                        label="email"
                        labelClassName="text-base"
                        className={inputCustomStyle}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: EMAIL_REGEX,
                                message: "Invalid email address",
                            },
                        })}
                        error={errors.email}
                    />
                </InputGroup>

                <InputGroup>
                    <FormInput
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        label="password"
                        labelClassName="text-base"
                        className={inputCustomStyle}
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters long",
                            },
                            pattern: {
                                value: PWD_REGEX,
                                message:
                                    "It must contain at least one capital, one small, one number and one special character with 8 min length",
                            },
                        })}
                        error={errors.password}
                    />
                </InputGroup>

                <Link
                    to="/auth/verification"
                    className="text-secondary text-base underline ms-2 mt-[-8px]"
                >
                    Forget your password ?
                </Link>

                <Button
                    type="submit"
                    className="font-bold text-[18px] h-[56px] bg-primary text-white rounded-lg"
                    disabled={isPending}
                >
                    Login
                </Button>
            </Column>
        </form>
    );
}
