import { useCurrentPage } from "../../hooks/useCurrentPage";
import { LIMIT } from "../../lib/constants";
import { Package } from "../../lib/interfaces";
import { get_orders } from "../../services/apiOrders";
import Column from "../../ui/Column";
import DataFetcher from "../../ui/DataFetcher";
import Pagination from "../../ui/Pagination";
import OrderCard from "./OrderCard";

export default function CompletedOrdersList(): JSX.Element {
    const page: number = useCurrentPage();

    return (
        <DataFetcher
            dataKey='orders'
            fetcher={get_orders}
            render={(data) => {
                const numOfPages = Math.ceil(data.count / LIMIT);

                return <Column className="py-8 px-3 justify-between flex-1 gap-y-6 lg:px-[38px]">
                    <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 2xl:w-[95%]">
                        {data?.orders?.map((order: Partial<Package>) => (
                            <OrderCard key={order.id} order={order} status="completed" />
                        ))}
                    </ul>

                    {numOfPages > 1 && <Pagination currentPage={Number(page)} totalPages={numOfPages} />}
                </Column >
            }
            }
        />
    )
}
