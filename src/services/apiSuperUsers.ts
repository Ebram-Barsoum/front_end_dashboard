/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../lib/axios";
import { AppUser, CSAvailablity, SuperUser } from "../lib/interfaces";

export async function create_super_user(superUser: Partial<SuperUser>): Promise<any> {
    const { data } = await axiosInstance.post(`/super-users/?lang=en`, superUser,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return data;
}

export async function get_super_users(params: string): Promise<any> {
    const { data } = await axiosInstance.get(`/super-users?${params}`,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return { users: [...data.superUsers.superUsers], count: data.superUsers.count };
}

export async function update_super_user(id: string, newData: Partial<SuperUser | AppUser>): Promise<any> {
    const { data } = await axiosInstance.put(`/super-users/${id}?lang=en`, newData, {
        headers: {
            "Content-Type": 'multipart/form-data'
        }
    });

    return data;
}

export async function update_customer_support_availablity(id: string, newData: Partial<CSAvailablity>): Promise<any> {
    const { data } = await axiosInstance.patch(`/super-users/availability/${id}?lang=en`, newData, {
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return data;
}
