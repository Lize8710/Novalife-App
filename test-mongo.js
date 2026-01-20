const { MongoClient } = require('mongodb');

// Remplace par ton URI MongoDB réelle :
const uri = 'mongodb+srv://Vercel-Admin-Novalife:Souris87@novalife.3wean0a.mongodb.net/Novalife?retryWrites=true&w=majority';

MongoClient.connect(uri)
  .then(() => {
    console.log('Connexion OK');
    process.exit(0);
  })
  .catch(err => {
    console.error('Erreur connexion:', err);
    process.exit(1);
  });