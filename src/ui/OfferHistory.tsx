import { Offer } from "../lib/interfaces"

import FormPartition from "./FormPartition"
import OfferMessage from "./OfferMessage";
import Message from "./Message";
import Column from "./Column"

interface OfferHistoryProps {
    offers: Offer[]
}

// const data = [
//     {
//         createdAt: "2025-01-12T13:07:05.000Z",
//         id: "01JHDA0DSJ89PHEGZCXXPFRB94",
//         lastUpdatedBy: { userType: "OWNER" },
//         offeredPrice: 2000,
//     },
//     {
//         createdAt: "2025-01-12T14:15:10.000Z",
//         id: "02JHDA0DSJ89PHEGZCXXPFRB95",
//         lastUpdatedBy: { userType: "CUSTOMER" },
//         offeredPrice: 1500,
//     },
//     {
//         createdAt: "2025-01-12T15:20:30.000Z",
//         id: "03JHDA0DSJ89PHEGZCXXPFRB96",
//         lastUpdatedBy: { userType: "OWNER" },
//         offeredPrice: 2500,
//     },
//     {
//         createdAt: "2025-01-12T16:35:45.000Z",
//         id: "04JHDA0DSJ89PHEGZCXXPFRB97",
//         lastUpdatedBy: { userType: "CUSTOMER" },
//         offeredPrice: 1800,
//     },
//     {
//         createdAt: "2025-01-12T17:40:50.000Z",
//         id: "05JHDA0DSJ89PHEGZCXXPFRB98",
//         lastUpdatedBy: { userType: "OWNER" },
//         offeredPrice: 3000,
//     },
// ];

export default function OfferHistory({ offers }: OfferHistoryProps): JSX.Element {

    return (
        <FormPartition title="Negotiation History" isAccordion={true}>
            <Column className="w-full gap-0 px-10">
                {
                    offers.length === 0 && <Message type="no-result" message="No offers found" />
                }
                {
                    offers.map((offer) => {
                        return <OfferMessage key={offer.id} offer={offer as Offer} />
                    })
                }
            </Column>
        </FormPartition>
    )
}
