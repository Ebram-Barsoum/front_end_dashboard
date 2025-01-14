import { tableRowStyle } from "../lib/constants"
import Column from "./Column"
import DataTable from "./DataTable"
import FormPartition from "./FormPartition"
import TableRow from "./TableRow"
import UserDataFile from "./UserDataFile"

interface OwnerInfoProps {
    name: string;
    phone: string;
    email: string;
    commercialRegister: string;
    taxCard: string;
}

export default function OwnerInfo({ name, phone, email, commercialRegister, taxCard }: OwnerInfoProps): JSX.Element {
    const ownerDate = [
        { label: "Name", value: name },
        { label: "Phone", value: phone },
        { label: "Email", value: email },
    ]

    return (
        <FormPartition title="Owner Information" isAccordion={true}>
            <Column className="w-full gap-6">

                <DataTable className={"bg-white border-t-0"}>
                    {
                        ownerDate.map((item) => {
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

                {commercialRegister && <UserDataFile src={commercialRegister} alt={`${name}'s commercial register image`} />}
                {taxCard && <UserDataFile src={taxCard} alt={`${name}'s tax card image`} />}

            </Column>
        </FormPartition>
    )
}
