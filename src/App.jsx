import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import RecruiterView from './components/RecruiterView';
import JobSeekerPortal from './components/JobSeekerPortal';
import PostJobModal from './components/PostJobModal';
import AuthModal from './components/AuthModal';
import { 
  fetchCompanies, 
  fetchApplications, 
  fetchEvents, 
  deleteCompanyService, 
  deleteApplicationService, 
  updateApplicationService,
  deleteEventService,
  updateEventService,
  createEvent         
} from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); 
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); 
  const [activeTab, setActiveTab] = useState('seeker'); 
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [myAppliedJobs, setMyAppliedJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [compRes, appRes, eventRes] = await Promise.all([
        fetchCompanies(),
        fetchApplications(),
        fetchEvents()
      ]);
      setCompanies(Array.isArray(compRes) ? compRes : []);
      setApplications(Array.isArray(appRes) ? appRes : []);
      setEvents(Array.isArray(eventRes) ? eventRes : []);
    } catch (err) {
      console.error('Backend sync error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadData(); 
    setIsAuthModalOpen(true);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthModalOpen(true);
  };

  const handleDeleteApplication = async (id) => {
    try {
      const targetApp = applications.find(app => app.id === id);
      await deleteApplicationService(id);

      if (targetApp) {
        const role = targetApp.jobRole || targetApp.role;
        const matchingEvent = events.find(ev => ev.title && ev.title.includes(role));
        if (matchingEvent && matchingEvent.id) {
          await deleteEventService(matchingEvent.id);
        }
      }

      setMyAppliedJobs(myAppliedJobs.filter(job => job.id !== id));
      loadData();
    } catch (err) {
      console.error('Failed to delete application', err);
      loadData();
    }
  };

  const handleDeleteAppliedJob = (id) => {
    setMyAppliedJobs(myAppliedJobs.filter(job => job.id !== id));
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEventService(eventId);
      loadData();
    } catch (err) {
      console.error('Failed to delete event', err);
    }
  };

  const handleUpdateApplication = async (id, updatedData) => {
    try {
      await updateApplicationService(id, updatedData);

      const targetApp = applications.find(app => app.id === id);
      if (targetApp && updatedData.interviewDate) {
        const role = targetApp.jobRole || targetApp.role;
        const companyName = targetApp.company?.companyName || targetApp.company || '';
        const matchingEvent = events.find(ev => ev.title && ev.title.includes(role));

        if (matchingEvent && matchingEvent.id) {
          await updateEventService(matchingEvent.id, {
            ...matchingEvent,
            date: updatedData.interviewDate
          });
        } else {
          await createEvent({
            title: `Interview for ${role} at ${companyName}`,
            date: updatedData.interviewDate,
            location: updatedData.location || 'Remote'
          });
        }
      }

      loadData();
    } catch (err) {
      console.error('Failed to update application', err);
    }
  };

  const handleApplyJob = async (jobWithResume) => {
    if (!myAppliedJobs.some((app) => app.id === jobWithResume.id)) {
      setMyAppliedJobs([...myAppliedJobs, jobWithResume]);
    }
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    if (userData.role === 'ROLE_RECRUITER') {
      setActiveTab('recruiter');
    } else {
      setActiveTab('seeker');
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light font-sans">
      <AuthModal 
        isOpen={isAuthModalOpen || !currentUser} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-grow-1 d-flex flex-column min-w-0">
        <TopHeader 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenPostModal={() => setIsPostModalOpen(true)} 
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />
        
        <main className="p-4 p-md-5 w-100 mx-auto" style={{ maxWidth: '1400px' }}>
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : currentUser?.role === 'ROLE_RECRUITER' ? (
            <RecruiterView 
              companies={companies}
              applications={applications}
              events={events}
              onDeleteCompany={async (id) => { await deleteCompanyService(id); loadData(); }}
              onDeleteApplication={handleDeleteApplication}
              onUpdateApplication={handleUpdateApplication}
              onDeleteEvent={handleDeleteEvent}
              onOpenModal={() => setIsPostModalOpen(true)}
            />
          ) : (
            <JobSeekerPortal 
              jobs={applications}
              myAppliedJobs={myAppliedJobs}
              events={events}
              onApplyJob={handleApplyJob}
              onDeleteAppliedJob={handleDeleteAppliedJob}
              onUpdateApplication={handleUpdateApplication}
            />
          )}
        </main>
      </div>

      <PostJobModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
        onRefreshData={loadData} 
      />
    </div>
  );
}