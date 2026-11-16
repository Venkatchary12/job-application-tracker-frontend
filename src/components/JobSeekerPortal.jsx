import React, { useState } from 'react';
import { uploadResume } from '../services/api';

export default function JobSeekerPortal({ 
  jobs = [], 
  myAppliedJobs = [], 
  events = [], 
  onApplyJob, 
  onDeleteAppliedJob 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const safeMyApplications = Array.isArray(myAppliedJobs) ? myAppliedJobs : [];
  const safeEvents = Array.isArray(events) ? events : [];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadResume(file);
      setUploadedResumeUrl(res.fileUrl);
      setResumeFile(file.name);
      alert('Resume uploaded successfully!');
    } catch (err) {
      alert('Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = () => {
    setResumeFile(null);
    setUploadedResumeUrl('');
  };

  const getCompanyName = (job) => {
    if (!job.company) return '';
    if (typeof job.company === 'string') return job.company;
    return job.company.companyName || job.company.name || '';
  };

  const getLocationName = (job) => {
    if (job.location) return job.location;
    if (job.company && typeof job.company === 'object' && job.company.location) {
      return job.company.location;
    }
    return 'Remote';
  };

  const filteredJobs = safeJobs.filter((j) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const role = (j.jobRole || j.role || '').toLowerCase();
    const company = getCompanyName(j).toLowerCase();
    const location = getLocationName(j).toLowerCase();
    return role.includes(query) || company.includes(query) || location.includes(query);
  });

  return (
    <div>
      {/* Upload & Manage Resume Section */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <h5 className="fw-bold text-dark mb-2">Upload Resume (PDF / DOCX)</h5>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          {!resumeFile ? (
            <input 
              type="file" 
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="form-control form-control-sm w-auto"
            />
          ) : (
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success-subtle text-success p-2 small">
                ✓ Attached: {resumeFile}
              </span>
              <a href={`http://localhost:9990${uploadedResumeUrl}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary py-1">
                View
              </a>
              <button 
                onClick={handleDeleteResume} 
                className="btn btn-sm btn-outline-danger py-1"
              >
                Delete / Change
              </button>
            </div>
          )}
          {uploading && <span className="spinner-border spinner-border-sm text-primary"></span>}
        </div>
      </div>

      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark mb-1">Explore & Apply for Jobs</h1>
        <input
          type="text"
          placeholder="Search by role, company, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control py-2 shadow-sm"
        />
      </div>

      {/* Available Jobs */}
      <h5 className="fw-bold text-dark mb-3">Available Job Vacancies ({filteredJobs.length})</h5>
      <div className="row row-cols-1 row-cols-md-2 g-3 mb-5">
        {filteredJobs.length === 0 ? (
          <div className="col-12 text-muted small py-3 bg-white border rounded-3 text-center">
            No matching job vacancies found.
          </div>
        ) : (
          filteredJobs.map((job) => {
            const hasApplied = safeMyApplications.some((app) => app.id === job.id);
            return (
              <div className="col" key={job.id || Math.random()}>
                <div className="card h-100 border shadow-sm rounded-4 p-4 bg-white d-flex flex-column justify-content-between">
                  <div>
                    <span className="badge bg-success-subtle text-success px-2.5 py-1 small fw-semibold mb-2">
                      {getCompanyName(job) || 'Company'}
                    </span>
                    <h4 className="h5 fw-bold text-dark mb-2">{job.jobRole || job.role}</h4>
                    <div className="d-flex flex-wrap gap-1.5 mb-3">
                      <span className="badge bg-light text-dark border px-2.5 py-1">{job.type || 'Full-time'}</span>
                      <span className="badge bg-light text-dark border px-2.5 py-1">
                        <i className="bi bi-geo-alt me-1"></i>{getLocationName(job)}
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-top d-flex justify-content-end">
                    {hasApplied ? (
                      <button disabled className="btn btn-secondary btn-sm px-4 disabled">✓ Applied</button>
                    ) : (
                      <button onClick={() => onApplyJob({ ...job, resumeUrl: uploadedResumeUrl })} className="btn btn-dark btn-sm px-4">
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Applied Jobs & Tracker Section */}
      <h5 className="fw-bold text-dark mb-3">My Applied Jobs & Interview Tracker ({safeMyApplications.length})</h5>
      <div className="vstack gap-3 mb-5">
        {safeMyApplications.length === 0 ? (
          <div className="text-muted small py-3 bg-white border rounded-3 text-center">
            You haven't applied to any jobs yet.
          </div>
        ) : (
          safeMyApplications.map((job) => (
            <div className="card border shadow-sm rounded-4 p-4 bg-white" key={job.id}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <span className="badge bg-primary-subtle text-primary mb-2">{getCompanyName(job)}</span>
                  <h5 className="fw-bold text-dark mb-1">{job.jobRole || job.role}</h5>
                  <p className="text-muted small mb-2"><i className="bi bi-geo-alt me-1"></i>{getLocationName(job)}</p>
                  {job.interviewDate && (
                    <span className="badge bg-warning-subtle text-dark border me-2">
                      Interview Scheduled: {job.interviewDate}
                    </span>
                  )}
                  {job.resumeUrl && (
                    <a href={`http://localhost:9990${job.resumeUrl}`} target="_blank" rel="noreferrer" className="small text-decoration-none d-block mt-1">
                      📎 Attached Resume
                    </a>
                  )}
                </div>
                <div>
                  <button 
                    onClick={() => onDeleteAppliedJob(job.id)} 
                    className="btn btn-outline-danger btn-sm"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Scheduled Interviews & Events */}
      <h5 className="fw-bold text-dark mb-3">Scheduled Interviews & Events ({safeEvents.length})</h5>
      <div className="row row-cols-1 row-cols-md-3 g-3">
        {safeEvents.length === 0 ? (
          <div className="col-12 text-muted small py-3 bg-white border rounded-3 text-center">
            No upcoming interview events scheduled.
          </div>
        ) : (
          safeEvents.map((ev) => (
            <div className="col" key={ev.id || Math.random()}>
              <div className="card border shadow-sm rounded-4 p-3 bg-white">
                <h6 className="fw-bold text-dark mb-1">{ev.title}</h6>
                <p className="text-muted small mb-1"><i className="bi bi-calendar me-1"></i>{ev.date}</p>
                <p className="text-muted small mb-0"><i className="bi bi-geo-alt me-1"></i>{ev.location || 'Remote'}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}