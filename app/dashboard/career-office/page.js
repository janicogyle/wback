'use client';

import { useState, useEffect } from 'react';
import { firebaseDb } from '../../../lib/firebaseClient';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import styles from './career-office-dashboard.module.css';

export default function CareerOfficeDashboard() {
  // Real-time stats from Firestore
  const [stats, setStats] = useState({
    activeJobs: 0,
    pendingApplications: 0,
    scheduledInterviews: 0,
    newStudents: 0
  });

  const [recentApplications, setRecentApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingJob, setDeletingJob] = useState(null);

  // Real-time Firestore listeners
  useEffect(() => {
    // Listen to users collection
    const usersQuery = query(collection(firebaseDb, 'users'));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersMap = {};
      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        usersMap[docSnap.id] = {
          uid: docSnap.id,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          fullName: data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          email: data.email || '',
          createdAt: data.createdAt || ''
        };
      });
      setUsers(usersMap);

      // Calculate new students this month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newStudentsCount = Object.values(usersMap).filter(user => {
        if (!user.createdAt) return false;
        const createdDate = new Date(user.createdAt);
        return createdDate >= firstDayOfMonth;
      }).length;
      
      setStats(prev => ({ ...prev, newStudents: newStudentsCount }));
    }, (error) => {
      console.error('Error fetching users:', error);
    });

    // Listen to job listings collection
    const jobsQuery = query(collection(firebaseDb, 'jobs'), orderBy('id', 'desc'));
    const unsubscribeJobs = onSnapshot(jobsQuery, (snapshot) => {
      const jobs = snapshot.docs.map(docSnap => ({
        docId: docSnap.id,
        id: docSnap.data().id || docSnap.id,
        ...docSnap.data()
      }));
      
      // Count active jobs (not closed/expired)
      const activeJobsCount = jobs.filter(job => 
        job.status !== 'closed' && job.status !== 'expired'
      ).length;
      
      setStats(prev => ({ ...prev, activeJobs: activeJobsCount }));
      
      // Get recent 4 jobs for display
      setRecentJobs(jobs.slice(0, 4));
      setLoading(false);
    }, (error) => {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    });

    // Listen to applications collection
    const applicationsQuery = query(collection(firebaseDb, 'applications'), orderBy('id', 'desc'));
    const unsubscribeApplications = onSnapshot(applicationsQuery, (snapshot) => {
      const apps = snapshot.docs.map(docSnap => ({
        docId: docSnap.id,
        id: docSnap.data().id || docSnap.id,
        ...docSnap.data()
      }));
      
      // Count pending applications
      const pendingCount = apps.filter(app => 
        app.status === 'Applied' || app.status === 'Pending Review'
      ).length;
      
      // Count scheduled interviews
      const interviewCount = apps.filter(app => 
        app.status === 'Interview' || app.status === 'Interview Scheduled'
      ).length;
      
      setStats(prev => ({ 
        ...prev, 
        pendingApplications: pendingCount,
        scheduledInterviews: interviewCount
      }));
      
      // Get recent 5 applications for display
      setRecentApplications(apps.slice(0, 5));
    }, (error) => {
      console.error('Error fetching applications:', error);
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeUsers();
      unsubscribeJobs();
      unsubscribeApplications();
    };
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending Review': return styles.statusPending;
      case 'Applied': return styles.statusPending;
      case 'Forwarded to Employer': return styles.statusForwarded;
      case 'Interview Scheduled': return styles.statusInterview;
      case 'Interview': return styles.statusInterview;
      case 'Rejected': return styles.statusRejected;
      case 'Offer Extended': return styles.statusOffer;
      case 'Offer': return styles.statusOffer;
      default: return '';
    }
  };

  // Get applicant name from userId
  const getApplicantName = (userId) => {
    if (!userId) return 'Anonymous Applicant';
    const user = users[userId];
    if (!user) return 'Loading...';
    return user?.fullName || user?.email || 'Anonymous Applicant';
  };

  // Handle job actions
  const handleApproveJob = async (jobDocId) => {
    try {
      await updateDoc(doc(firebaseDb, 'jobs', jobDocId), {
        status: 'active',
        approvedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error approving job:', error);
      alert('Failed to approve job');
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
  };

  const handleDeleteJob = async (jobDocId) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) return;
    
    try {
      await deleteDoc(doc(firebaseDb, 'jobs', jobDocId));
      setDeletingJob(null);
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const handleCloseJob = async (jobDocId) => {
    try {
      await updateDoc(doc(firebaseDb, 'jobs', jobDocId), {
        status: 'closed',
        closedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error closing job:', error);
      alert('Failed to close job');
    }
  };

  return (
    <DashboardLayout userType="career-office">
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>Career Office Dashboard</h1>
          <div className={styles.dashboardActions}>
            <a href="/dashboard/career-office/jobs" className={`btn ${styles.actionButton}`}>
            <button className={`btn ${styles.actionButton}`}>Post New Job</button>
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.activeJobs}</div>
              <div className={styles.statLabel}>Active Job Listings</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.pendingApplications}</div>
              <div className={styles.statLabel}>Pending Applications</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.scheduledInterviews}</div>
              <div className={styles.statLabel}>Scheduled Interviews</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
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
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
              ) : recentApplications.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No applications yet</div>
              ) : (
                <div className={styles.applicationsList}>
                  {recentApplications.map(application => (
                    <div key={application.id} className={styles.applicationItem}>
                      <div className={styles.applicationHeader}>
                        <div className={styles.applicationStudent}>{getApplicantName(application.userId)}</div>
                        <span className={`${styles.statusBadge} ${getStatusBadgeClass(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                      <div className={styles.applicationPosition}>{application.jobTitle || 'N/A'}</div>
                      <div className={styles.applicationCompany}>{application.company || 'N/A'}</div>
                      <div className={styles.applicationMeta}>
                        <span>Applied: {formatDate(application.date)}</span>
                        <div className={styles.applicationActions}>
                          <button className={styles.actionButton} title="View Details">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Jobs */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Recent Job Postings</h2>
              <a href="/dashboard/career-office/jobs" className={styles.cardLink}>Manage Jobs</a>
            </div>
            <div className={styles.cardBody}>
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
              ) : recentJobs.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No job postings yet</div>
              ) : (
                <div className={styles.jobsList}>
                  {recentJobs.map(job => (
                    <div key={job.id} className={styles.jobItem}>
                      <div className={styles.jobHeader}>
                        <div className={styles.jobTitle}>{job.title || 'Untitled Job'}</div>
                        <div className={styles.jobApplications}>{job.applications || 0} applications</div>
                      </div>
                      <div className={styles.jobCompany}>{job.company || 'N/A'}</div>
                      <div className={styles.jobLocation}>{job.location || 'N/A'}</div>
                      <div className={styles.jobMeta}>
                        <span>Posted: {formatDate(job.postedDate || job.createdAt)}</span>
                        <div className={styles.jobActions}>
                          <button 
                            className={styles.actionButton} 
                            title="View Applications"
                            onClick={() => window.location.href = `/dashboard/career-office/jobs/${job.id}`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                              <path d="M23 21v-2a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button 
                            className={styles.actionButton} 
                            title="Edit Job"
                            onClick={() => handleEditJob(job)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button 
                            className={styles.actionButton} 
                            title="Delete Job"
                            onClick={() => handleDeleteJob(job.docId)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                  <div className={styles.quickActionIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className={styles.quickActionContent}>
                    <div className={styles.quickActionTitle}>Post New Job</div>
                    <div className={styles.quickActionDescription}>Create a new job listing for employers</div>
                  </div>
                </a>
                <a href="/dashboard/career-office/students" className={styles.quickActionItem}>
                  <div className={styles.quickActionIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className={styles.quickActionContent}>
                    <div className={styles.quickActionTitle}>Browse Student Profiles</div>
                    <div className={styles.quickActionDescription}>View and search student portfolios</div>
                  </div>
                </a>
                <a href="/dashboard/career-office/reports" className={styles.quickActionItem}>
                  <div className={styles.quickActionIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
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
