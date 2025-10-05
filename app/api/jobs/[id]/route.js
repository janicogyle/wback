import { adminDb } from '../../../../lib/firebaseAdmin';

export async function GET(req, { params }) {
  try {
    const id = String(params.id);
    const doc = await adminDb.collection('jobs').doc(id).get();
    if (!doc.exists) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    const data = doc.data();
    return new Response(JSON.stringify({ id: data?.id ?? doc.id, ...data }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function PATCH(req, { params }) {
  try {
    const id = String(params.id);
    const body = await req.json();
    const docRef = adminDb.collection('jobs').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    await docRef.set({ ...doc.data(), ...body, id: Number(id) }, { merge: true });
    const updated = (await docRef.get()).data();
    return new Response(JSON.stringify(updated), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = String(params.id);
    const docRef = adminDb.collection('jobs').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    await docRef.delete();
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
