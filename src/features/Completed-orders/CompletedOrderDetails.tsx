import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { get_order_details } from "../../services/apiOrders";

import OrderDetailsHeader from "../../ui/OrderDetailsHeader";
import Column from "../../ui/Column";
import View from "../../ui/View";
import Loader from "../../ui/Loader";
import Message from "../../ui/Message";
import DriverInfo from "../../ui/DriverInfo";
import ShipmentInfo from "../../ui/ShipmentInfo";
import Grid from "../../ui/Grid";
import TruckInfo from "../../ui/TruckInfo";
import ShippingInfo from "../../ui/ShippingInfo";
import OwnerInfo from "../../ui/OwnerInfo";
import CustomerInfo from "../../ui/CustomerInfo";
import OfferHistory from "../../ui/OfferHistory";

export default function CompletedOrderDetails(): JSX.Element {
    const { orderNumber } = useParams();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["completed-order-details", orderNumber],
        queryFn: () => get_order_details(parseInt(orderNumber as string)),
    });

    if (isLoading) return <Loader />;
    if (isError) return <Message type="error" message={error.message} />;

    const { driverName, driverPhone, driverLicense } = data.truck;
    const { type, weight, shipmentImage, description } = data.shipment;
    const {
        truckType,
        truckNumber,
        truckImage,
        drivingLicense,
        city,
        weight: truckCapacity,
        user: owner,
    } = data.truck;

    const {
        shippingDate,
        shippingFromCity,
        shippingFromArea,
        shippingFromDistrict,
        shippingFromStreet,
        shippingFromLandmark,
        clientName,
        clientPhone,
        user: customer,
    } = data.shipment;

    const { name, phone, email, commercialRegister, taxCard } = owner;
    const { name: customerName, phone: customerPhone, email: customerEmail } = customer;

    return (
        <View>
            <Column as="section" className="gap-6">
                <OrderDetailsHeader orderNumber={parseInt(orderNumber as string)} />

                <Grid className="gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    <Column className="gap-6">
                        <CustomerInfo
                            name={customerName}
                            phone={customerPhone}
                            email={customerEmail}
                        />

                        <ShippingInfo
                            shippingDate={shippingDate}
                            shippingFromCity={shippingFromCity}
                            shippingFromArea={shippingFromArea}
                            shippingFromDistrict={shippingFromDistrict}
                            shippingFromStreet={shippingFromStreet}
                            shippingFromLandmark={shippingFromLandmark}
                            clinentName={clientName}
                            clientPhone={clientPhone}
                        />

                        <ShipmentInfo
                            shipmnetImage={shipmentImage}
                            weight={weight}
                            description={description}
                            shipmentType={type}
                            truckType={truckType}
                        />

                    </Column>

                    <Column className="gap-6">
                        <OwnerInfo
                            name={name}
                            phone={phone}
                            email={email}
                            commercialRegister={commercialRegister}
                            taxCard={taxCard}
                        />

                        <TruckInfo
                            truckImage={truckImage}
                            truckNumber={truckNumber}
                            truckType={truckType}
                            drivingLicense={drivingLicense}
                            city={city}
                            capacity={truckCapacity}
                        />
                    </Column>

                    <Column className="gap-6">
                        <DriverInfo
                            driverName={driverName}
                            driverPhone={driverPhone}
                            driverLicense={driverLicense}
                        />
                        <OfferHistory offers={data?.offerHistory} />
                    </Column>
                </Grid>
            </Column>
        </View>
    );
}
