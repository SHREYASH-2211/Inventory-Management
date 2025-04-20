import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../../utils';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

export default function Login() {
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError('All fields are compulsory');
    }

    try {
      const response = await fetch('http://192.168.252.193:8000/api/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();

      if (response.ok) {
        const { accessToken, user } = result;
        handleSuccess('Login successful!');
        localStorage.setItem('token', accessToken);
        localStorage.setItem('loggedInUser', user?.fullname || user?.username || user?.email);
        setTimeout(() => navigate('/home'), 1000);
      } else {
        handleError(result?.message || 'Login failed');
      }
    } catch (err) {
      handleError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex">
      <div className="col-md-6 d-flex flex-column justify-content-center align-items-center bg-white p-5">
        {/* <img src="media/images/logo.png" style={{ width: '40%' }} alt="Logo" /> */}

        <h6 className="text-muted">Welcome back</h6>
        <h3 className="fw-bold mb-4">Log In to StockWise</h3>

        <form className="w-100" style={{ maxWidth: '350px' }} onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">E-mail</label>
            <div className="input-group">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="example@email.com"
                value={loginInfo.email}
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
                placeholder="Enter your password"
                value={loginInfo.password}
                onChange={handleChange}
                required
              />
              <span className="input-group-text">
                <i className="fas fa-lock"></i>
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>

          <p className="mt-4 text-muted text-center">
            Don't have an account? <Link to="/signup" className="text-primary">Sign up</Link>
          </p>
        </form>
      </div>

      <div
        className="col-md-6 d-none d-md-block"
        style={{
          width: "50%",
          backgroundImage: 'url("./bg.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      <ToastContainer />
    </div>
  );
}
