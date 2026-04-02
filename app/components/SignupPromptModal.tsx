'use client';

import { userManager } from '@/types';
import styles from '../dashboard/dashboard.module.css';

interface SignupPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function SignupPromptModal({ isOpen, onClose, message }: SignupPromptModalProps) {
  if (!isOpen) return null;

  const handleSignIn = () => {
    userManager.signinRedirect();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Sign in to continue</h3>
          <button
            type="button"
            className={styles.modalCloseButton}
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className={styles.modalBody}>
          <p style={{ color: '#5a5248', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            {message ||
              'Create a free account or log in to unlock full access — resume crafting, career analysis, profile saving, and more.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button type="button" className={styles.nextButton} onClick={handleSignIn}>
              <span className={styles.nextButtonText}>Sign Up / Log In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
