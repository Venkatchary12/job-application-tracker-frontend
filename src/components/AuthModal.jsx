import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'ROLE_SEEKER' });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await registerUser(formData);
        alert('Registration successful! Please sign in.');
        setIsRegister(false);
      } else {
        const data = await loginUser({ email: formData.email, password: formData.password });
        onLoginSuccess(data);
        onClose();
      }
    } catch (err) {
      // Captures the exact error message sent back from Spring Boot
      const errorMsg = typeof err.response?.data === 'string' 
        ? err.response.data 
        : err.response?.data?.message || err.message || 'Authentication failed';
      setError(errorMsg);
    }
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1060 }}>
      <div className="bg-white rounded-4 shadow p-4 w-100" style={{ maxWidth: '400px' }}>
        <h4 className="fw-bold text-dark mb-3">{isRegister ? 'Create Account' : 'Sign In'}</h4>
        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit} className="vstack gap-3">
          <div>
            <label className="form-label small fw-semibold">Email Address</label>
            <input 
              type="email" 
              required 
              className="form-control form-control-sm"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label small fw-semibold">Password</label>
            <input 
              type="password" 
              required 
              className="form-control form-control-sm"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {isRegister && (
            <div>
              <label className="form-label small fw-semibold">Account Role</label>
              <select 
                className="form-select form-select-sm"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="ROLE_SEEKER">Job Seeker</option>
                <option value="ROLE_RECRUITER">Recruiter</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 fw-semibold mt-2">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-3 border-top pt-2">
          <button 
            onClick={() => setIsRegister(!isRegister)} 
            className="btn btn-link btn-sm text-decoration-none"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}