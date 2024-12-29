import Column from "./Column";

interface ProfileHeaderProps {
    name?: string;
    type?: string
}

export default function ProfileHeader({ name, type }: ProfileHeaderProps): JSX.Element {
    return (
        <Column className="gap-1">
            <p className="text-[12px] text-primary">{name}</p>
            <p className="text-[12px] capitalize">{type}</p>
        </Column>
    );
}
