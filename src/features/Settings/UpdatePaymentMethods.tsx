import Column from "../../ui/Column";
import FormPartition from "../../ui/FormPartition";
import Row from "../../ui/Row";


export default function UpdatePaymentMethods(): JSX.Element {
    return (
        <FormPartition title="Payment Methods" isAccordion={true}>
            <Column className="w-full gap-4">
                <Row className="gap-2">
                    <input type="checkbox" id="visa" className="cursor-pointer" />
                    <label htmlFor="visa" className="text-[12px] cursor-pointer">Visa / MasterCard</label>
                </Row>

                <Row className="gap-2">
                    <input type="checkbox" id="mobileWallet" className=" cursor-pointer" />
                    <label htmlFor="mobileWallet" className="text-[12px] cursor-pointer">Mobile wallet</label>
                </Row>
            </Column>
        </FormPartition>
    )
}
