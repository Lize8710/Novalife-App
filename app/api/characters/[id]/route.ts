import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

import type { NextRequest } from 'next/server';
export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const paramsObj = await context.params;
  try {
    const client = await clientPromise;
    const db = client.db();
    const character = await db.collection('characters').findOne({ _id: new ObjectId(paramsObj.id) });
    if (!character) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(character);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération.' }, { status: 500 });
  }
}

import type { NextRequest } from 'next/server';
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db();
    const now = new Date().toISOString();
    await db.collection('characters').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ...data, updated_at: now } }
    );
    return NextResponse.json({ ...data, _id: params.id, updated_at: now });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour.' }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection('characters').deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression.' }, { status: 500 });
  }
}
