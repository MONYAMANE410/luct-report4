import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import { logout } from '../../utils/api';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('monitoring');
  const [monitoring, setMonitoring] = useState([]);
  const [ratingForm, setRatingForm] = useState({ lecturer_email: '', course_name: '', rating: '', comments: '' });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (activeTab === 'monitoring') {
      API.get(`/student/monitoring/${user.email}`)
        .then(res => setMonitoring(res.data))
        .catch(err => console.error(err.message));
    }
  }, [activeTab, user.email]);

  const handleRatingSubmit = () => {
    const payload = { ...ratingForm, student_email: user.email };
    API.post('/student/ratings', payload)
      .then(() => {
        setRatingForm({ lecturer_email: '', course_name: '', rating: '', comments: '' });
        alert('Rating submitted!');
      })
      .catch(err => console.error(err.message));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Student Dashboard</h3>
        <button className="btn btn-danger" onClick={logout}>Logout</button>
      </div>
      <p>Welcome, {user?.name} ({user?.email})</p>

      <div className="btn-group mb-4">
        <button className={`btn btn-outline-primary ${activeTab === 'monitoring' ? 'active' : ''}`} onClick={() => setActiveTab('monitoring')}>Monitoring</button>
        <button className={`btn btn-outline-primary ${activeTab === 'rating' ? 'active' : ''}`} onClick={() => setActiveTab('rating')}>Rating</button>
      </div>

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div>
          <h5>Your Attendance & Engagement</h5>
          {monitoring.length === 0 ? <p>No records found.</p> : monitoring.map(m => (
            <div key={m.id} className="card mb-3">
              <div className="card-body">
                <p><strong>Course:</strong> {m.course_name}</p>
                <p><strong>Attendance:</strong> {m.attendance_rate}%</p>
                <p><strong>Engagement:</strong> {m.engagement_score}/10</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating Tab */}
      {activeTab === 'rating' && (
        <div>
          <h5>Submit Feedback & Rating</h5>
          <input className="form-control mb-2" placeholder="Lecturer Email" value={ratingForm.lecturer_email} onChange={e => setRatingForm({ ...ratingForm, lecturer_email: e.target.value })} />
          <input className="form-control mb-2" placeholder="Course Name" value={ratingForm.course_name} onChange={e => setRatingForm({ ...ratingForm, course_name: e.target.value })} />
          <input className="form-control mb-2" type="number" placeholder="Rating (1-5)" value={ratingForm.rating} onChange={e => setRatingForm({ ...ratingForm, rating: e.target.value })} />
          <textarea className="form-control mb-2" rows="3" placeholder="Comments" value={ratingForm.comments} onChange={e => setRatingForm({ ...ratingForm, comments: e.target.value })} />
          <button className="btn btn-primary" onClick={handleRatingSubmit}>Submit Rating</button>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
