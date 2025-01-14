/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosInstance from "../lib/axios";
import { Address } from "../lib/interfaces";

export async function get_user_addresses(userId: string): Promise<any> {
    const { data } = await axiosInstance.get(`/addresses/users/${userId}`);

    return data.addresses;
}

export async function update_user_address(addressId: string, newAddress: Address): Promise<any> {
    const { data } = await axiosInstance.put(`/addresses/${addressId}`, newAddress, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return data;
}

export async function create_user_address(userId: string, address: Address): Promise<any> {
    const { data } = await axiosInstance.post(`/addresses/users/${userId}`, address,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        });

    return data;
}

export async function delete_user_address(addressId: string): Promise<any> {
    const { data } = await axiosInstance.delete(`/addresses/${addressId}`);

    return data;
}