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

export interface UserCardValues {
    profileImage: string;

    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    type: string;
    userType?: string;
    userSubtype?: string;
    lastSeen: Date;

    email: string;
    city: string;
    phone: string;
    createdAt: Date;

    lastSeenDate: Date
    isBanned: boolean
}

export interface SuperUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    type: string;
    profileImage: string;
    city: string;
    createdAt: Date | string;
    FCMToken: string;
    onVacation: boolean;
    isBusy: boolean;
    isBanned?: boolean;
    breakTimeStart: string | null;
    breakTimeEnd: string | null;
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
    id?: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    type: string;
    city?: string;
    area?: string;
    district?: string;
    street?: string;
    landmark?: string;
    driverLicense?: File;
    taxCard?: File;
    commercialRegister?: File;
}

export interface Truck {
    truckType: string;
    truckImage: File;
    drivingLicense: File;
    truckNumber: string;
    weight: number;
    city: string;

    driverName: string;
    driverPhone: string;
    driverLicense: File;

    secondaryDriverName?: string;
    secondaryDriverPhone?: string;
    secondaryDriverDriverLicense?: File;
}

export interface Package {
    type: string;
    shipmentImage: FileList | File;
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