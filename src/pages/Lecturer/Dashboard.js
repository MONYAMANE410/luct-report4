import React, { useState, useEffect } from 'react';
import ReportingForm from './ReportingForm';
import MonitoringForm from './MonitoringForm';
import RatingForm from './RatingForm';
import ClassForm from './ClassForm';
import { logout } from '../../utils/api';
import API from '../../utils/api';

const LecturerDashboard = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [classes, setClasses] = useState([]);
  const [monitoring, setMonitoring] = useState([]);
  const [ratings, setRatings] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const email = user?.email;

  useEffect(() => {
    if (!email) return;

    if (activeTab === 'classes') {
      API.get(`/lecturer/classes?email=${email}`)
        .then(res => setClasses(res.data))
        .catch(err => console.error('Classes error:', err.message));
    }

    if (activeTab === 'monitoring') {
      API.get(`/lecturer/monitoring?email=${email}`)
        .then(res => setMonitoring(res.data))
        .catch(err => console.error('Monitoring error:', err.message));
    }

    if (activeTab === 'rating') {
      API.get(`/lecturer/ratings?email=${email}`)
        .then(res => setRatings(res.data))
        .catch(err => console.error('Ratings error:', err.message));
    }
  }, [activeTab, email]);

  const refreshClasses = () => {
    API.get(`/lecturer/classes?email=${email}`)
      .then(res => setClasses(res.data))
      .catch(err => console.error('Classes error:', err.message));
  };

  const refreshMonitoring = () => {
    API.get(`/lecturer/monitoring?email=${email}`)
      .then(res => setMonitoring(res.data))
      .catch(err => console.error('Monitoring error:', err.message));
  };

  const refreshRatings = () => {
    API.get(`/lecturer/ratings?email=${email}`)
      .then(res => setRatings(res.data))
      .catch(err => console.error('Ratings error:', err.message));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Lecturer Dashboard</h3>
        <button className="btn btn-danger" onClick={logout}>Logout</button>
      </div>
      <p>Welcome, {user?.name || 'Lecturer'} ({user?.role || 'lecturer'})</p>

      {/* Navigation Tabs */}
      <div className="btn-group mb-4">
        <button className={`btn btn-outline-primary ${activeTab === 'classes' ? 'active' : ''}`} onClick={() => setActiveTab('classes')}>Classes</button>
        <button className={`btn btn-outline-primary ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>Reports</button>
        <button className={`btn btn-outline-primary ${activeTab === 'monitoring' ? 'active' : ''}`} onClick={() => setActiveTab('monitoring')}>Monitoring</button>
        <button className={`btn btn-outline-primary ${activeTab === 'rating' ? 'active' : ''}`} onClick={() => setActiveTab('rating')}>Rating</button>
      </div>

      {/* Tab Content */}
      {activeTab === 'reports' && (
        <div>
          <h5>Submit Teaching Report</h5>
          <ReportingForm />
        </div>
      )}

      {activeTab === 'classes' && (
        <div>
          <h5>Your Assigned Classes</h5>
          <ClassForm onSuccess={refreshClasses} />
          {classes.length === 0 ? (
            <p>No classes assigned.</p>
          ) : (
            classes.map(cls => (
              <div key={cls.id} className="card mb-3">
                <div className="card-body">
                  <h6>Course ID: {cls.course_id}</h6>
                  <p><strong>Class:</strong> {cls.class_name}</p>
                  <p><strong>Venue:</strong> {cls.venue}</p>
                  <p><strong>Time:</strong> {cls.scheduled_time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'monitoring' && (
        <div>
          <h5>Monitoring Overview</h5>
          <MonitoringForm onSuccess={refreshMonitoring} />
          {monitoring.length === 0 ? (
            <p>No monitoring data available.</p>
          ) : (
            monitoring.map(item => (
              <div key={item.id} className="card mb-3">
                <div className="card-body">
                  <p><strong>Course:</strong> {item.course_name}</p>
                  <p><strong>Attendance:</strong> {item.attendance_rate}%</p>
                  <p><strong>Engagement:</strong> {item.engagement_score}/10</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'rating' && (
        <div>
          <h5>Feedback & Ratings</h5>
          <RatingForm onSuccess={refreshRatings} />
          {ratings.length === 0 ? (
            <p>No ratings received yet.</p>
          ) : (
            ratings.map(r => (
              <div key={r.id} className="card mb-3">
                <div className="card-body">
                  <p><strong>Course:</strong> {r.course_name}</p>
                  <p><strong>Rating:</strong> {r.rating}/5</p>
                  <p><strong>Feedback:</strong> {r.comments}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;
