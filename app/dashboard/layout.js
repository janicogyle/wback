'use client';
import { Suspense } from "react";
import Navbar from "../../components/Navbar/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <Suspense fallback={<div className="loading-container">Loading...</div>}>
          <main className="main-content">
            {children}
          </main>
        </Suspense>
      </div>
      <style jsx global>{`
        /* Hide the footer in dashboard pages */
        body > footer {
          display: none !important;
        }
      `}</style>
    </div>
  );
}