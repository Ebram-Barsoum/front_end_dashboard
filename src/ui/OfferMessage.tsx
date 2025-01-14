import { Offer } from "../lib/interfaces";
import Column from "./Column";
import Row from "./Row";

interface OfferMessageProps {
    offer: Offer;
}

export default function OfferMessage({
    offer,
}: OfferMessageProps): JSX.Element {
    console.log(offer);

    const { offeredPrice, lastUpdatedBy } = offer;
    const user: string = lastUpdatedBy?.userType?.toLowerCase() as string;

    return (
        <Column className={`gap-1 ${user === "customer" && 'ms-auto'}`}>
            <Row as={"span"} className={`text-[10px] text-grey-3 capitalize ${user === "customer" && 'ms-auto'}`}>
                {user}
            </Row>
            <Row
                as={"p"}
                className={`offer-negotiation-message py-1 px-2 ${user === "owner"
                    ? "bg-[#F7FAFB] after:border-t-[#F7FAFB_!important]"
                    : "bg-[#FEF1EF] after:border-t-[#FEF1EF_!important] after:left-[70%_!important]"
                    }`}
            >
                {offeredPrice}
            </Row>
        </Column>
    );
}
