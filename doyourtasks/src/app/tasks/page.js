"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../auth/authContext";

export default function Tasks() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/auth/signIn");
        }
    }, [user, router]);

    return <h1>He conseguido entrar</h1>;
}
