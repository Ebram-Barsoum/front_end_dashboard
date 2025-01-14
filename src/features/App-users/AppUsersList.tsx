import { useSearchParams } from "react-router-dom";
import { get_app_users } from "../../services/apiAppUsers";

import DataFetcher from "../../ui/DataFetcher";
import UsersList from "../../ui/UsersList";
import { useEffect } from "react";

export default function AppUsersList(): JSX.Element {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        searchParams.set("approvalStatus", "Approved");
        setSearchParams(searchParams);
    }, [searchParams, setSearchParams]);

    return <DataFetcher
        dataKey="app-users"
        fetcher={get_app_users}
        render={(data) => <UsersList data={data} />}
    />
}
