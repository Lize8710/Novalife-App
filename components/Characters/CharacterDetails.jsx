import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, User, MapPin, Briefcase, Heart, Droplets, 
  Calendar, Globe, Stethoscope, FileText, Phone, UserCheck, Paperclip, ExternalLink, Image as ImageIcon, Link as LinkIcon 
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const bloodTypeColors = {
  'A+': 'bg-rose-500/20 text-rose-400 shadow-rose-500/50',
  'A-': 'bg-rose-500/20 text-rose-300 shadow-rose-500/50',
  'B+': 'bg-cyan-500/20 text-cyan-400 shadow-cyan-500/50',
  'B-': 'bg-cyan-500/20 text-cyan-300 shadow-cyan-500/50',
  'AB+': 'bg-purple-500/20 text-purple-400 shadow-purple-500/50',
  'AB-': 'bg-purple-500/20 text-purple-300 shadow-purple-500/50',
  'O+': 'bg-amber-500/20 text-amber-400 shadow-amber-500/50',
  'O-': 'bg-amber-500/20 text-amber-300 shadow-amber-500/50',
};

export default function CharacterDetails({ character, onClose, trustedPersons = [], allCharacters = [], onViewTrustedPerson }) {
  // Always ensure trustedPersons is an array
  const safeTrustedPersons = Array.isArray(trustedPersons) ? trustedPersons : [];
    const [showModal, setShowModal] = React.useState(false);
  const initials = `${character.first_name?.[0] || ''}${character.last_name?.[0] || ''}`.toUpperCase();

  const InfoRow = ({ icon: Icon, label, value }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-4 py-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-cyan-400/70 uppercase tracking-wider">{label}</p>
          <p className="text-slate-300 mt-0.5">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-cyan-500/20 border border-cyan-500/30 overflow-hidden max-h-[90vh] overflow-y-auto"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
      
      {/* Header compact avec photo et nom */}
      <div className="relative flex items-end h-32 overflow-hidden">
        {/* Gif en fond, couvre toute la zone */}
        <img src="/logo gif.gif" alt="Fond gif" className="absolute inset-0 w-full h-full object-cover opacity-80" style={{zIndex:1}} />
        {/* Une seule croix en haut à droite */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 z-20"
        >
          <X className="w-5 h-5" />
        </Button>
        <div className="flex items-end gap-4 px-6 pb-2">
          {character.avatar_url ? (
            (() => {
              let src = character.avatar_url;
              if (src && src.length > 100 && !src.startsWith('data:image') && !src.startsWith('http') && !src.startsWith('/api')) {
                src = `data:image/png;base64,${src}`;
              }
              return <img 
                src={src} 
                alt={`${character.first_name} ${character.last_name}`}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-cyan-500/50 shadow-lg shadow-cyan-500/50 cursor-pointer"
                onClick={() => setShowModal(true)}
                title="Agrandir la photo"
              />;
            })()
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-4 ring-cyan-500/50 shadow-lg shadow-cyan-500/50 backdrop-blur-sm">
              <span className="text-2xl font-bold text-cyan-400">{initials}</span>
            </div>
          )}
          <div>
            <h2 className="text-2xl font-semibold text-cyan-100 mb-1">{character.first_name} {character.last_name}</h2>
            {character.birth_date && (
              <div className="text-sm text-slate-300">{format(new Date(character.birth_date), 'dd/MM/yyyy', { locale: fr })}</div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="pt-6 px-6 pb-6 relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-cyan-100">
              {character.first_name} {character.last_name}
            </h2>
            {character.profession && (
              <p className="text-slate-400 mt-1">{character.profession}</p>
            )}
          </div>
          {character.blood_type && (
            <Badge className={`${bloodTypeColors[character.blood_type]} text-sm font-semibold px-3 py-1.5 shadow-lg`}>
              <Droplets className="w-3.5 h-3.5 mr-1.5" />
              {character.blood_type}
            </Badge>
          )}
        </div>

        <div className="mt-8 space-y-1 divide-y divide-cyan-500/10">
          <InfoRow icon={Calendar} label="Date de naissance" value={character.birth_date ? format(new Date(character.birth_date), 'dd MMMM yyyy', { locale: fr }) : null} />
          <InfoRow icon={Globe} label="Nationalité" value={character.nationality} />
          <InfoRow icon={Phone} label="Téléphone" value={character.phone} />
          <InfoRow icon={Briefcase} label="Métier" value={character.profession} />
          <InfoRow icon={MapPin} label="Adresse" value={character.address} />
          <InfoRow icon={Stethoscope} label="Médecin traitant" value={character.doctor ? `Dr. ${character.doctor}` : null} />

          {safeTrustedPersons.length > 0 && (
            <div className="flex items-start gap-4 py-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-indigo-400/70 uppercase tracking-wider mb-2">Personnes de confiance</p>
                <div className="space-y-1.5">
                  {safeTrustedPersons.map((person, index) => {
                    if (person.patient_id) {
                      const patient = allCharacters.find(c => c._id === person.patient_id);
                      if (patient) {
                        return (
                          <button 
                            key={index}
                            onClick={() => onViewTrustedPerson(patient)}
                            className="text-slate-300 hover:text-indigo-400 transition-colors underline decoration-dotted block"
                          >
                            {patient.first_name} {patient.last_name}
                            {patient.phone && ` - ${patient.phone}`}
                          </button>
                        );
                      }
                    }
                    return (
                      <p key={index} className="text-slate-300">
                        {person.name}
                        {person.phone && ` - ${person.phone}`}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          </div>

        {character.medical_history && (
          <div className="mt-6 p-4 bg-pink-500/10 rounded-xl border border-pink-500/30 shadow-lg shadow-pink-500/10">
            <div className="flex items-center gap-2 text-pink-400 font-medium mb-2">
              <FileText className="w-4 h-4" />
              Antécédents médicaux
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {character.medical_history}
            </p>
          </div>
        )}

        {Array.isArray(character.attachments) && character.attachments.length > 0 && (
          <div className="mt-6 p-4 bg-amber-500/10 rounded-xl border border-amber-500/30 shadow-lg shadow-amber-500/10">
            <div className="flex items-center gap-2 text-amber-400 font-medium mb-3">
              <Paperclip className="w-4 h-4" />
              Documents et liens ({character.attachments.length})
            </div>
            <div className="space-y-2">
              {character.attachments.map((attachment, index) => {
                const getIcon = () => {
                  switch (attachment.type) {
                    case 'image': return <ImageIcon className="w-4 h-4" />;
                    case 'link': return <LinkIcon className="w-4 h-4" />;
                    default: return <FileText className="w-4 h-4" />;
                  }
                };

                return (
                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-amber-500/20 hover:border-amber-500/40 transition-all group"
                  >
                    <div className="text-amber-400">
                      {getIcon()}
                    </div>
                    <span className="flex-1 text-sm text-slate-300 group-hover:text-slate-100 truncate">
                      {attachment.name}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
                  </a>
                );
              })}
            </div>
          </div>
        )}
        </div>
        </motion.div>
        );
        }