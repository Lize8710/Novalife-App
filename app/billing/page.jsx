

"use client";
import React, { useState, useEffect } from 'react';
export default function BillingPage() {
  const [invoices, setInvoices] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null); // id de la facture en édition ou null
  const [newInvoice, setNewInvoice] = useState({
    reason: '',
    amount: '',
    patient: '',
    created_at: ''
  });
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [errorPatients, setErrorPatients] = useState('');
  const [search, setSearch] = useState("");

  // Charger les patients
  useEffect(() => {
    setLoadingPatients(true);
    fetch('/api/characters')
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement des patients');
        return res.json();
      })
      .then(data => {
        setPatients(data);
        setLoadingPatients(false);
      })
      .catch(() => {
        setErrorPatients('Impossible de charger les patients');
        setLoadingPatients(false);
      });
  }, []);



  // Fonction pour charger les factures depuis MongoDB via l'API
  const fetchInvoices = () => {
    setInvoices(undefined);
    fetch('/api/invoices')
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement des factures');
        return res.json();
      })
      .then(data => {
        setInvoices(data);
      })
      .catch(() => {
        setInvoices([]);
      });
  };

  useEffect(() => {
    fetchInvoices();
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

  const handleAddOrEditInvoice = async () => {
    if (!newInvoice.reason.trim() || !newInvoice.amount || !newInvoice.patient) return;
    if (editingInvoice) {
      const res = await fetch('/api/invoices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: editingInvoice, ...newInvoice })
      });
      if (res.ok) {
        fetchInvoices();
      }
    } else {
      const patientObj = patients.find(p => (p.first_name + ' ' + p.last_name) === newInvoice.patient);
      const patientId = patientObj ? (patientObj._id || patientObj.id) : undefined;
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          reason: newInvoice.reason,
          amount: newInvoice.amount,
          patient: newInvoice.patient
        })
      });
      if (res.ok) {
        fetchInvoices();
      }
    }
    setNewInvoice({ reason: '', amount: '', patient: '', created_at: '' });
    setModalOpen(false);
    setEditingInvoice(null);
  };

  const handleDeleteInvoice = async (id) => {
    const res = await fetch('/api/invoices', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: id })
    });
    if (res.ok) {
      fetchInvoices();
    }
  };

  // Associer le nom du patient à chaque facture si manquant
  const invoicesWithPatient = invoices.map(inv => {
    if (inv.patient) return inv;
    const patientObj = patients.find(p => (p._id === inv.patientId || p.id === inv.patientId));
    return {
      ...inv,
      patient: patientObj ? (patientObj.first_name + ' ' + patientObj.last_name) : ''
    };
  });

  // Filtrer les factures selon la recherche
  const filteredInvoices = invoicesWithPatient.filter(inv =>
    inv.patient && inv.patient.toLowerCase().includes(search.toLowerCase())
  );

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
          <div className="mb-6">
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-cyan-500/40 bg-[#11223a] text-cyan-100 placeholder:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Rechercher par nom ou prénom du patient..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="space-y-6">
            {filteredInvoices.length === 0 && (
              <div className="text-cyan-100 text-center opacity-70">Aucune facture pour le moment.</div>
            )}
            {filteredInvoices.map((inv) => (
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
              <select
                className="border border-cyan-600 bg-[#11223a] text-cyan-100 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={newInvoice.patient}
                onChange={e => setNewInvoice({ ...newInvoice, patient: e.target.value })}
                required
                disabled={loadingPatients || errorPatients}
              >
                <option value="">Sélectionnez un patient...</option>
                {patients.map((p) => (
                  <option key={p._id || p.id} value={p.first_name + ' ' + p.last_name}>
                    {p.first_name} {p.last_name}
                  </option>
                ))}
              </select>
              {loadingPatients && <div className="text-cyan-400 text-sm mb-2">Chargement des patients...</div>}
              {errorPatients && <div className="text-rose-400 text-sm mb-2">{errorPatients}</div>}
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
