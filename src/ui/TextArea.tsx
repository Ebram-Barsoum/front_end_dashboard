import { forwardRef } from "react";
import Column from "./Column";
import { FieldError } from "react-hook-form";
import FormError from "./FormError";

interface TextAreaProps {
    id?: string;
    label?: string;
    placeholder?: string;
    value?: string;
    className?: string;
    labelClassName?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error?: FieldError;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({ id, label, placeholder, value, className, labelClassName, onChange, error, ...rest }: TextAreaProps, ref): JSX.Element => {
    return <Column className="gap-2">
        <label htmlFor={id} className={labelClassName}>{label}</label>
        <textarea
            id={id}
            placeholder={placeholder}
            value={value}
            className={`w-full h-[150px] p-4 border rounded-xl resize-none outline-none placeholder:text-xs placeholder:text-grey-2  ${className}`}
            onChange={onChange}
            ref={ref}
            {...rest}
        ></textarea>
        {error && <FormError message={error.message} />}
    </Column>
});

export default TextArea;