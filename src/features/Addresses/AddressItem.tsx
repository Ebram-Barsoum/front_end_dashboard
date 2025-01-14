import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { delete_user_address } from '../../services/apiAddress';

import { handleMutationError } from '../../lib/healpers';

import TrashIcon from '../../icons/TrashIcon';
import UpdateIcon from '../../icons/UpdateIcon';
import Row from '../../ui/Row';


interface AddressItemProps {
    id?: string;
    city: string;
    area: string;
    district: string;
    street: string;
    landmark: string;

    userId: string;
    onClickEdit: () => void;
}

export default function AddressItem({ id, city, area, district, street, landmark, userId, onClickEdit }: AddressItemProps): JSX.Element {
    const { isPending, mutate } = useMutation({ mutationFn: (addressId: string) => delete_user_address(addressId) });
    const queryClient = useQueryClient();

    const handleDelteAddress = () => {
        mutate(id as string, {
            onSuccess: (data) => {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ['addresses', userId] });
            },
            onError: (error) => {
                handleMutationError(error, "Failed to delete address");
            }
        })
    }

    const handleClickEdit = () => {
        onClickEdit();
    }

    return (
        <Row className='gap-[14px] p-[1rem] justify-between text-xs border-b border-b-stroke last:border-none'>
            <Row as={'p'}>{`${city}, ${area}, ${district}, ${street}, ${landmark}`}</Row>
            <Row className='gap-[12px]'>
                <button
                    disabled={isPending}
                    onClick={handleClickEdit}
                >
                    <UpdateIcon />
                </button>

                <button
                    disabled={isPending}
                    onClick={(handleDelteAddress)}
                >
                    <TrashIcon />
                </button>
            </Row>
        </Row>
    )
}
