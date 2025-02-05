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
        const { data, error } = await supabase
            .from("note")
            .select("*")
            .eq("user_id", user?.id)
            .eq("category", category);

        if (error) {
            console.error("Error fetching notes:", error);
        } else {
            setNotes(data);
        }
    }

    async function handleAddNote() {
        if (!newNote.trim()) return;

        const { error } = await supabase.from("note").insert([
            {
                text: newNote,
                category,
                user_id: user?.id,
                due_date: new Date(),
            },
        ]);

        if (error) {
            console.error("Error inserting note:", error);
        } else {
            setNewNote("");
            setShowInput(false);
            fetchNotes();
        }
    }

    async function handleCompleteNote(id) {
        const { error } = await supabase.from("note").delete().eq("id", id);

        if (error) {
            console.error("Error deleting note:", error);
        } else {
            fetchNotes();
        }
    }

    return (
        <div style={{ padding: "16px" }}>
            {/* Botones de Filtro */}
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

            {/* Listado de Notas */}
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
                            onChange={() => handleCompleteNote(note.id)}
                            style={{ marginLeft: "8px" }}
                        />
                    </li>
                ))}
            </ul>

            {/* Agregar Nota */}
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
        </div>
    );
}
