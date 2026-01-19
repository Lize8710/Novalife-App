import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const characters = await db.collection('characters').find({}).sort({ created_at: -1 }).toArray();
    return NextResponse.json(characters);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération des personnages.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db();
    const now = new Date().toISOString();
    const result = await db.collection('characters').insertOne({
      ...data,
      created_at: now,
      updated_at: now,
    });
    return NextResponse.json({ ...data, _id: result.insertedId, created_at: now, updated_at: now });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création.' }, { status: 500 });
  }
}
