import { get_coupons } from "../../services/apiCoupon";

import DataFetcher from "../../ui/DataFetcher";
import CouponCard from "./CouponCard";

import Column from "../../ui/Column";
import Row from "../../ui/Row";

export default function CouponList(): JSX.Element {
    return (
        <Column className="gap-4">
            <Row as={"h1"} className="text-[14px] ms-4">
                Coupons History
            </Row>

            <DataFetcher
                dataKey="coupons"
                fetcher={get_coupons}
                render={(coupons): JSX.Element => {
                    return (
                        <div className="grid grid-cols-2 gap-4 content-center">
                            {coupons.map((coupon) => (
                                <CouponCard key={coupon.id} coupon={coupon} />
                            ))}
                        </div>
                    );
                }}
            />
        </Column>
    );
}
