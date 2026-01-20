import React, { useState, useEffect } from 'react';
import { uploadAvatarToGridFS } from '../../lib/uploadAvatar';
import { motion, AnimatePresence } from 'framer-motion';
// Utilisation de l'API route pour récupérer les personnages
const api = {
  list: async () => {
    const res = await fetch('/api/characters');
    if (!res.ok) throw new Error('Erreur lors du chargement des personnages');
    return res.json();
  },
};
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save, User, MapPin, Briefcase, Heart, Droplets, UserCheck, Paperclip } from 'lucide-react';
import AttachmentsManager from './AttachmentsManager';
import TrustedPersonsManager from './TrustedPersonsManager';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function CharacterForm({ character, onSubmit, onCancel, isLoading }) {
  const { data: allCharacters = [] } = useQuery({
    queryKey: ['characters'],
    queryFn: () => api.list(),
  });

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    nationality: '',
    phone: '',
    social_score: '',
    profession: '',
    address: '',
    blood_type: '',
    doctor: '',
    medical_history: '',
    trusted_persons: [],
    avatar_url: '', // base64 ou url
    attachments: []
  });

  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    if (character) {
      // Migration des anciennes données vers le nouveau format

      // Always ensure trustedPersons is an array (parse if string)
      let trustedPersons = character.trusted_persons;
      if (typeof trustedPersons === 'string') {
        try {
          trustedPersons = JSON.parse(trustedPersons);
        } catch {
          trustedPersons = [];
        }
      }
      if (!Array.isArray(trustedPersons)) trustedPersons = [];

      // Si l'ancien format existe, le migrer
      if (!trustedPersons.length) {
        if (character.trusted_person_id) {
          trustedPersons = [{ patient_id: character.trusted_person_id }];
        } else if (character.trusted_person_name) {
          trustedPersons = [{
            name: character.trusted_person_name,
            phone: character.trusted_person_phone || ''
          }];
        }
      }

      setFormData({
        first_name: character.first_name || '',
        last_name: character.last_name || '',
        birth_date: character.birth_date || '',
        nationality: character.nationality || '',
        phone: character.phone || '',
        social_score: character.social_score || '',
        profession: character.profession || '',
        address: character.address || '',
        blood_type: character.blood_type || '',
        doctor: character.doctor || '',
        medical_history: character.medical_history || '',
        trusted_persons: trustedPersons,
        avatar_url: character.avatar_url || '',
        attachments: character.attachments || []
      });
      setAvatarPreview(character.avatar_url || '');
    }
  }, [character]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (avatarUploading) {
      alert("Merci de patienter, l'upload de la photo est en cours.");
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'avatar_url') {
      setAvatarPreview(value);
    }
  };

  // Upload image sur GridFS
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarUploading(true);
      setAvatarPreview(URL.createObjectURL(file));
      try {
        const { fileUrl } = await uploadAvatarToGridFS(file);
        setFormData(prev => ({ ...prev, avatar_url: fileUrl }));
      } catch (err) {
        alert("Erreur lors de l'upload de la photo");
      } finally {
        setAvatarUploading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-cyan-500/20 border border-cyan-500/30 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
      <div className="px-6 py-5 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 relative">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-cyan-100">
            {character ? 'Modifier le patient' : 'Nouveau patient'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel} className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 relative">
        {/* Identité */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-cyan-400 uppercase tracking-wider">
            <User className="w-4 h-4" />
            Identité
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-slate-300">Prénom *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                placeholder="Jean"
                className="h-11 bg-slate-800/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-slate-300">Nom *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                placeholder="Dupont"
                className="h-11 bg-slate-800/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birth_date" className="text-slate-300">Date de naissance</Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => handleChange('birth_date', e.target.value)}
                className="h-11 bg-slate-800/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality" className="text-slate-300">Nationalité</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
                placeholder="Française"
                className="h-11 bg-slate-800/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
              />
            </div>
            </div>

            <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-300">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+33 6 12 34 56 78"
              className="h-11 bg-slate-800/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
            />
            </div>

            <div className="space-y-2">
            <Label htmlFor="social_score" className="text-slate-300">Score social</Label>
            <Input
              id="social_score"
              value={formData.social_score}
              onChange={(e) => handleChange('social_score', e.target.value)}
              placeholder="Score social"
              className="h-11 bg-slate-800/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
            />
            </div>

          <div className="space-y-2">
            <Label htmlFor="avatar_upload" className="text-slate-300">Photo du patient</Label>
            <input
              id="avatar_upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
            />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Aperçu avatar"
                className="mt-2 rounded-lg shadow-md max-h-32 border border-cyan-500/30"
              />
            )}
          </div>
        </div>

        {/* Profession & Adresse */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-purple-400 uppercase tracking-wider">
            <Briefcase className="w-4 h-4" />
            Profession & Localisation
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profession" className="text-slate-300">Métier</Label>
            <Input
              id="profession"
              value={formData.profession}
              onChange={(e) => handleChange('profession', e.target.value)}
              placeholder="Médecin, Avocat, Ingénieur..."
              className="h-11 bg-slate-800/50 border-purple-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-slate-300">Adresse</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="123 Rue de la Paix, Paris"
              className="h-11 bg-slate-800/50 border-purple-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/50"
            />
          </div>
        </div>

        {/* Personnes de confiance */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-400 uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            Personnes de confiance
          </div>

          <TrustedPersonsManager
            trustedPersons={formData.trusted_persons}
            onChange={(persons) => handleChange('trusted_persons', persons)}
            allCharacters={allCharacters}
            currentCharacterId={character?.id}
          />
        </div>

        {/* Informations médicales */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-pink-400 uppercase tracking-wider">
            <Heart className="w-4 h-4" />
            Informations médicales
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="blood_type" className="text-slate-300">Groupe sanguin</Label>
              <select 
                id="blood_type"
                value={formData.blood_type || ''}
                onChange={(e) => handleChange('blood_type', e.target.value)}
                className="h-11 w-full rounded-md bg-slate-800/50 border border-pink-500/30 text-cyan-100 px-3 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50"
              >
                <option value="">Sélectionner...</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor" className="text-slate-300">Médecin traitant</Label>
              <Input
                id="doctor"
                value={formData.doctor}
                onChange={(e) => handleChange('doctor', e.target.value)}
                placeholder="Dr. Martin"
                className="h-11 bg-slate-800/50 border-pink-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-pink-500 focus:ring-pink-500/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medical_history" className="text-slate-300">Antécédents médicaux</Label>
            <Textarea
              id="medical_history"
              value={formData.medical_history}
              onChange={(e) => handleChange('medical_history', e.target.value)}
              placeholder="Allergies, maladies chroniques, opérations..."
              rows={3}
              className="resize-none bg-slate-800/50 border-pink-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-pink-500 focus:ring-pink-500/50"
            />
          </div>
          </div>

          {/* Pièces jointes */}
          <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-amber-400 uppercase tracking-wider">
            <Paperclip className="w-4 h-4" />
            Documents et liens
          </div>

          <AttachmentsManager
            attachments={formData.attachments}
            onChange={(attachments) => handleChange('attachments', attachments)}
          />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-cyan-500/20">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="flex-1 h-11 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || avatarUploading || (avatarPreview && !formData.avatar_url)}
            className="flex-1 h-11 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
          >
            <Save className="w-4 h-4 mr-2" />
            {avatarUploading ? 'Upload photo...' : isLoading ? 'Enregistrement...' : (character ? 'Mettre à jour' : 'Créer')}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}