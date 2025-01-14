/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, ReactNode, useState } from "react";
import { toast } from "react-toastify";

interface CustomeDropDownProps {
    label?: string;
    labelStyle?: string;
    placeholder?: string;
    className?: string;
    width?: string;
    placeholderIcon?: ReactNode;
    options: string[];
    multiple?: boolean;
    max?: number;
    limitMessage?: string
    value?: string | null;
    onChange?: (option: any) => void
}

const CustomeDropDown = forwardRef<HTMLDivElement, CustomeDropDownProps>(
    (
        {
            label,
            labelStyle,
            placeholder,
            placeholderIcon,
            className,
            width,
            options,
            multiple = false,
            max,
            limitMessage,
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
                    const newOptions = value.split(',').filter((item) => {
                        if (item !== option) return item.trim();
                    }).join(',');
                    onChange?.(newOptions);
                }
                else {
                    if (max !== undefined && value?.split(',').length === max) {
                        toast.error(limitMessage);
                        return;
                    }

                    const newOptions: string[] = (value as string).split(',').filter((option) => {
                        if (option !== '') return option.trim();
                    });
                    newOptions.push(option);
                    onChange?.(newOptions.join(','));
                }
            }
        }

        const isSelected = (option: string) => {
            return value === option || value?.includes(option);
        }

        return (
            <div className={`flex flex-col gap-2`} style={{ width }}>
                {label && (
                    <p className={labelStyle}>
                        {label}
                    </p>
                )}
                <div
                    ref={ref}
                    {...rest}
                    className={`relative `}
                    style={{ width }}
                >
                    <button
                        type="button"
                        className={`border h-12  
                        ${className}`}
                        onClick={toggleMenu}
                        style={{ width }}
                    >
                        {value ? <span className={`text-black whitespace-nowrap overflow-hidden text-ellipsis`}>{value}</span> : placeholder}
                        {placeholderIcon && placeholderIcon}
                    </button>

                    {displaMenu && <ul className={`flex flex-col gap-1 max-h-[10rem] bg-light mt-4 absolute overflow-auto z-50`} style={{ width }}>
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
                    </ul>}
                </div>
            </div>
        );
    }
);

export default CustomeDropDown;
