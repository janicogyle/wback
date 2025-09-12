'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './login.module.css';
import FormInput from '../../components/UI/FormInput/FormInput';
import Button from '../../components/UI/Button/Button';
import { getAuthConfig, getNavConfig, getValidationConfig } from '../../utils/config';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Placeholder for Firebase Auth logic
    console.log('Login data:', formData);
    // In a real app, you would call Firebase Auth here
    const authConfig = getAuthConfig();
    const navConfig = getNavConfig();
    
    // For now, just set token and role for student
    localStorage.setItem(authConfig.tokenKey, authConfig.tokens.student);
    localStorage.setItem(authConfig.userRoleKey, authConfig.roles.student);
    
    // Redirect to the student dashboard
    window.location.href = navConfig.dashboardRedirects.student;
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

            <div className={styles.forgotPassword}>
              <Link href="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" fullWidth>
              Login
            </Button>
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