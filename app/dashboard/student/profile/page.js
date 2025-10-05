'use client';
import { useState } from 'react';
import DashboardLayout from '../../../../components/Dashboard/DashboardLayout';
import Card from '../../../../components/UI/Card/Card';
import Button from '../../../../components/UI/Button/Button';
import FormInput, { FormSelect, FormTextarea } from '../../../../components/UI/FormInput/FormInput';
import styles from './profile.module.css';

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: 'John',
    lastName: 'ian',
    email: 'johnian@google.com',
    phone: '09304433316',
    dateOfBirth: '2005-04-02',
    address: 'Asinan Olongapo city',
    city: 'Olongapo',
    state: 'Zambales',
    zipCode: '2200',
    
    // Education
    degree: 'Bachelor of Science',
    major: 'Computer Science',
    university: 'Gordon College',
    graduationDate: '2026-05',
    gpa: '1.8',
    
    // Skills & Experience
    skills: 'JavaScript, React, Node.js, HTML, CSS, Git',
    bio: 'Recent computer science graduate with a passion for web development and software engineering.',
    
    // Resume & Portfolio
    resumeUrl: '',
    portfolioUrl: 'https://johndoe-portfolio.com',
    githubUrl: 'https://github.com/johndoe',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    
    // Preferences
    jobTypes: ['Full-time'],
    locations: ['Zambales, Olongapo'],
    industries: ['IT', 'Finance'],
    salary: '25,000 - 30,000',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would save the data to a database
    console.log('Profile data:', formData);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    // Reset form data to original values
    setIsEditing(false);
  };
  
  return (
    <DashboardLayout userType="student">
      <div className={styles.profileHeader}>
        <h1 className={styles.profileTitle}>My Profile</h1>
        {!isEditing && (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>
      
      <div className={styles.profileContent}>
        <div className={styles.profileSidebar}>
          <Card>
            <div className={styles.profileCard}>
              <div className={styles.profileAvatar}>
                <span>JI</span>
              </div>
              <h2 className={styles.profileName}>{formData.firstName} {formData.lastName}</h2>
              <p className={styles.profileMajor}>{formData.major}</p>
              <p className={styles.profileUniversity}>{formData.university}</p>
              
              <div className={styles.profileLinks}>
                {formData.githubUrl && (
                  <a href={formData.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.profileLink}>
                    GitHub
                  </a>
                )}
                {formData.linkedinUrl && (
                  <a href={formData.linkedinUrl} target="_blank" rel="noopener noreferrer" className={styles.profileLink}>
                    LinkedIn
                  </a>
                )}
                {formData.portfolioUrl && (
                  <a href={formData.portfolioUrl} target="_blank" rel="noopener noreferrer" className={styles.profileLink}>
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          </Card>
        </div>
        
        <div className={styles.profileMain}>
          <Card>
            <div className={styles.profileTabs}>
              <button 
                className={`${styles.tabButton} ${activeTab === 'personal' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('personal')}
              >
                Personal Info
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'education' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('education')}
              >
                Education
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'skills' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('skills')}
              >
                Skills & Experience
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'resume' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('resume')}
              >
                Resume & Portfolio
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'preferences' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                Job Preferences
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.profileForm}>
              {/* Personal Information */}
              {activeTab === 'personal' && (
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Personal Information</h3>
                  
                  <div className={styles.formRow}>
                    <FormInput
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                    <FormInput
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  
                  <div className={styles.formRow}>
                    <FormInput
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                    <FormInput
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <FormInput
                    label="Date of Birth"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  
                  <FormInput
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  
                  <div className={styles.formRow}>
                    <FormInput
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <FormInput
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <FormInput
                      label="Zip Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              )}
              
              {/* Education */}
              {activeTab === 'education' && (
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Education</h3>
                  
                  <div className={styles.formRow}>
                    <FormInput
                      label="Degree"
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                    <FormInput
                      label="Major"
                      name="major"
                      value={formData.major}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  
                  <FormInput
                    label="University"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                  
                  <div className={styles.formRow}>
                    <FormInput
                      label="Graduation Date"
                      type="month"
                      name="graduationDate"
                      value={formData.graduationDate}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                    <FormInput
                      label="GPA"
                      name="gpa"
                      value={formData.gpa}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              )}
              
              {/* Skills & Experience */}
              {activeTab === 'skills' && (
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Skills & Experience</h3>
                  
                  <FormInput
                    label="Skills (comma separated)"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                  
                  <FormTextarea
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              )}
              
              {/* Resume & Portfolio */}
              {activeTab === 'resume' && (
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Resume & Portfolio</h3>
                  
                  {isEditing ? (
                    <div className={styles.fileUpload}>
                      <label className={styles.fileLabel}>Resume</label>
                      <input type="file" className={styles.fileInput} accept=".pdf,.doc,.docx" />
                      <p className={styles.fileHelp}>Upload your resume (PDF, DOC, or DOCX)</p>
                    </div>
                  ) : formData.resumeUrl ? (
                    <div className={styles.resumePreview}>
                      <p>Resume: <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer">View Resume</a></p>
                    </div>
                  ) : (
                    <p className={styles.noResume}>No resume uploaded yet.</p>
                  )}
                  
                  <FormInput
                    label="Portfolio URL"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  
                  <FormInput
                    label="GitHub URL"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  
                  <FormInput
                    label="LinkedIn URL"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              )}
              
              {/* Job Preferences */}
              {activeTab === 'preferences' && (
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Job Preferences</h3>
                  
                  <FormInput
                    label="Job Types (comma separated)"
                    name="jobTypes"
                    value={formData.jobTypes.join(', ')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        jobTypes: value.split(',').map(item => item.trim()),
                      });
                    }}
                    disabled={!isEditing}
                  />
                  
                  <FormInput
                    label="Preferred Locations (comma separated)"
                    name="locations"
                    value={formData.locations.join(', ')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        locations: value.split(',').map(item => item.trim()),
                      });
                    }}
                    disabled={!isEditing}
                  />
                  
                  <FormInput
                    label="Preferred Industries (comma separated)"
                    name="industries"
                    value={formData.industries.join(', ')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        industries: value.split(',').map(item => item.trim()),
                      });
                    }}
                    disabled={!isEditing}
                  />
                  
                  <FormInput
                    label="Expected Salary Range"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              )}
              
              {isEditing && (
                <div className={styles.formActions}>
                  <Button type="button" variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}