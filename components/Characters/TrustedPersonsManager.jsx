import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, X, Plus } from 'lucide-react';

export default function TrustedPersonsManager({ trustedPersons = [], onChange }) {
  // Always ensure trustedPersons is an array
  const safeTrustedPersons = Array.isArray(trustedPersons) ? trustedPersons : [];
  // Suppression de la pagination, retour à l'affichage complet
  const [isAdding, setIsAdding] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');

  const resetForm = () => {
    setManualName('');
    setManualPhone('');
    setIsAdding(false);
  };

  const handleAdd = () => {
    if (!manualName) return;
    const newPerson = {
      name: manualName,
      phone: manualPhone,
    };
    onChange([...safeTrustedPersons, newPerson]);
    resetForm();
  };

  const handleRemove = (idx) => {
    const updated = safeTrustedPersons.filter((_, i) => i !== idx);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {isAdding ? (
        <div className="p-4 bg-slate-800/50 rounded-lg border border-indigo-500/30 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="manual_name" className="text-slate-300">Nom complet</Label>
            <Input
              id="manual_name"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder="Jean Dupont"
              className="bg-slate-800/50 border-indigo-500/30 text-cyan-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manual_phone" className="text-slate-300">Téléphone</Label>
            <Input
              id="manual_phone"
              type="tel"
              value={manualPhone}
              onChange={(e) => setManualPhone(e.target.value)}
              placeholder="+33 6 12 34 56 78"
              className="bg-slate-800/50 border-indigo-500/30 text-cyan-100"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleAdd}
              disabled={!manualName}
              className="flex-1"
            >
              Ajouter
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={resetForm}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="w-full border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une personne de confiance
        </Button>
      )}

      <div className="space-y-2">
        {safeTrustedPersons.length === 0 && (
          <div className="text-slate-400 text-sm">Aucune personne de confiance ajoutée.</div>
        )}
        {safeTrustedPersons.map((person, idx) => (
          <div key={idx} className="flex items-center justify-between bg-slate-800/40 rounded px-3 py-2 border border-indigo-500/20">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-cyan-100 font-medium">{person.name}</span>
              {person.phone && <span className="text-slate-400 text-xs ml-2">{person.phone}</span>}
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => handleRemove(idx)}
              className="text-red-400 hover:bg-red-900/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}