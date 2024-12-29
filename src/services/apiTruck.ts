/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../lib/axios";
import { Truck } from "../lib/interfaces";

export async function create_truck(ownerId: string, truckData: Truck): Promise<any> {
    const { data } = await axiosInstance.post(`/trucks/${ownerId}?lang=en`, truckData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return data;
}