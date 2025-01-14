import { orderOptions } from "../lib/constants";

import { orderIconMapper } from "./DashboardUsers";
import UncompletedOffersList from "../features/Uncompleted-offers/UncompletedOffersList";
import AddPackageButton from "../features/Package/AddPackageButton";

import ViewActions from "../ui/ViewActions";
import ActionsLeft from "../ui/ActionsLeft";
import ActionsRight from "../ui/ActionsRight";
import Filter from "../ui/Filter";
import MonthFilter from "../ui/MonthFilter";
import Search from "../ui/Search";
import VLine from "../ui/VLine";

import Column from "../ui/Column";
import SortingIcon from "../icons/SortingIcon";



export default function IncompletedOrders(): JSX.Element {
    return (
        <Column className="h-full">
            <ViewActions className="lg:px-[38px]">
                <ActionsLeft>
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

            <UncompletedOffersList />
        </Column>
    )
}
