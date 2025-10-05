import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '../../../lib/firebaseAdmin';

export async function GET() {
  try {
    const session = cookies().get('session')?.value;
    if (!session) return new Response(JSON.stringify({ user: null }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    const decoded = await adminAuth.verifySessionCookie(session, false);
    const uid = decoded.uid;
    const doc = await adminDb.collection('users').doc(uid).get();
    const profile = doc.exists ? doc.data() : { uid, email: decoded.email };
    return new Response(JSON.stringify({ user: { uid, email: decoded.email, ...profile } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ user: null, error: err.message }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}


