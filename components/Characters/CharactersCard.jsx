import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, MapPin, Briefcase, Heart, Eye, Pencil, Trash2, Phone, Calendar, UserCheck, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const bloodTypeColors = {
  'A+': 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-rose-500/50',
  'A-': 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-rose-500/50',
  'B+': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-cyan-500/50',
  'B-': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-cyan-500/50',
  'AB+': 'bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-purple-500/50',
  'AB-': 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-purple-500/50',
  'O+': 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-amber-500/50',
  'O-': 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-500/50',
};

export default function CharacterCard({ character, onView, onEdit, onDelete, trustedPersons = [], allCharacters = [] }) {
  const safeTrustedPersons = Array.isArray(trustedPersons) ? trustedPersons : [];
  const initials = `${character.first_name?.[0] || ''}${character.last_name?.[0] || ''}`.toUpperCase();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group relative overflow-hidden bg-slate-900/40 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/10 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6966dea0eae2ef138766d9ef/d73b7558b_Atelis.png"
          alt=""
          className="absolute right-2 bottom-2 w-20 h-auto opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg shadow-cyan-500/50" />
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="p-6 relative z-10">
          <div className="flex items-start gap-4">
            {character.avatar_url ? (
              <img 
                src={character.avatar_url} 
                alt={`${character.first_name} ${character.last_name}`}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-500/50"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-500/50 backdrop-blur-sm">
                <span className="text-lg font-semibold text-cyan-400">{initials}</span>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-cyan-100 truncate group-hover:text-cyan-300 transition-colors">
                {character.first_name} {character.last_name}
              </h3>
              
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {character.birth_date && (
                  <span className="text-sm text-slate-400">
                    {format(new Date(character.birth_date), 'dd/MM/yyyy', { locale: fr })}
                  </span>
                )}
                {character.nationality && (
                  <>
                    {character.birth_date && <span className="text-cyan-700">•</span>}
                    <span className="text-sm text-slate-400">{character.nationality}</span>
                  </>
                )}
                {character.social_score && (
                  <>
                    {(character.birth_date || character.nationality) && <span className="text-cyan-700">•</span>}
                    <span className="text-sm text-cyan-400">Score: {character.social_score}</span>
                  </>
                )}
              </div>
            </div>

            {character.blood_type && (
              <Badge 
                variant="outline" 
                className={`${bloodTypeColors[character.blood_type]} font-medium px-2.5 py-1 shadow-lg`}
              >
                {character.blood_type}
              </Badge>
            )}
          </div>

          <div className="mt-5 space-y-2.5">
            {character.profession && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-slate-300">{character.profession}</span>
              </div>
            )}

            {character.phone && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                  <Phone className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-slate-300">{character.phone}</span>
              </div>
            )}

            {character.address && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <MapPin className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-slate-300 truncate">{character.address}</span>
              </div>
            )}
            
            {character.doctor && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                  <Heart className="w-4 h-4 text-pink-400" />
                </div>
                <span className="text-slate-300">Dr. {character.doctor}</span>
              </div>
            )}

            {safeTrustedPersons.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
                  <UserCheck className="w-3.5 h-3.5" />
                  Personne{safeTrustedPersons.length > 1 ? 's' : ''} de confiance
                </div>
                {safeTrustedPersons.map((person, index) => {
                  let displayName = '';
                  if (person.patient_id) {
                    const patient = allCharacters.find(c => c._id === person.patient_id);
                    if (patient) {
                      displayName = `${patient.first_name} ${patient.last_name}`;
                    }
                  } else {
                    displayName = person.name;
                  }

                  return displayName ? (
                    <div key={index} className="flex items-center gap-2 text-sm ml-5">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/50" />
                      <span className="text-slate-300">{displayName}</span>
                    </div>
                  ) : null;
                })}
              </div>
            )}

            {/* Filter out trusted persons if they were wrongly stored as attachments */}
            {character.attachments && Array.isArray(character.attachments) && character.attachments.filter(att => !att.name || !att.phone).length > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Paperclip className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-slate-300">{
                  character.attachments.filter(att => !att.name || !att.phone).length
                } document{
                  character.attachments.filter(att => !att.name || !att.phone).length > 1 ? 's' : ''
                }</span>
              </div>
            )}
            </div>

          <div className="flex items-center gap-2 mt-5 pt-5 border-t border-cyan-500/20">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30"
              onClick={() => onView(character)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Voir
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30"
              onClick={() => onEdit(character)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Modifier
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 border border-transparent hover:border-pink-500/30"
              onClick={() => onDelete(character)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}