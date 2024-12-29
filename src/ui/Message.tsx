import Row from "./Row";

interface ErrorMessageProps {
    className?: string;
    type: string;
    message: string;
}

const typeToStyleMapper: Record<string, string> = {
    "error": " bg-[#FFF2EF] text-primary  border border-primary",
    "no-result": "border border-secondary uppercase bg-grey-1 text-secondary"
}

export default function Message({ className, message, type }: ErrorMessageProps): JSX.Element {
    return (
        <Row className={`w-fit font-bold p-6 mx-auto my-24 rounded-xl ${typeToStyleMapper[type]} ${className}`}>
            {message}
        </Row>
    );
}
