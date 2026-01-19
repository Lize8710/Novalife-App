// Script de migration MongoDB à lancer une seule fois
// Il déplace les personnes à contacter mal stockées dans attachments vers trusted_persons
// Usage : node migrate_contacts.js (après avoir installé mongodb : npm install mongodb)

const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://Vercel-Admin-Novalife:Souris87@novalife.3wean0a.mongodb.net/Novalife?retryWrites=true&w=majority';
const dbName = 'Novalife'; // Mets ici le nom de ta base si différent

async function migrate() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const characters = db.collection('characters');

    const cursor = characters.find({ attachments: { $exists: true, $ne: [] } });
    let count = 0;
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      let attachments = Array.isArray(doc.attachments) ? doc.attachments : [];
      let trusted = Array.isArray(doc.trusted_persons) ? doc.trusted_persons : [];

      // On considère comme "personne à contacter" tout objet avec name OU phone mais SANS type/url
      const contacts = attachments.filter(att => (att.name || att.phone) && !att.type && !att.url);
      const realDocs = attachments.filter(att => att.type || att.url);

      if (contacts.length > 0) {
        trusted = [...trusted, ...contacts];
        await characters.updateOne(
          { _id: doc._id },
          {
            $set: {
              trusted_persons: trusted,
              attachments: realDocs
            }
          }
        );
        count++;
      }
    }
    console.log(`Migration terminée. Fiches modifiées : ${count}`);
  } finally {
    await client.close();
  }
}

migrate().catch(console.error);
