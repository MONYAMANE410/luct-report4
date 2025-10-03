import React, { useState } from 'react';
import API from '../../utils/api';

const ReportingForm = () => {
  const [formData, setFormData] = useState({
    faculty: '',
    className: '',
    week: '',
    dateOfLecture: '',
    courseName: '',
    courseCode: '',
    lecturerName: '',
    actualStudents: '',
    totalStudents: '',
    venue: '',
    scheduledTime: '',
    topic: '',
    outcomes: '',
    recommendations: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/reports', formData);
      alert('Report submitted successfully!');
    } catch (error) {
      alert('Error submitting report');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h3>Lecturer Reporting Form</h3>
      {Object.keys(formData).map((field) => (
        <div className="mb-3" key={field}>
          <label className="form-label">{field}</label>
          <input
            type={field === 'dateOfLecture' ? 'date' : 'text'}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
      ))}
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
};

export default ReportingForm;
