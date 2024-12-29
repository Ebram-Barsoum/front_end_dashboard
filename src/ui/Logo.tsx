export default function Logo(): JSX.Element {
    return (
        <img
            src="/logo.svg"
            alt="tranzita company logo"
            className="h-20 w-40 mx-auto object-cover hidden lg:flex"
            loading="lazy"
        />
    );
}
