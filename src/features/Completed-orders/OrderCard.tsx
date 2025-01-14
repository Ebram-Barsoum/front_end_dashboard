/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import Column from "../../ui/Column";
import Row from "../../ui/Row";
import DeleteOrderButton from "./DeleteOrderButton";


interface OrderCardProps {
    order: any,
    status: "completed" | "uncompleted";
}

export default function OrderCard({ order, status }: OrderCardProps): JSX.Element {
    const { id, order: orderInfo, shipment: { type, shipmentImage, shippingDate, shippingFromCity, shippingToCity } } = order;
    const navigae = useNavigate();

    const gotToOrderDetails = () => {
        if (orderInfo) {
            navigae(`/completed-orders/${orderInfo.orderNo}`);
        }
        else {
            navigae(`/uncompleted-offers/${id}`);
        }
    }

    const orderData = [
        { label: 'Shipping From', value: shippingFromCity },
        { label: 'Shipping To', value: shippingToCity },
        { label: 'Shipping Date', value: new Date(shippingDate).toLocaleDateString() },
        { label: 'Shipping Type', value: type },
    ]

    return (
        <Column className="rounded-lg overflow-hidden">
            <Row className="relative">
                <img
                    onClick={gotToOrderDetails}
                    src={shipmentImage as string}
                    alt={`${type} shipment image`}
                    loading="lazy"
                    className="object-fill w-full h-[116px] cursor-pointer" />

                {status === "completed" && <DeleteOrderButton orderId={orderInfo.orderNo} />}
            </Row>

            <Column className="py-1 bg-grey-1 ">
                {orderInfo && <div className="grid grid-cols-[6.5rem_1fr] border-b border-grey-2">
                    <Row as='p' className="text-[12px] px-[10px]  border-r border-grey-2">
                        <Row as='span' className="block py-1 font-bold text-primary">Order Status</Row>
                    </Row>

                    <Row as='p' className="text-[12px] text-secondary px-[10px]">
                        <Row as='span' className="block py-1 capitalize font-bold"> {(orderInfo.orderStatus as string).toLowerCase()}</Row>
                    </Row>
                </div>}

                {
                    orderData.map(({ label, value }, index) => {
                        return <div key={index} className="grid grid-cols-[6.5rem_1fr] ">

                            <Row as='p' className="text-[12px] px-[10px]  border-r border-grey-2">
                                <Row as='span' className="block pb-1"> {label}</Row>
                            </Row>

                            <Row as='p' className="text-[12px] text-secondary px-[10px]">
                                <Row as='span' className="block pb-1"> {value}</Row>
                            </Row>
                        </div>
                    })
                }
            </Column>
        </Column>
    )
}
