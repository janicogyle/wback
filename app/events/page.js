'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './events.module.css';

export default function EventsPage() {
  // This would normally be fetched from an API
  const events = [
    {
      id: 1,
      title: 'Tech Career Fair 2023',
      organizer: 'University Career Center',
      date: '2023-11-15',
      time: '10:00 AM - 4:00 PM',
      location: 'University Main Hall',
      type: 'Career Fair',
      description: 'Connect with over 50 tech companies looking to hire for internships and full-time positions. Bring your resume and dress professionally.',
      image: '/images/events/career-fair.jpg',
    },
    {
      id: 2,
      title: 'Resume Workshop',
      organizer: 'Career Development Office',
      date: '2023-11-05',
      time: '2:00 PM - 4:00 PM',
      location: 'Online (Zoom)',
      type: 'Workshop',
      description: 'Learn how to craft a standout resume that will get you noticed by recruiters. This workshop will cover formatting, content, and tailoring your resume for specific roles.',
      image: '/images/events/resume-workshop.jpg',
    },
    {
      id: 3,
      title: 'Interview Skills Masterclass',
      organizer: 'Career Development Office',
      date: '2023-11-10',
      time: '1:00 PM - 3:30 PM',
      location: 'Business Building, Room 305',
      type: 'Workshop',
      description: 'Prepare for technical and behavioral interviews with this comprehensive masterclass. Practice answering common questions and receive feedback from industry professionals.',
      image: '/images/events/interview-skills.jpg',
    },
    {
      id: 4,
      title: 'Networking Night: Tech Edition',
      organizer: 'Alumni Association',
      date: '2023-11-20',
      time: '6:00 PM - 8:30 PM',
      location: 'Downtown Convention Center',
      type: 'Networking',
      description: 'Meet and connect with alumni working in various tech roles. This is a great opportunity to build your professional network and learn about different career paths.',
      image: '/images/events/networking.jpg',
    },
    {
      id: 5,
      title: 'Industry Panel: Future of AI',
      organizer: 'Computer Science Department',
      date: '2023-12-01',
      time: '5:00 PM - 7:00 PM',
      location: 'Science Building Auditorium',
      type: 'Panel Discussion',
      description: 'Join us for an insightful discussion on the future of AI and its impact on various industries. Panelists include leading researchers and industry professionals.',
      image: '/images/events/ai-panel.jpg',
    },
  ];

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.eventsPage}>
      {/* Hero Sech=tion */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Upcoming Events</h1>
            <p className={styles.heroSubtitle}>
              Stay informed about career fairs, workshops, and networking opportunities to advance your professional journey.
            </p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className={styles.eventsSection}>
        <div className="container">
          <div className={styles.eventsGrid}>
            {events.map((event) => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventImageContainer}>
                  <div className={styles.eventImagePlaceholder}>
                    {event.title.charAt(0)}
                  </div>
                  <span className={`${styles.eventType} ${styles[`eventType${event.type.replace(/\s+/g, '')}`]}`}>
                    {event.type}
                  </span>
                </div>
                <div className={styles.eventContent}>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <div className={styles.eventInfo}>
                    <div className={styles.eventDate}>
                      <span className={styles.eventInfoIcon}>📅</span>
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className={styles.eventTime}>
                      <span className={styles.eventInfoIcon}>🕒</span>
                      <span>{event.time}</span>
                    </div>
                    <div className={styles.eventLocation}>
                      <span className={styles.eventInfoIcon}>📍</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className={styles.eventDescription}>
                    {event.description.length > 120 
                      ? `${event.description.substring(0, 120)}...` 
                      : event.description}
                  </div>
                  <div className={styles.eventActions}>
                    <Link href={`/events/${event.id}`} className={`btn btn-primary ${styles.detailsButton}`}>
                      View Details
                    </Link>
                    <Link href={`/events/${event.id}/register`} className={`btn btn-secondary ${styles.registerButton}`}>
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Want to host an event?</h2>
            <p className={styles.ctaText}>
              If you're an employer or organization interested in hosting an event with our career center, we'd love to hear from you.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}