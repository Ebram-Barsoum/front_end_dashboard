import axiosInstance from "../lib/axios";
import { SuperUser } from "../lib/interfaces";

import { ProfilesValues } from "./apiSelfProfile";

export async function create_super_user(superUser: Partial<SuperUser>) {
    const { data } = await axiosInstance.post(`/super-users/?lang=en`, superUser,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return data;
}

export async function get_super_users(params: string) {
    const { data } = await axiosInstance.get(`/super-users?${params}`,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return { users: [...data.superUsers.superUsers], count: data.superUsers.count };
}

export async function update_super_user(id: string, newData: Partial<ProfilesValues>) {
    console.log(id, newData);

    const { data } = await axiosInstance.put(`/super-users/${id}?lang=en`, newData, {
        headers: {
            "Content-Type": 'multipart/form-data'
        }
    });

    return data;
}
