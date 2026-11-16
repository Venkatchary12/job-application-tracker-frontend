import React, { useState } from 'react';

export default function RecruiterView({ 
  companies = [], 
  applications = [], 
  events = [],
  onDeleteCompany, 
  onDeleteApplication, 
  onUpdateApplication, 
  onDeleteEvent, 
  onOpenModal,
  onOpenEventModal 
}) {
  const [editingJobId, setEditingJobId] = useState(null);
  const [editFormData, setEditFormData] = useState({ 
    jobRole: '', 
    salary: '', 
    type: 'Full-time', 
    location: '',
    interviewDate: '' 
  });
  const [currentJobObj, setCurrentJobObj] = useState(null);

  const safeCompanies = Array.isArray(companies) ? companies : [];
  const safeApplications = Array.isArray(applications) ? applications : [];
  const safeEvents = Array.isArray(events) ? events : [];

  const startEdit = (job) => {
    setEditingJobId(job.id);
    setCurrentJobObj(job);
    setEditFormData({ 
      jobRole: job.jobRole || job.role || '', 
      salary: job.salary || '', 
      type: job.type || 'Full-time', 
      location: job.location || job.company?.location || '',
      interviewDate: job.interviewDate || job.interview_date || job.date || '' 
    });
  };

  const handleUpdateSubmit = (id) => {
    const completeUpdatedPayload = {
      ...currentJobObj,
      jobRole: editFormData.jobRole,
      salary: editFormData.salary,
      type: editFormData.type,
      location: editFormData.location,
      interviewDate: editFormData.interviewDate,
      appliedDate: currentJobObj.appliedDate || currentJobObj.applied_date || new Date().toISOString().split('T')[0],
      status: currentJobObj.status || 'Applied'
    };

    onUpdateApplication(id, completeUpdatedPayload);
    setEditingJobId(null);
    setCurrentJobObj(null);
  };

  const getCompanyName = (job) => {
    if (!job.company) return 'Company';
    if (typeof job.company === 'string') return job.company;
    return job.company.companyName || job.company.name || 'Company';
  };

  const getLocationName = (job) => {
    if (job.location) return job.location;
    if (job.company && typeof job.company === 'object' && job.company.location) {
      return job.company.location;
    }
    return 'Not Specified';
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Recruiter Dashboard</h1>
          <p className="text-muted small mb-0">Manage companies, job vacancies, and interview schedules</p>
        </div>
        <div className="d-flex gap-2">
          <button onClick={onOpenEventModal} className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2">
            <i className="bi bi-calendar-event"></i>
            <span>Schedule Interview</span>
          </button>
          <button onClick={onOpenModal} className="btn btn-primary btn-sm d-flex align-items-center gap-2">
            <i className="bi bi-plus-lg"></i>
            <span>Add Vacancy</span>
          </button>
        </div>
      </div>

      {/* Posted Job Vacancies */}
      <h5 className="fw-bold text-dark mb-3">Posted Job Vacancies ({safeApplications.length})</h5>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 mb-5">
        {safeApplications.length === 0 ? (
          <div className="col-12 text-muted small py-3 bg-white border rounded-3 text-center">
            No job vacancies posted yet.
          </div>
        ) : (
          safeApplications.map((job) => (
            <div className="col" key={job.id || Math.random()}>
              <div className="card h-100 border shadow-sm rounded-4 p-4 bg-white d-flex flex-column justify-content-between">
                {editingJobId === job.id ? (
                  <div className="vstack gap-2">
                    <div>
                      <label className="form-label text-muted small mb-1">Role / Title</label>
                      <input 
                        type="text" 
                        className="form-control form-control-sm"
                        value={editFormData.jobRole}
                        onChange={(e) => setEditFormData({ ...editFormData, jobRole: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label text-muted small mb-1">Salary Range</label>
                      <input 
                        type="text" 
                        className="form-control form-control-sm"
                        value={editFormData.salary}
                        onChange={(e) => setEditFormData({ ...editFormData, salary: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label text-muted small mb-1">Location</label>
                      <input 
                        type="text" 
                        className="form-control form-control-sm"
                        placeholder="e.g. Hyderabad / Remote"
                        value={editFormData.location}
                        onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label text-muted small mb-1">Interview Date</label>
                      <input 
                        type="date" 
                        className="form-control form-control-sm"
                        value={editFormData.interviewDate}
                        onChange={(e) => setEditFormData({ ...editFormData, interviewDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label text-muted small mb-1">Type</label>
                      <select 
                        className="form-select form-select-sm"
                        value={editFormData.type}
                        onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-2">
                      <button onClick={() => setEditingJobId(null)} className="btn btn-light btn-sm">Cancel</button>
                      <button onClick={() => handleUpdateSubmit(job.id)} className="btn btn-success btn-sm">Save Changes</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-primary-subtle text-primary px-2 py-1 small fw-semibold">
                        {getCompanyName(job)}
                      </span>
                      <div className="d-flex align-items-center gap-1">
                        <button 
                          onClick={() => startEdit(job)} 
                          className="btn btn-sm btn-outline-secondary p-1 px-2" 
                          title="Edit Vacancy"
                        >
                          <i className="bi bi-pencil"></i> Edit
                        </button>
                        <button 
                          onClick={() => onDeleteApplication(job.id)} 
                          className="btn btn-sm btn-outline-danger p-1 px-2" 
                          title="Delete Vacancy"
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </div>
                    </div>
                    <h4 className="h6 fw-bold text-dark mb-2">{job.jobRole || job.role}</h4>
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      <span className="badge bg-light text-secondary border px-2 py-1">{job.type || 'Full-time'}</span>
                      {/* DYNAMIC LOCATION DISPLAY */}
                      <span className="badge bg-light text-secondary border px-2 py-1">
                        <i className="bi bi-geo-alt me-1"></i>{getLocationName(job)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-top d-flex justify-content-between align-items-center small text-muted">
                  <span>Posted: {job.appliedDate || job.applied_date || job.date || 'Recent'}</span>
                  <span className="fw-bold text-dark text-success">{job.salary || 'Competitive'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Scheduled Interview Events */}
      <h5 className="fw-bold text-dark mb-3">Scheduled Interviews & Events ({safeEvents.length})</h5>
      <div className="list-group">
        {safeEvents.length === 0 ? (
          <div className="text-muted small py-3 bg-white border rounded-3 text-center">
            No interview events scheduled.
          </div>
        ) : (
          safeEvents.map((ev) => {
            const eventDate = ev.date || ev.eventDate || ev.interviewDate || ev.interview_date || 'Not specified';
            
            return (
              <div key={ev.id || Math.random()} className="list-group-item d-flex justify-content-between align-items-center rounded-3 mb-2 p-3 border shadow-sm bg-white">
                <div>
                  <h6 className="fw-bold text-dark mb-1">{ev.title || ev.eventName || 'Interview'}</h6>
                  <small className="text-muted">
                    <i className="bi bi-calendar3 me-1 text-primary"></i> 
                    <span className="fw-semibold text-dark">Date:</span> {eventDate}
                  </small>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="badge bg-success-subtle text-success px-3 py-1 fw-semibold">Scheduled</span>
                  <button 
                    onClick={() => onDeleteEvent(ev.id)} 
                    className="btn btn-sm btn-outline-danger p-1 px-2"
                    title="Delete Interview Schedule"
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}