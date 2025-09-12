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
          type={type}
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