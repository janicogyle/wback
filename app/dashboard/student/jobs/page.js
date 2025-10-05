'use client';
import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../../components/Dashboard/DashboardLayout';
import Card from '../../../../components/UI/Card/Card';
import Button from '../../../../components/UI/Button/Button';
import FormInput from '../../../../components/UI/FormInput/FormInput';
import styles from './jobs.module.css';
import { useEffect } from 'react';

export default function JobsPage() {
  // Use shared jobs posted by career-office; adapt field names where necessary
  // Map shared `posted` -> `postedDate` to match this page's expectations
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/jobs')
      .then(r => r.json())
      .then(data => {
        if (!mounted) return;
        setJobs(data.map(j => ({ ...j, postedDate: j.posted || j.postedDate || '' })));
      })
      .catch(() => {});
    return () => { mounted = false };
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: '',
    location: '',
  });

  // Filter jobs based on search term and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesJobType = filters.jobType === '' || job.type === filters.jobType;
    const matchesLocation = filters.location === '' || job.location === filters.location;
    
    return matchesSearch && matchesJobType && matchesLocation;
  });

  // Get unique job types and locations for filter options
  const jobTypes = [...new Set(jobs.map(job => job.type))];
  const locations = [...new Set(jobs.map(job => job.location))];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      jobType: '',
      location: '',
    });
  };

  return (
    <DashboardLayout userType="student">
      <div className={styles.jobsHeader}>
        <h1 className={styles.jobsTitle}>Job Listings</h1>
      </div>

      <div className={styles.jobsContent}>
        <div className={styles.filtersPanel}>
          <Card>
            <div className={styles.filtersCard}>
              <h2 className={styles.filtersTitle}>Search & Filters</h2>
              
              <div className={styles.searchBox}>
                <FormInput
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Job Type</label>
                <select 
                  name="jobType" 
                  value={filters.jobType} 
                  onChange={handleFilterChange}
                  className={styles.filterSelect}
                >
                  <option value="">All Types</option>
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Location</label>
                <select 
                  name="location" 
                  value={filters.location} 
                  onChange={handleFilterChange}
                  className={styles.filterSelect}
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <Button 
                variant="secondary" 
                onClick={clearFilters}
                className={styles.clearButton}
              >
                Clear Filters
              </Button>
            </div>
          </Card>
        </div>

        <div className={styles.jobsListContainer}>
          <div className={styles.resultsInfo}>
            <p className={styles.resultsCount}>
              Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
            </p>
            <div className={styles.sortOptions}>
              <span>Sort by:</span>
              <select className={styles.sortSelect}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="deadline">Application Deadline</option>
              </select>
            </div>
          </div>

          {filteredJobs.length > 0 ? (
            <div className={styles.jobsList}>
              {filteredJobs.map((job) => (
                <Card key={job.id} variant="clickable" className={styles.jobCard}>
                  <div className={styles.jobCardContent}>
                    <div className={styles.jobHeader}>
                      <h2 className={styles.jobTitle}>{job.title}</h2>
                      <span className={styles.jobType}>{job.type}</span>
                    </div>
                    
                    <div className={styles.jobCompany}>
                      <span className={styles.companyName}>{job.company}</span>
                      <span className={styles.jobLocation}>{job.location}</span>
                    </div>
                    
                    <p className={styles.jobDescription}>
                      {job.description.length > 150 
                        ? `${job.description.substring(0, 150)}...` 
                        : job.description}
                    </p>
                    
                    <div className={styles.jobRequirements}>
                      <h3 className={styles.requirementsTitle}>Requirements:</h3>
                      <ul className={styles.requirementsList}>
                        {job.requirements.slice(0, 2).map((req, index) => (
                          <li key={index} className={styles.requirementItem}>{req}</li>
                        ))}
                        {job.requirements.length > 2 && (
                          <li className={styles.requirementItem}>+{job.requirements.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                    
                    <div className={styles.jobFooter}>
                      <div className={styles.jobMeta}>
                        <div className={styles.jobSalary}>{job.salary}</div>
                        <div className={styles.jobDeadline}>Apply by: {job.deadline}</div>
                      </div>
                      
                      <div className={styles.jobActions}>
                        <Button 
                          variant="text" 
                          href={`/jobs/${job.id}`}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="primary" 
                          href={`/jobs/${job.id}/apply`}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <h3>No jobs found</h3>
              <p>Try adjusting your search or filters to find more opportunities.</p>
              <Button variant="secondary" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}