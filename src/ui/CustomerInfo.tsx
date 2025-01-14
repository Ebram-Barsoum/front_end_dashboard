import { tableRowStyle } from "../lib/constants"
import Column from "./Column"
import DataTable from "./DataTable"
import FormPartition from "./FormPartition"
import TableRow from "./TableRow"

interface CustomerInfoProps {
    name: string;
    phone: string;
    email: string;
}

export default function CustomerInfo({ name, phone, email }: CustomerInfoProps): JSX.Element {

    const ownerDate = [
        { label: "Name", value: name },
        { label: "Phone", value: phone },
        { label: "Email", value: email },
    ]

    return (
        <FormPartition title="Customer Information" isAccordion={true}>
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
            </Column>
        </FormPartition>
    )
}
