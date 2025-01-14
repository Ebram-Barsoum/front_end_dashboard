
import Row from "../../ui/Row";

interface TruckPaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function TruckPagination({ totalPages, currentPage, onPageChange }: TruckPaginationProps): JSX.Element {

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    }

    return (
        <Row className="justify-center gap-4">
            <button
                onClick={handlePrevPage}
                className="p-2 border border-primary bg-[#FF795B1A] text-primary text-xs rounded-xl"
            >Prev</button>


            <button
                onClick={handleNextPage}
                className="p-2 border border-primary bg-[#FF795B1A] text-primary text-xs rounded-xl"
            >Next</button>
        </Row>
    )
}
