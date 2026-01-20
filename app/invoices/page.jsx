
"use client";
import React, { useState, useEffect } from 'react';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null); // id de la facture en édition ou null
  const [newInvoice, setNewInvoice] = useState({
    reason: '',
    amount: '',
    patient: '',
    created_at: ''
  });

  // Charger les factures depuis l'API
  useEffect(() => {
    fetch('/api/invoices')
      .then(res => res.ok ? res.json() : [])
      .then(data => setInvoices(data))
      .catch(() => setInvoices([]));
  }, []);

  if (!Array.isArray(invoices)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-cyan-200">
        <div>Chargement des factures...</div>
      </div>
    );
  }

  const openEditModal = (invoice) => {
    setEditingInvoice(invoice._id);
    setNewInvoice({
      reason: invoice.reason,
      amount: invoice.amount,
      patient: invoice.patient || '',
      created_at: invoice.created_at || ''
    });
    setModalOpen(true);
  };

  const handleAddOrEditInvoice = () => {
    if (!newInvoice.reason.trim() || !newInvoice.amount) return;
    if (editingInvoice) {
      setInvoices(invoices.map(inv =>
        inv._id === editingInvoice
          ? { ...inv, ...newInvoice }
          : inv
      ));
    } else {
      setInvoices([
        ...invoices,
        {
          ...newInvoice,
          _id: Date.now(),
          created_at: new Date().toISOString()
        }
      ]);
    }
    setNewInvoice({ reason: '', amount: '', patient: '', created_at: '' });
    setModalOpen(false);
    setEditingInvoice(null);
  };

  const handleDeleteInvoice = (id) => {
    setInvoices(invoices.filter(inv => inv._id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
      {/* Animated background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6966dea0eae2ef138766d9ef/e2fc969cb_Atelis.png" 
          alt="Atelis"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-auto opacity-5"
        />
      </div>
      <main className="relative z-10 flex flex-col items-center py-10">
        <div className="w-full max-w-3xl flex justify-start mb-6">
          <a href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-900/60 hover:bg-cyan-800/80 text-cyan-200 font-semibold shadow transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M15 18l-6-6 6-6"/></svg>
            Retour à l'accueil
          </a>
        </div>
        <div className="w-full max-w-3xl bg-white/10 rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-cyan-200">Factures</h1>
            <button
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold shadow"
              onClick={() => { setModalOpen(true); setEditingInvoice(null); setNewInvoice({ reason: '', amount: '', patient: '', created_at: '' }); }}
            >
              + Nouvelle facture
            </button>
          </div>
          <div className="space-y-6">
            {invoices.length === 0 && (
              <div className="text-cyan-100 text-center opacity-70">Aucune facture pour le moment.</div>
            )}
            {invoices.map((inv) => (
              <div key={inv._id} className="bg-cyan-900/60 rounded-lg p-5 shadow flex flex-col gap-2">
                <div className="flex items-center gap-4 justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-xl font-semibold text-cyan-200 truncate">{inv.reason}</div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      className="text-cyan-300 hover:text-cyan-100 font-bold px-2"
                      title="Modifier"
                      onClick={() => openEditModal(inv)}
                    >✎</button>
                    <button
                      className="text-red-400 hover:text-red-600 font-bold px-2"
                      title="Supprimer"
                      onClick={() => handleDeleteInvoice(inv._id)}
                    >×</button>
                  </div>
                </div>
                <div className="text-cyan-300 text-sm mb-1"><span className="font-semibold">Montant :</span> {inv.amount} $</div>
                {inv.patient && (
                  <div className="text-cyan-300 text-sm mb-1"><span className="font-semibold">Patient :</span> {inv.patient}</div>
                )}
                <div className="text-cyan-400 text-xs">{inv.created_at ? new Date(inv.created_at).toLocaleString() : ''}</div>
              </div>
            ))}
          </div>
        </div>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-[#0a223a] via-[#0e2a47] to-[#1a1a40] rounded-2xl p-8 w-full max-w-md shadow-2xl flex flex-col gap-4 relative border border-cyan-700/40">
              <button
                className="absolute top-2 right-2 text-cyan-300 hover:text-cyan-400 text-2xl font-bold"
                onClick={() => { setModalOpen(false); setEditingInvoice(null); }}
                title="Fermer"
              >×</button>
              <h2 className="text-2xl font-bold text-cyan-200 mb-2">{editingInvoice ? 'Modifier la facture' : 'Nouvelle facture'}</h2>
              <input
                className="border border-cyan-600 bg-[#11223a] text-cyan-100 placeholder:text-cyan-400 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Raison de la facture"
                value={newInvoice.reason}
                onChange={e => setNewInvoice({ ...newInvoice, reason: e.target.value })}
                autoFocus
              />
              <input
                className="border border-cyan-600 bg-[#11223a] text-cyan-100 placeholder:text-cyan-400 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Montant ($)"
                type="number"
                min="0"
                value={newInvoice.amount}
                onChange={e => setNewInvoice({ ...newInvoice, amount: e.target.value })}
              />
              <input
                className="border border-cyan-600 bg-[#11223a] text-cyan-100 placeholder:text-cyan-400 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Patient (optionnel)"
                value={newInvoice.patient}
                onChange={e => setNewInvoice({ ...newInvoice, patient: e.target.value })}
              />
              <button
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg px-4 py-2 font-semibold mt-2 shadow"
                onClick={handleAddOrEditInvoice}
              >{editingInvoice ? 'Enregistrer' : 'Créer'}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
