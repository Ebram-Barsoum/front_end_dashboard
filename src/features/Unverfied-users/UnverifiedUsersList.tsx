import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DataFetcher from "../../ui/DataFetcher";
import { get_app_users } from "../../services/apiAppUsers";
import UsersList from "../../ui/UsersList";

export default function UnverifiedUsersList(): JSX.Element {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        searchParams.set("approvalStatus", "Pending");
        setSearchParams(searchParams);
    }, [searchParams, setSearchParams]);

    return <DataFetcher dataKey='unverified-users' fetcher={get_app_users} render={(data) => <UsersList data={data} />} />
}
