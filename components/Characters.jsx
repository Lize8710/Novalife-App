"use client";
import React, { useState } from 'react';
import { base44 } from '@/api/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Loader2, Users } from 'lucide-react';


import CharacterCard from '@/components/Characters/CharactersCard';
import CharacterForm from '@/components/Characters/CharacterForm';
import CharacterDetails from '@/components/Characters/CharacterDetails';

export default function Characters() {
  // Suppression de la pagination côté serveur
  const [showForm, setShowForm] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [viewingCharacter, setViewingCharacter] = useState(null);
  const [deletingCharacter, setDeletingCharacter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const queryClient = useQueryClient();

  const { data: characters = [], isLoading } = useQuery({
    queryKey: ['characters'],
    queryFn: () => base44.entities.Character.list('created_at'),
    // Pas de cache prolongé, configuration par défaut
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const getTrustedPersons = (character) => {
    return character.trusted_persons || [];
  };

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Character.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      setShowForm(false);
    },
    onError: (error) => {
      console.error('Erreur lors de la création:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Character.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      setShowForm(false);
      setEditingCharacter(null);
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Character.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      setDeletingCharacter(null);
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression:', error);
      setDeletingCharacter(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingCharacter) {
      updateMutation.mutate({ id: editingCharacter.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (character) => {
    setEditingCharacter(character);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCharacter(null);
  };

  const filteredCharacters = characters.filter(char => {
    const fullName = `${char.first_name} ${char.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) ||
      char.profession?.toLowerCase().includes(query) ||
      char.blood_type?.toLowerCase().includes(query) ||
      char.phone?.toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6966dea0eae2ef138766d9ef/e2fc969cb_Atelis.png" 
          alt="Atelis"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-auto opacity-5"
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6966dea0eae2ef138766d9ef/d73b7558b_Atelis.png"
                alt="Atelis"
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-cyan-100">Patients</h1>
                <p className="text-xs text-cyan-400/70">{characters.length} patient{characters.length > 1 ? 's' : ''}</p>
              </div>
            </div>

            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau
            </Button>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
          <Input
            placeholder="Rechercher par nom, métier, groupe sanguin, téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-slate-800/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50 shadow-lg shadow-cyan-500/10"
          />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative z-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : filteredCharacters.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-cyan-100 mb-1">
              {searchQuery ? 'Aucun résultat' : 'Aucun patient'}
            </h3>
            <p className="text-slate-400 mb-6">
              {searchQuery ? 'Essayez avec d\'autres termes' : 'Commencez par créer votre premier patient'}
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 shadow-lg shadow-cyan-500/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer un patient
              </Button>
            )}
          </motion.div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredCharacters.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    trustedPersons={getTrustedPersons(character)}
                    allCharacters={characters}
                    onView={setViewingCharacter}
                    onEdit={handleEdit}
                    onDelete={setDeletingCharacter}
                  />
                ))}
              </AnimatePresence>
            </div>
        )}
      </main>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-0 bg-transparent shadow-none">
          <DialogTitle className="sr-only">
            {editingCharacter ? 'Modifier le patient' : 'Nouveau patient'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Formulaire pour créer ou modifier un patient
          </DialogDescription>
          <CharacterForm
            character={editingCharacter}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={!!viewingCharacter} onOpenChange={() => setViewingCharacter(null)}>
        <DialogContent className="max-w-lg p-0 gap-0 border-0 bg-transparent shadow-none">
          <DialogTitle className="sr-only">Détails du patient</DialogTitle>
          <DialogDescription className="sr-only">
            Informations détaillées sur le patient
          </DialogDescription>
          {viewingCharacter && (
            <CharacterDetails
              character={viewingCharacter}
              trustedPersons={getTrustedPersons(viewingCharacter)}
              allCharacters={characters}
              onViewTrustedPerson={setViewingCharacter}
              onClose={() => setViewingCharacter(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingCharacter} onOpenChange={() => setDeletingCharacter(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce patient ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le patient{' '}
              <span className="font-semibold">
                {deletingCharacter?.first_name} {deletingCharacter?.last_name}
              </span>{' '}
              sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingCharacter?.id) {
                  deleteMutation.mutate(deletingCharacter.id);
                }
              }}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}