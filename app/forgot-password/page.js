'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './forgot-password.module.css';
import FormInput from '../../components/UI/FormInput/FormInput';
import Button from '../../components/UI/Button/Button';
import { getValidationConfig, getAppConfig } from '../../utils/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { firebaseAuth } from '../../lib/firebaseClient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationConfig = getValidationConfig();
    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }
    if (!validationConfig.email.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    try {
      setStatus('sending');
      const appCfg = getAppConfig();
      const baseUrl = appCfg?.baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
      const url = `${baseUrl}/login?reset=1`;
      await sendPasswordResetEmail(firebaseAuth, email, { url, handleCodeInApp: false });
      setStatus('sent');
    } catch (error) {
      setStatus('error');
      setErrors({ general: error.message || 'Failed to send reset email' });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Reset your password</h1>
            <p className={styles.subtitle}>Enter your account email to receive a reset link.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <FormInput
              label="Email Address"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={errors.email}
            />

            <Button type="submit" variant="primary" fullWidth disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send reset link'}
            </Button>
            {errors.general && <div className={styles.errorText}>{errors.general}</div>}
            {status === 'sent' && (
              <div className={styles.successText}>
                If an account exists for this email, a reset link has been sent.
              </div>
            )}
          </form>

          <div className={styles.footer}>
            <Link href="/login" className={styles.backLink}>Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}


