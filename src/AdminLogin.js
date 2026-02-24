import React, { useState } from "react";
import { SUPABASE_URL } from "./supabaseClient";

const PALETTE = {
    bg: "#0b0f14",
    text: "#e5e7eb",
    subtext: "#9ca3af",
    cardBg: "#0f172a",
    border: "#1f2937",
    accent: "#22d3ee",
};

export default function AdminLogin({ onLogin }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${SUPABASE_URL}/functions/v1/auth-admin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();

            if (data.success) {
                sessionStorage.setItem("admin_auth", "true");
                onLogin();
            } else {
                setError("Incorrect password");
            }
        } catch (err) {
            setError("Failed to verify. Try again.");
        }
        setLoading(false);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    background: PALETTE.cardBg,
                    border: `1px solid ${PALETTE.border}`,
                    borderRadius: 12,
                    padding: "2.5rem",
                    width: 340,
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                }}
            >
                <h2 style={{ margin: 0, color: PALETTE.text, textAlign: "center", fontSize: "1.5rem" }}>
                    Admin Login
                </h2>
                <input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                    }}
                    style={{
                        padding: "0.75rem 1rem",
                        borderRadius: 8,
                        border: `1px solid ${PALETTE.border}`,
                        background: PALETTE.bg,
                        color: PALETTE.text,
                        fontSize: "1rem",
                        outline: "none",
                    }}
                />
                {error && (
                    <p style={{ margin: 0, color: "#ef4444", fontSize: "0.85rem", textAlign: "center" }}>
                        {error}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: "0.75rem",
                        borderRadius: 8,
                        border: "none",
                        background: PALETTE.accent,
                        color: PALETTE.bg,
                        fontSize: "1rem",
                        fontWeight: "bold",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "opacity 0.2s",
                        opacity: loading ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
                    onMouseLeave={(e) => { if (!loading) e.currentTarget.style.opacity = "1"; }}
                >
                    {loading ? "Verifying..." : "Login"}
                </button>
            </form>
        </div>
    );
}
