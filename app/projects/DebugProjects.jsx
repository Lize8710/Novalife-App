// Ce composant debug l'état du localStorage et du state React pour la page projets
import { useEffect } from 'react';

export default function DebugProjects() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('novalife-projects');
      console.log('[DEBUG] localStorage novalife-projects:', saved);
    }
  });
  return null;
}
