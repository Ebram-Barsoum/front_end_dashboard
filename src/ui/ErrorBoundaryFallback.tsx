import { useErrorBoundary } from "react-error-boundary";
import Button from "./Button";
import Column from "./Column";

export default function ErrorBoundaryFallback(): JSX.Element {
    const { resetBoundary } = useErrorBoundary();

    return (
        <Column className="gap-8 h-[100dvh] justify-center items-center">
            <img src="/ErrorBoundary.png" alt="Error Boundary image" className="max-w-[100%] mx-auto object-cover  md:w-[490px]" />
            <Button onClick={resetBoundary} className="w-fit bg-primary text-white h-[56px] px-[36px] py-[18px] font-bold rounded-xl">Go Back to Dashboard</Button>
        </Column >
    );
}
