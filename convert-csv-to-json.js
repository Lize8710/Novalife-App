const fs = require('fs');
const csv = require('csvtojson');

const csvFilePath = 'public/characters_rows.csv'; // Fichier CSV source
const jsonFilePath = 'public/characters_rows.json'; // Fichier JSON de sortie

csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonObj, null, 2), 'utf-8');
    console.log('Conversion terminée:', jsonFilePath);
  });
