// Cette route est désactivée. Utilisez pages/api/characters/[id].ts pour l'API MongoDB.
export const dynamic = 'force-static';
export async function GET() {
  return new Response('Route désactivée. Utilisez /api/characters/[id] (pages router).', { status: 410 });
}
export async function PUT() {
  return new Response('Route désactivée. Utilisez /api/characters/[id] (pages router).', { status: 410 });
}
export async function DELETE() {
  return new Response('Route désactivée. Utilisez /api/characters/[id] (pages router).', { status: 410 });
}

// DELETE character
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  console.log('DELETE character id:', id);
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection('characters').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
