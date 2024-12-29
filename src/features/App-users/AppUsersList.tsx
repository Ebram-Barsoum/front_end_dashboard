import { get_app_users } from "../../services/apiAppUsers";

import DataFetcher from "../../ui/DataFetcher";
import UsersList from "../../ui/UsersList";

export default function AppUsersList(): JSX.Element {
    return <DataFetcher
        dataKey="app-users"
        fetcher={get_app_users}
        render={(data) => <UsersList data={data} />}
    />
}
