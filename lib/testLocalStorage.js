// Test rapide pour vérifier la persistance du localStorage dans le navigateur
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'novalife-projects') {
      console.log('Changement détecté dans le localStorage :', event.newValue);
    }
  });
  console.log('Valeur actuelle de novalife-projects :', localStorage.getItem('novalife-projects'));
}
