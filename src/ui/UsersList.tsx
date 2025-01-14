/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy } from "react";
import { useSearchParams } from "react-router-dom";

import { LIMIT } from "../lib/constants";
import { UserCardValues } from "../lib/interfaces";

const UserCard = lazy(() => import("./UserCard"));

import Pagination from "./Pagination";
import Grid from "./Grid";
import Column from "./Column";

interface UsersListProps {
    data: any,
}

export default function UsersList({ data }: UsersListProps): JSX.Element {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || "1";

    const numOfPages = Math.ceil(data.count / LIMIT);

    return (
        <Column className="py-8 px-3 justify-between flex-1 gap-y-6 lg:px-[38px]">
            <Grid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 2xl:w-[95%]">
                {data.users.map((user: UserCardValues) => (
                    <UserCard key={user.id} {...user} />
                ))}
            </Grid>

            {numOfPages > 1 && <Pagination currentPage={Number(page)} totalPages={numOfPages} />}
        </Column >
    )
}
