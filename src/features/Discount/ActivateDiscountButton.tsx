import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { activate_discount } from "../../services/apiDiscount";

import { handleMutationError } from "../../lib/healpers";

import Button from "../../ui/Button";
import useQueryParams from "../../hooks/useQueryParams";

interface ActivateDiscountButtonProps {
    discountId: string;
}

export default function ActivateDiscountButton({ discountId }: ActivateDiscountButtonProps): JSX.Element {
    const { isPending, mutate } = useMutation({ mutationFn: (discountId: string) => activate_discount(discountId) });
    const queryClient = useQueryClient();
    const params = useQueryParams();

    const handleActivateDiscount = () => {
        mutate(discountId, {
            onSuccess: (data) => {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["discounts", params] });
            },
            onError: (error) => {
                handleMutationError(error, "Failed to activate discount");
            }
        });
    }

    return (
        <Button
            onClick={handleActivateDiscount}
            disabled={isPending}
            className=" h-[32px]  p-[10px] text-[12px] w-fit bg-primary text-white font-bold rounded-lg">
            Activate
        </Button>
    );
}
