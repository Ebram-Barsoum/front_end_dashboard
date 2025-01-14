import { useNavigate } from 'react-router-dom';

import Button from "../../ui/Button";
import AddPackageIcon from "../../icons/AddPackageIcon";


export default function AddPackageButton(): JSX.Element {
    const navigate = useNavigate();

    const handleGoToAddPackage = () => {
        navigate('/add-package');
    }

    return (
        <Button
            onClick={handleGoToAddPackage}
            className={" h-[42px] bg-primary rounded-lg text-white flex items-center gap-1"}>
            <AddPackageIcon />
            Add New Package
        </Button>
    )
}
