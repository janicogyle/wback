import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '../../../lib/firebaseAdmin';

export async function GET() {
  try {
    // Authenticate user
    const session = cookies().get('session')?.value;
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    const decoded = await adminAuth.verifySessionCookie(session, false);
    const userId = decoded.uid;

    // Check user role from Firestore
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userRole = userDoc.exists ? userDoc.data().role : null;

    let snapshot;
    // Career office can see all applications, students see only their own
    if (userRole === 'career_office') {
      snapshot = await adminDb.collection('applications').get();
    } else {
      snapshot = await adminDb.collection('applications').where('userId', '==', userId).get();
    }
    
    const apps = snapshot.docs.map(d => ({ id: d.get('id') ?? d.id, ...d.data() }));
    // Sort by id in memory to avoid needing a composite index
    apps.sort((a, b) => (a.id || 0) - (b.id || 0));
    return new Response(JSON.stringify(apps), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST(req) {
  try {
    // Authenticate user
    const session = cookies().get('session')?.value;
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    const decoded = await adminAuth.verifySessionCookie(session, false);
    const userId = decoded.uid;

    const body = await req.json();
    const snapshot = await adminDb.collection('applications').orderBy('id', 'desc').limit(1).get();
    const maxId = snapshot.empty ? 0 : Number(snapshot.docs[0].get('id')) || 0;
    const nextId = maxId + 1;
    const newApp = { id: nextId, userId, date: new Date().toISOString().split('T')[0], ...body };
    await adminDb.collection('applications').doc(String(nextId)).set(newApp);
    return new Response(JSON.stringify(newApp), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// Optional bulk update/delete using body payload for convenience
export async function PUT(req) {
  try {
    // Authenticate user
    const session = cookies().get('session')?.value;
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    const decoded = await adminAuth.verifySessionCookie(session, false);
    const userId = decoded.uid;

    const body = await req.json();
    const id = String(body?.id || '');
    if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    
    // Verify ownership
    const doc = await adminDb.collection('applications').doc(id).get();
    if (!doc.exists || doc.get('userId') !== userId) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    const { jobTitle, company, status, date } = body || {};
    const updates = { ...(jobTitle !== undefined && { jobTitle }), ...(company !== undefined && { company }), ...(status !== undefined && { status }), ...(date !== undefined && { date }) };
    await adminDb.collection('applications').doc(id).set(updates, { merge: true });
    const saved = await adminDb.collection('applications').doc(id).get();
    return new Response(JSON.stringify({ id: Number(id), ...saved.data() }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function DELETE(req) {
  try {
    // Authenticate user
    const session = cookies().get('session')?.value;
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    const decoded = await adminAuth.verifySessionCookie(session, false);
    const userId = decoded.uid;

    const body = await req.json().catch(() => ({}));
    const id = String(body?.id || '');
    if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    
    // Verify ownership before deleting
    const doc = await adminDb.collection('applications').doc(id).get();
    if (!doc.exists || doc.get('userId') !== userId) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    await adminDb.collection('applications').doc(id).delete();
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}