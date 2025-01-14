/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Day, Shift, ShiftDay } from "./interfaces";
import { shiftsColors } from "./constants";

export function formatDate(date: Date) {
    return Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',

    }).format(new Date(date));
}

export function formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
}

export function formatTimeTo12(time: string): string {
    const [hours, minutes,] = time.split(':');

    return Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(new Date(`1970-01-01T${hours}:${minutes}:00`));
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

export function getDaysInCurrentMonth(): Day[] {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Get the number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create an array of days for the current month
    const days: Day[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

        days.push({
            number: day,
            name: dayName
        })
    }

    return days;
}

export function generateShiftToColorMap(shifts: Shift[]): Record<string, string> {
    const shiftToColorMap: Record<string, string> = {};

    shifts?.map((shift, index) => shiftToColorMap[shift.id as string] = shiftsColors[index % 4]);

    return shiftToColorMap;
}

export function prepareMonthShifts(days: Day[], shifts: Shift[]): Day[] {
    return days.map(day => {
        const shiftsPerDay: Shift[] = [];

        for (const shift of shifts) {
            for (const dayInShift of shift.days) {
                if ((dayInShift as ShiftDay).day === day.name.slice(0, 3)) {
                    shiftsPerDay.push(shift);
                    break;
                }
            }
        }

        return {
            ...day,
            shifts: [...shiftsPerDay]
        }
    });
}