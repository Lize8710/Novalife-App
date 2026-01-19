import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end('Method Not Allowed');
  }
  try {
    const client = await clientPromise;
    const db = client.db();
    const { _id, ...data } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!_id) return res.status(400).json({ error: 'ID manquant' });
    const now = new Date().toISOString();
    const result = await db.collection('characters').updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...data, updated_at: now } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur', details: err });
  }
}
