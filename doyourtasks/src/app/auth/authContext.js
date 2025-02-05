"use client";

import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../../../utils/supabase";
import Cookies from "js-cookie";

const AuthContext = createContext();

export default function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkUser(setUser);
        supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            if (session) {
                Cookies.set("supabase-auth-token", session.access_token, {
                    expires: 15,
                });
            } else {
                Cookies.remove("supabase-auth-token");
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

async function checkUser(setUser) {
    const token = Cookies.get("supabase-auth-token");
    if (token) {
        const { data } = await supabase.auth.getSession();
        setUser(data.session ? data.session.user : null);
    } else {
        setUser(null);
    }
}
