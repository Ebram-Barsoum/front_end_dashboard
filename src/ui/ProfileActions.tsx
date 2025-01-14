import { ReactNode } from "react";

interface Action {
    icon: ReactNode;
    onClick?: () => void;
}

interface ProfileActionsProps {
    actions: Action[];
    loading?: boolean;
}

export default function ProfileActions({
    actions,
    loading = false,
}: ProfileActionsProps): JSX.Element {
    return (
        <>
            {actions.map((action: Action, index) => (
                <button
                    type="button"
                    key={index}
                    disabled={loading}
                    onClick={() => {
                        action.onClick?.();
                    }}>{action.icon}</button>
            ))}
        </>
    );
}
