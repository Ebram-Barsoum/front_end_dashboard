import { tableRowStyle } from "../lib/constants"

import Column from "./Column"
import DataTable from "./DataTable"
import FormPartition from "./FormPartition"
import TableRow from "./TableRow"
import UserDataFile from "./UserDataFile"

interface TruckInfoProps {
    truckType: string;
    truckNumber: string;
    capacity: number;
    city: string;

    truckImage: string;
    drivingLicense: string;
}

export default function TruckInfo({ truckImage, drivingLicense, truckNumber, capacity, truckType, city }: TruckInfoProps): JSX.Element {

    const truckData = [
        {
            label: 'Truck Type',
            value: truckType
        },
        {
            label: 'Truck Number',
            value: truckNumber
        },
        {
            label: 'Capacity',
            value: capacity
        },
        {
            label: 'City',
            value: city
        }
    ];

    return (
        <FormPartition title="Truck Information" isAccordion={true}>
            <Column className="w-full gap-6">
                <UserDataFile src={truckImage} />

                <DataTable className={"bg-white border-t-0"}>

                    {
                        truckData.map((item) => {
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

                <UserDataFile src={drivingLicense} />
            </Column>
        </FormPartition>
    )
}
