/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosInstance from "../lib/axios";
import { Coupon } from "../lib/interfaces";

export async function add_coupon(couponData: Partial<Coupon>): Promise<any> {
    const { data } = await axiosInstance.post('/coupons/?lang=en', couponData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return data;
}

export async function get_coupons(): Promise<any> {
    const { data } = await axiosInstance.get('/coupons/?lang=en');

    return data.coupons;
}

export async function activate_coupon(couponId: string): Promise<any> {
    const { data } = await axiosInstance.post(`/coupons/activate/${couponId}/?lang=en`);

    return data;
}

export async function deactivate_coupon(couponId: string): Promise<any> {
    const { data } = await axiosInstance.post(`/coupons/deactivate/${couponId}/?lang=en`);

    return data;
}