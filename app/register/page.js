'use client';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { firebaseAuth } from '../../lib/firebaseClient';
import Link from 'next/link';
import Image from 'next/image';
import styles from './register.module.css';
import FormInput, { FormSelect } from '../../components/UI/FormInput/FormInput';
import Button from '../../components/UI/Button/Button';
import { getAuthConfig, getNavConfig, getValidationConfig } from '../../utils/config';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: getAuthConfig().defaultRole,
  });

  const [errors, setErrors] = useState({});

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validationConfig.email.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < validationConfig.passwordMinLength) {
      newErrors.password = `Password must be at least ${validationConfig.passwordMinLength} characters`;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    const role = formData.role;
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, formData.email, formData.password);
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await updateProfile(cred.user, { displayName: fullName });
      const idToken = await cred.user.getIdToken();
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, profile: { firstName: formData.firstName, lastName: formData.lastName, email: formData.email, role } })
      });
      window.location.href = navConfig.dashboardRedirects[role];
    } catch (error) {
      setErrors({ general: error.message || 'Registration failed' });
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <div className={styles.registerCard}>
          <div className={styles.registerHeader}>
            <h1 className={styles.registerTitle}>Create Your Account</h1>
            <p className={styles.registerSubtitle}>
              Join GCCCS CareerLink to access job opportunities, events, and career resources.
            </p>
          </div>

          <form className={styles.registerForm} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <FormInput
                label="First Name"
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                error={errors.firstName}
              />

              <FormInput
                label="Last Name"
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                error={errors.lastName}
              />
            </div>

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
            />

            <FormInput
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              error={errors.confirmPassword}
            />

            <FormSelect
              label="I am a"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: 'student', label: 'Student' },
                { value: 'graduate', label: 'Graduate/Alumni' },
              ]}
              required
            />

            <Button type="submit" variant="primary" fullWidth>
              Register
            </Button>
            {errors.general && <div className={styles.errorText}>{errors.general}</div>}
          </form>

          <div className={styles.registerFooter}>
            <p>
              Already have an account?{' '}
              <Link href="/login" className={styles.loginLink}>
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}