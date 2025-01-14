import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { deactivate_discount } from "../../services/apiDiscount";

import { handleMutationError } from "../../lib/healpers";

import Button from "../../ui/Button";
import useQueryParams from "../../hooks/useQueryParams";

interface DeactivateDiscountButtonProps {
    discountId: string;
}

export default function DeactivateDiscountButton({ discountId }: DeactivateDiscountButtonProps): JSX.Element {
    const { isPending, mutate } = useMutation({ mutationFn: (discountId: string) => deactivate_discount(discountId) });
    const queryClient = useQueryClient();
    const params = useQueryParams();

    const handleDeactivateDiscount = () => {
        mutate(discountId, {
            onSuccess: (data) => {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["discounts", params] });
            },
            onError: (error) => {
                handleMutationError(error, "Failed to deactivate discount");
            }
        });
    }

    return (
        <Button
            onClick={handleDeactivateDiscount}
            disabled={isPending}
            className="h-[32px] w-[92px] p-[10px] text-[12px]  bg-secondary text-white font-bold rounded-lg">
            Deactivate
        </Button>
    );
}
