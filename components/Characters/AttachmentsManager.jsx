import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { base44 } from '@/api/base44Client';
import { FileText, Image as ImageIcon, Link as LinkIcon, Upload, X, Loader2, ExternalLink } from 'lucide-react';

export default function AttachmentsManager({ attachments = [], onChange }) {
  // Always ensure attachments is an array
  const safeAttachments = Array.isArray(attachments) ? attachments : [];
  const [isAdding, setIsAdding] = useState(false);
  const [addType, setAddType] = useState('document');
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/characters/upload-attachment', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Erreur upload');
      const data = await res.json();
      const fileUrl = data.fileUrl || data.file_url;
      if (!fileUrl) {
        alert('Erreur : le serveur n’a pas retourné d’URL pour la pièce jointe.');
        return;
      }
      const newAttachment = {
        type,
        name: file.name,
        url: fileUrl,
        added_date: new Date().toISOString()
      };
      onChange([...attachments, newAttachment]);
      setIsAdding(false);
    } catch (error) {
      alert('Erreur lors de l’upload du fichier.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleAddLink = () => {
    if (!linkName || !linkUrl) return;

    const newAttachment = {
      type: 'link',
      name: linkName,
      url: linkUrl,
      added_date: new Date().toISOString()
    };

    onChange([...attachments, newAttachment]);
    setLinkName('');
    setLinkUrl('');
    setIsAdding(false);
  };

  const handleRemove = (index) => {
    onChange(attachments.filter((_, i) => i !== index));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'link': return <LinkIcon className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'image': return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
      case 'link': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      default: return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {/* Liste des liens */}
        {safeAttachments.length > 0 && (
          <div className="space-y-2">
            {safeAttachments.map((attachment, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg border ${getColor('link')}`}
              >
                <div className="flex-shrink-0">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{attachment.name}</p>
                </div>
                <a
                  href={attachment.url && (typeof attachment.url === 'string') && (attachment.url.startsWith('/') || attachment.url.startsWith('http')) ? attachment.url : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-slate-400 hover:text-slate-200"
                  onClick={e => {
                    if (!attachment.url || attachment.url === '#' || typeof attachment.url !== 'string' ||
                      !(attachment.url.startsWith('/') || attachment.url.startsWith('http'))
                    ) {
                      e.preventDefault();
                    }
                    e.stopPropagation();
                  }}
                  tabIndex={0}
                  role="link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="flex-shrink-0 text-slate-400 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Formulaire d'ajout de lien uniquement */}
        {isAdding ? (
          <div className="p-4 bg-slate-800/50 rounded-lg border border-cyan-500/30 space-y-3">
            <div className="space-y-2">
              <div>
                <Label htmlFor="link_name" className="text-slate-300">Nom du lien</Label>
                <Input
                  id="link_name"
                  value={linkName}
                  onChange={(e) => setLinkName(e.target.value)}
                  placeholder="Mon document"
                  className="bg-slate-800/50 border-cyan-500/30 text-cyan-100"
                />
              </div>
              <div>
                <Label htmlFor="link_url" className="text-slate-300">URL</Label>
                <Input
                  id="link_url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="bg-slate-800/50 border-cyan-500/30 text-cyan-100"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddLink}
                  disabled={!linkName || !linkUrl}
                  className="flex-1"
                >
                  Ajouter
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setLinkName('');
                    setLinkUrl('');
                  }}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAdding(true)}
            className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            <Upload className="w-4 h-4 mr-2" />
            Ajouter un lien
          </Button>
        )}
      </div>
    </div>
  );
}