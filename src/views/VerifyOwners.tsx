import { accountTypeFilterOtions, approvalStatusFilterOptions, orderOptions } from "../lib/constants";

import { orderIconMapper, statusFilterIconMapper } from "./DashboardUsers";
import AddAppUserForm from "../features/App-users/AddAppUserForm";
import UnverifiedUsersList from "../features/Unverfied-users/UnverifiedUsersList";

import AddUserIcon from "../icons/AddUserIcon";
import SortingIcon from "../icons/SortingIcon";
import StatusIcon from "../icons/StatusIcon";
import UserIcon from "../icons/UserIcon";
import ActionsLeft from "../ui/ActionsLeft";
import ActionsRight from "../ui/ActionsRight";
import AddUserButton from "../ui/AddUserButton";
import Column from "../ui/Column";
import Filter from "../ui/Filter";
import Search from "../ui/Search";
import ViewActions from "../ui/ViewActions";
import VLine from "../ui/VLine";

export default function VerifyOwners(): JSX.Element {

    return (
        <Column className="h-full">
            <ViewActions className="lg:px-[38px]">
                <ActionsLeft>
                    <Filter
                        filterBy="role"
                        label="Account Type"
                        options={accountTypeFilterOtions}
                        icon={<UserIcon />}
                        className="h-[42px] ps-3 py-1 rounded-xl"
                    />
                    <VLine />
                    <Filter
                        filterBy="approvalStatus"
                        label="Pending"
                        options={approvalStatusFilterOptions}
                        icon={<StatusIcon />}
                        iconMapper={statusFilterIconMapper}
                        className="h-[42px] ps-3 py-1 rounded-xl"
                    />
                    <VLine />

                    <Filter
                        filterBy="order"
                        label="order"
                        icon={<SortingIcon />}
                        options={orderOptions}
                        iconMapper={orderIconMapper}
                        className="h-[42px] ps-3 py- rounded-xl"
                    />

                </ActionsLeft>

                <ActionsRight>
                    <Search
                        param="search"
                        placeholder="Search"
                        className="h-[42px] w-full xl:w-[192px]"
                    />

                    <AddUserButton
                        className="bg-primary h-[42px] text-white"
                        icon={<AddUserIcon />}
                        label="Add New User"
                    >
                        <AddAppUserForm />
                    </AddUserButton>
                </ActionsRight>
            </ViewActions>

            <UnverifiedUsersList />
        </Column>
    )
}
