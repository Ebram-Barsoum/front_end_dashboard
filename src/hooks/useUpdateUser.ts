/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { AppUser, SuperUser } from "../lib/interfaces";

interface UseUpdateUserParams {
    userId: string;
    updateFn: (id: string, newUser: Partial<SuperUser | AppUser>) => Promise<any>;
}

export default function useUpdateUser({
    userId,
    updateFn,
}: UseUpdateUserParams) {
    const { isPending, mutate } = useMutation({
        mutationFn: (newUser: Partial<SuperUser | AppUser>) =>
            updateFn(userId, newUser),
    });

    return { isPending, mutate };
}
