/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../lib/axios";
import { Shift, SuperUser } from "../lib/interfaces";

export async function create_shift(shiftData: Shift): Promise<any> {
    const { data } = await axiosInstance.post("/shifts?lang=en", shiftData, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    return data;
}

export async function delete_shift(shiftId: string): Promise<any> {
    const { data } = await axiosInstance.delete(`/shifts/${shiftId}?lang=en`);

    return data;
}

export async function get_system_shifts(): Promise<any> {
    const { data } = await axiosInstance.get("/shifts?lang=en");

    return data;
}

export async function get_user_shifts(userId: string): Promise<any> {
    const { data } = await axiosInstance.get(
        `/shifts/super-users/${userId}?lang=en`
    );

    return data;
}

export async function assign_user_to_shift(shiftId: string, userData: Partial<SuperUser>): Promise<any> {
    const { id, primaryBreakDay, secondaryBreakDay, breakTimeStart, breakTimeEnd } = userData;

    const { data } = await axiosInstance.put(
        `/shifts/${shiftId}/super-users/${id}?lang=en`,
        { primaryBreakDay, secondaryBreakDay, breakTimeStart, breakTimeEnd }
    );

    return data;
}

export async function remove_user_from_shift(shiftId: string, userId: string): Promise<any> {
    const { data } = await axiosInstance.delete(
        `/shifts/${shiftId}/super-users/${userId}?lang=en`
    );

    return data;
}
