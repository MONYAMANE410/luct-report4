import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import { logout } from '../../utils/api';
import * as XLSX from 'xlsx';

const PrincipalDashboard = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [courses, setCourses] = useState([]);
  const [monitoring, setMonitoring] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [newFeedback, setNewFeedback] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (activeTab === 'reports') {
      API.get('/principal/reports').then(res => setReports(res.data));
      API.get('/principal/feedback').then(res => {
        const grouped = {};
        res.data.forEach(f => {
          if (!grouped[f.report_id]) grouped[f.report_id] = [];
          grouped[f.report_id].push(f);
        });
        setFeedbacks(grouped);
      });
    }
    if (activeTab === 'courses') {
      API.get('/principal/courses').then(res => setCourses(res.data));
    }
    if (activeTab === 'monitoring') {
      API.get('/principal/monitoring').then(res => setMonitoring(res.data));
    }
    if (activeTab === 'rating') {
      API.get('/principal/ratings').then(res => setRatings(res.data));
    }
    if (activeTab === 'classes') {
      API.get('/principal/classes').then(res => setClassesData(res.data));
    }
  }, [activeTab]);

  const handleSubmitFeedback = reportId => {
    const text = newFeedback[reportId];
    if (!text) return;
    API.post('/principal/feedback', {
      report_id: reportId,
      feedback_text: text,
      submitted_by: user.name
    }).then(() => {
      setNewFeedback(prev => ({ ...prev, [reportId]: '' }));
      return API.get('/principal/feedback');
    }).then(res => {
      const grouped = {};
      res.data.forEach(f => {
        if (!grouped[f.report_id]) grouped[f.report_id] = [];
        grouped[f.report_id].push(f);
      });
      setFeedbacks(grouped);
    });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reports);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
    XLSX.writeFile(workbook, 'PrincipalReports.xlsx');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Principal Lecturer Dashboard</h3>
        <button className="btn btn-danger" onClick={logout}>Logout</button>
      </div>
      <p>Welcome, {user.name} ({user.role})</p>

      <div className="btn-group mb-4">
        {['reports','courses','monitoring','rating','classes'].map(tab => (
          <button key={tab} className={`btn btn-outline-primary ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <input
        type="text"
        className="form-control mb-3"
        placeholder={`Search ${activeTab}...`}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {/* Reports */}
      {activeTab === 'reports' && (
        <div>
          <button className="btn btn-outline-success mb-3" onClick={exportToExcel}>
            Download Excel
          </button>
          <h5>Submitted Teaching Reports</h5>
          {reports
            .filter(r =>
              r.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              r.lecturer_name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(r => (
              <div key={r.id} className="card mb-3">
                <div className="card-body">
                  <p><strong>Date:</strong> {new Date(r.date_of_lecture).toLocaleDateString()}</p>
                  <p><strong>Week:</strong> {r.week}</p>
                  <p><strong>Lecturer:</strong> {r.lecturer_name}</p>
                  <p><strong>Course:</strong> {r.course_name} ({r.course_code})</p>
                  <p><strong>Class:</strong> {r.class_name}</p>
                  <p><strong>Faculty:</strong> {r.faculty}</p>
                  <p><strong>Topic:</strong> {r.topic_taught}</p>
                  <p><strong>Outcomes:</strong> {r.learning_outcomes}</p>
                  <p><strong>Recs:</strong> {r.recommendations}</p>
                  <p><strong>Students:</strong> {r.actual_students_present}/{r.total_registered_students}</p>
                  <p><strong>Venue:</strong> {r.venue}</p>
                  <p><strong>Time:</strong> {r.scheduled_time}</p>

                  <div className="mt-3">
                    <h6>Feedback</h6>
                    {feedbacks[r.id]?.map(f => (
                      <div key={f.id} className="border p-2 mb-2 bg-light">
                        <p><strong>{f.submitted_by}:</strong> {f.feedback_text}</p>
                        <p className="text-muted" style={{ fontSize: '0.8em' }}>
                          {new Date(f.submitted_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                    <textarea
                      className="form-control mb-2"
                      rows="2"
                      placeholder="Add feedback..."
                      value={newFeedback[r.id] || ''}
                      onChange={e => setNewFeedback(prev => ({ ...prev, [r.id]: e.target.value }))}
                    />
                    <button className="btn btn-sm btn-primary" onClick={() => handleSubmitFeedback(r.id)}>
                      Submit Feedback
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Courses */}
      {activeTab === 'courses' && (
        <div>
          <h5>All Courses</h5>
          {courses
            .filter(c =>
              c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.code.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(c => (
              <div key={c.id} className="card mb-3">
                <div className="card-body">
                  <p><strong>Course:</strong> {c.name} ({c.code})</p>
                  <p><strong>Faculty:</strong> {c.faculty}</p>
                  <p><strong>Assigned To:</strong> {c.assigned_to || 'Not assigned'}</p>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Monitoring */}
      {activeTab === 'monitoring' && (
        <div>
          <h5>Monitoring Overview</h5>
          {monitoring
            .filter(m =>
              m.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              m.lecturer_email.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(m => (
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

      {/* Rating */}
      {activeTab === 'rating' && (
        <div>
          <h5>Feedback & Ratings</h5>
          {ratings
            .filter(r =>
              r.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              r.lecturer_email.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(r => (
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
{/* Classes */}
{activeTab === 'classes' && (
  <div>
    <h5>All Scheduled Classes</h5>
    {classesData
      .filter(cls =>
        cls.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.course_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.lecturer_email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(cls => (
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

</div>
);
};

export default PrincipalDashboard;
