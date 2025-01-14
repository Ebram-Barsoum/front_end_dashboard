import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { activate_coupon } from "../../services/apiCoupon";

import { handleMutationError } from "../../lib/healpers";

import Button from "../../ui/Button";

interface ActivateCouponButtonProps {
    id: string;
}

export default function ActivateCouponButton({ id }: ActivateCouponButtonProps): JSX.Element {

    const { isPending, mutate } = useMutation({ mutationFn: (couponId: string) => activate_coupon(couponId) });
    const queryClient = useQueryClient();

    const activateCoupon = () => {
        mutate(id, {
            onSuccess: (data) => {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ['coupons'] });
            },
            onError: (error) => {
                handleMutationError(error, "Failed to activate coupon");
            }
        });
    }

    return (
        <Button
            onClick={activateCoupon}
            disabled={isPending}
            className={" h-[32px]  p-[10px] text-[12px] w-fit bg-primary text-white font-bold rounded-lg"}
        >Activate</Button>
    )
}
