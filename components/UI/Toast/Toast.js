import React, { useEffect, useState } from 'react';
import './toast.css';

export default function Toast({ message, type = 'info', duration = 15000, sticky = true, onClose }) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    setVisible(!!message);
    if (!message) return;
    if (sticky) return; // do not auto-hide when sticky
    const t = setTimeout(() => setVisible(false), Math.max(1000, duration));
    return () => clearTimeout(t);
  }, [message, duration, sticky]);

  useEffect(() => {
    if (!visible && typeof onClose === 'function') onClose();
  }, [visible, onClose]);

  if (!visible) return null;
  return (
    <div className={`gc-toast gc-toast-${type}`} role="status" aria-live="polite">
      <span>{message}</span>
      <button className="gc-toast-close" aria-label="Close notification" onClick={() => setVisible(false)}>
        ×
      </button>
    </div>
  );
}
