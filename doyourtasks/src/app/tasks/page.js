"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../auth/authContext";
import Cookies from "js-cookie";
import supabase from "../../../utils/supabase";

export default function Tasks() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("supabase-auth-token");
        if (!user && !token) {
            router.push("/auth/signIn");
        } else if (token) {
            supabase.auth.setSession(token).then(({ data }) => {
                if (!data.session) {
                    router.push("/auth/signIn");
                }
            });
        }
    }, []);

    return <h1>He conseguido entrar</h1>;
}
