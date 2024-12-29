import Button from "./Button";
import Column from "./Column";
import Row from "./Row";

interface DeleteAlertProps {
    onConfirm?: () => void;
    onCancel?: () => void;
    disabled: boolean;
}

export default function DeleteAlert({
    onConfirm,
    onCancel,
    disabled,
}: DeleteAlertProps): JSX.Element {
    return (
        <Column className="gap-4 bg-white w-full rounded-xl p-8 md:w-[474px] sm:p-[66px]">
            <Row as={"h2"} className="justify-center font-bold text-[24px] text-red">
                Delete
            </Row>
            <Row as={"p"} className="justify-center text-[18px]">
                Are you sure, you want to make this action ?{" "}
            </Row>

            <Row className="mt-2 justify-center gap-4">
                <Button
                    disabled={disabled}
                    onClick={onConfirm}
                    className="font-bold text-[18px] text-white bg-warn rounded-xl h-[56px] w-[164px]"
                >
                    Yes, delete
                </Button>
                <Button
                    disabled={disabled}
                    onClick={onCancel}
                    className="font-bold text-[18px] text-white bg-grey-2 rounded-xl h-[56px] w-[164px]"
                >
                    Cancel
                </Button>
            </Row>
        </Column>
    );
}
