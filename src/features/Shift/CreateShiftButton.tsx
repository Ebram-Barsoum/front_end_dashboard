import { useState } from "react";
import ShiftsIcon from "../../icons/ShiftsIcon";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateShiftForm from './CreateShiftForm';


export default function CreateShiftButton(): JSX.Element {
    const [showForm, setShowForm] = useState<boolean>(false);

    const handleShowCreateShiftForm = () => {
        setShowForm(true);
    }

    const handleCloseModal = () => {
        setShowForm(false);
    }

    return (
        <>
            <Button
                onClick={handleShowCreateShiftForm}
                className='h-[42px] p-3 bg-primary rounded-xl text-white flex items-center gap-1'>
                <ShiftsIcon color="#fff" />
                Add New Shift
            </Button>

            {
                showForm && <Modal outsideClickHandler={handleCloseModal}>
                    <CreateShiftForm />
                </Modal>
            }
        </>
    )
}
