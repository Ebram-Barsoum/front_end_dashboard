import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { disapprove_app_user } from "../../services/apiAppUsers";

import { handleMutationError } from "../../lib/healpers";
import { secondaryButtonStyle } from "../../lib/constants";

import Button from "../../ui/Button";
import useQueryParams from "../../hooks/useQueryParams";

interface DisapproveUserButtonProps {
    userId: string;
}

export default function DisapproveUserButton({ userId }: DisapproveUserButtonProps): JSX.Element {

    const { isPending, mutate } = useMutation({ mutationFn: (userId: string) => disapprove_app_user(userId) });
    const queryClient = useQueryClient();
    const params = useQueryParams();

    const handleApproveUser = () => {
        mutate(userId, {
            onSuccess: () => {
                toast.success("User disapproved successfully");
                queryClient.invalidateQueries({ queryKey: ['app-users', params] });
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
            className={secondaryButtonStyle}
        > Disapprove</ Button>
    );
}