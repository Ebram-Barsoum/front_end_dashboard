import { tableRowStyle } from "../lib/constants";
import Column from "./Column";
import DataTable from "./DataTable";
import FormPartition from "./FormPartition";
import TableRow from "./TableRow";
import UserDataFile from "./UserDataFile";

interface ShipmentInfoProps {
    shipmentType: string;
    weight: number;
    description: string;
    shipmnetImage: string;
    truckType: string;
}

export default function ShipmentInfo({ shipmentType, weight, description, shipmnetImage, truckType }: ShipmentInfoProps): JSX.Element {

    const shipmentData = [
        {
            label: "Shipment Type",
            value: shipmentType,
        },
        {
            label: "Weight",
            value: weight,
        },
        {
            label: "Description",
            value: description,
        },
        {
            label: "Truck Type",
            value: truckType,
        }
    ]

    return (
        <FormPartition title="Shipment Details" isAccordion={true} >
            <Column className="w-full gap-6 self-start">
                <UserDataFile src={shipmnetImage} />

                <DataTable className={"bg-white border-t-0"}>

                    {
                        shipmentData.map((item) => {
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
