interface VLineProps {
    className?: string;
}

export default function VLine({ className }: VLineProps): JSX.Element {
    return (
        <p className={` w-[2px] h-4 rounded-[1px] bg-black hidden xl:flex ${className}`}></p>
    );
}
