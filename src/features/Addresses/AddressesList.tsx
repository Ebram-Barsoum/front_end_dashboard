import { Dispatch, SetStateAction, useState } from "react";
import MenuIcon from "../../icons/MenuIcon";
import Column from "../../ui/Column";
import Row from '../../ui/Row';
import { useQuery } from "@tanstack/react-query";
import { get_user_addresses } from "../../services/apiAddress";
import Loader from "../../ui/Loader";
import Message from "../../ui/Message";
import AddressItem from "./AddressItem";
import { Address } from '../../lib/interfaces';

interface AddressesListProps {
    userId: string;
    setAddressToBeUpdated: Dispatch<SetStateAction<Address | undefined>>;
}

export default function AddressesList({ userId, setAddressToBeUpdated }: AddressesListProps): JSX.Element {
    const [showAddresses, setShowAddresses] = useState<boolean>(true);

    const { data: addresses, isError, error, isLoading } = useQuery({
        queryKey: ["addresses", userId],
        queryFn: () => get_user_addresses(userId)
    })

    const toggleAddressesList = () => {
        setShowAddresses((state) => !state)
    }

    return (
        <Column className="border border-stroke rounded-lg overflow-hidden ">
            <Row
                onClick={toggleAddressesList}
                className="justify-between bg-card px-[16px] py-[18px] cursor-pointer" >
                <Row as={'h2'} className="text-xs">Saved Addresses</Row>

                <span className={`${!showAddresses ? 'rotate-180' : ''} transition-all duration-100 ease-in-out`}>
                    <MenuIcon />
                </span>
            </Row>

            {isLoading && <Loader />}
            {isError && <Message type="error" message={error.message} />}

            {
                (showAddresses && !isLoading && !isError) &&
                <Column className="max-h-[10rem] overflow-auto">
                    {addresses.map((address: Address) => {
                        return <AddressItem key={address.id} {...address} userId={userId} onClickEdit={() => setAddressToBeUpdated(address)} />
                    })}
                </Column>
            }
        </Column>
    )
}
