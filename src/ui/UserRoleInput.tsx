import { forwardRef, ReactNode } from "react";

interface UserRoleInputProps {
    id: string;
    name: string;
    value: string;
    label: string | ReactNode;
    className?: string;
}

const UserRoleInput = forwardRef<HTMLInputElement, UserRoleInputProps>(
    ({ id, name, value, label, className, ...rest }, ref) => {
        return (
            <>
                <input
                    id={id}
                    ref={ref}
                    {...rest}
                    type="radio"
                    name={name}
                    value={value}
                    hidden
                />
                <label
                    htmlFor={id}
                    className={`text-grey-3 border border-grey-2 rounded-lg p-4 cursor-pointer ${className}`}
                >
                    {label}
                </label>
            </>
        );
    }
);
export default UserRoleInput;
