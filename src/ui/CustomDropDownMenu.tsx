/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, ReactNode, useState } from "react";
import Column from "./Column";

interface CustomeDropDownProps {
    label?: string;
    labelStyle?: string;
    placeholder?: string;
    className?: string;
    placeholderIcon?: ReactNode;
    options: string[];
    multiple?: boolean;
    value: string | null;
    onChange?: (option: string) => void
}

const CustomeDropDown = forwardRef<HTMLDivElement, CustomeDropDownProps>(
    (
        {
            label,
            labelStyle,
            placeholder,
            placeholderIcon,
            className,
            options,
            multiple = false,
            onChange,
            value,
            ...rest
        },
        ref
    ) => {
        const [displaMenu, setDisplayMenu] = useState(false);


        const toggleMenu = () => {
            setDisplayMenu((state) => !state);
        }

        const handleSelect = (option: string) => {
            if (!multiple) {
                onChange?.(option);
                setDisplayMenu(false);
            }
            else {
                if (value?.includes(option)) {
                    const index = value.split(',').indexOf(option);
                    onChange?.(index ? value.replace(`,${option}`, '') : value.replace(option, ''));
                }
                else {
                    onChange?.(value ? `${value},${option}` : option);
                }
            }
        }

        const isSelected = (option: string) => {
            return value === option || value?.includes(option);
        }

        return (
            <Column className="gap-2">
                {label && (
                    <p className={labelStyle}>
                        {label}
                    </p>
                )}
                <div
                    ref={ref}
                    {...rest}
                    className="relative"

                >
                    <button
                        type="button"
                        className={`border h-12 w-full 
                        ${className}`}
                        onClick={toggleMenu}

                    >
                        {value ? <span className="text-black text-base whitespace-nowrap overflow-hidden text-ellipsis">{value}</span> : placeholder}
                        {placeholderIcon && placeholderIcon}
                    </button>

                    {displaMenu && <Column as={'ul'} className="gap-1 w-[100%] max-h-[10rem] bg-light mt-4 z-10 absolute overflow-auto">
                        {options.map((option) => (
                            <li
                                key={option}
                                value={option}
                                className={`py-1 px-3 cursor-pointer hover:bg-primary hover:text-white ${isSelected(option) && 'bg-primary text-white'}`}
                                onClick={() => handleSelect(option)}
                            >
                                {option}
                            </li>
                        ))}
                    </Column>}
                </div>
            </Column>
        );
    }
);

export default CustomeDropDown;
