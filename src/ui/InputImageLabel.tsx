import CameraIcon from "../icons/CameraIcon";
import Column from "./Column";

interface InputImageLabelProps {
    label?: string;
    labelStyle?: string;
    filled?: boolean;
}

export default function InputImageLabel({ label, labelStyle }: InputImageLabelProps): JSX.Element {
    return (
        <Column className="items-center justify-center gap-2 w-full">
            <CameraIcon />
            {label && <span className={`text-grey-2 ${labelStyle}`}>{label}</span>}
        </Column>
    )
}
