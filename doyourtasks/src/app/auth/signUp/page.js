"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../../utils/supabase";
import useAuth from "../authContext";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const router = useRouter();

    if (user) {
        router.push("/tasks");
        return null;
    }

    async function handleRegister(event) {
        event.preventDefault();
        setError(null);

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { username: username },
            },
        });

        if (error) {
            setError(error.message);
        } else {
            router.push("/tasks");
        }
    }
}
