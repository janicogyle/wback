'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { applyActionCode, checkActionCode, getAuth } from 'firebase/auth';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('verifying'); // verifying | success | invalid | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const oobCode = searchParams?.get('oobCode');
    const mode = searchParams?.get('mode');

    if (!oobCode || mode !== 'verifyEmail') {
      setStatus('invalid');
      setMessage('Invalid or missing verification code.');
      return;
    }

    (async () => {
      try {
        // Optionally check code first for clearer errors
        await checkActionCode(auth, oobCode);
        await applyActionCode(auth, oobCode);
        setStatus('success');
        setMessage('Email verified successfully! You can now log in.');
        const timer = setTimeout(() => {
          router.replace('/login?verified=1');
        }, 3000);
        return () => clearTimeout(timer);
      } catch (err) {
        setStatus('error');
        setMessage(err?.message || 'Verification failed.');
      }
    })();
  }, [searchParams, router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: 24 }}>
      <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
        {status === 'verifying' && <h1>Verifying your email…</h1>}
        {status === 'success' && <h1>Success!</h1>}
        {status === 'invalid' && <h1>Invalid link</h1>}
        {status === 'error' && <h1>Verification error</h1>}
        {message && <p style={{ marginTop: 12 }}>{message}</p>}
        {(status === 'invalid' || status === 'error') && (
          <p style={{ marginTop: 16 }}>
            You can try <Link href="/login">signing in</Link> or request a new verification email from the login page.
          </p>
        )}
      </div>
    </div>
  );
}


