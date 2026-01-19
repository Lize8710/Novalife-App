import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET one character
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
  try {
    const client = await clientPromise;
    const db = client.db();
    const character = await db.collection('characters').findOne({ _id: new ObjectId(id) });
    if (!character) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(character);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

// PUT update character
export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const data = await request.json();
  const now = new Date().toISOString();
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection('characters').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...data, updated_at: now } }
    );
    return NextResponse.json({ ...data, _id: id, updated_at: now });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

// DELETE character
export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection('characters').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
