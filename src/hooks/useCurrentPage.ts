import { useSearchParams } from "react-router-dom";

/**
 * A custom hook to retrieve the current page number from the URL query string.
 * Defaults to 1 if the page parameter is missing, invalid, or not a positive number.
 */

export function useCurrentPage(): number {
    const [searchParams,] = useSearchParams();
    const page = parseInt(searchParams.get("page") || '1');

    return page;
}