'use client';
import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import Card from '../../../components/UI/Card/Card';
import Button from '../../../components/UI/Button/Button';
import styles from './student-dashboard.module.css';

export default function StudentDashboard() {
  // Mock data for dashboard
  const recentJobs = [
    { id: 1, title: 'Frontend Developer', company: 'Tech Solutions Inc.', location: 'Remote', postedDate: '2023-06-15' },
    { id: 2, title: 'UX Designer', company: 'Creative Designs', location: 'New York', postedDate: '2023-06-14' },
    { id: 3, title: 'Data Analyst', company: 'Data Insights', location: 'Chicago', postedDate: '2023-06-13' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Tech Career Fair', date: '2023-06-25', time: '10:00 AM - 4:00 PM', location: 'Main Campus' },
    { id: 2, title: 'Resume Workshop', date: '2023-06-28', time: '2:00 PM - 3:30 PM', location: 'Online' },
  ];

  const applications = [
    { id: 1, jobTitle: 'Web Developer', company: 'WebTech Inc.', status: 'Applied', date: '2023-06-10' },
    { id: 2, jobTitle: 'Software Engineer', company: 'SoftSolutions', status: 'Interview', date: '2023-06-05' },
  ];

  const careerTips = [
    { id: 1, title: 'How to Ace Your Technical Interview', category: 'Interviews' },
    { id: 2, title: 'Building a Professional Portfolio', category: 'Career Development' },
    { id: 3, title: 'Networking Tips for New Graduates', category: 'Networking' },
  ];

  return (
    <DashboardLayout userType="student">
      <div className={styles.dashboardGrid}>
        {/* Welcome Section */}
        <section className={styles.welcomeSection}>
          <Card>
            <CardHeader>
              <h2 className={styles.welcomeTitle}>Welcome back, John!</h2>
            </CardHeader>
            <CardBody>
              <Button variant="primary" href="/dashboard/student/profile">
                Complete Profile
              </Button>
            </CardBody>
          </Card>
        </section>

        {/* Job Applications */}
        <section className={styles.applicationsSection}>
          <Card>
            <CardHeader>
              <h2 className={styles.sectionTitle}>My Applications</h2>
              <Link href="/dashboard/student/applications" className={styles.viewAllLink}>
                View All
              </Link>
            </CardHeader>
            <CardBody>
              {applications.length > 0 ? (
                <ul className={styles.applicationsList}>
                  {applications.map((app) => (
                    <li key={app.id} className={styles.applicationItem}>
                      <div className={styles.applicationInfo}>
                        <h3 className={styles.applicationTitle}>{app.jobTitle}</h3>
                        <p className={styles.applicationCompany}>{app.company}</p>
                      </div>
                      <div className={styles.applicationMeta}>
                        <span className={`${styles.applicationStatus} ${styles[app.status.toLowerCase()]}`}>{app.status}</span>
                        <span className={styles.applicationDate}>{app.date}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyState}>You haven't applied to any jobs yet.</p>
              )}
            </CardBody>
          </Card>
        </section>

        {/* Recent Jobs */}
        <section className={styles.jobsSection}>
          <Card>
            <CardHeader>
              <h2 className={styles.sectionTitle}>Recent Job Postings</h2>
              <Link href="/dashboard/student/jobs" className={styles.viewAllLink}>
                View All
              </Link>
            </CardHeader>
            <CardBody>
              <ul className={styles.jobsList}>
                {recentJobs.map((job) => (
                  <li key={job.id} className={styles.jobItem}>
                    <Link href={`/jobs/${job.id}`} className={styles.jobLink}>
                      <h3 className={styles.jobTitle}>{job.title}</h3>
                      <p className={styles.jobCompany}>{job.company}</p>
                      <span className={styles.jobLocation}>{job.location}</span>
                      <span className={styles.jobPostedDate}>{job.postedDate}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </section>

        {/* Events */}
        <section className={styles.eventsSection}>
          <Card>
            <CardHeader>
              <h2 className={styles.sectionTitle}>Upcoming Events</h2>
              <Link href="/dashboard/student/events" className={styles.viewAllLink}>
                View All
              </Link>
            </CardHeader>
            <CardBody>
              <ul className={styles.eventsList}>
                {upcomingEvents.map((event) => (
                  <li key={event.id} className={styles.eventItem}>
                    <div className={styles.eventInfo}>
                      <h3 className={styles.eventTitle}>{event.title}</h3>
                      <p className={styles.eventTime}>{event.time}</p>
                      <p className={styles.eventLocation}>{event.location}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}

// Card components for use within the dashboard
function CardHeader({ children }) {
  return <div className={styles.cardHeader}>{children}</div>;
}

function CardBody({ children }) {
  return <div className={styles.cardBody}>{children}</div>;
}