'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import styles from './career-office-dashboard.module.css';

export default function CareerOfficeDashboard() {
  // Mock data for dashboard
  const [stats, setStats] = useState({
    activeJobs: 24,
    pendingApplications: 47,
    scheduledInterviews: 12,
    newStudents: 18
  });

  const [recentApplications, setRecentApplications] = useState([
    {
      id: 1,
      studentName: 'Alex Johnson',
      position: 'Frontend Developer',
      company: 'TechCorp Inc.',
      date: '2023-10-18',
      status: 'Pending Review'
    },
    {
      id: 2,
      studentName: 'Sarah Williams',
      position: 'UX Designer',
      company: 'Creative Solutions',
      date: '2023-10-17',
      status: 'Forwarded to Employer'
    },
    {
      id: 3,
      studentName: 'Michael Chen',
      position: 'Data Analyst',
      company: 'DataViz Corp',
      date: '2023-10-16',
      status: 'Interview Scheduled'
    },
    {
      id: 4,
      studentName: 'Emily Rodriguez',
      position: 'Full Stack Developer',
      company: 'WebSolutions Ltd',
      date: '2023-10-15',
      status: 'Rejected'
    },
    {
      id: 5,
      studentName: 'David Park',
      position: 'Product Manager',
      company: 'InnovateTech',
      date: '2023-10-14',
      status: 'Offer Extended'
    }
  ]);

  // upcoming interviews removed from dashboard per request

  const [recentJobs, setRecentJobs] = useState([
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechCorp Inc.',
  location: 'Manila, Philippines (Remote)',
      posted: '2023-10-15',
      applications: 12
    },
    {
      id: 2,
      title: 'UX Designer',
      company: 'Creative Solutions',
  location: 'Quezon City, Philippines (On-site)',
      posted: '2023-10-14',
      applications: 8
    },
    {
      id: 3,
      title: 'Data Analyst',
      company: 'DataViz Corp',
  location: 'Cebu, Philippines (Hybrid)',
      posted: '2023-10-13',
      applications: 5
    },
    {
      id: 4,
      title: 'Full Stack Developer',
      company: 'WebSolutions Ltd',
  location: 'Davao, Philippines (Remote)',
      posted: '2023-10-12',
      applications: 15
    }
  ]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending Review': return styles.statusPending;
      case 'Forwarded to Employer': return styles.statusForwarded;
      case 'Interview Scheduled': return styles.statusInterview;
      case 'Rejected': return styles.statusRejected;
      case 'Offer Extended': return styles.statusOffer;
      default: return '';
    }
  };

  return (
    <DashboardLayout userType="career-office">
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>Career Office Dashboard</h1>
          <div className={styles.dashboardActions}>
            <a href="/dashboard/career-office/students" className={`btn ${styles.actionButton}`}>
            <button className={`btn ${styles.actionButton}`}>Post New Job</button>
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📋</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.activeJobs}</div>
              <div className={styles.statLabel}>Active Job Listings</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📝</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.pendingApplications}</div>
              <div className={styles.statLabel}>Pending Applications</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🗓️</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.scheduledInterviews}</div>
              <div className={styles.statLabel}>Scheduled Interviews</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👨‍🎓</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.newStudents}</div>
              <div className={styles.statLabel}>New Students This Month</div>
            </div>
          </div>
        </div>

        <div className={styles.dashboardGrid}>
          {/* Recent Applications */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Recent Applications</h2>
              <a href="/dashboard/career-office/applications" className={styles.cardLink}>View All</a>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.applicationsList}>
                {recentApplications.map(application => (
                  <div key={application.id} className={styles.applicationItem}>
                    <div className={styles.applicationHeader}>
                      <div className={styles.applicationStudent}>{application.studentName}</div>
                      <span className={`${styles.statusBadge} ${getStatusBadgeClass(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                    <div className={styles.applicationPosition}>{application.position}</div>
                    <div className={styles.applicationCompany}>{application.company}</div>
                    <div className={styles.applicationMeta}>
                      <span>Applied: {formatDate(application.date)}</span>
                      <div className={styles.applicationActions}>
                        <button className={styles.actionButton} title="View Details">👁️</button>
                        <button className={styles.actionButton} title="Forward to Employer">📤</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Interviews removed */}

          {/* Recent Jobs */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Recent Job Postings</h2>
              <a href="/dashboard/career-office/jobs" className={styles.cardLink}>Manage Jobs</a>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.jobsList}>
                {recentJobs.map(job => (
                  <div key={job.id} className={styles.jobItem}>
                    <div className={styles.jobHeader}>
                      <div className={styles.jobTitle}>{job.title}</div>
                      <div className={styles.jobApplications}>{job.applications} applications</div>
                    </div>
                    <div className={styles.jobCompany}>{job.company}</div>
                    <div className={styles.jobLocation}>{job.location}</div>
                    <div className={styles.jobMeta}>
                      <span>Posted: {formatDate(job.posted)}</span>
                      <div className={styles.jobActions}>
                        <button className={styles.actionButton} title="View Applications">👥</button>
                        <button className={styles.actionButton} title="Edit Job">✏️</button>
                        <button className={styles.actionButton} title="Close Job">🚫</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Quick Actions</h2>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.quickActionsList}>
                <a href="/dashboard/career-office/jobs" className={styles.quickActionItem}>
                  <div className={styles.quickActionIcon}>📝</div>
                  <div className={styles.quickActionContent}>
                    <div className={styles.quickActionTitle}>Post New Job</div>
                    <div className={styles.quickActionDescription}>Create a new job listing for employers</div>
                  </div>
                </a>
                <a href="/dashboard/career-office/students" className={styles.quickActionItem}>
                  <div className={styles.quickActionIcon}>👨‍🎓</div>
                  <div className={styles.quickActionContent}>
                    <div className={styles.quickActionTitle}>Browse Student Profiles</div>
                    <div className={styles.quickActionDescription}>View and search student portfolios</div>
                  </div>
                </a>
                {/* Schedule Interview quick action removed per request */}
                <a href="/dashboard/career-office/reports" className={styles.quickActionItem}>
                  <div className={styles.quickActionIcon}>📊</div>
                  <div className={styles.quickActionContent}>
                    <div className={styles.quickActionTitle}>Generate Reports</div>
                    <div className={styles.quickActionDescription}>Create placement and activity reports</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}