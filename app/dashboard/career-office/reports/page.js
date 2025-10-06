'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import styles from './reports.module.css';
import { useRouter } from 'next/navigation';
import { getAuthConfig, getNavConfig } from '../../../../utils/config';

export default function ReportsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [viewRow, setViewRow] = useState(null);

  useEffect(() => {
    let mounted = true;
    const verifyRole = async () => {
      try {
        const authConfig = getAuthConfig();
        const navConfig = getNavConfig();
        const res = await fetch('/api/me', { cache: 'no-store' });
        if (!mounted) return;
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const me = await res.json();
        const role = me?.user?.role || me?.profile?.role; // support either shape
        const roleKey = role === 'career_office' ? 'careerOffice' : role;
        if (roleKey !== 'careerOffice') {
          if (roleKey === 'student') {
            router.push(navConfig.dashboardRedirects.student);
          } else if (roleKey === 'graduate') {
            router.push(navConfig.dashboardRedirects.graduate);
          } else {
            router.push('/login');
          }
        }
      } catch {
        router.push('/login');
      }
    };
    verifyRole();
    return () => { mounted = false };
  }, [router]);

  // Load applications for reports
  useEffect(() => {
    let mounted = true;
    fetch('/api/applications', { cache: 'no-store' })
      .then(r => r.json())
      .then(list => { if (mounted) setApplications(Array.isArray(list) ? list : []); })
      .catch(() => {});
    return () => { mounted = false };
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    const fileName = `applications-${new Date().toISOString().split('T')[0]}.csv`;
    const csvContent = generateCSV(applications);
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
  };

  // Generate CSV content from report data
  const generateCSV = (rows) => {
    const headers = ['Application ID', 'Job Title', 'Company', 'Status', 'Date', 'Resume Name'];
    const csvRows = rows.map(a => [
      a.id,
      quote(a.jobTitle),
      quote(a.company),
      a.status,
      a.date,
      quote(a.resumeName || '')
    ]);
    
    return [headers.join(','), ...csvRows.map(r => r.join(','))].join('\n');
  };
  const quote = (s) => {
    const v = String(s == null ? '' : s);
    return v.includes(',') ? '"' + v.replace(/"/g, '""') + '"' : v;
  };

  const handleDownloadResume = (row) => {
    if (!row?.resumeData) return;
    const a = document.createElement('a');
    a.href = row.resumeData; // data URL
    a.download = row.resumeName || `resume-${row.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <DashboardLayout userType="career-office">
      <div className={styles.reportsContainer}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Applications Report</h1>
          <div className={styles.reportControls}>
            <button 
              className={styles.exportButton}
              onClick={handleExport}
              disabled={isExporting || applications.length === 0}
            >
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>

        <div className={styles.reportsTable}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Job Title</th>
                <th>Company</th>
                <th>Status</th>
                <th>Date</th>
                <th>Resume</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.jobTitle}</td>
                    <td>{row.company}</td>
                    <td>{row.status}</td>
                    <td>{row.date}</td>
                    <td>{row.resumeName ? row.resumeName : '—'}</td>
                    <td>
                      <button 
                        className={styles.viewButton}
                        onClick={() => setViewRow(row)}
                      >
                        View
                      </button>
                      <button 
                        className={styles.downloadButton}
                        onClick={() => handleDownloadResume(row)}
                        disabled={!row.resumeData}
                      >
                        Download Resume
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={styles.noReports}>
                    No applications yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {viewRow && (
          <div className={styles.modalOverlay} onClick={() => setViewRow(null)}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>Application #{viewRow.id}</div>
              <div className={styles.modalBody}>
                <div><strong>Job:</strong> {viewRow.jobTitle}</div>
                <div><strong>Company:</strong> {viewRow.company}</div>
                <div><strong>Status:</strong> {viewRow.status}</div>
                <div><strong>Date:</strong> {viewRow.date}</div>
                <div><strong>Resume:</strong> {viewRow.resumeName || '—'}</div>
              </div>
              <div className={styles.modalActions}>
                <button className={styles.btnBase} onClick={() => setViewRow(null)}>Close</button>
                <button className={`${styles.btnBase} ${styles.btnPrimary}`} onClick={() => { handleDownloadResume(viewRow); }}>Download Resume</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}