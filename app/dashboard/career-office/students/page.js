'use client';

import { useState, useEffect } from 'react';
import { firebaseDb } from '../../../../lib/firebaseClient';
import { collection, onSnapshot, query } from 'firebase/firestore';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import styles from './students.module.css';

export default function CareerOfficeStudents() {
  // Real-time students from Firestore
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    major: 'all',
    graduationYear: 'all',
    availability: 'all'
  });
  const [sortBy, setSortBy] = useState('name');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch students from Firestore with real-time updates
  useEffect(() => {
    const studentsQuery = query(collection(firebaseDb, 'users'));
    const unsubscribe = onSnapshot(studentsQuery, (snapshot) => {
      const studentsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Unknown',
          email: data.email || 'N/A',
          major: data.major || 'Not specified',
          graduationYear: data.graduationDate ? new Date(data.graduationDate).getFullYear() : new Date().getFullYear(),
          university: data.university || 'Not specified',
          skills: data.skills ? (typeof data.skills === 'string' ? data.skills.split(',').map(s => s.trim()).filter(s => s) : data.skills) : [],
          gpa: data.gpa || 'N/A',
          jobPreferences: data.jobTypes || [],
          location: data.city && data.state ? `${data.city}, ${data.state}` : data.city || data.state || 'Not specified',
          availability: 'Immediate',
          applications: 0,
          avatar: data.firstName ? data.firstName.charAt(0).toUpperCase() : '?',
          profileCompletion: calculateProfileCompletion(data),
          role: data.role || 'student',
          phone: data.phone || 'N/A',
          degree: data.degree || 'N/A',
          bio: data.bio || '',
          resumeUrl: data.resumeUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          githubUrl: data.githubUrl || '',
          portfolioUrl: data.portfolioUrl || ''
        };
      }).filter(student => student.role === 'student' || student.role === 'graduate');
      
      setStudents(studentsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching students:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Calculate profile completion percentage
  const calculateProfileCompletion = (data) => {
    const fields = [
      data.firstName, data.lastName, data.email, data.phone,
      data.major, data.university, data.graduationDate,
      data.skills, data.bio, data.degree
    ];
    const filledFields = fields.filter(field => field && field !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMajor = filters.major === 'all' || student.major === filters.major;
    const matchesGraduationYear = filters.graduationYear === 'all' || 
                                 student.graduationYear.toString() === filters.graduationYear;
    const matchesAvailability = filters.availability === 'all' || 
                               student.availability.toLowerCase() === filters.availability.toLowerCase();
    
    return matchesSearch && matchesMajor && matchesGraduationYear && matchesAvailability;
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'gpa':
        const gpaA = typeof a.gpa === 'number' ? a.gpa : 0;
        const gpaB = typeof b.gpa === 'number' ? b.gpa : 0;
        return gpaB - gpaA;
      case 'graduationYear':
        return a.graduationYear - b.graduationYear;
      case 'profileCompletion':
        return b.profileCompletion - a.profileCompletion;
      default:
        return 0;
    }
  });

  // Get unique majors for filter
  const uniqueMajors = [...new Set(students.map(student => student.major).filter(m => m !== 'Not specified'))];
  const uniqueGraduationYears = [...new Set(students.map(student => student.graduationYear))];
  const uniqueAvailability = [...new Set(students.map(student => student.availability))];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  const handleCloseStudentDetail = () => {
    setSelectedStudent(null);
  };

  return (
    <DashboardLayout userType="career-office">
      <div className={styles.studentsContainer}>
        <div className={styles.studentsHeader}>
          <h1 className={styles.studentsTitle}>Student Profiles</h1>
          <div className={styles.studentsActions}>
            <button className={`btn ${styles.exportButton}`}>
              Export Data
            </button>
            <button className={`btn ${styles.bulkEmailButton}`}>
              Send Bulk Email
            </button>
          </div>
        </div>

        <div className={styles.studentsContent}>
          {/* Left Panel - Filters */}
          <div className={styles.filtersPanel}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              {searchTerm && (
                <button 
                  className={styles.clearSearch}
                  onClick={() => setSearchTerm('')}
                >
                  ×
                </button>
              )}
            </div>

            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Major</h3>
              <select
                className={styles.filterSelect}
                value={filters.major}
                onChange={(e) => handleFilterChange('major', e.target.value)}
              >
                <option value="all">All Majors</option>
                {uniqueMajors.map(major => (
                  <option key={major} value={major}>{major}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Graduation Year</h3>
              <select
                className={styles.filterSelect}
                value={filters.graduationYear}
                onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
              >
                <option value="all">All Years</option>
                {uniqueGraduationYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Availability</h3>
              <select
                className={styles.filterSelect}
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
              >
                <option value="all">All Availability</option>
                {uniqueAvailability.map(availability => (
                  <option key={availability} value={availability}>{availability}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Sort By</h3>
              <select
                className={styles.filterSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name (A-Z)</option>
                <option value="gpa">GPA (Highest First)</option>
                <option value="graduationYear">Graduation Year (Earliest First)</option>
                <option value="profileCompletion">Profile Completion</option>
              </select>
            </div>

            <button 
              className={styles.clearFiltersButton}
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  major: 'all',
                  graduationYear: 'all',
                  availability: 'all'
                });
                setSortBy('name');
              }}
            >
              Clear All Filters
            </button>
          </div>

          {/* Middle Panel - Students List */}
          <div className={styles.studentsList}>
            <div className={styles.studentsListHeader}>
              <div className={styles.studentsCount}>
                {loading ? 'Loading...' : `${sortedStudents.length} ${sortedStudents.length === 1 ? 'student' : 'students'} found`}
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>Loading students...</div>
            ) : sortedStudents.length > 0 ? (
              <div className={styles.studentsGrid}>
                {sortedStudents.map(student => (
                  <div 
                    key={student.id} 
                    className={`${styles.studentCard} ${selectedStudent?.id === student.id ? styles.selectedStudent : ''}`}
                    onClick={() => handleStudentSelect(student)}
                  >
                    <div className={styles.studentAvatar}>{student.avatar}</div>
                    <div className={styles.studentInfo}>
                      <h3 className={styles.studentName}>{student.name}</h3>
                      <div className={styles.studentMajor}>{student.major}</div>
                      <div className={styles.studentUniversity}>{student.university}</div>
                      <div className={styles.studentGradYear}>Class of {student.graduationYear}</div>
                      
                      <div className={styles.studentStats}>
                        <div className={styles.statItem}>
                          <span className={styles.statValue}>{student.applications}</span>
                          <span className={styles.statLabel}>applications</span>
                        </div>
                      </div>
                      
                      <div className={styles.studentSkills}>
                        {student.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className={styles.skillBadge}>{skill}</span>
                        ))}
                        {student.skills.length > 3 && (
                          <span className={styles.moreSkills}>+{student.skills.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noStudents}>
                <div className={styles.noStudentsIcon}>🔍</div>
                <h3>No students found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Right Panel - Student Detail */}
          <div className={`${styles.studentDetail} ${selectedStudent ? styles.studentDetailActive : ''}`}>
            {selectedStudent && (
              <div className={styles.studentDetailContent}>
                <div className={styles.studentDetailHeader}>
                  <button 
                    className={styles.closeButton}
                    onClick={handleCloseStudentDetail}
                  >
                    ×
                  </button>
                  <div className={styles.studentDetailAvatar}>{selectedStudent.avatar}</div>
                  <h2 className={styles.studentDetailName}>{selectedStudent.name}</h2>
                  <div className={styles.studentDetailMajor}>{selectedStudent.major}</div>
                  <div className={styles.studentDetailUniversity}>{selectedStudent.university}</div>
                  <div className={styles.studentDetailGradYear}>Class of {selectedStudent.graduationYear}</div>
                </div>

                <div className={styles.studentDetailBody}>
                  <div className={styles.studentDetailSection}>
                    <h3 className={styles.sectionTitle}>Contact Information</h3>
                    <div className={styles.studentDetailItem}>
                      <span className={styles.detailLabel}>Email:</span>
                      <span>{selectedStudent.email}</span>
                    </div>
                    <div className={styles.studentDetailItem}>
                      <span className={styles.detailLabel}>Phone:</span>
                      <span>{selectedStudent.phone}</span>
                    </div>
                    <div className={styles.studentDetailItem}>
                      <span className={styles.detailLabel}>Location:</span>
                      <span>{selectedStudent.location}</span>
                    </div>
                  </div>

                  <div className={styles.studentDetailSection}>
                    <h3 className={styles.sectionTitle}>Academic Information</h3>
                    <div className={styles.studentDetailItem}>
                      <span className={styles.detailLabel}>Degree:</span>
                      <span>{selectedStudent.degree}</span>
                    </div>
                    <div className={styles.studentDetailItem}>
                      <span className={styles.detailLabel}>GPA:</span>
                      <span>{selectedStudent.gpa}</span>
                    </div>
                    <div className={styles.studentDetailItem}>
                      <span className={styles.detailLabel}>Availability:</span>
                      <span>{selectedStudent.availability}</span>
                    </div>
                  </div>

                  {selectedStudent.bio && (
                    <div className={styles.studentDetailSection}>
                      <h3 className={styles.sectionTitle}>Bio</h3>
                      <p>{selectedStudent.bio}</p>
                    </div>
                  )}

                  {selectedStudent.skills.length > 0 && (
                    <div className={styles.studentDetailSection}>
                      <h3 className={styles.sectionTitle}>Skills</h3>
                      <div className={styles.skillsList}>
                        {selectedStudent.skills.map((skill, index) => (
                          <span key={index} className={styles.skillBadge}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedStudent.jobPreferences.length > 0 && (
                    <div className={styles.studentDetailSection}>
                      <h3 className={styles.sectionTitle}>Job Preferences</h3>
                      <ul className={styles.preferencesList}>
                        {selectedStudent.jobPreferences.map((preference, index) => (
                          <li key={index} className={styles.preferenceItem}>{preference}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className={styles.studentDetailSection}>
                    <h3 className={styles.sectionTitle}>Links</h3>
                    {selectedStudent.linkedinUrl && (
                      <div className={styles.studentDetailItem}>
                        <a href={selectedStudent.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                      </div>
                    )}
                    {selectedStudent.githubUrl && (
                      <div className={styles.studentDetailItem}>
                        <a href={selectedStudent.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
                      </div>
                    )}
                    {selectedStudent.portfolioUrl && (
                      <div className={styles.studentDetailItem}>
                        <a href={selectedStudent.portfolioUrl} target="_blank" rel="noopener noreferrer">Portfolio</a>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.studentDetailActions}>
                  {selectedStudent.resumeUrl && (
                    <a href={selectedStudent.resumeUrl} target="_blank" rel="noopener noreferrer" className={`btn ${styles.downloadResumeButton}`}>
                      View Resume
                    </a>
                  )}
                  <button className={`btn ${styles.hideButton}`} onClick={handleCloseStudentDetail}>
                    Hide
                  </button>
                </div>
              </div>
            )}

            {!selectedStudent && (
              <div className={styles.noStudentSelected}>
                <div className={styles.noStudentSelectedIcon}>👈</div>
                <h3>No student selected</h3>
                <p>Select a student from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
