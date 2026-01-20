import clientPromise from '../lib/mongodb';
import { ObjectId } from 'mongodb';

export interface Project {
  _id?: ObjectId;
  id: string;
  title: string;
  description: string;
  manager: string;
  members: string[];
  links: { label: string; url: string }[];
  image: string;
}

export const projectMethods = {
  list: async () => {
    try {
      const client = await clientPromise;
      const db = client.db();
      const projects = await db.collection('projects').find({}).sort({ _id: -1 }).toArray();
      return projects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  get: async (id: string) => {
    try {
      const client = await clientPromise;
      const db = client.db();
      const project = await db.collection('projects').findOne({ id });
      return project;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  },

  create: async (project: Project) => {
    try {
      const client = await clientPromise;
      const db = client.db();
      const result = await db.collection('projects').insertOne(project);
      return result.insertedId;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  },

  update: async (id: string, update: Partial<Project>) => {
    try {
      const client = await clientPromise;
      const db = client.db();
      await db.collection('projects').updateOne({ id }, { $set: update });
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      return false;
    }
  },

  delete: async (id: string) => {
    try {
      const client = await clientPromise;
      const db = client.db();
      await db.collection('projects').deleteOne({ id });
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  },
};
