/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import axiosInstance from "../lib/axios";
import { AppUser } from "../lib/interfaces";

import Spinner from "./Spinner";

import Row from "./Row";
import Column from "./Column";

interface AppUserSearchProps {
    role: "OWNER" | "CUSTOMER";
    user: AppUser | null;
    onSelect?: (owner: AppUser | null) => void
}

export default function AppUserSearch({ role, user, onSelect }: AppUserSearchProps): JSX.Element {
    const [searchResults, setSearchResults] = useState<AppUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [loading, setLoading] = useState(false);


    const search = async (query: string) => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get(`/users?role=${role}&search=${query}`);
            setSearchResults(data.users.users);

            if (data.users.users.length === 0) {
                toast.info(`No ${role} found with this email or phone`);
            }
        }
        catch (error: any) {
            toast.error(error?.message)
        }
        finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = (e.target as HTMLInputElement).value.trim();

            if (!query) return;
            search(query as string);
        }
    }

    const handleSelectUser = (user: AppUser) => {
        setSelectedUser(user.email);
        setSearchResults([]);
        onSelect?.(user);
    }

    useEffect(() => {
        if (!user) {
            setSelectedUser('');
        }

    }, [user]);

    return (
        <Column className="gap-4 relative">
            <input
                type="search"
                placeholder={`Search for ${role === "OWNER" ? "owner" : "customer"} by phone number or email`}
                className="h-12 border border-grey-2 rounded-lg focus:outline-none p-4 placeholder:text-xs placeholder:text-grey-2"
                onKeyDown={handleKeyDown}
                onChange={(e) => setSelectedUser(e.target.value)}
                value={selectedUser}
            />

            {loading && <Row className="absolute right-14 top-[30%]"><Spinner /></Row>}

            {(searchResults.length !== 0) && (
                <Column as={'ul'} className="absolute top-14 w-full bg-light max-h-[10rem] overflow-auto">
                    {searchResults?.map((user) => (
                        <li
                            onClick={() => handleSelectUser(user)}
                            key={user.id}
                            className="p-1 hover:bg-primary hover:text-white cursor-pointer">
                            {user.email}
                        </li>
                    ))}
                </Column>
            )}
        </Column>
    );
}
