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

export async function create_app_user(user: AppUser) {
    const { role, type, ...rest } = user;
    const contentType = role === "OWNER" || type === "CORPORATION" ? "multipart/form-data" : "application/json";

    const { data } = await axiosInstance.post(`/users/register/${roleMapper[role]}/${typeMapper[type]}?lang=en`, rest, {
        headers: {
            'Content-Type': contentType
        }
    });


    return data;
}

export async function get_app_users(params: string) {
    const { data } = await axiosInstance.get(`/users?${params}`);

    return data.users;
}


export async function delete_app_user(id: string) {
    const { data } = await axiosInstance.delete(`/users/${id}?lang=en`);

    return data;
}