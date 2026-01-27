import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('coroner_reports');

  if (req.method === 'GET') {
    const reports = await collection.find({}).toArray();
    res.status(200).json(reports);
  } else if (req.method === 'POST') {
    const report = req.body;
    report.created_at = new Date();
    const result = await collection.insertOne(report);
    res.status(201).json({ ...report, _id: result.insertedId });
  } else if (req.method === 'PUT') {
    const { _id, ...update } = req.body;
    await collection.updateOne({ _id }, { $set: update });
    res.status(200).json({ message: 'Updated' });
  } else if (req.method === 'DELETE') {
    const { _id } = req.body;
    try {
      await collection.deleteOne({ _id: new ObjectId(_id) });
      res.status(200).json({ message: 'Deleted' });
    } catch (e) {
      res.status(400).json({ message: 'Invalid id' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
