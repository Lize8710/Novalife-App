import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, X, Plus } from 'lucide-react';

export default function TrustedPersonsManager({ trustedPersons = [], onChange, allCharacters = [], currentCharacterId }) {
  const [isAdding, setIsAdding] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');

  const handleAdd = () => {
    if (patientId) {
      onChange([...trustedPersons, { patient_id: patientId }]);
    } else if (manualName) {
      onChange([...trustedPersons, { name: manualName, phone: manualPhone }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setIsAdding(false);
    setPatientId('');
    setManualName('');
    setManualPhone('');
  };

  const handleRemove = (index) => {
    onChange(trustedPersons.filter((_, i) => i !== index));
  };

  const getPersonDisplay = (person) => {
    if (person.patient_id) {
      const patient = allCharacters.find(c => c.id === person.patient_id);
      if (patient) {
        return `${patient.first_name} ${patient.last_name}${patient.phone ? ` - ${patient.phone}` : ''}`;
      }
      return 'Patient non trouvé';
    }
    return `${person.name}${person.phone ? ` - ${person.phone}` : ''}`;
  };

  return (
    <div className="space-y-3">
      {trustedPersons.length > 0 && (
        <div className="space-y-2">
          {trustedPersons.map((person, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30"
            >
              <UserCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span className="flex-1 text-sm text-slate-300">{getPersonDisplay(person)}</span>
              <button
                onClick={() => handleRemove(index)}
                className="text-slate-400 hover:text-red-400 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isAdding ? (
        <div className="p-4 bg-slate-800/50 rounded-lg border border-indigo-500/30 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="trusted_patient_id" className="text-slate-300">Patient existant</Label>
            <select 
              id="trusted_patient_id"
              value={patientId}
              onChange={(e) => {
                setPatientId(e.target.value);
                if (e.target.value) {
                  setManualName('');
                  setManualPhone('');
                }
              }}
              className="h-11 w-full rounded-md bg-slate-800/50 border border-indigo-500/30 text-cyan-100 px-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            >
              <option value="">Aucun</option>
              {allCharacters
                .filter(c => c.id !== currentCharacterId)
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.first_name} {c.last_name} {c.phone ? `- ${c.phone}` : ''}
                  </option>
                ))}
            </select>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-indigo-500/20"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800 px-2 text-slate-500">ou saisie manuelle</span>
            </div>
          </div>

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