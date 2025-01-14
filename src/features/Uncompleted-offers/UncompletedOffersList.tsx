import { get_uncompleted_offers } from "../../services/apiOffers";

import { useCurrentPage } from "../../hooks/useCurrentPage";

import { Package } from "../../lib/interfaces";
import { LIMIT } from "../../lib/constants";

import DataFetcher from "../../ui/DataFetcher";
import Pagination from "../../ui/Pagination";
import OrderCard from "../Completed-orders/OrderCard";

import Column from "../../ui/Column";

export default function UncompletedOffersList(): JSX.Element {
    const page: number = useCurrentPage();

    return (
        <DataFetcher
            dataKey='uncompleted-orders'
            fetcher={get_uncompleted_offers}
            render={(data) => {
                const numOfPages = Math.ceil(data.count / LIMIT);

                return <Column className="py-8 px-3 justify-between flex-1 gap-y-6 lg:px-[38px]">
                    <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 2xl:w-[95%]">
                        {data?.offers?.map((order: Partial<Package>) => (
                            <OrderCard key={order.id} order={order} status="uncompleted" />
                        ))}
                    </ul>

                    {numOfPages > 1 && <Pagination currentPage={Number(page)} totalPages={numOfPages} />}
                </Column >
            }}
        />
    )
}
