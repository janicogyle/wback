'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import styles from './reports.module.css';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('all');
  const [activeTab, setActiveTab] = useState('students');
  const [filteredReports, setFilteredReports] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  
  // Sample data for demonstration
  const studentReports = [
    { id: 1, name: 'Student Placement Report', date: '2023-05-15', status: 'Complete', type: 'placement' },
    { id: 2, name: 'Internship Completion Report', date: '2023-06-22', status: 'Complete', type: 'internship' },
    { id: 3, name: 'Career Fair Attendance', date: '2023-07-10', status: 'Pending', type: 'placement' },
  ];
  
  const employerReports = [
    { id: 1, name: 'Employer Engagement Report', date: '2023-05-20', status: 'Complete', type: 'employer' },
    { id: 2, name: 'Job Posting Analytics', date: '2023-06-15', status: 'Complete', type: 'employer' },
    { id: 3, name: 'Recruitment Drive Summary', date: '2023-07-05', status: 'Pending', type: 'employer' },
  ];

  // Filter reports based on selection
  useEffect(() => {
    const currentReports = activeTab === 'students' ? studentReports : employerReports;
    
    if (selectedReport === 'all') {
      setFilteredReports(currentReports);
    } else {
      setFilteredReports(currentReports.filter(report => report.type === selectedReport));
    }
  }, [selectedReport, activeTab]);

  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      const reportType = activeTab === 'students' ? 'student' : 'employer';
      const reportFilter = selectedReport === 'all' ? 'all' : selectedReport;
      const fileName = `${reportType}-${reportFilter}-reports-${new Date().toISOString().split('T')[0]}.csv`;
      
      // In a real implementation, this would generate a CSV file from filteredReports
      const csvContent = generateCSV(filteredReports);
      
      // Create a download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      alert(`Report exported as ${fileName}`);
    }, 1000);
  };

  // Generate CSV content from report data
  const generateCSV = (reports) => {
    const headers = ['Report Name', 'Date', 'Status', 'Type'];
    const rows = reports.map(report => [
      report.name,
      report.date,
      report.status,
      report.type
    ]);
    
    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  };

  const handleViewReport = (reportId) => {
    alert(`Viewing report ID: ${reportId}`);
    // In a real implementation, this would navigate to a detailed report view
  };

  const handleDownloadReport = (reportId) => {
    const report = filteredReports.find(r => r.id === reportId);
    if (report) {
      alert(`Downloading report: ${report.name}`);
      // In a real implementation, this would trigger a file download for the specific report
      const csvContent = generateCSV([report]);
      const fileName = `${report.name.toLowerCase().replace(/\s+/g, '-')}-${report.date}.csv`;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.reportsContainer}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Reports</h1>
          <div className={styles.reportControls}>
            <select 
              className={styles.reportSelect}
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
            >
              <option value="all">All Reports</option>
              <option value="placement">Placement Reports</option>
              <option value="internship">Internship Reports</option>
              <option value="employer">Employer Reports</option>
            </select>
            <button 
              className={styles.exportButton}
              onClick={handleExport}
              disabled={isExporting || filteredReports.length === 0}
            >
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>

        <div className={styles.tabsContainer}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'students' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Student Reports
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'employers' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('employers')}
          >
            Employer Reports
          </button>
        </div>

        <div className={styles.reportsTable}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.name}</td>
                    <td>{report.date}</td>
                    <td>
                      <span className={`${styles.status} ${report.status === 'Complete' ? styles.statusComplete : styles.statusPending}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={styles.viewButton}
                        onClick={() => handleViewReport(report.id)}
                      >
                        View
                      </button>
                      <button 
                        className={styles.downloadButton}
                        onClick={() => handleDownloadReport(report.id)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles.noReports}>
                    No reports found for the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}