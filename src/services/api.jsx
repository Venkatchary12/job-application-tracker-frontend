import axios from 'axios';

const API_BASE_URL = 'http://job-application-tracker-backend-production-12fe81a6.up.railway.app';

// --- COMPANY SERVICES ---
export const fetchCompanies = async () => {
  const res = await fetch(`${API_BASE_URL}/companies`);
  if (!res.ok) throw new Error('Failed to fetch companies');
  return res.json();
};

export const createCompany = async (data) => {
  const res = await fetch(`${API_BASE_URL}/companies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create company');
  return res.json();
};

export const updateCompanyService = async (id, data) => {
  const res = await fetch(`${API_BASE_URL}/companies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update company');
  return res.json();
};

export const deleteCompanyService = async (id) => {
  const res = await fetch(`${API_BASE_URL}/companies/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete company');
  return true;
};

// --- JOB APPLICATION SERVICES ---
export const fetchApplications = async () => {
  const res = await fetch(`${API_BASE_URL}/applications`);
  if (!res.ok) throw new Error('Failed to fetch applications');
  return res.json();
};

export const createApplication = async (data) => {
  const res = await fetch(`${API_BASE_URL}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create application');
  return res.json();
};

export const updateApplicationService = async (id, data) => {
  const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update application');
  return res.json();
};

export const deleteApplicationService = async (id) => {
  const res = await fetch(`${API_BASE_URL}/applications/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete application');
  return true;
};

// --- EVENT SERVICES (Interview Dates) ---
export const fetchEvents = async () => {
  const res = await fetch(`${API_BASE_URL}/events`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
};

export const createEvent = async (data) => {
  const res = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create event');
  return res.json();
};

export const updateEventService = async (id, data) => {
  const res = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update event');
  return res.json();
};

export const deleteEventService = async (id) => {
  const res = await fetch(`${API_BASE_URL}/events/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete event');
  return true;
};


// Auth Endpoints
export const registerUser = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/auth/register`, data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, data);
  return res.data;
};

// Resume Upload Endpoint
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axios.post(`${API_BASE_URL}/api/files/upload-resume`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};