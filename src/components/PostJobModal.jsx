import React, { useState } from 'react';
import { createCompany, createApplication, createEvent } from '../services/api';

export default function PostJobModal({ isOpen, onClose, onRefreshData }) {
  const [formData, setFormData] = useState({
    companyName: '',
    location: '',
    website: '',
    role: '',
    salary: '',
    type: 'Full-time',
    status: 'Applied',
    interviewDate: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Create Company
      const companyRes = await createCompany({
        companyName: formData.companyName,
        location: formData.location,
        website: formData.website || 'https://example.com'
      });

      // 2. Create Job Application with interviewDate included right away
      await createApplication({
        company: companyRes,
        jobRole: formData.role,
        appliedDate: new Date().toISOString().split('T')[0],
        status: formData.status,
        salary: formData.salary,
        type: formData.type,
        location: formData.location,
        interviewDate: formData.interviewDate // Saved immediately on creation
      });

      // 3. Create Event
      if (formData.interviewDate) {
        await createEvent({
          title: `Interview for ${formData.role} at ${formData.companyName}`,
          date: formData.interviewDate,
          location: formData.location || 'Remote'
        });
      }

      onRefreshData();
      onClose();
    } catch (error) {
      console.error('Error creating vacancy & event:', error);
      alert('Failed to save data to backend database.');
    }
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
      <div className="bg-white rounded-4 shadow p-4 w-100" style={{ maxWidth: '500px' }}>
        <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
          <h5 className="fw-bold text-dark mb-0">Add Company & Job Vacancy</h5>
          <button onClick={onClose} className="btn-close"></button>
        </div>

        <form onSubmit={handleSubmit} className="vstack gap-3">
          <div>
            <label className="form-label small fw-semibold text-secondary">Company Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Google" 
              className="form-control form-control-sm"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
          </div>

          <div className="row g-2">
            <div className="col">
              <label className="form-label small fw-semibold text-secondary">Location</label>
              <input 
                type="text" 
                placeholder="e.g. Hyderabad / Remote" 
                className="form-control form-control-sm"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="col">
              <label className="form-label small fw-semibold text-secondary">Website</label>
              <input 
                type="text" 
                placeholder="e.g. google.com" 
                className="form-control form-control-sm"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="form-label small fw-semibold text-secondary">Job Role / Title</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Spring Boot Developer" 
              className="form-control form-control-sm"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
          </div>

          <div className="row g-2">
            <div className="col">
              <label className="form-label small fw-semibold text-secondary">Employment Type</label>
              <select 
                className="form-select form-select-sm"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div className="col">
              <label className="form-label small fw-semibold text-secondary">Salary Range</label>
              <input 
                type="text" 
                placeholder="e.g. $90k - 120k" 
                className="form-control form-control-sm"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="form-label small fw-semibold text-primary">
              <i className="bi bi-calendar-event me-1"></i> Interview Schedule Date
            </label>
            <input 
              type="date" 
              required
              className="form-control form-control-sm"
              value={formData.interviewDate}
              onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
            />
          </div>

          <div className="d-flex justify-content-end gap-2 pt-3 border-top mt-2">
            <button type="button" onClick={onClose} className="btn btn-light btn-sm fw-semibold">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm fw-semibold">
              Save to Database
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}