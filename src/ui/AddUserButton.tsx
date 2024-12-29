import { ReactNode, useState } from "react"
import Modal from "./Modal";


interface AddUserButtonProps {
    children: ReactNode;
    icon?: ReactNode;
    className: string;
    label: string | ReactNode;
}
export default function AddUserButton({ className, children, icon, label }: AddUserButtonProps): JSX.Element {
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <>
            <button onClickCapture={() => setShowModal(true)} className={`flex items-center gap-1 p-3 rounded-xl ${className}`}>
                {icon}
                <span className="hidden xl:flex">{label}</span>
            </button>
            {showModal && <Modal outsideClickHandler={() => setShowModal(false)}>
                {children}
            </Modal>}
        </>
    )
}
