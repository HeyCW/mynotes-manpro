import { createContext, useState } from "react";
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        token:  Cookies.get('token') || null,
        role: Cookies.get('role') || null
    });
    
    const login = (user) => {
        const userNew = {
            token : user,
            role: null
        }
        setUser(userNew);
    };

    const logout = () => {
        setUser({
            token: null,
            role: null
        });
    };
    
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}


