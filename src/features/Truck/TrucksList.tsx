/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GoBackIcon from "../../icons/GoBackIcon";

import { get_owner_truck_types, get_user_trucks } from "../../services/apiTruck";

import { Truck } from "../../lib/interfaces";
import { LIMIT } from "../../lib/constants";

import TruckCard from "./TruckCard";

import Column from "../../ui/Column";
import Row from "../../ui/Row";
import Loader from "../../ui/Loader";
import Message from "../../ui/Message";
import TruckPagination from "./TruckPagination";
import TruckDetails from "./TruckDetails";

interface TrucksListProps {
    userId: string;
    goBack: () => void;
}

const tabStyle = "py-2 px-4 border rounded-lg ";

export default function TrucksList({
    userId,
    goBack,
}: TrucksListProps): JSX.Element {

    const [truckFilter, setTruckFilter] = useState<string>("All");
    const [params, setParams] = useState<string>("");
    const [currentPage, setCuurentPage] = useState<number>(1);
    const [truckToBeDetailed, setTruckToBeDetailed] = useState<Truck | null>(
        null
    );

    const { data, isLoading, isError, error } = useQuery({
        queryKey: [userId, "trucks", params],
        queryFn: () => get_user_trucks(userId, params),
    });

    const { data: truckTypes, isLoading: loadingTruckTypes, isError: isErrorTruckTypes, error: errorTruckTypes } = useQuery({ queryKey: ["truck-types", userId], queryFn: () => get_owner_truck_types(userId) });

    const handleTruckFilter = (truckType: string) => {
        setTruckFilter(truckType);
    };

    const handleSelectCard = (truck: Truck) => {
        setTruckToBeDetailed(truck);
    };

    // handle rebuild paeams when filter value or page number changes
    useEffect(() => {
        setParams(
            `${truckFilter.replace("All", "")
                ? `${"truckType=" + truckFilter.replace("All", "")}`
                : ""
            }&page=${currentPage}&limit=${LIMIT}`
        );
    }, [currentPage]);

    // handle reset page number when filter value changes
    useEffect(() => {
        setParams(
            `${truckFilter.replace("All", "")
                ? `${"truckType=" + truckFilter.replace("All", "")}`
                : ""
            }&page=1&limit=${LIMIT}`
        );
    }, [truckFilter]);

    const totalPages = Math.ceil(data?.count / LIMIT);

    return (
        <Column className="gap-6">
            {!truckToBeDetailed ? (
                <>
                    <Row onClick={goBack} as={"button"} className="gap-2">
                        <GoBackIcon />
                        <span>Back</span>
                    </Row>

                    <Row className="gap-2 flex-wrap">
                        {loadingTruckTypes && <Loader />}

                        {isErrorTruckTypes && <Message type="error" message={errorTruckTypes.message} />}

                        {(!loadingTruckTypes && !isErrorTruckTypes) && ["All", ...truckTypes].map((truck) => (
                            <button
                                key={truck}
                                onClick={() => handleTruckFilter(truck)}
                                className={
                                    tabStyle +
                                    `${truckFilter === truck
                                        ? "bg-[#FF795B1A] border-primary text-primary font-bold"
                                        : " border-stroke text-grey-2"
                                    } `
                                }
                            >
                                {truck}
                            </button>
                        ))}
                    </Row>
                    <Column className="gap-4">
                        {isLoading && <Loader />}

                        {isError && <Message type="error" message={error.message} />}

                        {data?.count !== 0 ? (
                            <>
                                {data?.trucks?.map((truck: Truck) => (
                                    <TruckCard
                                        key={truck.id as string}
                                        truck={truck}
                                        onSelectCard={handleSelectCard}
                                    />
                                ))}
                                {totalPages !== 1 && (
                                    <TruckPagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCuurentPage}
                                    />
                                )}
                            </>
                        ) : (
                            <Message type="no-result" message="No trucks found!." />
                        )}
                    </Column>
                </>
            ) : (
                <TruckDetails
                    userId={userId}
                    truck={truckToBeDetailed}
                    setTruckToBeDetailed={setTruckToBeDetailed}
                    params={params}
                    resetFilter={() => setTruckFilter('All')}
                    resetCurrentPage={() => setCuurentPage(1)}
                />
            )}
        </Column>
    );
}
