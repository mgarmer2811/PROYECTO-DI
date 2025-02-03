"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuth from "../authContext";

export default function SignIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const { user, setUser } = useAuth();
    const router = useRouter();

    async function handleLogin(event) {
        event.preventDefault();
        setError(null);

        if (username === "") {
            alert("Username field is blank. Please fill it");
            return;
        }
        if (password === "") {
            alert("Password field is blank. Please fill it");
            return;
        }

        const response = await fetch("/api/auth/signIn", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (!response.ok) {
            setError(result.error || "Error in login");
            return;
        }

        const { session } = result;
        if (session?.user) {
            setUser(session.user);
        }

        router.push("/tasks");
    }

    return (
        <div>
            <h1>
                <i>
                    <b>DoYourTasks</b>
                </i>
            </h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Sign In</button>
            </form>
            <p>
                <Link href={"/auth/signUp"}>Don't have an account?</Link>
            </p>
        </div>
    );
}
