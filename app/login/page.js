'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { firebaseAuth } from '../../lib/firebaseClient';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Toast from '../../components/UI/Toast/Toast';
import styles from './login.module.css';
import FormInput from '../../components/UI/FormInput/FormInput';
import Button from '../../components/UI/Button/Button';
import { getAuthConfig, getNavConfig, getValidationConfig, getAppConfig } from '../../utils/config';

export default function Login() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [info, setInfo] = useState('');
  const [resendStatus, setResendStatus] = useState('idle'); // idle | sending | sent | error

  // Show info banners based on URL status
  const verifyParam = searchParams?.get('verify');
  const verifiedParam = searchParams?.get('verified');
  const oobCodeParam = searchParams?.get('oobCode');
  const resetParam = searchParams?.get('reset');
  if (!info && (verifyParam === 'sent' || verifiedParam === '1' || resetParam === '1')) {
    if (verifyParam === 'sent') setInfo('Verification email sent. Check your inbox.');
    if (verifiedParam === '1') setInfo('Email verified successfully! You can now log in.');
    if (resetParam === '1') setInfo('Password reset successful. Please sign in with your new password.');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const validationConfig = getValidationConfig();

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validationConfig.email.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const navConfig = getNavConfig();
    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, formData.email, formData.password);
      if (!cred.user.emailVerified) {
        setErrors({ general: 'Please verify your email before logging in. We just sent you a new verification email.' });
        // Attempt to send verification email immediately
        try {
          const appCfg = getAppConfig();
          const baseUrl = appCfg?.baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
          const url = `${baseUrl}/login?verified=1`;
          await sendEmailVerification(cred.user, { url, handleCodeInApp: false });
          setInfo('Verification email sent. Check your inbox.');
        } catch {}
        try { await signOut(firebaseAuth); } catch {}
        return;
      }
      const idToken = await cred.user.getIdToken();
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      // Determine redirect based on role from session/profile
      let roleKey = 'student';
      try {
        const meRes = await fetch('/api/me', { cache: 'no-store' });
        if (meRes.ok) {
          const me = await meRes.json();
          const role = me?.user?.role || me?.profile?.role; // support either shape
          if (role) {
            // Map API role (e.g., 'career_office') to nav config key ('careerOffice')
            roleKey = role === 'career_office' ? 'careerOffice' : role;
          }
        }
      } catch {}
      const redirectMap = navConfig.dashboardRedirects || {};
      const target = redirectMap[roleKey] || redirectMap.student || '/dashboard/student';
      window.location.href = target;
    } catch (error) {
      setErrors({ general: error.message || 'Login failed' });
    }
  };

  const handleResendVerification = async () => {
    setErrors({});
    setInfo('');
    const newErrors = validateForm();
    if (!formData.email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }
    if (!formData.password) {
      setErrors({ password: 'Password is required to resend verification' });
      return;
    }
    try {
      setResendStatus('sending');
      const cred = await signInWithEmailAndPassword(firebaseAuth, formData.email, formData.password);
      const appCfg = getAppConfig();
      const baseUrl = appCfg?.baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
      const url = `${baseUrl}/auth/verify`;
      await sendEmailVerification(cred.user, { url, handleCodeInApp: true });
      setResendStatus('sent');
      setInfo('Verification email sent. Check your inbox.');
    } catch (error) {
      setResendStatus('error');
      setErrors({ general: error.message || 'Failed to resend verification email' });
    } finally {
      try { await signOut(firebaseAuth); } catch {}
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h1 className={styles.loginTitle}>Welcome Back</h1>
            <p className={styles.loginSubtitle}>
              Sign in to access your GCCCS CareerLink account
            </p>
          </div>

          <form className={styles.loginForm} onSubmit={handleSubmit}>
            {info && <Toast message={info} type="success" duration={8000} sticky={false} />}
            <FormInput
              label="Email Address"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              error={errors.email}
            />

            <FormInput
              label="Password"
            type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              error={errors.password}
            showPasswordToggle
            isPasswordVisible={showPassword}
            onTogglePassword={() => setShowPassword((v) => !v)}
            />

            <div className={styles.forgotPassword}>
              <Link href="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <div>
              <button type="button" className={styles.linkButton} onClick={handleResendVerification} disabled={resendStatus === 'sending'}>
                {resendStatus === 'sending' ? 'Sending verification…' : 'Resend verification email'}
              </button>
            </div>

            <Button type="submit" variant="primary" fullWidth>
              Login
            </Button>
            {errors.general && <div className={styles.errorText}>{errors.general}</div>}
          </form>

          <div className={styles.loginFooter}>
            <p>
              Don't have an account?{' '}
              <Link href="/register" className={styles.registerLink}>
                Register here
              </Link>
            </p>
            <p className={styles.careerOfficeLink}>
              <Link href="/career-office/login">
                Career Office Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}