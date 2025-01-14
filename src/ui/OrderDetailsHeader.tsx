import { useNavigate } from "react-router-dom";
import GoBackIcon from "../icons/GoBackIcon";
import Row from "./Row";

interface OrderDetailsHeaderProps {
    orderNumber?: number;
}

export default function OrderDetailsHeader({ orderNumber }: OrderDetailsHeaderProps): JSX.Element {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    }

    return (
        <Row className="justify-between">
            <Row as='button' onClick={handleGoBack} className="gap-2" >
                <GoBackIcon />
                Go Back
            </Row>

            <Row as='p' className="gap-2 text-[22px]">
                {orderNumber ? <>
                    Order Number :  <span className="text-[#2FBE12] font-bold block">{orderNumber}</span>
                </> : <>
                    Order Status :  <span className="text-orange font-bold block">Uncompleted</span>
                </>}
            </Row>
        </Row>
    )
}
