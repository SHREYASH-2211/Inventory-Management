import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../../utils';
import 'react-toastify/dist/ReactToastify.css';

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    role: 'staff',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullname, username, email, password, role } = formData;

    if (!fullname || !username || !email || !password || !role) {
      return handleError('All fields are required');
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        handleSuccess('Registered successfully!');
        
        // Store refreshToken in localStorage (or HttpOnly cookie in production)
        if (result.refreshToken) {
          localStorage.setItem('refreshToken', result.refreshToken);
        }

        // You can also store user info if needed
        localStorage.setItem('user', JSON.stringify(result.user));

        setTimeout(() => navigate('/login'), 1500);
      } else {
        handleError(result?.message || 'Registration failed');
      }
    } catch (err) {
      handleError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex">
      <div className="col-md-6 d-flex flex-column justify-content-center align-items-center bg-white p-5">
        <img src="media/images/logo.png" style={{ width: '40%' }} alt="Logo" />

        <h6 className="text-muted">Start your journey</h6>
        <h3 className="fw-bold mb-4">Sign Up to InsideBox</h3>

        <form className="w-100" style={{ maxWidth: '350px' }} onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullname"
              className="form-control"
              placeholder="John Doe"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="john123"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">E-mail</label>
            <div className="input-group">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <span className="input-group-text">
                <i className="fas fa-envelope"></i>
              </span>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="input-group-text">
                <i className="fas fa-lock"></i>
              </span>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">Sign Up</button>

          <div className="text-center text-muted mb-2">or sign up with</div>

          <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-outline-secondary" type="button">
              <i className="fab fa-facebook-f"></i>
            </button>
            <button className="btn btn-outline-secondary" type="button">
              <i className="fab fa-google"></i>
            </button>
            <button className="btn btn-outline-secondary" type="button">
              <i className="fab fa-apple"></i>
            </button>
          </div>
        </form>

        <p className="mt-4 text-muted">
          Have an account? <Link to="/login" className="text-primary">Sign in</Link>
        </p>
      </div>

      <div
        className="col-md-6 d-none d-md-block"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1554913660-fc17f5227a6b?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJsdWUlMjBwYWludGluZ3xlbnwwfHwwfHx8MA==")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      <ToastContainer />
    </div>
  );
};

export default SignupPage;
