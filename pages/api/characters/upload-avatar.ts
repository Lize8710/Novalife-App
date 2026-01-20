import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { GridFSBucket, ObjectId } from 'mongodb';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const client = await clientPromise;
  const db = client.db('Novalife');
  const bucket = new GridFSBucket(db, { bucketName: 'avatars' });

  // Parse le flux multipart
  const busboy = require('busboy');
  const bb = busboy({ headers: req.headers });
  let fileId: ObjectId | null = null;
  let fileUrl = '';

  bb.on('file', (fieldname: string, file: any, filename: string, encoding: string, mimetype: string) => {
    fileId = new ObjectId();
    const uploadStream = bucket.openUploadStreamWithId(fileId, filename, { contentType: mimetype });
    file.pipe(uploadStream);
    uploadStream.on('finish', () => {
      fileUrl = `/api/characters/avatar/${fileId}`;
    });
  });

  bb.on('finish', async () => {
    if (!fileId) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.status(200).json({ fileId, fileUrl });
  });

  req.pipe(bb);
}
