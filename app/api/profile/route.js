import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '../../../lib/firebaseAdmin';

export async function GET() {
  try {
    const session = cookies().get('session')?.value;
    if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    const decoded = await adminAuth.verifySessionCookie(session, false);
    const uid = decoded.uid;
    const snap = await adminDb.collection('users').doc(uid).get();
    if (!snap.exists) return new Response(JSON.stringify({ profile: { uid, email: decoded.email } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    return new Response(JSON.stringify({ profile: snap.data() }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function PUT(req) {
  try {
    const session = cookies().get('session')?.value;
    if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    const decoded = await adminAuth.verifySessionCookie(session, false);
    const uid = decoded.uid;
    const body = await req.json();
    const allowed = [
      'firstName','lastName','email','phone','dateOfBirth','address','city','state','zipCode',
      'degree','major','university','graduationDate','gpa',
      'skills','bio',
      'resumeUrl','portfolioUrl','githubUrl','linkedinUrl',
      'jobTypes','locations','industries','salary'
    ];
    const update = {};
    for (const k of allowed) if (k in body) update[k] = body[k];
    if (update.firstName || update.lastName) {
      const first = update.firstName ?? '';
      const last = update.lastName ?? '';
      update.fullName = `${first} ${last}`.trim();
    }
    update.updatedAt = new Date().toISOString();
    await adminDb.collection('users').doc(uid).set({ uid, email: decoded.email, ...update }, { merge: true });
    const saved = await adminDb.collection('users').doc(uid).get();
    return new Response(JSON.stringify({ profile: saved.data() }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}


