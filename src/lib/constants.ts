import { FilterOption } from "./interfaces";


export const EMAIL_REGEX = /^([a-zA-Z][0-9._%+-]*)+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PWD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
export const PHONE_REGEX = /^\+201[0-25]\d{8}$/;
export const STREET_REGEX = /.*\d+.*/;
export const TRUCK_NUMBER_REGEX = /^\d{4}\s[أ-ي]\s[أ-ي]\s[أ-ي]$/;


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
        icon: '<ActiveIcon />',
    },
    {
        value: "inactive",
        icon: '<InactiveIcon />',
    },
];

export const orderOptions: FilterOption[] = [
    {
        value: 'desc',
    },
    {
        value: 'asc',
    }
]

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
    }
]

export const roleMapper: Record<string, string> = {
    "admin": "Admin",
    "manager": "Manager",
    "support": "Customer Support",
    "c-individual": "CUSTOMER-INDIVIDUAL",
    "c-corporation": "CUSTOMER-CORPORATION",
    "o-individual": "OWNER-INDIVIDUAL",
    "o-corporation": "OWNER-CORPORATION"
}

export const orderMapper: Record<string, string> = {
    "asc": "ASC",
    "desc": "DESC",
}

export const superUserStatusMapper: Record<string, number> = {
    "active": 1,
    "inactive": 0,
}

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
    "Flatbed"
]);

export const ShipmentTypes: Set<string> = new Set([
    "Liquid",
    "Gas",
    "Temperature Sensitive",
    "Others",
]);

export const LIMIT = 2;



