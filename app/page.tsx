"use client";

import Image from "next/image";
import { useState } from "react";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "2035Atelis") {
      if (typeof window !== "undefined") {
        localStorage.setItem("novalife_auth", "true");
        window.location.href = "/";
      }
    } else {
      setError("Mot de passe incorrect");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e293b 0%, #64748b 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative"
    }}>
      <Image
        src="/logo.png"
        alt="Logo Novalife"
        width={220}
        height={220}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          opacity: 0.15,
          zIndex: 0
        }}
      />
      <form
        onSubmit={handleSubmit}
        style={{
          background: "rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 1
        }}
      >
        <h2 style={{ color: "#fff", marginBottom: 24 }}>Connexion</h2>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Mot de passe"
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            border: "none",
            marginBottom: 16,
            width: 220,
            fontSize: 18
          }}
        />
        {error && <div style={{ color: "#ef4444", marginBottom: 12 }}>{error}</div>}
        <button
          type="submit"
          style={{
            background: "#334155",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 32px",
            fontSize: 18,
            cursor: "pointer"
          }}
        >Se connecter</button>
      </form>
    </div>
  );
}
