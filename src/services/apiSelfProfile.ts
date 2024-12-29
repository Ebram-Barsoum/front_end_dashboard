import axiosInstance from "../lib/axios";

export interface ProfilesValues {
    profileImage?: File;
    email: string;
    phone: string;
    city: string;
    password: string;
}

export async function update_self_profile(newUserData: ProfilesValues) {
    const { data } = await axiosInstance.put("/super-users?lang=en", newUserData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return data;
}