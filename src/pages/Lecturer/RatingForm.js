import React, { useState } from 'react';
import API from '../../utils/api';

const RatingForm = ({ onSuccess }) => {
  const [course_name, setCourseName] = useState('');
  const [rating, setRating] = useState('');
  const [comments, setComments] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const lecturer_email = user?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/lecturer/ratings', {
        course_name,
        rating,
        comments,
        lecturer_email
      });
      setCourseName('');
      setRating('');
      setComments('');
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
        <label>Rating (1–5)</label>
        <input type="number" className="form-control" value={rating} onChange={e => setRating(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Feedback Comments</label>
        <textarea className="form-control" value={comments} onChange={e => setComments(e.target.value)} required />
      </div>
      <button type="submit" className="btn btn-primary">Submit Rating</button>
    </form>
  );
};

export default RatingForm;
