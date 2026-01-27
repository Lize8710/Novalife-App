"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const initial = {
  name: "",
  sex: "M",
  birth: "",
  terminal: "",
  eventDate: "",
  location: "",
  coroner: "",
  info: "",
  signature: "",
  accessDate: "",
};

export default function CoronerNewPage() {
  const [form, setForm] = useState({ ...initial });
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/coroner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setForm({ ...initial });
      router.replace("/coroner");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1620]">
      <form
        onSubmit={handleSubmit}
        className="relative w-[540px] max-w-full bg-[#101c2b] border-2 border-cyan-400 rounded-2xl shadow-2xl p-8 font-mono text-cyan-200"
        style={{ boxShadow: "0 0 24px #00fff7a0" }}
      >
        <div className="flex flex-col items-center mb-6">
          <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6966dea0eae2ef138766d9ef/e2fc969cb_Atelis.png" alt="Atelis" className="w-16 mb-2" />
          <h1 className="text-3xl font-bold text-cyan-300 tracking-widest mb-1" style={{ textShadow: "0 0 8px #00fff7" }}>NOVALIFE</h1>
          <div className="text-cyan-400 text-xs tracking-widest mb-2">SYSTÈME TERMINAL MÉDICAL V3.7</div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-cyan-400 text-xs mb-1">NOM ET PRÉNOM</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full bg-transparent border border-cyan-400 rounded px-3 py-2 text-cyan-100 font-mono outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>
          <div>
            <label className="block text-cyan-400 text-xs mb-1">CODE SEXE</label>
            <select name="sex" value={form.sex} onChange={handleChange} className="w-full bg-transparent border border-cyan-400 rounded px-3 py-2 text-cyan-100 font-mono outline-none focus:ring-2 focus:ring-cyan-400">
              <option value="M">M</option>
              <option value="F">F</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-cyan-400 text-xs mb-1">DATE DE NAISSANCE</label>
            <input name="birth" value={form.birth} onChange={handleChange} className="w-full bg-transparent border border-cyan-400 rounded px-3 py-2 text-cyan-100 font-mono outline-none focus:ring-2 focus:ring-cyan-400" placeholder="YYYY-MM-DD" />
          </div>
          <div>
            <label className="block text-cyan-400 text-xs mb-1">ENREGISTREMENT TERMINAL</label>
            <input name="terminal" value={form.terminal} onChange={handleChange} className="w-full bg-transparent border border-cyan-400 rounded px-3 py-2 text-cyan-100 font-mono outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>
          <div>
            <label className="block text-cyan-400 text-xs mb-1">DATE & HEURE ÉVÉNEMENT</label>
            <input name="eventDate" value={form.eventDate} onChange={handleChange} className="w-full bg-transparent border border-cyan-400 rounded px-3 py-2 text-cyan-100 font-mono outline-none focus:ring-2 focus:ring-cyan-400" placeholder="YYYY-MM-DD HH:mm" />
          </div>
          <div>
            <label className="block text-cyan-400 text-xs mb-1">CODE LOCALISATION</label>
            <input name="location" value={form.location} onChange={handleChange} className="w-full bg-transparent border border-cyan-400 rounded px-3 py-2 text-cyan-100 font-mono outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-cyan-400 text-xs mb-1">MÉDECIN LÉGISTE</label>
          <input name="coroner" value={form.coroner} onChange={handleChange} className="w-full bg-transparent border border-cyan-400 rounded px-3 py-2 text-cyan-100 font-mono outline-none focus:ring-2 focus:ring-cyan-400" />
        </div>
        <div className="mb-4">
          <label className="block text-cyan-400 text-xs mb-1">DONNÉES AUTOPSIE / INFORMATIONS</label>
          <textarea name="info" value={form.info} onChange={handleChange} className="w-full bg-transparent border border-cyan-400 rounded px-3 py-2 text-cyan-100 font-mono outline-none focus:ring-2 focus:ring-cyan-400" rows={2} />
        </div>
        <div className="border-t border-cyan-700 my-6" />
        <div className="italic text-cyan-300 text-center text-sm mb-4">"Je certifie sur l'honneur l'exactitude de ces informations."</div>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <label className="block text-cyan-400 text-xs mb-1">SIGNATURE NUMÉRIQUE DU MÉDECIN LÉGISTE</label>
            <input name="signature" value={form.signature} onChange={handleChange} className="w-full bg-transparent border-b-2 border-cyan-400 rounded-none px-3 py-2 text-cyan-100 font-mono outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>
          <div>
            <label className="block text-cyan-400 text-xs mb-1">DATE D'ACCÈS TERMINAL</label>
            <input name="accessDate" value={form.accessDate} onChange={handleChange} className="w-full bg-transparent border-b-2 border-cyan-400 rounded-none px-3 py-2 text-cyan-100 font-mono outline-none focus:ring-2 focus:ring-cyan-400" placeholder="YYYY-MM-DD" />
          </div>
        </div>
        <button type="submit" className="w-full mt-6 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-bold tracking-widest shadow-lg transition-all">ENREGISTRER</button>
        {saved && <div className="text-green-400 text-center mt-3">Enregistré !</div>}
        <div className="absolute left-0 right-0 bottom-2 text-center text-xs text-cyan-400 tracking-widest opacity-80 select-none">
          ● SYSTÈMES MÉDICAUX NOVALIFE - DIVISION LOS SANTOS
        </div>
      </form>
    </div>
  );
}
