"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../auth/authContext";
import Cookies from "js-cookie";
import supabase from "../../../utils/supabase";

export default function Tasks() {
    const { user } = useAuth();
    const router = useRouter();
    const [notes, setNotes] = useState([]);
    const [category, setCategory] = useState(1);
    const [newNote, setNewNote] = useState("");
    const [showInput, setShowInput] = useState(false);

    useEffect(() => {
        const tokenData = Cookies.get("supabase-auth-token");
        if (!user && !tokenData) {
            router.push("/auth/signIn");
        } else if (tokenData) {
            try {
                const { access_token, refresh_token } = JSON.parse(tokenData);
                supabase.auth
                    .setSession({ access_token, refresh_token })
                    .then(({ data }) => {
                        if (!data.session) {
                            router.push("/auth/signIn");
                        }
                    });
            } catch (error) {
                console.error("Error parsing auth token:", error);
                router.push("/auth/signIn");
            }
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchNotes();
        }
    }, [user, category]);

    async function fetchNotes() {
        const tokenData = Cookies.get("supabase-auth-token");

        if (!user && !tokenData) {
            router.push("/auth/signIn");
            return;
        }

        const response = await fetch("/api/tasks", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: user?.id,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            alert("Error fetching notes", data.error);
            return;
        }

        setNotes(data);
    }

    async function handleAddNote() {
        if (!newNote.trim()) return;

        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: newNote,
                category: category,
                user_id: user?.id,
                due_date: new Date(),
            }),
        });

        const data = await response.json();

        if (response.ok) {
            setNewNote("");
            setShowInput(false);
            fetchNotes();
        } else {
            alert("Error adding note:", data.error);
        }
    }

    async function handleDeleteNote(id) {
        const response = await fetch("/api/tasks", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id }),
        });

        const data = await response.json();

        if (response.ok) {
            fetchNotes();
        } else {
            console.error("Error deleting note:", data.error);
        }
    }

    return (
        <div style={{ padding: "16px", paddingBottom: "80px" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                {[1, 2, 3, 4].map((num) => (
                    <button
                        key={num}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "4px",
                            backgroundColor:
                                category === num ? "#007BFF" : "#E0E0E0",
                            color: category === num ? "white" : "black",
                            border: "none",
                            cursor: "pointer",
                        }}
                        onClick={() => setCategory(num)}
                    >
                        Categoría {num}
                    </button>
                ))}
            </div>
            <ul style={{ marginBottom: "16px", listStyle: "none", padding: 0 }}>
                {notes.map((note) => (
                    <li
                        key={note.id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#F5F5F5",
                            padding: "8px",
                            borderRadius: "4px",
                            marginBottom: "8px",
                        }}
                    >
                        <div>
                            <p>{note.text}</p>
                            <small style={{ color: "#757575" }}>
                                {new Date(note.due_date).toLocaleDateString()}
                            </small>
                        </div>
                        <input
                            type="checkbox"
                            onChange={() => handleDeleteNote(note.id)}
                            style={{ marginLeft: "8px" }}
                        />
                    </li>
                ))}
            </ul>
            {showInput ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    <textarea
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            padding: "8px",
                            resize: "none",
                        }}
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                    />
                    <button
                        style={{
                            backgroundColor: "#28A745",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: "4px",
                            border: "none",
                            cursor: "pointer",
                        }}
                        onClick={handleAddNote}
                    >
                        Guardar Nota
                    </button>
                </div>
            ) : (
                <button
                    style={{
                        backgroundColor: "#007BFF",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        border: "none",
                        cursor: "pointer",
                    }}
                    onClick={() => setShowInput(true)}
                >
                    Agregar Nota
                </button>
            )}
            <div
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "60px",
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    borderTop: "1px solid #ccc",
                }}
            >
                <button
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                    }}
                    onClick={() => router.push("/tasks")}
                >
                    Tareas
                </button>
                <button
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                    }}
                    onClick={() => router.push("/calendar")}
                >
                    Calendario
                </button>
            </div>
        </div>
    );
}
