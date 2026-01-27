"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CoronerReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/coroner");
        if (!res.ok) throw new Error("Erreur lors du chargement des rapports");
        const data = await res.json();
        setReports(data);
      } catch (e) {
        setError(e.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    setDeleteError("");
    try {
      const res = await fetch(`/api/coroner?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setReports((prev) => prev.filter((r) => r._id !== id));
      setSelected(null);
    } catch (e) {
      setDeleteError(e.message || "Erreur inconnue");
    } finally {
      setDeleting(null);
    }
  };

  // Filtrage des rapports selon la recherche (nom et prénom)
  const filteredReports = Array.isArray(reports)
    ? reports.filter((r) =>
        r.name && r.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-[#0a1620] flex flex-col items-center py-10">
      <>
        <div className="w-full max-w-4xl bg-[#101c2b] border-2 border-cyan-400 rounded-2xl shadow-2xl p-8 font-mono text-cyan-200" style={{ boxShadow: "0 0 24px #00fff7a0" }}>
          <div className="flex justify-between items-center mb-6">
            <button
              className="px-4 py-2 rounded bg-cyan-900 hover:bg-cyan-800 text-cyan-200 font-semibold border border-cyan-700/30 transition-colors shadow"
              onClick={() => router.push("/")}
            >
              Retour à l'accueil
            </button>
            <h1 className="text-3xl font-bold text-cyan-300 text-center flex-1 tracking-widest" style={{ textShadow: "0 0 8px #00fff7" }}>RAPPORTS CORONER</h1>
            <span className="w-32" />
          </div>

          {/* Barre de recherche */}
          <div className="mb-6 flex justify-center">
            <input
              type="text"
              className="w-full max-w-md px-4 py-2 rounded border border-cyan-400 bg-[#0a223a] text-cyan-200 placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Rechercher par nom et prénom..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {loading && <div className="text-cyan-300 text-center">Chargement...</div>}
          {error && <div className="text-red-400 text-center">{error}</div>}
          {Array.isArray(reports) && filteredReports.length === 0 && !loading && (
            <div className="text-cyan-400 text-center">Aucun rapport trouvé.</div>
          )}
          {Array.isArray(reports) && filteredReports.length > 0 && (
            <div className="space-y-6">
              {filteredReports.map((r) => (
                <div key={r._id} className="border border-cyan-700 rounded-lg p-4 bg-[#0a223a]/40 cursor-pointer hover:border-cyan-400 transition-all" onClick={() => setSelected(r)}>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div><span className="text-cyan-400 text-xs">Nom et prénom :</span> <span className="font-bold">{r.name}</span></div>
                    <div><span className="text-cyan-400 text-xs">Sexe :</span> {r.sex}</div>
                    <div><span className="text-cyan-400 text-xs">Date de naissance :</span> {r.birth}</div>
                    <div><span className="text-cyan-400 text-xs">Terminal :</span> {r.terminal}</div>
                    <div><span className="text-cyan-400 text-xs">Date/Heure :</span> {r.eventDate}</div>
                    <div><span className="text-cyan-400 text-xs">Lieu :</span> {r.location}</div>
                  </div>
                  <div className="mb-1"><span className="text-cyan-400 text-xs">Médecin légiste :</span> {r.coroner}</div>
                  <div className="mb-1"><span className="text-cyan-400 text-xs">Informations :</span> {r.info}</div>
                  <div className="flex justify-between text-xs text-cyan-500 mt-2">
                    <span>Signature : {r.signature}</span>
                    <span>Accès : {r.accessDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DIALOG RAPPORT DETAIL */}
        {selected && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="relative w-[540px] max-w-full bg-[#101c2b] border-2 border-cyan-400 rounded-2xl shadow-2xl p-8 font-mono text-cyan-200" style={{ boxShadow: "0 0 24px #00fff7a0" }}>
              <button className="absolute top-2 right-2 text-cyan-400 text-2xl font-bold" onClick={() => setSelected(null)} title="Fermer">×</button>
              <h2 className="text-2xl font-bold text-cyan-300 mb-4 text-center tracking-widest">FICHE RAPPORT</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-cyan-400 text-xs mb-1">NOM ET PRÉNOM</label>
                  <div className="border border-cyan-400 rounded px-3 py-2 text-cyan-100">{selected.name}</div>
                </div>
                <div>
                  <label className="block text-cyan-400 text-xs mb-1">CODE SEXE</label>
                  <div className="border border-cyan-400 rounded px-3 py-2 text-cyan-100">{selected.sex}</div>
                </div>
                <div>
                  <label className="block text-cyan-400 text-xs mb-1">DATE DE NAISSANCE</label>
                  <div className="border border-cyan-400 rounded px-3 py-2 text-cyan-100">{selected.birth}</div>
                </div>
                <div>
                  <label className="block text-cyan-400 text-xs mb-1">ENREGISTREMENT TERMINAL</label>
                  <div className="border border-cyan-400 rounded px-3 py-2 text-cyan-100">{selected.terminal}</div>
                </div>
                <div>
                  <label className="block text-cyan-400 text-xs mb-1">DATE & HEURE ÉVÉNEMENT</label>
                  <div className="border border-cyan-400 rounded px-3 py-2 text-cyan-100">{selected.eventDate}</div>
                </div>
                <div>
                  <label className="block text-cyan-400 text-xs mb-1">CODE LOCALISATION</label>
                  <div className="border border-cyan-400 rounded px-3 py-2 text-cyan-100">{selected.location}</div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-cyan-400 text-xs mb-1">MÉDECIN LÉGISTE</label>
                <div className="border border-cyan-400 rounded px-3 py-2 text-cyan-100">{selected.coroner}</div>
              </div>
              <div className="mb-4">
                <label className="block text-cyan-400 text-xs mb-1">DONNÉES AUTOPSIE / INFORMATIONS</label>
                <div className="border border-cyan-400 rounded px-3 py-2 text-cyan-100 whitespace-pre-line">{selected.info}</div>
              </div>
              <div className="border-t border-cyan-700 my-6" />
              <div className="italic text-cyan-300 text-center text-sm mb-4">"Je certifie sur l'honneur l'exactitude de ces informations."</div>
              <div className="flex flex-row items-end gap-4 mb-2">
                <div className="flex-1 flex flex-col">
                  <label className="block text-cyan-400 text-xs mb-1">SIGNATURE NUMÉRIQUE DU MÉDECIN LÉGISTE</label>
                  <div className="border-b-2 border-cyan-400 rounded-none px-3 py-2 text-cyan-100 whitespace-nowrap">{selected.signature}</div>
                </div>
                <div className="flex-1 flex flex-col items-end">
                  <label className="block text-cyan-400 text-xs mb-1 text-right">DATE D'ACCÈS TERMINAL</label>
                  <div className="border-b-2 border-cyan-400 rounded-none px-3 py-2 text-cyan-100 whitespace-nowrap text-right">{selected.accessDate}</div>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold shadow border border-rose-400"
                  onClick={() => handleDelete(selected._id)}
                  disabled={deleting === selected._id}
                >
                  {deleting === selected._id ? "Suppression..." : "Supprimer"}
                </button>
                <button
                  className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-bold shadow border border-cyan-400"
                  onClick={() => setSelected(null)}
                >Fermer</button>
              </div>
              {deleteError && <div className="text-red-400 text-center mt-2">{deleteError}</div>}
            </div>
          </div>
        )}
      </>
    </div>
  );
}
// ...