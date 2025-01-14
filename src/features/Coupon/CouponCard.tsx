import { Coupon } from "../../lib/interfaces";

import ActivateCouponButton from "./ActivateCouponButton";
import DeactivateCouponButton from "./DeactivateCouponButton";

import Column from "../../ui/Column";
import Row from "../../ui/Row";

interface CouponProps {
    coupon: Coupon
}

export default function CouponCard({ coupon }: CouponProps): JSX.Element {
    const { id, isActive, description, percentage, fixedAmount } = coupon;

    return <Column className="gap-4 bg-card rounded-lg p-3 border border-stroke ">
        <Column className="gap-2">
            <Row className="text-[12px]">{description}</Row>
            <Row className="text-primary text-[22px] font-bold">{percentage ? `${percentage * 100}%` : `${fixedAmount}EGP`}</Row>
        </Column>

        {isActive ? <DeactivateCouponButton id={id as string} /> : <ActivateCouponButton id={id as string} />}
    </Column>
}