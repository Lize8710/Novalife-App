import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../lib/mongodb';
import { GridFSBucket, ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing id' });
  }

  const client = await clientPromise;
  const db = client.db('Novalife');
  const bucket = new GridFSBucket(db, { bucketName: 'avatars' });

  try {
    const _id = new ObjectId(id);
    const downloadStream = bucket.openDownloadStream(_id);
    res.setHeader('Content-Type', 'image/jpeg'); // Par défaut, ou à améliorer
    downloadStream.pipe(res);
    downloadStream.on('error', () => {
      res.status(404).json({ error: 'Image not found' });
    });
  } catch (err) {
    res.status(400).json({ error: 'Invalid id' });
  }
}
