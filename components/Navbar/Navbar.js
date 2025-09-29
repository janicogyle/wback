'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { getAuthConfig, getNavConfig, logout } from '../../utils/config';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(getAuthConfig().defaultRole);
  const router = useRouter();
  const pathname = usePathname();
  
  // Get configuration
  const authConfig = getAuthConfig();
  const navConfig = getNavConfig();
  
  // Check authentication status and user role from localStorage
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(authConfig.tokenKey);
      const role = localStorage.getItem(authConfig.userRoleKey);
      setIsLoggedIn(!!token);
      setUserRole(role || authConfig.defaultRole);
      
      // Redirect if student tries to access career office pages
      if (role === authConfig.roles.student && pathname.includes('/career-office')) {
        router.push(navConfig.dashboardRedirects.student);
      }
    }
  }, [pathname, router, authConfig, navConfig]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest(`.${styles.navLinks}`) && 
          !event.target.closest(`.${styles.mobileMenuButton}`)) {
        setIsMenuOpen(false);
      }
    };
    
    // Prevent scrolling when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);
  
  // Handle logout
  // const handleLogout = () => {
  //   if (typeof window !== 'undefined') {
  //     localStorage.removeItem(authConfig.tokenKey);
  //     localStorage.removeItem(authConfig.userRoleKey);
  //     setIsLoggedIn(false);
  //     setUserRole(authConfig.defaultRole);
  //     setIsMenuOpen(false);
  //     router.push('/');
  //   }
  // };

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <span>GCCCS</span>
          <span className={styles.highlight}>CareerLink</span>
        </Link>

        <div 
          className={`${styles.mobileMenuButton} ${isMenuOpen ? styles.active : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          role="button"
          tabIndex="0"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div 
          className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}
          aria-hidden={!isMenuOpen}
        >
          {!isLoggedIn ? (
            <>
              {navConfig.publicLinks.map((link, index) => (
                <Link key={index} href={link.path} className={styles.navLink}>{link.name}</Link>
              ))}
              <div className={styles.authButtons}>
                <Link href="/login" className={`btn btn-secondary ${styles.loginBtn}`}>Login</Link>
                {/* Career Office login is only accessible directly via URL, not from navbar */}
                <Link href="/register" className={`btn btn-primary ${styles.registerBtn}`}>Register</Link>
              </div>
            </>
          ) : (
            <>
              {navConfig.authenticatedLinks[userRole]?.map((link, index) => (
                <Link key={index} href={link.path} className={styles.navLink}>{link.name}</Link>
              ))}
              <div className={styles.authButtons}>
                <button onClick={logout} className={`btn btn-secondary ${styles.logoutBtn}`}>Logout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}