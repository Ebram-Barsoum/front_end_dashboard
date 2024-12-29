/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import {
    LIMIT,
    orderMapper,
    roleMapper,
    superUserStatusMapper,
} from "../lib/constants";

export default function useQueryParams(): string {
    const [searchParams, setSearchParams] = useSearchParams();

    let role = roleMapper[searchParams.get("role") || ""];
    const order = orderMapper[searchParams.get("order") || ""];
    const status = superUserStatusMapper[searchParams.get("status") || ""];
    const active = status === 1 || status === 0;
    const [month, year] = searchParams.get("date")?.split("/") || "";
    const search = searchParams.get("search") || "";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || String(LIMIT);
    let subRole: string = "";

    if (role?.includes('-')) {
        [role, subRole] = role.split('-');
    }

    const params = useMemo(() => {
        const buildQueryParam = (key: string, value: string | number | boolean): string => {
            if (value === undefined) return "";
            return `${key}=${value}`;
        }

        return [
            buildQueryParam("role", role),
            subRole ? buildQueryParam("subRole", subRole) : undefined,
            buildQueryParam("order", order),
            active ? buildQueryParam("active", status) : "",
            buildQueryParam("month", month),
            buildQueryParam("year", year),
            buildQueryParam("search", search),
            buildQueryParam("page", page),
            buildQueryParam("limit", limit),
        ].filter(Boolean).join("&");
    }, [role, subRole, order, status, month, year, search, page, limit, active]);


    useMemo(() => {
        if (page !== "1") {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.set("page", "1");
                return newParams;
            });
        }

    }, [role, order, status, active, month, year, search]);


    return params;
}

