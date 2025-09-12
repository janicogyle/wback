'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import styles from './events.module.css';

export default function EventsPage() {
  // Mock data for events
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Tech Career Fair 2023',
      organizer: 'University Career Center',
      date: '2023-11-15',
      time: '10:00 AM - 4:00 PM',
      location: 'University Main Hall',
      type: 'Career Fair',
      description: 'Connect with over 50 tech companies looking to hire for internships and full-time positions. Bring your resume and dress professionally.',
      companies: ['Google', 'Microsoft', 'Amazon', 'IBM', 'Oracle', 'Adobe'],
      image: '/images/events/career-fair.jpg',
      isRegistered: true,
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
      presenter: 'Sarah Johnson, Senior Career Advisor',
      image: '/images/events/resume-workshop.jpg',
      isRegistered: false,
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
      presenter: 'Michael Chen, HR Director at TechCorp',
      image: '/images/events/interview-skills.jpg',
      isRegistered: false,
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
      isRegistered: true,
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
      panelists: ['Dr. Emily Rodriguez, AI Research Lead', 'David Park, ML Engineer at DeepMind', 'Lisa Wong, Ethics in AI Advocate'],
      image: '/images/events/ai-panel.jpg',
      isRegistered: false,
    },
  ]);

  // Filter states
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'calendar'
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Get unique event types
  const eventTypes = ['All', ...new Set(events.map(event => event.type))];

  // Filter events based on type and search term
  const filteredEvents = events.filter(event => {
    const matchesType = typeFilter === 'All' || event.type === typeFilter;
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Register for event
  const toggleRegistration = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, isRegistered: !event.isRegistered } 
        : event
    ));
  };

  // Group events by date for calendar view
  const eventsByDate = filteredEvents.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});

  // Sort dates for calendar view
  const sortedDates = Object.keys(eventsByDate).sort((a, b) => new Date(a) - new Date(b));

  return (
    <DashboardLayout>
      <div className={styles.eventsContainer}>
        {selectedEvent ? (
          // Event detail view
          <div className={styles.eventDetailView}>
            <button 
              className={styles.backButton}
              onClick={() => setSelectedEvent(null)}
            >
              ← Back to Events
            </button>
            
            <div className={styles.eventDetailHeader}>
              <h1 className={styles.eventDetailTitle}>{selectedEvent.title}</h1>
              <span className={`${styles.eventType} ${styles[`eventType${selectedEvent.type.replace(/\s+/g, '')}`]}`}>
                {selectedEvent.type}
              </span>
            </div>
            
            <div className={styles.eventDetailImageContainer}>
              <div className={styles.eventDetailImagePlaceholder}>
                {/* This would be an actual image in production */}
                {selectedEvent.title.charAt(0)}
              </div>
            </div>
            
            <div className={styles.eventDetailInfo}>
              <div className={styles.eventDetailInfoItem}>
                <span className={styles.eventDetailInfoLabel}>Date:</span>
                <span className={styles.eventDetailInfoValue}>{formatDate(selectedEvent.date)}</span>
              </div>
              
              <div className={styles.eventDetailInfoItem}>
                <span className={styles.eventDetailInfoLabel}>Time:</span>
                <span className={styles.eventDetailInfoValue}>{selectedEvent.time}</span>
              </div>
              
              <div className={styles.eventDetailInfoItem}>
                <span className={styles.eventDetailInfoLabel}>Location:</span>
                <span className={styles.eventDetailInfoValue}>{selectedEvent.location}</span>
              </div>
              
              <div className={styles.eventDetailInfoItem}>
                <span className={styles.eventDetailInfoLabel}>Organizer:</span>
                <span className={styles.eventDetailInfoValue}>{selectedEvent.organizer}</span>
              </div>
            </div>
            
            <div className={styles.eventDetailDescription}>
              <h3>About This Event</h3>
              <p>{selectedEvent.description}</p>
              
              {selectedEvent.presenter && (
                <div className={styles.eventDetailSection}>
                  <h3>Presenter</h3>
                  <p>{selectedEvent.presenter}</p>
                </div>
              )}
              
              {selectedEvent.panelists && (
                <div className={styles.eventDetailSection}>
                  <h3>Panelists</h3>
                  <ul className={styles.eventDetailList}>
                    {selectedEvent.panelists.map((panelist, index) => (
                      <li key={index}>{panelist}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedEvent.companies && (
                <div className={styles.eventDetailSection}>
                  <h3>Participating Companies</h3>
                  <div className={styles.eventCompanies}>
                    {selectedEvent.companies.map((company, index) => (
                      <span key={index} className={styles.eventCompanyTag}>{company}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.eventDetailActions}>
              <button 
                className={`${styles.registerButton} ${selectedEvent.isRegistered ? styles.registeredButton : ''}`}
                onClick={() => toggleRegistration(selectedEvent.id)}
              >
                {selectedEvent.isRegistered ? 'Cancel Registration' : 'Register for Event'}
              </button>
              <button className={styles.addToCalendarButton}>Add to Calendar</button>
              <button className={styles.shareButton}>Share Event</button>
            </div>
          </div>
        ) : (
          // Events listing view
          <>
            <div className={styles.eventsHeader}>
              <h1 className={styles.eventsTitle}>Upcoming Events</h1>
              <div className={styles.viewToggle}>
                <button 
                  className={`${styles.viewToggleButton} ${viewMode === 'grid' ? styles.activeView : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  Grid View
                </button>
                <button 
                  className={`${styles.viewToggleButton} ${viewMode === 'calendar' ? styles.activeView : ''}`}
                  onClick={() => setViewMode('calendar')}
                >
                  Calendar View
                </button>
              </div>
            </div>

            <div className={styles.eventsControls}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                <span className={styles.searchIcon}>🔍</span>
              </div>

              <div className={styles.filterBox}>
                <label htmlFor="typeFilter" className={styles.filterLabel}>Event Type:</label>
                <select
                  id="typeFilter"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className={styles.filterSelect}
                >
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {viewMode === 'grid' ? (
              // Grid view
              <div className={styles.eventsGrid}>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map(event => (
                    <div 
                      key={event.id} 
                      className={styles.eventCard}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className={styles.eventImageContainer}>
                        <div className={styles.eventImagePlaceholder}>
                          {/* This would be an actual image in production */}
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
                          <button 
                            className={`${styles.registerButton} ${event.isRegistered ? styles.registeredButton : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRegistration(event.id);
                            }}
                          >
                            {event.isRegistered ? 'Registered' : 'Register'}
                          </button>
                          <button 
                            className={styles.detailsButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                            }}
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noEvents}>
                    <h3>No events found</h3>
                    <p>Try adjusting your filters or search term</p>
                  </div>
                )}
              </div>
            ) : (
              // Calendar view
              <div className={styles.calendarView}>
                {sortedDates.length > 0 ? (
                  sortedDates.map(date => (
                    <div key={date} className={styles.calendarDay}>
                      <div className={styles.calendarDayHeader}>
                        <h3 className={styles.calendarDayTitle}>{formatDate(date)}</h3>
                      </div>
                      <div className={styles.calendarDayEvents}>
                        {eventsByDate[date].map(event => (
                          <div 
                            key={event.id} 
                            className={styles.calendarEvent}
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className={styles.calendarEventTime}>{event.time}</div>
                            <div className={styles.calendarEventContent}>
                              <h4 className={styles.calendarEventTitle}>{event.title}</h4>
                              <div className={styles.calendarEventLocation}>
                                <span className={styles.eventInfoIcon}>📍</span>
                                <span>{event.location}</span>
                              </div>
                              <span className={`${styles.eventType} ${styles[`eventType${event.type.replace(/\s+/g, '')}`]}`}>
                                {event.type}
                              </span>
                            </div>
                            <div className={styles.calendarEventActions}>
                              <button 
                                className={`${styles.registerButton} ${event.isRegistered ? styles.registeredButton : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRegistration(event.id);
                                }}
                              >
                                {event.isRegistered ? 'Registered' : 'Register'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noEvents}>
                    <h3>No events found</h3>
                    <p>Try adjusting your filters or search term</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}