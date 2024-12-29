import { ReactNode, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const { auth } = useAuth();

    useEffect(() => {
        if (!auth) navigate('/auth/login')
    }, [auth, navigate]);

    return (
        <>{children}</>
    )
}
