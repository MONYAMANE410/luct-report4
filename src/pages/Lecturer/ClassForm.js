import React, { useState } from 'react';
import API from '../../utils/api';

const ClassForm = ({ onSuccess }) => {
  const [course_id, setCourseId] = useState('');
  const [class_name, setClassName] = useState('');
  const [venue, setVenue] = useState('');
  const [scheduled_time, setScheduledTime] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const lecturer_email = user?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/lecturer/classes', {
        course_id,
        class_name,
        venue,
        scheduled_time,
        lecturer_email
      });
      setCourseId('');
      setClassName('');
      setVenue('');
      setScheduledTime('');
      if (onSuccess) onSuccess(); // Refresh class list
    } catch (err) {
      console.error('Class submit error:', err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <label>Course ID</label>
        <input type="text" className="form-control" value={course_id} onChange={e => setCourseId(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Class Name</label>
        <input type="text" className="form-control" value={class_name} onChange={e => setClassName(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Venue</label>
        <input type="text" className="form-control" value={venue} onChange={e => setVenue(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Scheduled Time</label>
        <input type="text" className="form-control" value={scheduled_time} onChange={e => setScheduledTime(e.target.value)} required />
      </div>
      <button type="submit" className="btn btn-primary">Add Class</button>
    </form>
  );
};

export default ClassForm;
