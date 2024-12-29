import DateIcon from "../icons/DateIcon";

export default function HeaderDate(): JSX.Element {
    const date: Date = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const today = new Intl.DateTimeFormat('en-US', options).format(date);

    return (
        <p className="h-12 min-w-32 px-3 py-2 bg-light rounded-md hidden items-center gap-1  sm:flex">
            <DateIcon />
            <span className="leading-5">{today}</span>
        </p>
    )
}
