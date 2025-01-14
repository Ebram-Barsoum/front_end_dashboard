import { FilterOption } from "./interfaces";

export const EMAIL_REGEX =
    /^([a-zA-Z][0-9._%+-]*)+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PWD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
export const PHONE_REGEX = /^\+201[0-25]\d{8}$/;
export const STREET_REGEX = /.*\d+.*/;
export const TRUCK_NUMBER_REGEX = /^\d{4}\s[أ-ي]\s[أ-ي]\s[أ-ي]$/;
export const COUPON_REGEX = /^[A-Z0-9]+$/;

export const roleFilterOptions: FilterOption[] = [
    {
        value: "all",
    },
    {
        value: "admin",
    },
    {
        value: "manager",
    },
    {
        value: "support",
    },
];

export const statusFilterOption: FilterOption[] = [
    {
        value: "all",
    },
    {
        value: "active",
        icon: "<ActiveIcon />",
    },
    {
        value: "inactive",
        icon: "<InactiveIcon />",
    },
];

export const orderOptions: FilterOption[] = [
    {
        value: "desc",
    },
    {
        value: "asc",
    },
];

export const banStatusFilterOptions: FilterOption[] = [
    {
        value: "All-users",
    },
    {
        value: "Banned",
    },
    {
        value: "Not-banned",
    }
]

export const approvalStatusFilterOptions: FilterOption[] = [
    { value: "Pending" },
    { value: "Disapproved" }
]

export const banStatusMapper: Record<string, string> = {
    "Banned": "1",
    "Not-banned": "0"
}

export const accountTypeFilterOtions = [
    {
        value: "all app users",
    },
    {
        value: "c-individual",
    },
    {
        value: "c-corporation",
    },
    {
        value: "o-individual",
    },
    {
        value: "o-corporation",
    },
];

export const roleMapper: Record<string, string> = {
    admin: "Admin",
    manager: "Manager",
    support: "Customer Support",
    "c-individual": "CUSTOMER-INDIVIDUAL",
    "c-corporation": "CUSTOMER-CORPORATION",
    "o-individual": "OWNER-INDIVIDUAL",
    "o-corporation": "OWNER-CORPORATION",
};

export const orderMapper: Record<string, string> = {
    asc: "ASC",
    desc: "DESC",
};


export const superUserStatusMapper: Record<string, number> = {
    active: 1,
    inactive: 0,
};

export const cities: Set<string> = new Set([
    "Cairo",
    "Alexandria",
    "Giza",
    "Qalyubia",
    "Gharbia",
    "Menoufia",
    "Dakahlia",
    "Damietta",
    "Port Said",
    "Suez",
    "Ismailia",
    "Sharqia",
    "Kafr El Sheikh",
    "Beheira",
    "Matrouh",
    "Fayoum",
    "Beni Suef",
    "Minya",
    "Assiut",
    "Sohag",
    "Qena",
    "Luxor",
    "Aswan",
    "Red Sea",
    "North Sinai",
    "South Sinai",
    "New Valley",
]);

export const Trucks: Set<string> = new Set([
    "Tank",
    "Jumbo",
    "Closed Quarter",
    "Closed Half",
    "Trailer",
    "Tanker",
    "Refrigerator",
    "Container",
    "Flatbed",
]);

export const ShipmentTypes: Set<string> = new Set([
    "Liquid",
    "Gas",
    "Temperature Sensitive",
    "Others",
]);

export const days: Set<string> = new Set([
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
]);

export const daysMapper: Record<string, string> = {
    "Sat": "Saturday",
    "Sun": "Sunday",
    "Mon": "Monday",
    "Tue": "Tuesday",
    "Wed": "Wednesday",
    "Thu": "Thursday",
    "Fri": "Friday",
}

export const tableRowStyle = {
    labelStyle: "py-2 ps-[10px] border-r-stroke ",
    valueStyle: "py-2 px-[10px] text-black",
    className: " border-b border-stroke last:border-b-0 items-center py-0",
};

export const dataTableStyle =
    "border border-stroke rounded-xl py-3 px-4 bg-card";

export const PrimaryButtonStyle = "bg-primary rounded-lg text-white text-base font-bold flex-1";
export const secondaryButtonStyle = "bg-secondary rounded-lg text-white text-base font-bold flex-1";

export const userDataInputs = [
    {
        id: "name",
        name: "name",
        label: "name",
        type: "text",
        validation: {
            required: "Name is required",
        }
    },
    {
        id: "phone",
        name: "phone",
        label: "phone",
        type: "tel",
        validation: {
            required: "Phone is required",
            pattern: {
                value: PHONE_REGEX,
                message: "Invalid phone number"
            }
        }
    },
    {
        id: "email",
        name: "email",
        label: "email",
        type: "email",
        validation: {
            required: "Email is required",
            pattern: {
                value: EMAIL_REGEX,
                message: "Invalid email address"
            }
        }
    }
]

export const addressInputs = [
    {
        id: "street",
        name: "street",
        type: "text",
        label: "Street",
        validation: {
            required: "Street is required",
            pattern: {
                value: STREET_REGEX,
                message: "Street must have a number"
            }
        },
    },
    {
        id: "area",
        name: "area",
        type: "text",
        label: "Area",
        validation: {
            required: "Area is required",
        },
    },
    {
        id: "district",
        name: "district",
        type: "text",
        label: "District",
        validation: {
            required: "District is required",
        },
    },
    {
        id: "landmark",
        name: "landmark",
        type: "text",
        label: "Landmark",
        validation: {
            required: "Landmark is required",
        },
    },
];


export const shiftsColors: string[] = [
    '#FF765B',
    '#EDEDED',
    '#709EA8',
    '#A6A6A6'
];

export const orderStatusMapper: Record<string, string> = {
    'Pending payment': 'PENDING_PAYMENT',
    'order': 'ORDER',
    'In production': 'IN_PRODUCTION',
    'Completed': 'COMPLETED',
    'Canceled': 'CANCELED'
}

export const regions: string[] = [
    'saied',
    'delta'
]

export const LIMIT = 2;
