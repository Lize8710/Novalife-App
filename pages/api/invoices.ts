import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db('Novalife');
  const collection = db.collection('invoices');

  if (req.method === 'GET') {
    // Récupérer toutes les factures ou celles d'un patient
    const { patientId } = req.query;
    let filter = {};
    if (patientId) filter = { patientId };
    const invoices = await collection.find(filter).sort({ created_at: -1 }).toArray();
    return res.status(200).json(invoices);
  }

  if (req.method === 'POST') {
    // Créer une nouvelle facture
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { patientId, reason, amount } = body;
    const patient = body.patient;
    if (!patientId || !reason || !amount) return res.status(400).json({ error: 'Champs requis manquants' });
    const now = new Date().toISOString();
    const facture: any = { patientId, reason, amount: parseFloat(amount), created_at: now };
    if (patient) facture.patient = patient;
    const result = await collection.insertOne(facture);
    return res.status(201).json({ _id: result.insertedId, ...facture });
  }

  if (req.method === 'PUT') {
    // Mettre à jour une facture
    const { _id, reason, amount, patient } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!_id || !reason || !amount) return res.status(400).json({ error: 'Champs requis manquants' });
    const { ObjectId } = require('mongodb');
    const update: { [key: string]: any } = { reason, amount: parseFloat(amount) };
    if (patient) update['patient'] = patient;
    const result = await collection.findOneAndUpdate(
      { _id: typeof _id === 'string' ? new ObjectId(_id) : _id },
      { $set: update },
      { returnDocument: 'after' }
    );
    if (!result.value) return res.status(404).json({ error: 'Facture non trouvée' });
    return res.status(200).json(result.value);
  }

  if (req.method === 'DELETE') {
    // Supprimer une facture
    const { _id } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!_id) return res.status(400).json({ error: 'ID requis' });
    const { ObjectId } = require('mongodb');
    const result = await collection.deleteOne({ _id: typeof _id === 'string' ? new ObjectId(_id) : _id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Facture non trouvée' });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end('Method Not Allowed');
}
