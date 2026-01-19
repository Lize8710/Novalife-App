import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';


// GET all characters
export async function GET(request: NextRequest) {
  const client = await clientPromise;
  const db = client.db();
  const characters = await db.collection('characters')
    .find({})
    .sort({ created_at: -1 })
    .allowDiskUse()
    .toArray();
  return NextResponse.json(characters);
}

// POST create character
export async function POST(request: NextRequest) {
  const data = await request.json();
  const client = await clientPromise;
  const db = client.db();
  const now = new Date().toISOString();
  const result = await db.collection('characters').insertOne({
    ...data,
    created_at: now,
    updated_at: now,
  });
  return NextResponse.json({ ...data, _id: result.insertedId, created_at: now, updated_at: now }, { status: 201 });
}