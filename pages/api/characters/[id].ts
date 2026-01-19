import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'ID invalide' });
    return;
  }
  try {
    const client = await clientPromise;
    const db = client.db();
    if (req.method === 'GET') {
      const character = await db.collection('characters').findOne({ _id: new ObjectId(id) });
      if (!character) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(character);
    }
    if (req.method === 'PUT') {
      const data = req.body;
      const now = new Date().toISOString();
      await db.collection('characters').updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...data, updated_at: now } }
      );
      return res.status(200).json({ ...data, _id: id, updated_at: now });
    }
    if (req.method === 'DELETE') {
      await db.collection('characters').deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}
