// Script de migration pour convertir trusted_persons de string JSON à tableau natif
// Usage : node fix_trusted_persons.js

const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://Vercel-Admin-Novalife:Souris87@novalife.3wean0a.mongodb.net/Novalife?retryWrites=true&w=majority';
const dbName = 'Novalife';

async function migrate() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const characters = db.collection('characters');

    const cursor = characters.find({ trusted_persons: { $type: 'string' } });
    let count = 0;
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      let arr = [];
      try {
        arr = JSON.parse(doc.trusted_persons);
        if (!Array.isArray(arr)) arr = [];
      } catch {
        arr = [];
      }
      await characters.updateOne(
        { _id: doc._id },
        { $set: { trusted_persons: arr } }
      );
      count++;
    }
    console.log(`Migration terminée. Fiches corrigées : ${count}`);
  } finally {
    await client.close();
  }
}

migrate().catch(console.error);
