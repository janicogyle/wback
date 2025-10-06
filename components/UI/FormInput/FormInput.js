'use client';
import { useState } from 'react';
import styles from './FormInput.module.css';

export default function FormInput({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
  className,
  showPasswordToggle,
  onTogglePassword,
  isPasswordVisible,
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`${styles.formGroup} ${error ? styles.hasError : ''} ${className || ''}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          type={type === 'password' && isPasswordVisible ? 'text' : type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`${styles.input} ${focused ? styles.focused : ''}`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            className={styles.passwordToggle}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            onClick={onTogglePassword}
            tabIndex={0}
          >
            <span className={styles.eyeIcon} aria-hidden>
              {isPasswordVisible ? (
                // Eye off icon
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.58 10.58a2 2 0 102.83 2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.88 5.09A9.12 9.12 0 0012 5c5 0 9 4 10 7-0.33 0.99-0.86 2.01-1.57 2.96M6.61 6.61C4.21 8.12 2.58 10.3 2 12c1 3 5 7 10 7 1.59 0 3.09-0.35 4.43-0.97" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                // Eye icon
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              )}
            </span>
          </button>
        )}
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}

export function FormSelect({
  label,
  id,
  name,
  value,
  onChange,
  options,
  required,
  error,
  className,
  ...props
}) {
  return (
    <div className={`${styles.formGroup} ${error ? styles.hasError : ''} ${className || ''}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={styles.select}
          required={required}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}

export function FormTextarea({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
  rows = 4,
  className,
  ...props
}) {
  return (
    <div className={`${styles.formGroup} ${error ? styles.hasError : ''} ${className || ''}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={styles.textarea}
          rows={rows}
          {...props}
        />
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}