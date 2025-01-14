interface OpenedIconProps {
    color?: string;
}

export default function OpenedIcon({ color = "#FF795B" }: OpenedIconProps): JSX.Element {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9.5V2.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.5 6L6 2.5L2.5 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
}
