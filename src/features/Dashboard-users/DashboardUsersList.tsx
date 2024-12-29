import { get_super_users } from "../../services/apiSuperUsers";


import DataFetcher from "../../ui/DataFetcher";
import UsersList from "../../ui/UsersList";

export default function DashboardUsersList(): JSX.Element {

    return <DataFetcher
        dataKey="dashboard-users"
        fetcher={get_super_users}
        render={(data) => <UsersList data={data} />}
    />;
}
