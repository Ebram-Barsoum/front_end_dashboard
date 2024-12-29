import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";


export default function Layout(): JSX.Element {
    return (
        <main className="grid grid-cols-[auto_1fr] h-[100dvh]">
            <Sidebar />

            <section className="grid grid-rows-[auto_1fr] h-[100dvh]">
                <Header />

                <div className="overflow-y-auto max-h-[100%]">
                    <Outlet />
                </div>
            </section>
        </main>
    )
}
