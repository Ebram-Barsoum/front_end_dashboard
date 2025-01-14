/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
    banStatusMapper,
    LIMIT,
    orderMapper,
    roleMapper,
    superUserStatusMapper,
} from "../lib/constants";

export default function useQueryParams(): string {
    const [searchParams, setSearchParams] = useSearchParams();
    const [params, setParams] = useState<string>('');

    let role = roleMapper[searchParams.get("role") || ""];
    const order = orderMapper[searchParams.get("order") || ""];
    const status = superUserStatusMapper[searchParams.get("status") || ""];
    const active = status === 1 || status === 0;
    const [month, year] = searchParams.get("date")?.split("/") || "";
    const search = searchParams.get("search") || "";
    const banned = banStatusMapper[searchParams.get("banned") || ""] || "";
    const approvalStatus = searchParams.get("approvalStatus") || "";
    const orderStatus = (searchParams.get("orderStatus") !== "all" && searchParams.get("orderStatus")) ? searchParams.get("orderStatus") : "";

    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || String(LIMIT);
    let subRole: string = "";

    if (role?.includes("-")) {
        [role, subRole] = role.split("-");
    }

    useEffect(() => {
        const buildQueryParam = (
            key: string,
            value: string | number | boolean
        ): string => {
            if (value === undefined) return "";
            return `${key}=${value}`;
        };

        const newParams = [
            buildQueryParam("role", role),
            subRole ? buildQueryParam("subRole", subRole) : undefined,
            buildQueryParam("order", order),
            banned ? buildQueryParam("banned", banned) : undefined,
            active ? buildQueryParam("active", status) : "",
            buildQueryParam("month", month),
            buildQueryParam("year", year),
            search !== "" ? buildQueryParam("search", search) : undefined,
            buildQueryParam("limit", limit),
            approvalStatus != "" ? buildQueryParam("approvalStatus", approvalStatus) : undefined,
            orderStatus != "" ? buildQueryParam("orderStatus", orderStatus as string) : undefined,
        ]
            .filter(Boolean)
            .join("&");

        // reset page to 1 when params change
        setParams(`${newParams}&page=1`);
        searchParams.set("page", "1");
        setSearchParams(searchParams)

    }, [role, subRole, order, status, banned, month, year, search, active, approvalStatus, orderStatus]);


    useEffect(() => {
        // Update only the `page` parameter in `params` when the page changes
        setParams((prevParams) => {
            const arrParams = prevParams.split("&");
            const updatedParams = arrParams.map((param) => {
                if (param.startsWith("page=")) {
                    return `page=${page}`;
                }
                return param;
            });
            return updatedParams.join("&");
        });

        // Update `page` in URL without affecting other params
        searchParams.set("page", page);
        setSearchParams(searchParams);
    }, [page, setSearchParams, searchParams, params]);


    return params;
}
