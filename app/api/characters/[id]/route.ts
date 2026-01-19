import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  const { id } = params;
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

export async function PUT(request, { params }) {
  const { id } = params;
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

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection('characters').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
