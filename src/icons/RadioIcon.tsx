interface RadioIconProps {
    color?: string;
}

export default function RadioIcon({ color = "#FF795B" }: RadioIconProps): JSX.Element {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7" cy="7" r="6" stroke={color} strokeWidth="2" />
            <circle cx="7.00013" cy="6.99999" r="3.26087" fill={color} />
        </svg>
    );
}
