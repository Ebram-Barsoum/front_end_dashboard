import { orderOptions, orderStatusMapper } from "../lib/constants";

import { orderIconMapper, statusFilterIconMapper } from "./DashboardUsers";
import AddPackageButton from "../features/Package/AddPackageButton";

import ActionsLeft from "../ui/ActionsLeft";
import ActionsRight from "../ui/ActionsRight";
import Column from "../ui/Column";
import Filter from "../ui/Filter";
import MonthFilter from "../ui/MonthFilter";
import Search from "../ui/Search";
import VLine from "../ui/VLine";
import ViewActions from "../ui/ViewActions";

import StatusIcon from "../icons/StatusIcon";
import SortingIcon from "../icons/SortingIcon";
import CompletedOrdersList from "../features/Completed-orders/CompletedOrdersList";


const orderStatusFilterOptions = Object.keys(orderStatusMapper).map((status) => ({
    value: orderStatusMapper[status],
    name: status
}));

const all = {
    name: "All orders",
    value: "all"
}

export default function CompletedOrders(): JSX.Element {

    return (
        <Column as={'section'} className="h-full">
            <ViewActions className="lg:px-[38px]">
                <ActionsLeft>
                    <Filter
                        filterBy="orderStatus"
                        label="Order status"
                        options={[all, ...orderStatusFilterOptions]}
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

                    <MonthFilter label="Date Created" />
                </ActionsLeft>

                <ActionsRight>
                    <Search
                        param="search"
                        placeholder="Search"
                        className="h-[42px] w-full xl:w-[192px]"
                    />

                    <AddPackageButton />
                </ActionsRight>
            </ViewActions>

            <CompletedOrdersList />
        </Column>
    );
}
