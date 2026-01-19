import clientPromise from '../lib/mongodb';
import { ObjectId } from 'mongodb';

import { ObjectId } from 'mongodb';
interface Character {
  _id?: ObjectId;
  id?: string;
  first_name: string;
  last_name: string;
  birth_date?: string;
  nationality?: string;
  phone?: string;
  social_score?: string;
  profession?: string;
  address?: string;
  blood_type?: string;
  doctor?: string;
  medical_history?: string;
  trusted_persons?: any[];
  avatar_url?: string;
  attachments?: any[];
  created_at?: string;
  updated_at?: string;
}

export const characterMethods = {
  list: async (sortBy = 'created_at') => {
    try {
      const client = await clientPromise;
      const db = client.db();
      const characters = await db.collection('characters')
        .find({})
        .sort({ [sortBy]: -1 })
        .toArray();
      return characters;
    } catch (error) {
      console.error('Error fetching characters:', error);
      return [];
    }
  },

  get: async (id: string) => {
    try {
      const client = await clientPromise;
      const db = client.db();
      const character = await db.collection('characters').findOne({ _id: new ObjectId(id) });
      return character;
    } catch (error) {
      console.error('Error fetching character:', error);
      return null;
    }
  },

  create: async (data: Character) => {
    try {
      const client = await clientPromise;
      const db = client.db();
      const now = new Date().toISOString();
      // On retire _id si présent pour éviter le conflit de type
      const { _id, ...dataWithoutId } = data;
      const result = await db.collection('characters').insertOne({
        ...dataWithoutId,
        created_at: now,
        updated_at: now,
      });
      return { ...dataWithoutId, _id: result.insertedId, created_at: now, updated_at: now };
    } catch (error) {
      console.error('Error creating character:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<Character>) => {
    try {
      const client = await clientPromise;
      const db = client.db();
      const now = new Date().toISOString();
      await db.collection('characters').updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...data, updated_at: now } }
      );
      return { ...data, _id: id, updated_at: now };
    } catch (error) {
      console.error('Error updating character:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const client = await clientPromise;
      const db = client.db();
      await db.collection('characters').deleteOne({ _id: new ObjectId(id) });
      return { success: true };
    } catch (error) {
      console.error('Error deleting character:', error);
      throw error;
    }
  },
};
