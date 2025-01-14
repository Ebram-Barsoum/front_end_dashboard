import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PrimaryButtonStyle } from "../../lib/constants";
import Button from "../../ui/Button";
import { approve_app_user } from "../../services/apiAppUsers";
import { handleMutationError } from "../../lib/healpers";
import { toast } from "react-toastify";
import useQueryParams from "../../hooks/useQueryParams";

interface ApproveUserButtonProps {
    userId: string;
}

export default function ApproveUserButton({ userId }: ApproveUserButtonProps): JSX.Element {
    const { isPending, mutate } = useMutation({ mutationFn: (userId: string) => approve_app_user(userId) });
    const queryClient = useQueryClient();
    const params = useQueryParams();

    const handleApproveUser = () => {
        mutate(userId, {
            onSuccess: () => {
                toast.success("User approved successfully");
                queryClient.invalidateQueries({ queryKey: ['unverified-users', params] });
            },
            onError: (error) => {
                handleMutationError(error, "Failed to approve user");
            }
        });
    }

    return (
        <Button
            onClick={handleApproveUser}
            disabled={isPending}
            className={PrimaryButtonStyle}
        > Approve</ Button>
    )
}
