import { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

import Row from "./Row";
import ArrowLeft from "../icons/ArrowLeft";
import ArrowRight from "../icons/ArrowRight";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

interface PaginBTNProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
}

function PaginBTN({
    children,
    onClick,
    className,
}: PaginBTNProps): JSX.Element {
    return (
        <button
            className={`text-lg font-bold h-[24px] w-[24px] rounded-full ${className} `}
            onClick={() => onClick?.()}
        >
            {children}
        </button>
    );
}

export default function Pagination({
    currentPage,
    totalPages,
}: PaginationProps): JSX.Element {
    const [searchParams, setSearchParams] = useSearchParams();

    const pages = Array.from(
        { length: Math.min(4, totalPages - currentPage + 1) },
        (_, i) => i + currentPage
    );

    const handlePrevPage = () => {
        if (currentPage > 1) {
            searchParams.set("page", (currentPage - 1).toString());
            setSearchParams(searchParams);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            searchParams.set("page", (currentPage + 1).toString());
            setSearchParams(searchParams);
        }
    };

    const handleChangePage = (page: number) => {
        if (page === currentPage || page < 1 || page > totalPages) return;

        searchParams.set("page", String(page));
        setSearchParams(searchParams);
    };

    return (
        <Row className="justify-center gap-2">
            <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Previous page"
            >
                <ArrowLeft />
            </button>

            <Row className="font-bold text-base">
                {pages.map((pageNum) => (
                    <PaginBTN
                        className={pageNum === currentPage ? "bg-light" : ""}
                        onClick={() => handleChangePage(pageNum)}
                        key={pageNum}
                    >
                        {pageNum}
                    </PaginBTN>
                ))}
            </Row>

            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Next page"
            >
                <ArrowRight />
            </button>
        </Row>
    );
}
