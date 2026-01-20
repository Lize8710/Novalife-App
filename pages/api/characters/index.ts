import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

console.log('API /api/characters appelée - test redeploiement');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db();
      const characters = await db.collection('characters').find({}).toArray();
      return res.status(200).json(characters);
    } catch (err) {
      return res.status(500).json({ error: 'Erreur serveur', details: err });
    }
  } else if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db();
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const now = new Date().toISOString();
      const result = await db.collection('characters').insertOne({ ...data, created_at: now });
      return res.status(201).json({ _id: result.insertedId, ...data, created_at: now });
    } catch (err) {
      return res.status(500).json({ error: 'Erreur serveur', details: err });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end('Method Not Allowed');
  }
}
