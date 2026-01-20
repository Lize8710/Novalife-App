// Utilitaire pour uploader un fichier image vers l'API GridFS
export async function uploadAvatarToGridFS(file) {
  const formData = new FormData();
  formData.append('avatar', file);
  const res = await fetch('/api/characters/upload-avatar', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Erreur upload image');
  return res.json(); // { fileId, fileUrl }
}
