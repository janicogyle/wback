'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children, userType = 'student' }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Define navigation links based on user type
  const navLinks = userType === 'student' || userType === 'graduate' 
    ? [
        { href: '/dashboard/student', label: 'Dashboard', icon: '⚡' },
        { href: '/dashboard/student/profile', label: 'My Profile', icon: '👤' },
        { href: '/dashboard/student/jobs', label: 'Job Listings', icon: '🔍' },
        { href: '/dashboard/student/applications', label: 'My Applications', icon: '📋' },
        { href: '/dashboard/student/events', label: 'Events', icon: '🗓️' },
        { href: '/dashboard/student/resources', label: 'Career Resources', icon: '📘' },
      ]
    : [
        { href: '/dashboard/career-office', label: 'Dashboard', icon: '⚡' },
        { href: '/dashboard/career-office/jobs', label: 'Manage Jobs', icon: '💻' },
        { href: '/dashboard/career-office/students', label: 'Student Profiles', icon: '🎓' },
        { href: '/dashboard/career-office/events', label: 'Manage Events', icon: '🗓️' },
        { href: '/dashboard/career-office/reports', label: 'Reports', icon: '📊' },
      ];

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? '' : styles.collapsed}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>
            {userType === 'career-office' ? 'Career Office' : 'Student Portal'}
          </h2>
          <button 
            className={styles.sidebarToggle} 
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.href} className={styles.navItem}>
                <Link href={link.href} className={styles.navLink}>
                  <span className={styles.navIcon}>{link.icon}</span>
                  {isSidebarOpen && <span className={styles.navLabel}>{link.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/logout" className={`${styles.navLink} ${styles.logoutLink}`}>
            <span className={styles.navIcon}>🚪</span>
            {isSidebarOpen && <span className={styles.navLabel}>Logout</span>}
          </Link>
        </div>
      </aside>

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