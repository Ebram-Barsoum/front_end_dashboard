/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../lib/axios";
import { Settings } from "../lib/interfaces";

export async function get_app_settings(): Promise<any> {
    const { data } = await axiosInstance.get("/app-settings?lang=en");

    return data;
}

export async function update_app_settings(newSettings: Settings): Promise<any> {
    const { data } = await axiosInstance.put('/app-settings?lang=en', newSettings, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return data;
}