/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosInstance from "../lib/axios";

export async function get_uncompleted_offers(params: string): Promise<any> {
    const { data } = await axiosInstance.get(`/offers/incompleted?lang=en&${params}`);

    return data;
}

export async function get_uncompleted_offer_details(offerId: string): Promise<any> {
    const { data } = await axiosInstance.get(`/offers/${offerId}/details`);

    return data.offer;
}