import { get_discounts } from "../../services/apiDiscount";

import { Discount } from "../../lib/interfaces";

import DiscountCard from "./DiscountCard";
import DataFetcher from "../../ui/DataFetcher";
import Grid from "../../ui/Grid";
import Column from "../../ui/Column";
import Row from "../../ui/Row";

export default function DiscountsList(): JSX.Element {
    return (
        <DataFetcher
            dataKey={"discounts"}
            fetcher={get_discounts}
            render={(data: Discount[]) => {
                return (
                    <Column className="gap-4">
                        <Row as={'h1'} className="ps-4 text-[14px]">Offers History</Row>
                        <Grid className="grid-cols-2 gap-4">
                            {data.map((discount: Discount) => {
                                return (
                                    <DiscountCard
                                        key={discount.id}
                                        {...discount}
                                    />
                                );
                            })}
                        </Grid>
                    </Column>
                );
            }}
        />
    );
}
