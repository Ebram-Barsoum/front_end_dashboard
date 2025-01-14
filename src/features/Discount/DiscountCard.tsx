import Column from "../../ui/Column";
import Row from "../../ui/Row";
import ActivateDiscountButton from "./ActivateDiscountButton";
import DeactivateDiscountButton from "./DeactivateDiscountButton";

interface DiscountCardProps {
    id: string;
    title: string;
    percentage: number;
    description: string;
    isActive?: boolean;
}

export default function DiscountCard({ id, title, percentage, description, isActive }: DiscountCardProps): JSX.Element {
    return (
        <Column className="gap-2 bg-card p-3 border border-stroke rounded-lg">
            <Row as={'h2'} className="text-[12px]">{title}</Row>
            <Row as={'span'} className="text-[18px] text-primary font-bold">{percentage * 100}%</Row>
            <Row as={'p'} className="text-[10px] text-grey-3">{description}</Row>

            {
                isActive === true ? <DeactivateDiscountButton discountId={id} /> :
                    <ActivateDiscountButton discountId={id} />
            }
        </Column>
    )
}
