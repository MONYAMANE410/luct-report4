import React from 'react';
import { useNavigate } from 'react-router-dom';


const Welcome = () => {
  const navigate = useNavigate();

  return (
   <div className="welcome-container">
  <h1>🎓 Welcome to LUCT Academic Reporting System</h1>
  <p>Empowering Principal Lecturers to monitor, rate, and report with ease.</p>
  <div className="welcome-buttons">
    <button onClick={() => navigate('/login')}>Login</button>
    <button onClick={() => navigate('/register')}>Register</button>
  </div>
  <footer>
    <small>Developed by Teboho | DIWA2110 Project</small>
  </footer>
</div>

  );
};

export default Welcome;
