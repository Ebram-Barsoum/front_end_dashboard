import Logo from "./Logo";
import Navigation from "./Navigation";

export default function Sidebar() {
    return (
        <aside className="bg-light h-full py-8 px-3 flex flex-col gap-4 lg:px-8">
            <Logo />
            <Navigation />
        </aside>
    )
}
