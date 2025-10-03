import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import { logout } from '../../utils/api';

const PLDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: '', code: '', faculty: '' });
  const [reports, setReports] = useState([]);
  const [monitoring, setMonitoring] = useState([]);
  const [classes, setClasses] = useState([]);
  const [ratings, setRatings] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (activeTab === 'courses') {
      API.get('/pl/courses').then(res => setCourses(res.data));
      API.get('/pl/lecturers').then(res => setLecturers(res.data));
    }
    if (activeTab === 'reports') {
      API.get('/pl/reports').then(res => setReports(res.data));
    }
    if (activeTab === 'monitoring') {
      API.get('/pl/monitoring').then(res => setMonitoring(res.data));
    }
    if (activeTab === 'classes') {
      API.get('/pl/classes').then(res => setClasses(res.data));
    }
    if (activeTab === 'rating') {
      API.get('/pl/ratings').then(res => setRatings(res.data));
    }
  }, [activeTab]);

  const handleAddCourse = () => {
    API.post('/pl/courses', newCourse)
      .then(() => {
        setNewCourse({ name: '', code: '', faculty: '' });
        API.get('/pl/courses').then(res => setCourses(res.data));
      });
  };

  const handleAssignLecturer = (courseId, lecturerEmail) => {
    API.put('/pl/courses/assign', { course_id: courseId, assigned_to: lecturerEmail })
      .then(() => API.get('/pl/courses').then(res => setCourses(res.data)));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Program Leader Dashboard</h3>
        <button className="btn btn-danger" onClick={logout}>Logout</button>
      </div>
      <p>Welcome, {user?.name} ({user?.role})</p>

      <div className="btn-group mb-4">
        {['courses','reports','monitoring','classes','lectures','rating'].map(tab => (
          <button key={tab} className={`btn btn-outline-primary ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div>
          <h5>Add New Course</h5>
          <input className="form-control mb-2" placeholder="Course Name" value={newCourse.name} onChange={e => setNewCourse({ ...newCourse, name: e.target.value })} />
          <input className="form-control mb-2" placeholder="Course Code" value={newCourse.code} onChange={e => setNewCourse({ ...newCourse, code: e.target.value })} />
          <input className="form-control mb-2" placeholder="Faculty" value={newCourse.faculty} onChange={e => setNewCourse({ ...newCourse, faculty: e.target.value })} />
          <button className="btn btn-success mb-4" onClick={handleAddCourse}>Add Course</button>

          <h5>All Courses</h5>
          {courses.map(course => (
            <div key={course.id} className="card mb-3">
              <div className="card-body">
                <p><strong>{course.name}</strong> ({course.code})</p>
                <p><strong>Faculty:</strong> {course.faculty}</p>
                <p><strong>Assigned To:</strong> {course.assigned_to || 'Not assigned'}</p>
                <select className="form-select" onChange={e => handleAssignLecturer(course.id, e.target.value)}>
                  <option value="">Assign Lecturer</option>
                  {lecturers.map(l => (
                    <option key={l.id} value={l.email}>{l.name} ({l.email})</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div>
          <h5>Reports from PRL</h5>
          {reports.map(r => (
            <div key={r.id} className="card mb-3">
              <div className="card-body">
                <p><strong>Date:</strong> {new Date(r.date_of_lecture).toLocaleDateString()}</p>
                <p><strong>Lecturer:</strong> {r.lecturer_name}</p>
                <p><strong>Course:</strong> {r.course_name}</p>
                <p><strong>Class:</strong> {r.class_name}</p>
                <p><strong>Topic:</strong> {r.topic_taught}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div>
          <h5>Monitoring</h5>
          {monitoring.map(m => (
            <div key={m.id} className="card mb-3">
              <div className="card-body">
                <p><strong>Lecturer:</strong> {m.lecturer_email}</p>
                <p><strong>Course:</strong> {m.course_name}</p>
                <p><strong>Attendance:</strong> {m.attendance_rate}%</p>
                <p><strong>Engagement:</strong> {m.engagement_score}/10</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Classes Tab */}
      {activeTab === 'classes' && (
        <div>
          <h5>Scheduled Classes</h5>
          {classes.map(cls => (
            <div key={cls.id} className="card mb-3">
              <div className="card-body">
                <p><strong>Lecturer:</strong> {cls.lecturer_email}</p>
                <p><strong>Course ID:</strong> {cls.course_id}</p>
                <p><strong>Class:</strong> {cls.class_name}</p>
                <p><strong>Venue:</strong> {cls.venue}</p>
                <p><strong>Time:</strong> {cls.scheduled_time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lectures Tab */}
      {activeTab === 'lectures' && (
        <div>
          <h5>All Lecturers</h5>
          {lecturers.map(l => (
            <div key={l.id} className="card mb-2">
              <div className="card-body">
                <p><strong>Name:</strong> {l.name}</p>
                <p><strong>Email:</strong> {l.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating Tab */}
      {activeTab === 'rating' && (
        <div>
          <h5>Ratings & Feedback</h5>
          {ratings.map(r => (
            <div key={r.id} className="card mb-3">
              <div className="card-body">
                <p><strong>Lecturer:</strong> {r.lecturer_email}</p>
                <p><strong>Course:</strong> {r.course_name}</p>
                <p><strong>Rating:</strong> {r.rating}/5</p>
                <p><strong>Comments:</strong> {r.comments}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PLDashboard;
