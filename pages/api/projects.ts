import { NextApiRequest, NextApiResponse } from 'next';
import { projectMethods } from '../../lib/mongoProjectClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const projects = await projectMethods.list();
    return res.status(200).json(projects);
  }

  if (req.method === 'POST') {
    const project = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!project.title) return res.status(400).json({ error: 'Titre requis' });
    const id = Date.now().toString();
    const newProject = { ...project, id };
    const insertedId = await projectMethods.create(newProject);
    return res.status(201).json({ ...newProject, _id: insertedId });
  }

  if (req.method === 'PUT') {
    const { id, ...update } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!id) return res.status(400).json({ error: 'ID requis' });
    const ok = await projectMethods.update(id, update);
    return res.status(ok ? 200 : 500).json({ ok });
  }

  if (req.method === 'DELETE') {
    const { id } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!id) return res.status(400).json({ error: 'ID requis' });
    const ok = await projectMethods.delete(id);
    return res.status(ok ? 200 : 500).json({ ok });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end('Method Not Allowed');
}
