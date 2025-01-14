/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../lib/axios";

export async function get_orders(params: string): Promise<any> {
    const { data } = await axiosInstance.get(`/orders?lang=en&${params}`);

    return data;
}

export async function delete_order(orderNumber: number): Promise<any> {
    const { data } = await axiosInstance.delete(`/orders/${orderNumber}?lang=en`);

    return data;
}


export async function get_order_details(orderNumber: number): Promise<any> {
    const { data } = await axiosInstance.get(`/orders/${orderNumber}/details?lang=en`);

    return data;
}
