import { tableRowStyle } from "../lib/constants";
import Column from "./Column";
import DataTable from "./DataTable";
import FormPartition from "./FormPartition";
import TableRow from "./TableRow";

interface ShippingInfoProps {
    shippingDate: string,
    shippingFromCity: string,
    shippingFromArea: string,
    shippingFromDistrict: string,
    shippingFromStreet: string,
    shippingFromLandmark: string,
    clinentName: string,
    clientPhone: string,
}

export default function ShippingInfo({ shippingDate, shippingFromCity, shippingFromArea, shippingFromDistrict, shippingFromStreet, shippingFromLandmark, clinentName, clientPhone }: ShippingInfoProps): JSX.Element {

    const shppingData = [
        {
            label: 'Shipping Date',
            value: new Date(shippingDate).toLocaleDateString()
        }
        ,
        {
            label: 'Client Name',
            value: clinentName
        },
        {
            label: 'Client Phone',
            value: clientPhone
        },
        {
            label: 'City',
            value: shippingFromCity
        },
        {
            label: 'Area',
            value: shippingFromArea
        },
        {
            label: 'District',
            value: shippingFromDistrict
        },
        {
            label: 'Street',
            value: shippingFromStreet
        },
        {
            label: 'Landmark',
            value: shippingFromLandmark
        }
    ];

    return (
        <FormPartition title="Shipping Details" isAccordion={true}>
            <Column className="w-full gap-6">


                <DataTable className={"bg-white border-t-0"}>

                    {
                        shppingData.map((item) => {
                            return (
                                <TableRow
                                    key={item.label}
                                    label={item.label}
                                    value={item.value}
                                    {...tableRowStyle}
                                    className={tableRowStyle.className + " grid-cols-[6rem_1fr]"}
                                />
                            )
                        })
                    }
                </DataTable>
            </Column>
        </FormPartition>
    )
}
