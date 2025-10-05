"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './job.module.css';

export default function JobDetail({ params }) {
  const router = useRouter();
  const p = React.use(params);
  const { id } = p || {};
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/jobs')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const found = data.find((j) => String(j.id) === String(id));
        if (!found) {
          setError('Job not found');
        } else {
          setJob(found);
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Failed to load job');
      })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return <div className={styles.container}><p>Loading job...</p></div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p>{error}</p>
        <button onClick={() => router.back()} className={styles.backButton}>Back</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{job.title}</h1>
        <div className={styles.meta}>{job.company} • {job.location}</div>
      </div>

      <div className={styles.description}>
        <p>{job.description}</p>
        {job.requirements && job.requirements.length > 0 && (
          <div className={styles.requirements}>
            <h3>Requirements</h3>
            <ul>
              {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className={styles.metaRow}>
        <div>Salary: {job.salary || 'N/A'}</div>
        <div>Posted: {job.posted}</div>
        <div>Deadline: {job.deadline}</div>
      </div>

      <div className={styles.actions}>
        <Link href={`/jobs/${id}/apply`} className={styles.applyButton}>Apply Now</Link>
        <button onClick={() => router.back()} className={styles.backButton}>Back</button>
      </div>
    </div>
  );
}
