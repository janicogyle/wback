'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children, userType = 'student' }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true); // Always open on desktop
      } else {
        setIsSidebarOpen(false); // Closed by default on mobile
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen((prev) => !prev);
    } else {
      setIsSidebarOpen((prev) => !prev);
    }
  };

  const handleNavClick = () => {
    if (isMobile) setIsSidebarOpen(false);
  };

  // Define navigation links based on user type
  const navLinks = userType === 'student' || userType === 'graduate' 
    ? [
        { href: '/dashboard/student', label: 'Dashboard', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="2"/></svg> },
        { href: '/dashboard/student/profile', label: 'My Profile', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><rect x="4" y="13" width="12" height="4" rx="2" stroke="currentColor" strokeWidth="2"/></svg> },
        { href: '/dashboard/student/jobs', label: 'Job Listings', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="7" y="3" width="6" height="4" rx="2" stroke="currentColor" strokeWidth="2"/></svg> },
        { href: '/dashboard/student/applications', label: 'My Applications', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 9H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
        { href: '/dashboard/student/events', label: 'Events', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 9H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M7 13H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
      ]
    : [
        { href: '/dashboard/career-office', label: 'Dashboard', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="2"/></svg> },
        { href: '/dashboard/career-office/jobs', label: 'Manage Jobs', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="7" y="3" width="6" height="4" rx="2" stroke="currentColor" strokeWidth="2"/></svg> },
        { href: '/dashboard/career-office/students', label: 'Student Profiles', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><rect x="4" y="13" width="12" height="4" rx="2" stroke="currentColor" strokeWidth="2"/></svg> },
        { href: '/dashboard/career-office/events', label: 'Manage Events', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 9H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M7 13H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
        { href: '/dashboard/career-office/reports', label: 'Reports', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 9H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
      ];

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside
        className={
          styles.sidebar +
          (isMobile
            ? (isSidebarOpen ? ' ' + styles.open : ' ' + styles.collapsed)
            : (isSidebarOpen ? '' : ' ' + styles.collapsed))
        }
      >
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>
            {userType === 'career-office' ? 'Career Office' : 'Student Portal'}
          </h2>
          {!isMobile && (
            <button
              className={styles.sidebarToggle}
              onClick={toggleSidebar}
              aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isSidebarOpen ? '◀' : '▶'}
            </button>
          )}
          {isMobile && (
            <button
              className={styles.sidebarCloseButton}
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu"
              type="button"
            >
              ×
            </button>
          )}
        </div>
        <nav className={styles.sidebarNav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.href} className={styles.navItem}>
                <Link href={link.href} className={styles.navLink} onClick={handleNavClick}>
                  <span className={styles.navIcon}>{link.icon}</span>
                  {isSidebarOpen && <span className={styles.navLabel}>{link.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.sidebarFooter}>
          <Link href="/logout" className={styles.navLink} onClick={handleNavClick}>
            {isSidebarOpen ? <span className={styles.navLabel}>Logout</span> : <span className={styles.navLabelCollapsed}>Logout</span>}
          </Link>
        </div>
      </aside>
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 999,
          }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className={styles.mainContent}>
        <header className={styles.dashboardHeader}>
          <div className={styles.headerLeft}>
            <button 
              className={styles.mobileMenuButton}
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <h1 className={styles.pageTitle}>
              GCCCS CareerLink
            </h1>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>John Ian</span>
              <div className={styles.userAvatar}>J</div>
            </div>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  );
}