import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'seeker', label: 'Find & Apply Jobs', icon: 'bi-search' },
    { id: 'recruiter', label: 'Recruiter Dashboard', icon: 'bi-building-add' },
  ];

  return (
    <aside className="d-flex flex-column justify-between bg-white border-end vh-100 p-3 sticky-top" style={{ width: '260px' }}>
      <div>
        <div className="d-flex align-items-center gap-2 px-2 mb-4">
          <div className="bg-primary text-white fw-bold rounded-3 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            J
          </div>
          <span className="fw-bold fs-5 text-dark tracking-tight">JobTrakr Portal</span>
        </div>

        <nav className="nav flex-column gap-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`btn text-start w-100 d-flex align-items-center gap-3 px-3 py-2.5 fw-medium border-0 rounded-3 ${
                  isActive ? 'bg-primary text-white shadow-sm' : 'text-secondary hover-bg-light'
                }`}
              >
                <i className={`bi ${item.icon} fs-5`}></i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-3 border-top">
        <div className="bg-light p-3 rounded-3 small text-secondary">
          <p className="fw-bold text-dark mb-1">How it works:</p>
          <ol className="ps-3 mb-0 small">
            <li>Post jobs via Recruiter View.</li>
            <li>Search & apply in Job Seeker View.</li>
          </ol>
        </div>
      </div>
    </aside>
  );
}