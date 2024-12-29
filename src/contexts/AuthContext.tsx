import { ReactNode, useContext, useState, createContext, SetStateAction, useEffect } from "react";
import { AuthResponse } from "../lib/constants";

interface AuthContextType {
    auth: AuthResponse | null,
    setAuth: React.Dispatch<SetStateAction<AuthResponse | null>>
}

const AuthContext = createContext<AuthContextType | null>(null);
const getItemFromLocalStorage = (key: string) => {
    const item = localStorage.getItem(key);

    if (item) {
        return JSON.parse(item);
    }
    return null;
}

export default function AuthProvider({
    children,
}: {
    children: ReactNode;
}): JSX.Element {

    const [auth, setAuth] = useState<AuthResponse | null>(() => getItemFromLocalStorage("auth"));

    useEffect(() => {
        if (auth) {
            localStorage.setItem("auth", JSON.stringify(auth));
        }
        else {
            localStorage.removeItem("auth");
        }
    }, [auth]);

    return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
