import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { deactivate_coupon } from "../../services/apiCoupon";
import { handleMutationError } from "../../lib/healpers";

import Button from "../../ui/Button";

interface ActivateCouponButtonProps {
    id: string;
}

export default function DeactivateCouponButton({ id }: ActivateCouponButtonProps): JSX.Element {

    const { isPending, mutate } = useMutation({ mutationFn: (couponId: string) => deactivate_coupon(couponId) });
    const queryClient = useQueryClient();

    const deactivateCoupon = () => {
        mutate(id, {
            onSuccess: (data) => {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ['coupons'] });
            },
            onError: (error) => {
                handleMutationError(error, "Failed to deactivate coupon");
            }
        });
    }

    return (
        <Button
            onClick={deactivateCoupon}
            disabled={isPending}
            className={" h-[32px] w-[92px] p-[10px] text-[12px]  bg-secondary text-white font-bold rounded-lg"}
        >Deactivate</Button>
    )
}