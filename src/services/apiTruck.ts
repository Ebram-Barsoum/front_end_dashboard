/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../lib/axios";
import { Truck } from "../lib/interfaces";

export async function get_user_trucks(userId: string, params: string): Promise<any> {
    const { data } = await axiosInstance.get(`/trucks/users/${userId}?${params}`);

    return data;
}

export async function get_owner_truck_types(ownerId: string): Promise<any> {
    const { data } = await axiosInstance.get(`/trucks/users/${ownerId}/truck-types?lang=en`);

    return data.truckTypes;
}

export async function create_truck(ownerId: string, truckData: Truck): Promise<any> {
    const { data } = await axiosInstance.post(`/trucks/${ownerId}?lang=en`, truckData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return data;
}

export async function update_truck(truckId: string, newTruckData: Partial<Truck>): Promise<any> {
    const { data } = await axiosInstance.put(`/trucks/${truckId}`, newTruckData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return data;
}


export async function delete_truck(truckId: string): Promise<any> {
    const { data } = await axiosInstance.delete(`/trucks/${truckId}`);

    return data;
}