import axiosInstance from "../lib/axios";

export async function ban_app_user(id: string, reason: string) {
    const { data } = await axiosInstance.post(`/bans/${id}?lang=en`, { reason });

    return data;
}

export async function unban_app_user(id: string) {
    const { data } = await axiosInstance.delete(`/bans/${id}?lang=en`);

    return data;
}

export async function ban_super_user(id: string, reason: string) {
    const { data } = await axiosInstance.post(`/super-users/bans/${id}?lang=en`, { reason });

    return data;
}

export async function unban_super_user(id: string) {
    const { data } = await axiosInstance.delete(`/super-users/bans/${id}?lang=en`);

    return data;
}
