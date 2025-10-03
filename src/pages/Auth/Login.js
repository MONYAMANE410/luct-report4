import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });

      // ✅ Store user info in localStorage
      const { name, role, email: userEmail } = res.data;
      localStorage.setItem('user', JSON.stringify({ name, role, email: userEmail }));

      // ✅ Redirect based on role
      if (role === 'lecturer') navigate('/lecturer/dashboard');
      else if (role === 'student') navigate('/student/dashboard');
      else if (role === 'prl') navigate('/prl/dashboard');
      else if (role === 'pl') navigate('/pl/dashboard');
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleLogin} className="container mt-5">
      <h3>Login</h3>
      <input
        type="email"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
        className="form-control mb-2"
        required
      />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
        className="form-control mb-2"
        required
      />
      <button className="btn btn-primary">Login</button>
      <p className="mt-3">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </form>
  );
};

export default Login;
