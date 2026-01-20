// Utilitaire pour déboguer la persistance des projets dans le localStorage
export function debugLocalStorageProjects() {
  const saved = localStorage.getItem('novalife-projects');
  if (!saved) {
    console.warn('Aucun projet trouvé dans le localStorage.');
    return [];
  }
  try {
    const parsed = JSON.parse(saved);
    console.log('Projets trouvés dans le localStorage:', parsed);
    return parsed;
  } catch (e) {
    console.error('Erreur de parsing du localStorage:', e);
    return [];
  }
}
