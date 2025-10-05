import { adminDb } from '../../../lib/firebaseAdmin';

export async function GET() {
  try {
    const snapshot = await adminDb.collection('jobs').orderBy('id').get();
    const jobs = snapshot.docs.map(d => ({ id: d.get('id') ?? d.id, ...d.data() }));
    return new Response(JSON.stringify(jobs), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    // Compute next incremental id based on existing docs
    const snapshot = await adminDb.collection('jobs').orderBy('id', 'desc').limit(1).get();
    const maxId = snapshot.empty ? 0 : Number(snapshot.docs[0].get('id')) || 0;
    const nextId = maxId + 1;
    const newJob = { id: nextId, ...body };
    await adminDb.collection('jobs').doc(String(nextId)).set(newJob);
    return new Response(JSON.stringify(newJob), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
