
import { tableRowStyle } from "../../lib/constants";
import { Truck } from "../../lib/interfaces";
import DataTable from "../../ui/DataTable";
import TableRow from "../../ui/TableRow";



interface TruckCardProps {
    truck: Truck,
    onSelectCard: (truck: Truck) => void
}

export default function TruckCard({ truck, onSelectCard }: TruckCardProps): JSX.Element {
    const { truckImage, truckType, truckNumber, driverName } = truck;

    const truckCardData = [
        {
            label: "Truck Type",
            value: truckType
        },
        {
            label: "Driver Name",
            value: driverName
        },
        {
            label: "Truck Number",
            value: truckNumber
        },
    ]

    return (
        <div className=" grid grid-cols-[8rem_1fr] gap-3 p-2 border border-stroke bg-card rounded-lg">
            <img onClick={() => onSelectCard(truck)} src={truckImage as string} className="rounded-lg object-fill h-full cursor-pointer" loading="lazy" />

            <DataTable className="border-none">
                {
                    truckCardData.map(({ label, value }) => {
                        return <TableRow
                            key={label}
                            label={label}
                            value={value}
                            valueStyle="text-[11px]"
                            labelStyle={tableRowStyle.labelStyle + " text-[11px]"}
                            className={tableRowStyle.className + " grid-cols-[5.5rem_1fr] "}
                        />
                    })
                }
            </DataTable>
        </div>
    )
}
