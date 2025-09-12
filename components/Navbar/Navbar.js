'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <span>GCCCS</span>
          <span className={styles.highlight}>CareerLink</span>
        </Link>

        <div className={styles.mobileMenuButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/events" className={styles.navLink}>Events</Link>
          <Link href="/about" className={styles.navLink}>About</Link>
          <div className={styles.authButtons}>
            <Link href="/login" className={`btn btn-secondary ${styles.loginBtn}`}>Login</Link>
            <Link href="/register" className={`btn btn-primary ${styles.registerBtn}`}>Register</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}