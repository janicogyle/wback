'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import styles from './students.module.css';

export default function CareerOfficeStudents() {
  // Mock data for students
  const initialStudents = [
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.johnson@university.edu',
      major: 'Computer Science',
      graduationYear: 2023,
      university: 'Tech University',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      gpa: 3.8,
      jobPreferences: ['Frontend Developer', 'Full Stack Developer'],
      location: 'San Francisco, CA',
      availability: 'Immediate',
      profileCompletion: 95,
      applications: 8,
      interviews: 3,
      avatar: '👨‍🎓'
    },
    {
      id: 2,
      name: 'Sarah Williams',
      email: 'sarah.williams@university.edu',
      major: 'User Experience Design',
      graduationYear: 2023,
      university: 'Design Institute',
      skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'User Research'],
      gpa: 3.9,
      jobPreferences: ['UX Designer', 'Product Designer'],
      location: 'New York, NY',
      availability: 'Immediate',
      profileCompletion: 100,
      applications: 6,
      interviews: 2,
      avatar: '👩‍🎓'
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@university.edu',
      major: 'Data Science',
      graduationYear: 2023,
      university: 'State University',
      skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Data Visualization'],
      gpa: 4.0,
      jobPreferences: ['Data Analyst', 'Data Scientist'],
      location: 'Chicago, IL',
      availability: 'After graduation',
      profileCompletion: 90,
      applications: 5,
      interviews: 1,
      avatar: '👨‍🎓'
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@university.edu',
      major: 'Software Engineering',
      graduationYear: 2024,
      university: 'Tech University',
      skills: ['Java', 'Spring', 'React', 'AWS'],
      gpa: 3.7,
      jobPreferences: ['Software Engineer', 'Backend Developer'],
      location: 'Austin, TX',
      availability: 'Summer 2023',
      profileCompletion: 85,
      applications: 3,
      interviews: 0,
      avatar: '👩‍🎓'
    },
    {
      id: 5,
      name: 'David Park',
      email: 'david.park@university.edu',
      major: 'Business Administration',
      graduationYear: 2023,
      university: 'Business School',
      skills: ['Project Management', 'Marketing', 'Data Analysis', 'Leadership'],
      gpa: 3.6,
      jobPreferences: ['Product Manager', 'Business Analyst'],
      location: 'Seattle, WA',
      availability: 'Immediate',
      profileCompletion: 80,
      applications: 7,
      interviews: 2,
      avatar: '👨‍🎓'
    },
    {
      id: 6,
      name: 'Lisa Wong',
      email: 'lisa.wong@university.edu',
      major: 'Marketing',
      graduationYear: 2023,
      university: 'State University',
      skills: ['Digital Marketing', 'Social Media', 'Content Creation', 'SEO'],
      gpa: 3.5,
      jobPreferences: ['Marketing Specialist', 'Social Media Manager'],
      location: 'Los Angeles, CA',
      availability: 'Immediate',
      profileCompletion: 100,
      applications: 10,
      interviews: 4,
      avatar: '👩‍🎓'
    },
    {
      id: 7,
      name: 'James Taylor',
      email: 'james.taylor@university.edu',
      major: 'Computer Engineering',
      graduationYear: 2024,
      university: 'Engineering Institute',
      skills: ['C++', 'Python', 'Embedded Systems', 'IoT'],
      gpa: 3.9,
      jobPreferences: ['Software Engineer', 'Embedded Systems Engineer'],
      location: 'Boston, MA',
      availability: 'After graduation',
      profileCompletion: 75,
      applications: 2,
      interviews: 0,
      avatar: '👨‍🎓'
    },
    {
      id: 8,
      name: 'Olivia Martinez',
      email: 'olivia.martinez@university.edu',
      major: 'Graphic Design',
      graduationYear: 2023,
      university: 'Art Institute',
      skills: ['Adobe Creative Suite', 'Illustration', 'Typography', 'Branding'],
      gpa: 3.8,
      jobPreferences: ['Graphic Designer', 'UI Designer'],
      location: 'Miami, FL',
      availability: 'Immediate',
      profileCompletion: 95,
      applications: 6,
      interviews: 2,
      avatar: '👩‍🎓'
    }
  ];

  // State
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    major: 'all',
    graduationYear: 'all',
    availability: 'all'
  });
  const [sortBy, setSortBy] = useState('name');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Filter students
  const filteredStudents = students.filter(student => {
    // Search term filter
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Major filter
    const matchesMajor = filters.major === 'all' || student.major === filters.major;
    
    // Graduation year filter
    const matchesGraduationYear = filters.graduationYear === 'all' || 
                                 student.graduationYear.toString() === filters.graduationYear;
    
    // Availability filter
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
        return b.gpa - a.gpa;
      case 'graduationYear':
        return a.graduationYear - b.graduationYear;
      case 'profileCompletion':
        return b.profileCompletion - a.profileCompletion;
      default:
        return 0;
    }
  });

  // Get unique majors for filter
  const uniqueMajors = [...new Set(students.map(student => student.major))];
  
  // Get unique graduation years for filter
  const uniqueGraduationYears = [...new Set(students.map(student => student.graduationYear))];
  
  // Get unique availability options for filter
  const uniqueAvailability = [...new Set(students.map(student => student.availability))];

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle student selection
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  // Handle close student detail
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
                {sortedStudents.length} {sortedStudents.length === 1 ? 'student' : 'students'} found
              </div>
            </div>

            {sortedStudents.length > 0 ? (
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
                      
                      <div className={styles.studentCompletion}>
                        <div className={styles.completionLabel}>Profile: {student.profileCompletion}%</div>
                        <div className={styles.completionBar}>
                          <div 
                            className={styles.completionFill} 
                            style={{ width: `${student.profileCompletion}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className={styles.studentStats}>
                        <div className={styles.statItem}>
                          <span className={styles.statValue}>{student.applications}</span>
                          <span className={styles.statLabel}>Applications</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={styles.statValue}>{student.interviews}</span>
                          <span className={styles.statLabel}>Interviews</span>
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
                      <span className={styles.detailLabel}>Location:</span>
                      <span>{selectedStudent.location}</span>
                    </div>
                  </div>

                  <div className={styles.studentDetailSection}>
                    <h3 className={styles.sectionTitle}>Academic Information</h3>
                    <div className={styles.studentDetailItem}>
                      <span className={styles.detailLabel}>GPA:</span>
                      <span>{selectedStudent.gpa}</span>
                    </div>
                    <div className={styles.studentDetailItem}>
                      <span className={styles.detailLabel}>Availability:</span>
                      <span>{selectedStudent.availability}</span>
                    </div>
                  </div>

                  <div className={styles.studentDetailSection}>
                    <h3 className={styles.sectionTitle}>Skills</h3>
                    <div className={styles.skillsList}>
                      {selectedStudent.skills.map((skill, index) => (
                        <span key={index} className={styles.skillBadge}>{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.studentDetailSection}>
                    <h3 className={styles.sectionTitle}>Job Preferences</h3>
                    <ul className={styles.preferencesList}>
                      {selectedStudent.jobPreferences.map((preference, index) => (
                        <li key={index} className={styles.preferenceItem}>{preference}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.studentDetailSection}>
                    <h3 className={styles.sectionTitle}>Application History</h3>
                    <div className={styles.applicationStats}>
                      <div className={styles.applicationStat}>
                        <div className={styles.statValue}>{selectedStudent.applications}</div>
                        <div className={styles.statLabel}>Applications</div>
                      </div>
                      <div className={styles.applicationStat}>
                        <div className={styles.statValue}>{selectedStudent.interviews}</div>
                        <div className={styles.statLabel}>Interviews</div>
                      </div>
                      <div className={styles.applicationStat}>
                        <div className={styles.statValue}>0</div>
                        <div className={styles.statLabel}>Offers</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.studentDetailActions}>
                  <button className={`btn ${styles.viewResumeButton}`}>
                    View Resume
                  </button>
                  <button className={`btn ${styles.viewPortfolioButton}`}>
                    View Portfolio
                  </button>
                  <button className={`btn ${styles.contactButton}`}>
                    Contact Student
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