"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/authContext";

export default function Tasks() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/auth/register");
        }
    }, [user, router]);

    return user ? <h1>Bienvenido a la pagina principal user</h1> : null;
}
