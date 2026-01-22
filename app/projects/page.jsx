
"use client";

import React, { useState, useEffect } from 'react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les projets depuis MongoDB via l'API
  useEffect(() => {
    setLoading(true);
    fetch('/api/projects')
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement des projets');
        return res.json();
      })
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Impossible de charger les projets');
        setProjects([]);
        setLoading(false);
      });
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // id du projet en édition ou null
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    manager: '',
    members: [''],
    links: [{ label: '', url: '' }],
    image: ''
  });

  const openEditModal = (project) => {
    setEditingProject(project.id);
    setNewProject({
      title: project.title,
      description: project.description,
      manager: project.manager || '',
      members: project.members && project.members.length ? project.members : [''],
      links: project.links && project.links.length ? project.links : [{ label: '', url: '' }],
      image: project.image || ''
    });
    setModalOpen(true);
  };

  const handleAddOrEditProject = async () => {
    if (!newProject.title.trim()) return;
    const cleanLinks = newProject.links ? newProject.links.filter(l => l.label.trim() && l.url.trim()) : [];
    const payload = {
      ...newProject,
      members: newProject.members.filter(m => m.trim() !== ''),
      links: cleanLinks,
      image: newProject.image,
      id: editingProject || Date.now().toString(),
    };
    if (editingProject) {
      // Update
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingProject, ...payload })
      });
      if (res.ok) {
        setProjects(projects.map(p => p.id === editingProject ? { ...p, ...payload } : p));
      }
    } else {
      // Create
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        setProjects([created, ...projects]);
      }
    }
    setNewProject({ title: '', description: '', manager: '', members: [''], links: [{ label: '', url: '' }], image: '' });
    setModalOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = async (id) => {
    const res = await fetch('/api/projects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-cyan-200">
        <div>Chargement des projets...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-rose-300">
        <div>{error}</div>
      </div>
    );
  }
  if (!Array.isArray(projects)) {
    return null;
  }

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
            <h1 className="text-3xl font-bold text-cyan-200">Projets</h1>
            <button
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold shadow"
              onClick={() => setModalOpen(true)}
            >
              + Nouveau projet
            </button>
          </div>
          <div className="space-y-6">
            {projects.length === 0 && (
              <div className="text-cyan-100 text-center opacity-70">Aucun projet pour le moment.</div>
            )}
            {projects.map((proj) => (
              <div key={proj.id} className="bg-cyan-900/60 rounded-lg p-5 shadow flex flex-col gap-2">
                <div className="flex items-center gap-4 justify-between">
                  {proj.image && (
                    <div className="w-20 h-20 flex items-center justify-center rounded-xl shadow border-2 border-cyan-700 bg-cyan-950 overflow-hidden">
                      <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" draggable="false" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xl font-semibold text-cyan-200 truncate">{proj.title}</div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      className="text-cyan-300 hover:text-cyan-100 font-bold px-2"
                      title="Modifier"
                      onClick={() => openEditModal(proj)}
                    >✎</button>
                    <button
                      className="text-red-400 hover:text-red-600 font-bold px-2"
                      title="Supprimer"
                      onClick={() => handleDeleteProject(proj.id)}
                    >×</button>
                  </div>
                </div>
                {proj.manager && (
                  <div className="text-cyan-300 text-sm mb-1"><span className="font-semibold">Responsable :</span> {proj.manager}</div>
                )}
                {proj.members && proj.members.length > 0 && (
                  <div className="text-cyan-300 text-sm mb-2"><span className="font-semibold">Membres :</span> {proj.members.filter(m => m.trim() !== '').join(', ')}</div>
                )}
                <div className="text-cyan-100 opacity-80 whitespace-pre-line">{proj.description}</div>
              </div>
            ))}
          </div>
        </div>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-[#0a223a] via-[#0e2a47] to-[#1a1a40] rounded-2xl p-8 w-full max-w-md shadow-2xl flex flex-col gap-4 relative border border-cyan-700/40">
              <button
                className="absolute top-2 right-2 text-cyan-300 hover:text-cyan-400 text-2xl font-bold"
                onClick={() => { setModalOpen(false); setEditingProject(null); }}
                title="Fermer"
              >×</button>
                    <div className="mb-2">
                      <label className="block text-cyan-300 text-sm mb-1">Image du projet (URL)</label>
                      <div className="flex gap-2 items-center">
                        <input
                          className="flex-1 border border-cyan-600 bg-[#11223a] text-cyan-100 placeholder:text-cyan-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          placeholder="URL de l'image (https://...)"
                          value={newProject.image}
                          onChange={e => setNewProject({ ...newProject, image: e.target.value })}
                        />
                        {newProject.image && (
                          <img src={newProject.image} alt="miniature projet" className="w-12 h-12 object-cover rounded shadow border border-cyan-700" />
                        )}
                      </div>
                    </div>
              <h2 className="text-2xl font-bold text-cyan-200 mb-2">{editingProject ? 'Modifier le projet' : 'Nouveau projet'}</h2>
              <input
                className="border border-cyan-600 bg-[#11223a] text-cyan-100 placeholder:text-cyan-400 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Titre du projet"
                value={newProject.title}
                onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                autoFocus
              />
              <textarea
                className="border border-cyan-600 bg-[#11223a] text-cyan-100 placeholder:text-cyan-400 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Description du projet"
                value={newProject.description}
                onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                rows={4}
              />
              <input
                className="border border-cyan-600 bg-[#11223a] text-cyan-100 placeholder:text-cyan-400 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Responsable du projet"
                value={newProject.manager}
                onChange={e => setNewProject({ ...newProject, manager: e.target.value })}
              />
              <div className="mb-2">
                <label className="block text-cyan-300 text-sm mb-1">Membres du projet</label>
                {newProject.members.map((member, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-1 w-full">
                    <input
                      className="flex-1 border border-cyan-600 bg-[#11223a] text-cyan-100 placeholder:text-cyan-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      placeholder={`Membre ${idx + 1}`}
                      value={member}
                      onChange={e => {
                        const members = [...newProject.members];
                        members[idx] = e.target.value;
                        setNewProject({ ...newProject, members });
                      }}
                    />
                    {newProject.members.length > 1 && (
                      <button
                        type="button"
                        className="text-cyan-400 hover:text-red-400 font-bold px-2"
                        onClick={() => {
                          setNewProject({
                            ...newProject,
                            members: newProject.members.filter((_, i) => i !== idx)
                          });
                        }}
                        title="Retirer ce membre"
                      >×</button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="text-cyan-300 hover:text-cyan-400 text-sm font-semibold mt-1"
                  onClick={() => setNewProject({ ...newProject, members: [...newProject.members, ''] })}
                >+ Ajouter un membre</button>
              </div>
              <div className="mb-2">
                <label className="block text-cyan-300 text-sm mb-1">Liens utiles (images, docs, etc)</label>
                {newProject.links.map((link, idx) => (
                  <div key={idx} className="flex gap-2 mb-1">
                    <input
                      className="flex-1 min-w-0 border border-cyan-600 bg-[#11223a] text-cyan-100 placeholder:text-cyan-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      placeholder="Intitulé du lien (ex: Image, Fiche, ... )"
                      value={link.label}
                      onChange={e => {
                        const links = [...newProject.links];
                        links[idx].label = e.target.value;
                        setNewProject({ ...newProject, links });
                      }}
                    />
                    <input
                      className="flex-1 min-w-0 border border-cyan-600 bg-[#11223a] text-cyan-100 placeholder:text-cyan-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      placeholder="URL (https://...)"
                      value={link.url}
                      onChange={e => {
                        const links = [...newProject.links];
                        links[idx].url = e.target.value;
                        setNewProject({ ...newProject, links });
                      }}
                    />
                    {newProject.links.length > 1 && (
                      <button
                        type="button"
                        className="text-cyan-400 hover:text-red-400 font-bold px-2"
                        onClick={() => {
                          setNewProject({
                            ...newProject,
                            links: newProject.links.filter((_, i) => i !== idx)
                          });
                        }}
                        title="Retirer ce lien"
                      >×</button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="text-cyan-300 hover:text-cyan-400 text-sm font-semibold mt-1"
                  onClick={() => setNewProject({ ...newProject, links: [...newProject.links, { label: '', url: '' }] })}
                >+ Ajouter un lien</button>
              </div>
              <button
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg px-4 py-2 font-semibold mt-2 shadow"
                onClick={handleAddOrEditProject}
              >{editingProject ? 'Enregistrer' : 'Créer'}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
