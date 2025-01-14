/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../lib/axios";
import { AppUser } from "../lib/interfaces";

const roleMapper: Record<string, string> = {
    'CUSTOMER': 'customer',
    'OWNER': 'owner'
}

const typeMapper: Record<string, string> = {
    'INDIVIDUAL': 'individual',
    'CORPORATION': 'corporation'
}

export async function create_app_user(user: AppUser): Promise<any> {
    const { role, type, ...rest } = user;
    const contentType = role === "OWNER" || type === "CORPORATION" ? "multipart/form-data" : "application/json";

    const { data } = await axiosInstance.post(`/users/register/${roleMapper[role]}/${typeMapper[type]}?lang=en`, rest, {
        headers: {
            'Content-Type': contentType
        }
    });


    return data;
}

export async function get_app_users(params: string): Promise<any> {
    const { data } = await axiosInstance.get(`/users?${params}`);

    return data.users;
}


export async function delete_app_user(id: string): Promise<any> {
    const { data } = await axiosInstance.delete(`/users/${id}?lang=en`);

    return data;
}

export async function update_app_user(id: string, user: Partial<AppUser>): Promise<any> {
    const { data } = await axiosInstance.put(`/users/${id}?lang=en`, user, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return data;
}

export async function approve_app_user(userId: string): Promise<any> {
    const { data } = await axiosInstance.post(`/users/approve/${userId}?lang=en`);

    return data.user;
}

export async function disapprove_app_user(userId: string): Promise<any> {
    const { data } = await axiosInstance.post(`/users/disapprove/${userId}?lang=en`);

    return data.user;
}
