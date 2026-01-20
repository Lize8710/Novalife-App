import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db('Novalife');
  const collection = db.collection('invoices');

  if (req.method === 'GET') {
    // Récupérer toutes les factures d'un patient
    const { patientId } = req.query;
    if (!patientId) return res.status(400).json({ error: 'patientId requis' });
    const invoices = await collection.find({ patientId }).sort({ created_at: -1 }).toArray();
    return res.status(200).json(invoices);
  }

  if (req.method === 'POST') {
    // Créer une nouvelle facture
    const { patientId, reason, amount } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!patientId || !reason || !amount) return res.status(400).json({ error: 'Champs requis manquants' });
    const now = new Date().toISOString();
    const result = await collection.insertOne({ patientId, reason, amount: parseFloat(amount), created_at: now });
    return res.status(201).json({ _id: result.insertedId, patientId, reason, amount: parseFloat(amount), created_at: now });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end('Method Not Allowed');
}
