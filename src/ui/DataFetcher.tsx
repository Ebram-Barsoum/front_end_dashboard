/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import useQueryParams from "../hooks/useQueryParams";

import Loader from "./Loader";
import Message from "./Message";

interface DataFetcherProps {
    dataKey: string,
    fetcher: (params: string) => Promise<any>
    render: (data: any[]) => JSX.Element
}

export default function DataFetcher({ dataKey, fetcher, render }: DataFetcherProps): JSX.Element {
    const params = useQueryParams();

    const { isLoading, isError, error, data } = useQuery({
        queryKey: [dataKey, params],
        queryFn: () => fetcher(params),

    });

    if (isLoading) return <Loader />;
    if (isError) return <Message type="error" message={error.message} />;
    if (data.count === 0)
        return <Message type="no-result" message="No results found" />;

    return render(data);
}
