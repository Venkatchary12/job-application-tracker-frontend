import React, { useState } from 'react';
import { createEvent } from '../services/api';

export default function EventModal({ isOpen, onClose, onRefresh }) {
  const [eventData, setEventData] = useState({ title: '', eventDate: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(eventData);
      onRefresh();
      onClose();
    } catch (err) {
      alert('Failed to schedule event.');
    }
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
      <div className="bg-white rounded-4 shadow p-4 w-100" style={{ maxWidth: '400px' }}>
        <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-3">
          <h5 className="fw-bold mb-0">Schedule Interview</h5>
          <button onClick={onClose} className="btn-close"></button>
        </div>
        <form onSubmit={handleSubmit} className="vstack gap-3">
          <div>
            <label className="form-label small fw-semibold">Event / Interview Title</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Technical Round - Google" 
              className="form-control form-control-sm"
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label small fw-semibold">Date</label>
            <input 
              type="date" 
              required
              className="form-control form-control-sm"
              value={eventData.eventDate}
              onChange={(e) => setEventData({ ...eventData, eventDate: e.target.value })}
            />
          </div>
          <div className="d-flex justify-content-end gap-2 pt-2 border-top">
            <button type="button" onClick={onClose} className="btn btn-light btn-sm">Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm">Schedule</button>
          </div>
        </form>
      </div>
    </div>
  );
}