/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldError } from "react-hook-form";
import FormError from "./FormError";
import { forwardRef, ReactNode } from "react";
import Column from "./Column";

interface FormInputProps {
    type: string;
    id?: string;
    placeholder?: string;
    required?: boolean;
    label?: string | ReactNode;
    error?: FieldError;
    className?: string;
    labelClassName?: string;
    accept?: string;
    hidden?: boolean;
    defaultValue?: string;
    min?: string | number | undefined;
    max?: string | number | undefined;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    value?: any
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ type, id, placeholder, required, label, className, labelClassName, min, max, disabled, error, ...rest }, ref): JSX.Element => {
        return (
            <Column className="gap-2 w-full">
                {label && <label htmlFor={id} className={`${labelClassName}`}>
                    {label}
                </label>}
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    className={`h-12 p-4 outline-none border border-grey-2 rounded-lg placeholder:text-xs placeholder:text-grey-2 ${className}`}
                    required={required}
                    min={min}
                    max={max}
                    disabled={disabled}
                    {...rest}
                    ref={ref}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
                {error && <FormError message={error?.message} />}
            </Column>
        );
    });

FormInput.displayName = "FormInput";

export default FormInput;