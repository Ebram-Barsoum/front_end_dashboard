
import { orderOptions, roleFilterOptions, statusFilterOption } from "../lib/constants";

import Filter from "../ui/Filter";
import MonthFilter from "../ui/MonthFilter";

import UserIcon from "../icons/UserIcon";
import AddUserIcon from "../icons/AddUserIcon";
import StatusIcon from "../icons/StatusIcon";
import SortingIcon from "../icons/SortingIcon";

import ViewActions from "../ui/ViewActions";
import VLine from "../ui/VLine";
import Column from "../ui/Column";
import ActionsLeft from "../ui/ActionsLeft";
import AddUserButton from "../ui/AddUserButton";
import Search from "../ui/Search";
import ActionsRight from "../ui/ActionsRight";

import DashboardUsersList from "../features/Dashboard-users/DashboardUsersList";
import { ReactNode } from "react";
import ActiveIcon from "../icons/ActiveIcon";
import InactiveIcon from "../icons/InactiveIcon";
import ArrowDownIcon from "../icons/ArrowDownIcon";
import ArrowUpIcon from "../icons/ArrowUpIcon";
import AddSuperUserForm from "../features/Dashboard-users/AddSuperUserForm";

const statusFilterIconMapper: Record<string, ReactNode> = {
    active: <ActiveIcon />,
    inactive: <InactiveIcon />,
};

const orderIconMapper: Record<string, ReactNode> = {
    desc: <ArrowDownIcon />,
    asc: <ArrowUpIcon />,
}

export default function DashboardUsers(): JSX.Element {
    return (
        <Column className="h-full">
            <ViewActions className="lg:px-[38px]">
                <ActionsLeft>
                    <Filter
                        filterBy="role"
                        label="position"
                        options={roleFilterOptions}
                        icon={<UserIcon />}
                        className="h-[42px] ps-3 py-1 rounded-xl"
                    />

                    <Filter
                        filterBy="status"
                        options={statusFilterOption}
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
                    <VLine />

                    <MonthFilter />


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
                        <AddSuperUserForm />
                    </AddUserButton>
                </ActionsRight>
            </ViewActions>

            <DashboardUsersList />
        </Column>
    );
}

export { statusFilterIconMapper, orderIconMapper };