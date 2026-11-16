import React from 'react';

export default function TopHeader({ 
  activeTab, 
  setActiveTab, 
  onOpenPostModal, 
  currentUser, 
  onOpenAuthModal, 
  onLogout 
}) {
  const isRecruiter = currentUser?.role === 'ROLE_RECRUITER';

  return (
    <header className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center gap-3">
        <span className="text-muted small">
          Mode: <strong className="text-dark">{isRecruiter ? 'Recruiter' : 'Job Seeker'}</strong>
        </span>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* Only show Post Job button if logged in as a Recruiter */}
        {currentUser && isRecruiter && (
          <button 
            onClick={onOpenPostModal} 
            className="btn btn-primary btn-sm fw-semibold px-3 py-2 shadow-sm"
          >
            + Post New Job Vacancy
          </button>
        )}

        {currentUser ? (
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-secondary-subtle text-dark px-3 py-2">
              {currentUser.email} ({isRecruiter ? 'Recruiter' : 'Seeker'})
            </span>
            <button 
              onClick={onLogout} 
              className="btn btn-outline-danger btn-sm px-3"
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={onOpenAuthModal} 
            className="btn btn-outline-primary btn-sm fw-semibold px-3"
          >
            Sign In / Register
          </button>
        )}
      </div>
    </header>
  );
}