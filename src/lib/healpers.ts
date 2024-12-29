/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export function formatDate(date: Date) {
    return Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',

    }).format(new Date(date));
}

export function handleMutationError(error: any, fallbackError: string) {

    if ((error as AxiosError).isAxiosError) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error(axiosError.response?.data?.message || axiosError.response?.data?.errors?.[0]?.msg || fallbackError);
    } else {
        toast.error(error.message || fallbackError);
    }
}

export function convertFileToImageURL(file: File | undefined): string {
    if (file) {
        return URL.createObjectURL(file);
    }

    return '';
}