import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, X, Plus } from 'lucide-react';

export default function TrustedPersonsManager({ trustedPersons = [], onChange, allCharacters = [], currentCharacterId }) {
  // Always ensure trustedPersons is an array
  const safeTrustedPersons = Array.isArray(trustedPersons) ? trustedPersons : [];
  // Suppression de la pagination, retour à l'affichage complet
  const [isAdding, setIsAdding] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
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
            <Label htmlFor="manual_name" className="text-slate-300">Nom complet</Label>
            <Input
              id="manual_name"
              value={manualName}
              onChange={(e) => {
                setManualName(e.target.value);
                if (e.target.value) setPatientId('');
              }}
              placeholder="Jean Dupont"
              disabled={!!patientId}
              className="bg-slate-800/50 border-indigo-500/30 text-cyan-100 disabled:opacity-50"
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
              disabled={!!patientId}
              className="bg-slate-800/50 border-indigo-500/30 text-cyan-100 disabled:opacity-50"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleAdd}
              disabled={!patientId && !manualName}
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
    </div>
  );
}