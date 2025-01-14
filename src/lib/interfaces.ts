import { ReactNode } from "react";

export interface Link {
    text: string;
    href: string;
    icon?: ReactNode;
}

export interface SortValue {
    name: string
    value: string;
    icon?: ReactNode
}

export interface UserCardValues extends SuperUser, AppUser {

}

export interface SuperUser {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    type: string;
    profileImage: string | File | FileList;
    city?: string;
    createdAt: Date | string;
    FCMToken?: string;
    onVacation?: boolean;
    isBusy?: boolean;
    isBanned?: boolean;
    breakTimeStart: string | null;
    breakTimeEnd: string | null;
    primaryBreakDay?: string;
    secondaryBreakDay?: string;
    lastSeenDate: Date | string;
}

export interface FilterOption {
    name?: string;
    value?: string;
    icon?: ReactNode
}

export interface AuthResponse {
    authToken: string;
    refreshToken: string
    superUser: SuperUser;
}

export interface QueryParameters {
    role: string;
    status: string;
    order: string;
    search: string;
    month: number;
    year: number;
    page: number;
}

export interface AppUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    userType: "OWNER" | "CUSTOMER";
    userSubtype: "CORPORATION" | "INDIVIDUAL";
    role: string;
    type: string;
    city?: string;
    area?: string;
    district?: string;
    street?: string;
    landmark?: string;
    driverLicense?: File | string;
    taxCard?: File | string;
    commercialRegister?: File | string;
    profileImage: string | File | FileList;
    approvalStatus: "Pending" | "Approved" | "Disapproved";
    createdAt: Date | string;
}

export interface Truck {
    id?: string;
    truckType: string;
    truckImage: File | FileList | string;
    drivingLicense: File | FileList | string;
    truckNumber: string;
    weight: number;
    city: string;

    driverName: string;
    driverPhone: string;
    driverLicense: File | FileList | string;

    secondaryDriverName?: string;
    secondaryDriverPhone?: string;
    secondaryDriverDriverLicense?: File | FileList | string;
}

export interface Package {
    id?: string;
    type: string;
    shipmentImage: FileList | File | string;
    weight: number;
    description: string;
    shippingDate: Date | string;
    truckType: string;

    shippingFromCity: string;
    shippingFromArea: string;
    shippingFromDistrict: string;
    shippingFromStreet: string;
    shippingFromLandmark: string;

    shippingToCity: string;
    shippingToArea: string;
    shippingToDistrict: string;
    shippingToStreet: string;
    shippingToLandmark: string;

    customerName: string;
    customerPhone: string;

    clientName: string;
    clientPhone: string;

    preferredTruckTypes: string | string[];
}

export interface CSAvailablity {
    onVacation: boolean;
    isBusy: boolean;
    breakTimeStart: string;
    breakTimeEnd: string;
    primaryBreakDay: string;
    secondaryBreakDay: string;
}

export interface Address {
    id?: string;
    city: string;
    area: string;
    district: string;
    street: string;
    landmark: string;
    createdAt?: string | Date
}

export interface Shift {
    id?: string;
    startTime: string;
    endTime: string;
    days: ShiftDay[];
}

export interface ShiftDay {
    id: string;
    day: string;
}

export interface Day {
    number: number;
    name: string;
    shifts?: Shift[];
}

export interface Coupon {
    id?: string;
    code: string;
    description: string;
    validFrom: Date | string;
    validTo: Date | string;
    usageLimit?: number;
    usageGlobalLimit?: number;
    percentage: number;
    fixedAmount: number;
    isActive?: boolean;
}

export interface Settings {
    userSMSLimit: number;
    shipmentSMSLimit: number;
    offerNegotiationLimit: number;
}

export interface Offer {
    id?: string;
    createdAt?: string | Date;
    offerPrice: number;
    offeredPrice?: number;
    lastUpdatedBy?: {
        userType: string;
    }
}

export interface Discount {
    id: string;

    title: string;
    description: string;

    validFrom: Date | string;
    validTo: Date | string;
    isActive?: boolean;

    percentage: number;
    fixedAmount: number;

    usageLimit: number;

    newUsers: boolean;
    shippingFromRegion?: string;
    shippingFrom?: string;
    shippingTo?: string;
}