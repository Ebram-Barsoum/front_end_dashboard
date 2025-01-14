import { tableRowStyle } from "../lib/constants";
import Column from "./Column";
import DataTable from "./DataTable";
import FormPartition from "./FormPartition";
import TableRow from "./TableRow";
import UserDataFile from "./UserDataFile";

interface DriverInfoProps {
    driverName: string;
    driverPhone: string;
    driverLicense: string;
}

export default function DriverInfo({
    driverName,
    driverPhone,
    driverLicense,
}: DriverInfoProps): JSX.Element {

    return (
        <FormPartition title="Driver Information" isAccordion={true}>
            <Column className="w-full gap-6">
                <UserDataFile src={driverLicense} alt={`${driverName}'s driving license`} />

                <DataTable className={"bg-white border-t-0"}>
                    <TableRow
                        label="Driver Name"
                        value={driverName}
                        {...tableRowStyle}
                        className={tableRowStyle.className + " grid-cols-[6rem_1fr]"}
                    />

                    <TableRow
                        label="Driver Phone"
                        value={driverPhone}
                        {...tableRowStyle}
                        className={tableRowStyle.className + " grid-cols-[6rem_1fr]"}
                    />
                </DataTable>
            </Column>
        </FormPartition>
    );
}
