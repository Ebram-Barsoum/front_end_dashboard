import { useState } from "react";
import SearchIcon from "../icons/SearchIcon";
import { useSearchParams } from "react-router-dom";

interface SearchProps {
    className?: string;
    placeholder: string;
    param: string;
}

export default function Search({ className, placeholder, param }: SearchProps) {
    const [query, setQuery] = useState<string>("");
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (query.trim() !== "") {
            setSearchParams({});
            searchParams.set(param, query);
            setSearchParams(searchParams);
        }
    }

    return (
        <form className="flex-1" onSubmit={handleSubmit}>
            <div className={`relative flex`}>
                <span className="text-lg text-grey-3 absolute top-[50%] translate-y-[-50%] left-4">
                    <SearchIcon />
                </span>

                <input type="text"
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className={`outline-none px-2 pl-10 bg-grey-1 rounded-xl  placeholder:text-grey  ${className}`}
                    aria-label="search input"
                />
            </div>
        </form>
    )
}
