import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'lecturer'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      alert('Registered successfully. You can now log in.');
    } catch (err) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleRegister} className="container mt-5">
      <h3>Register</h3>
      <input name="name" placeholder="Name" onChange={handleChange} className="form-control mb-2" required />
      <input name="email" placeholder="Email" onChange={handleChange} className="form-control mb-2" required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className="form-control mb-2" required />
      <select name="role" onChange={handleChange} className="form-control mb-2">
        <option value="lecturer">Lecturer</option>
        <option value="student">Student</option>
        <option value="prl">Principal Lecturer</option>
        <option value="pl">Program Leader</option>
      </select>
      <button className="btn btn-success">Register</button>
      <p className="mt-3">
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </form>
  );
};

export default Register;
