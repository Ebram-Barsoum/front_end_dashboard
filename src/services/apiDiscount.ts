/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../lib/axios";
import { Discount } from "../lib/interfaces";

export async function add_discount(discount: Partial<Discount>): Promise<any> {
    const { data } = await axiosInstance.post('/discounts?lang=en', discount,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return data;
}

export async function get_discounts(): Promise<any> {
    const { data } = await axiosInstance.get('/discounts?lang=en');

    return data.discounts;
}

export async function activate_discount(discountId: string): Promise<any> {
    const { data } = await axiosInstance.post(`/discounts/activate/${discountId}?lang=en`);

    return data;
}

export async function deactivate_discount(discountId: string): Promise<any> {
    const { data } = await axiosInstance.post(`/discounts/deactivate/${discountId}?lang=en`);

    return data;
}