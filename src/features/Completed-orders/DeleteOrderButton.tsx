import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { delete_order } from "../../services/apiOrders";
import { handleMutationError } from "../../lib/healpers";
import useQueryParams from "../../hooks/useQueryParams";

import TrashIcon from "../../icons/TrashIcon";
import Modal from "../../ui/Modal";
import DeleteAlert from "../../ui/DeleteAlert";

interface DeleteOrderButtonProps {
    orderId: string;
}

export default function DeleteOrderButton({
    orderId,
}: DeleteOrderButtonProps): JSX.Element {
    const { isPending, mutate } = useMutation({
        mutationFn: (orderId: string) => delete_order(parseInt(orderId)),
    });
    const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);

    const queryClient = useQueryClient();
    const params = useQueryParams();

    const handleDelteOrder = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        mutate(orderId, {
            onSuccess: (data) => {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["orders", params] });
                setShowDeleteAlert(false);
            },
            onError: (error) => {
                console.log(error)
                handleMutationError(error, "Failed to delete order");
            },
        });
    };

    const hadnleDeleteCancel = () => {
        setShowDeleteAlert(false);
    }

    return (
        <button
            onClick={() => setShowDeleteAlert(true)}
            className="flex justify-center bg-white absolute top-[14px] right-[14px] p-1 rounded-full w-[1.5rem] h-[1.5rem]"
            aria-label="Delete order"
        >
            <TrashIcon color="#000" />

            {showDeleteAlert && (
                <Modal>
                    <DeleteAlert
                        disabled={isPending}
                        onCancel={hadnleDeleteCancel}
                        onConfirm={handleDelteOrder}
                    />
                </Modal>
            )}
        </button>
    );
}
