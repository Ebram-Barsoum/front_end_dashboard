import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


export default function Login(): JSX.Element {
    const { auth } = useAuth();

    if (auth?.authToken) return <Navigate to={'/'} />;

    return (
        <div className="h-[100dvh] grid grid-cols-1 items-center lg:grid-cols-2">
            <div className="hidden px-12 lg:grid lg:place-items-center">
                <img src="/login.svg" alt="tranzita login image" className="object-cover" />
            </div>
            <div className="bg-light h-full flex flex-col items-center justify-center">
                <img src="/logo.svg" alt="Tranzita logo image" className="w-[23rem]" />
                <Outlet />
            </div>
        </div>
    )
}
