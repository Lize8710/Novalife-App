import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID manquant ou invalide' });
  }
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('characters');

  if (req.method === 'GET') {
    try {
      const character = await collection.findOne({ _id: new ObjectId(id) });
      if (!character) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(character);
    } catch (err) {
      return res.status(500).json({ error: 'Erreur serveur', details: err });
    }
  } else if (req.method === 'PUT') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const now = new Date().toISOString();
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...data, updated_at: now } }
      );
      if (result.matchedCount === 0) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Erreur serveur', details: err });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Erreur serveur', details: err });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end('Method Not Allowed');
  }
}
