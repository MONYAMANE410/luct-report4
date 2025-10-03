import React, { useState } from 'react';
import API from '../../utils/api';

const MonitoringForm = ({ onSuccess }) => {
  const [course_name, setCourseName] = useState('');
  const [attendance_rate, setAttendanceRate] = useState('');
  const [engagement_score, setEngagementScore] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const lecturer_email = user?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/lecturer/monitoring', {
        course_name,
        attendance_rate,
        engagement_score,
        lecturer_email
      });
      setCourseName('');
      setAttendanceRate('');
      setEngagementScore('');
      if (onSuccess) onSuccess(); // Refresh dashboard
    } catch (err) {
      console.error('Submit error:', err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <label>Course Name</label>
        <input type="text" className="form-control" value={course_name} onChange={e => setCourseName(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Attendance Rate (%)</label>
        <input type="number" className="form-control" value={attendance_rate} onChange={e => setAttendanceRate(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Engagement Score (1–10)</label>
        <input type="number" className="form-control" value={engagement_score} onChange={e => setEngagementScore(e.target.value)} required />
      </div>
      <button type="submit" className="btn btn-primary">Submit Monitoring</button>
    </form>
  );
};

export default MonitoringForm;
