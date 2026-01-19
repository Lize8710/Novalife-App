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
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0a0a23 0%, #1e293b 100%)"
      }}
    >
      {/* GIF animé en fond */}
      <img
        src="/logo gif.gif"
        alt="Fond animé"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          transform: "translate(-50%, -50%)",
          opacity: 0.35,
          zIndex: 0,
          pointerEvents: "none"
        }}
      />
      {/* Logo Atelis en fondu */}
      <img
        src="/Atelis.png"
        alt="Logo Atelis"
        width={900}
        height={900}
        style={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.25,
          zIndex: 1,
          pointerEvents: "none"
        }}
      />
      {/* rien */}
      {/* Formulaire de connexion */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "rgba(44,62,80,0.7)",
          borderRadius: 20,
          padding: 40,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 1,
          minWidth: 320
        }}
      >
        <h2 style={{ color: "#fff", marginBottom: 24, fontWeight: 600, fontSize: 24 }}>Connexion</h2>
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
            fontSize: 18,
            background: "rgba(255,255,255,0.08)",
            color: "#fff"
          }}
        />
        {error && <div style={{ color: "#ef4444", marginBottom: 12 }}>{error}</div>}
        <button
          type="submit"
          style={{
            background: "linear-gradient(90deg, #06b6d4 0%, #a78bfa 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 32px",
            fontSize: 18,
            cursor: "pointer",
            fontWeight: 600,
            boxShadow: "0 2px 8px 0 rgba(31, 38, 135, 0.17)"
          }}
        >Se connecter</button>
      </form>
    </div>
  );
}
