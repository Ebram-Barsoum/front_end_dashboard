/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../lib/axios";
import { Package } from "../lib/interfaces";

export async function create_package(customerId: string, shipment: Package): Promise<any> {
    const { data } = await axiosInstance.post(`/shipments/${customerId}?lang=en`, shipment, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return data;
}