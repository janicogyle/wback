'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import styles from './jobs.module.css';

export default function CareerOfficeJobs() {
  // Mock data for jobs
  const initialJobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA (Remote)',
      type: 'Full-time',
      salary: '$80,000 - $110,000',
      posted: '2023-10-15',
      deadline: '2023-11-15',
      status: 'Active',
      applications: 12,
      description: 'TechCorp is seeking a talented Frontend Developer to join our growing team...',
      requirements: ['3+ years of experience with React', 'Strong JavaScript skills', 'Experience with responsive design'],
      featured: true
    },
    {
      id: 2,
      title: 'UX Designer',
      company: 'Creative Solutions',
      location: 'New York, NY (On-site)',
      type: 'Full-time',
      salary: '$75,000 - $95,000',
      posted: '2023-10-14',
      deadline: '2023-11-14',
      status: 'Active',
      applications: 8,
      description: 'Creative Solutions is looking for a UX Designer to create amazing user experiences...',
      requirements: ['Portfolio demonstrating UX work', 'Experience with Figma or Sketch', 'User research skills'],
      featured: true
    },
    {
      id: 3,
      title: 'Data Analyst',
      company: 'DataViz Corp',
      location: 'Chicago, IL (Hybrid)',
      type: 'Full-time',
      salary: '$65,000 - $85,000',
      posted: '2023-10-13',
      deadline: '2023-11-13',
      status: 'Active',
      applications: 5,
      description: 'DataViz Corp needs a Data Analyst to help interpret complex data sets...',
      requirements: ['SQL proficiency', 'Experience with data visualization tools', 'Statistical analysis background'],
      featured: false
    },
    {
      id: 4,
      title: 'Full Stack Developer',
      company: 'WebSolutions Ltd',
      location: 'Austin, TX (Remote)',
      type: 'Contract',
      salary: '$50-70/hour',
      posted: '2023-10-12',
      deadline: '2023-11-12',
      status: 'Active',
      applications: 15,
      description: 'WebSolutions is hiring a Full Stack Developer for a 6-month contract with possibility of extension...',
      requirements: ['Node.js and React experience', 'Database design skills', 'API development'],
      featured: false
    },
    {
      id: 5,
      title: 'Marketing Specialist',
      company: 'BrandBoost Agency',
      location: 'Miami, FL (On-site)',
      type: 'Part-time',
      salary: '$25-35/hour',
      posted: '2023-10-11',
      deadline: '2023-11-11',
      status: 'Active',
      applications: 7,
      description: 'BrandBoost Agency is seeking a part-time Marketing Specialist to support our campaigns...',
      requirements: ['Digital marketing experience', 'Social media management', 'Content creation skills'],
      featured: false
    },
    {
      id: 6,
      title: 'Product Manager',
      company: 'InnovateTech',
      location: 'Seattle, WA (Hybrid)',
      type: 'Full-time',
      salary: '$90,000 - $120,000',
      posted: '2023-10-10',
      deadline: '2023-11-10',
      status: 'Active',
      applications: 10,
      description: 'InnovateTech is looking for an experienced Product Manager to lead our product development...',
      requirements: ['3+ years in product management', 'Agile methodology experience', 'Technical background preferred'],
      featured: true
    },
    {
      id: 7,
      title: 'DevOps Engineer',
      company: 'CloudSys Solutions',
      location: 'Remote',
      type: 'Full-time',
      salary: '$85,000 - $115,000',
      posted: '2023-10-09',
      deadline: '2023-11-09',
      status: 'Closed',
      applications: 6,
      description: 'CloudSys Solutions needs a DevOps Engineer to improve our infrastructure and deployment processes...',
      requirements: ['AWS/Azure experience', 'CI/CD pipeline knowledge', 'Infrastructure as code'],
      featured: false
    },
    {
      id: 8,
      title: 'Content Writer',
      company: 'MediaPulse',
      location: 'Boston, MA (Remote)',
      type: 'Freelance',
      salary: '$40-50/hour',
      posted: '2023-10-08',
      deadline: '2023-11-08',
      status: 'Draft',
      applications: 0,
      description: 'MediaPulse is seeking freelance Content Writers to create engaging content for our clients...',
      requirements: ['Strong writing portfolio', 'SEO knowledge', 'Experience in content strategy'],
      featured: false
    }
  ];

  // State
  const [jobs, setJobs] = useState(initialJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    featured: 'all'
  });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [isEditingJob, setIsEditingJob] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    // Search term filter
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filters.status === 'all' || job.status.toLowerCase() === filters.status.toLowerCase();
    
    // Type filter
    const matchesType = filters.type === 'all' || job.type.toLowerCase() === filters.type.toLowerCase();
    
    // Featured filter
    const matchesFeatured = filters.featured === 'all' || 
                           (filters.featured === 'featured' && job.featured) ||
                           (filters.featured === 'regular' && !job.featured);
    
    return matchesSearch && matchesStatus && matchesType && matchesFeatured;
  });

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.posted) - new Date(a.posted);
      case 'oldest':
        return new Date(a.posted) - new Date(b.posted);
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'applications':
        return b.applications - a.applications;
      default:
        return 0;
    }
  });

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return styles.statusActive;
      case 'closed': return styles.statusClosed;
      case 'draft': return styles.statusDraft;
      default: return '';
    }
  };

  // Handle job selection
  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setIsEditingJob(false);
  };

  // Handle add new job
  const handleAddNewJob = () => {
    setSelectedJob(null);
    setIsAddingJob(true);
    setIsEditingJob(false);
  };

  // Handle edit job
  const handleEditJob = () => {
    setIsEditingJob(true);
  };

  // Handle close job detail
  const handleCloseJobDetail = () => {
    setSelectedJob(null);
    setIsAddingJob(false);
    setIsEditingJob(false);
  };

  return (
    <DashboardLayout userType="career-office">
      <div className={styles.jobsContainer}>
        <div className={styles.jobsHeader}>
          <h1 className={styles.jobsTitle}>Job Management</h1>
          <button 
            className={`btn ${styles.addJobButton}`}
            onClick={handleAddNewJob}
          >
            Post New Job
          </button>
        </div>

        <div className={styles.jobsContent}>
          {/* Left Panel - Filters */}
          <div className={styles.filtersPanel}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search jobs..."
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
              <h3 className={styles.filterTitle}>Status</h3>
              <select
                className={styles.filterSelect}
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Job Type</h3>
              <select
                className={styles.filterSelect}
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Featured</h3>
              <select
                className={styles.filterSelect}
                value={filters.featured}
                onChange={(e) => handleFilterChange('featured', e.target.value)}
              >
                <option value="all">All Jobs</option>
                <option value="featured">Featured Only</option>
                <option value="regular">Regular Only</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Sort By</h3>
              <select
                className={styles.filterSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="applications">Most Applications</option>
              </select>
            </div>

            <button 
              className={styles.clearFiltersButton}
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  status: 'all',
                  type: 'all',
                  featured: 'all'
                });
                setSortBy('newest');
              }}
            >
              Clear All Filters
            </button>
          </div>

          {/* Middle Panel - Jobs List */}
          <div className={styles.jobsList}>
            <div className={styles.jobsListHeader}>
              <div className={styles.jobsCount}>
                {sortedJobs.length} {sortedJobs.length === 1 ? 'job' : 'jobs'} found
              </div>
            </div>

            {sortedJobs.length > 0 ? (
              <div className={styles.jobsGrid}>
                {sortedJobs.map(job => (
                  <div 
                    key={job.id} 
                    className={`${styles.jobCard} ${selectedJob?.id === job.id ? styles.selectedJob : ''}`}
                    onClick={() => handleJobSelect(job)}
                  >
                    <div className={styles.jobCardHeader}>
                      <h3 className={styles.jobCardTitle}>{job.title}</h3>
                      <span className={`${styles.statusBadge} ${getStatusBadgeClass(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    <div className={styles.jobCardCompany}>{job.company}</div>
                    <div className={styles.jobCardLocation}>{job.location}</div>
                    <div className={styles.jobCardDetails}>
                      <div className={styles.jobCardDetail}>
                        <span className={styles.detailLabel}>Type:</span> {job.type}
                      </div>
                      <div className={styles.jobCardDetail}>
                        <span className={styles.detailLabel}>Salary:</span> {job.salary}
                      </div>
                    </div>
                    <div className={styles.jobCardFooter}>
                      <div className={styles.jobCardMeta}>
                        <div>Posted: {formatDate(job.posted)}</div>
                        <div>Applications: {job.applications}</div>
                      </div>
                      {job.featured && (
                        <div className={styles.featuredBadge}>Featured</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noJobs}>
                <div className={styles.noJobsIcon}>🔍</div>
                <h3>No jobs found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Right Panel - Job Detail */}
          <div className={`${styles.jobDetail} ${(selectedJob || isAddingJob) ? styles.jobDetailActive : ''}`}>
            {selectedJob && !isAddingJob && !isEditingJob && (
              <div className={styles.jobDetailContent}>
                <div className={styles.jobDetailHeader}>
                  <button 
                    className={styles.closeButton}
                    onClick={handleCloseJobDetail}
                  >
                    ×
                  </button>
                  <h2 className={styles.jobDetailTitle}>{selectedJob.title}</h2>
                  <div className={styles.jobDetailCompany}>{selectedJob.company}</div>
                  <div className={styles.jobDetailLocation}>{selectedJob.location}</div>
                  <div className={styles.jobDetailMeta}>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(selectedJob.status)}`}>
                      {selectedJob.status}
                    </span>
                    <span className={styles.jobType}>{selectedJob.type}</span>
                    {selectedJob.featured && (
                      <span className={styles.featuredBadge}>Featured</span>
                    )}
                  </div>
                </div>

                <div className={styles.jobDetailBody}>
                  <div className={styles.jobDetailSection}>
                    <h3 className={styles.sectionTitle}>Job Details</h3>
                    <div className={styles.jobDetailItem}>
                      <span className={styles.detailLabel}>Salary:</span>
                      <span>{selectedJob.salary}</span>
                    </div>
                    <div className={styles.jobDetailItem}>
                      <span className={styles.detailLabel}>Posted:</span>
                      <span>{formatDate(selectedJob.posted)}</span>
                    </div>
                    <div className={styles.jobDetailItem}>
                      <span className={styles.detailLabel}>Application Deadline:</span>
                      <span>{formatDate(selectedJob.deadline)}</span>
                    </div>
                    <div className={styles.jobDetailItem}>
                      <span className={styles.detailLabel}>Applications:</span>
                      <span>{selectedJob.applications}</span>
                    </div>
                  </div>

                  <div className={styles.jobDetailSection}>
                    <h3 className={styles.sectionTitle}>Description</h3>
                    <p className={styles.jobDescription}>{selectedJob.description}</p>
                  </div>

                  <div className={styles.jobDetailSection}>
                    <h3 className={styles.sectionTitle}>Requirements</h3>
                    <ul className={styles.requirementsList}>
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index} className={styles.requirementItem}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={styles.jobDetailActions}>
                  <button 
                    className={`btn ${styles.editButton}`}
                    onClick={handleEditJob}
                  >
                    Edit Job
                  </button>
                  <button className={`btn ${styles.viewApplicantsButton}`}>
                    View Applicants ({selectedJob.applications})
                  </button>
                  {selectedJob.status === 'Active' ? (
                    <button className={`btn ${styles.closeJobButton}`}>
                      Close Job
                    </button>
                  ) : selectedJob.status === 'Closed' ? (
                    <button className={`btn ${styles.reopenJobButton}`}>
                      Reopen Job
                    </button>
                  ) : null}
                </div>
              </div>
            )}

            {(isAddingJob || isEditingJob) && (
              <div className={styles.jobFormContent}>
                <div className={styles.jobFormHeader}>
                  <button 
                    className={styles.closeButton}
                    onClick={handleCloseJobDetail}
                  >
                    ×
                  </button>
                  <h2 className={styles.jobFormTitle}>
                    {isAddingJob ? 'Post New Job' : 'Edit Job'}
                  </h2>
                </div>

                <div className={styles.jobForm}>
                  <div className={styles.formRow}>
                    <label className={styles.formLabel}>Job Title</label>
                    <input 
                      type="text" 
                      className={styles.formInput}
                      defaultValue={isEditingJob ? selectedJob.title : ''}
                      placeholder="e.g. Frontend Developer"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.formLabel}>Company</label>
                    <input 
                      type="text" 
                      className={styles.formInput}
                      defaultValue={isEditingJob ? selectedJob.company : ''}
                      placeholder="e.g. TechCorp Inc."
                    />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.formLabel}>Location</label>
                    <input 
                      type="text" 
                      className={styles.formInput}
                      defaultValue={isEditingJob ? selectedJob.location : ''}
                      placeholder="e.g. San Francisco, CA (Remote)"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.formLabel}>Job Type</label>
                    <select 
                      className={styles.formSelect}
                      defaultValue={isEditingJob ? selectedJob.type : ''}
                    >
                      <option value="">Select Job Type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.formLabel}>Salary</label>
                    <input 
                      type="text" 
                      className={styles.formInput}
                      defaultValue={isEditingJob ? selectedJob.salary : ''}
                      placeholder="e.g. $80,000 - $110,000"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.formLabel}>Application Deadline</label>
                    <input 
                      type="date" 
                      className={styles.formInput}
                      defaultValue={isEditingJob ? selectedJob.deadline : ''}
                    />
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.formLabel}>Description</label>
                    <textarea 
                      className={styles.formTextarea}
                      defaultValue={isEditingJob ? selectedJob.description : ''}
                      placeholder="Enter job description..."
                      rows={5}
                    ></textarea>
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.formLabel}>Requirements</label>
                    <textarea 
                      className={styles.formTextarea}
                      defaultValue={isEditingJob ? selectedJob.requirements.join('\n') : ''}
                      placeholder="Enter requirements, one per line..."
                      rows={5}
                    ></textarea>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formCheckboxRow}>
                      <input 
                        type="checkbox" 
                        id="featuredJob"
                        className={styles.formCheckbox}
                        defaultChecked={isEditingJob ? selectedJob.featured : false}
                      />
                      <label htmlFor="featuredJob" className={styles.formCheckboxLabel}>
                        Mark as Featured Job
                      </label>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.formLabel}>Status</label>
                    <select 
                      className={styles.formSelect}
                      defaultValue={isEditingJob ? selectedJob.status : 'Draft'}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Active">Active</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className={styles.jobFormActions}>
                  <button 
                    className={`btn ${styles.cancelButton}`}
                    onClick={handleCloseJobDetail}
                  >
                    Cancel
                  </button>
                  <button className={`btn ${styles.saveButton}`}>
                    {isAddingJob ? 'Post Job' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {!selectedJob && !isAddingJob && (
              <div className={styles.noJobSelected}>
                <div className={styles.noJobSelectedIcon}>👈</div>
                <h3>No job selected</h3>
                <p>Select a job from the list to view details</p>
                <button 
                  className={`btn ${styles.addJobButton}`}
                  onClick={handleAddNewJob}
                >
                  Post New Job
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}