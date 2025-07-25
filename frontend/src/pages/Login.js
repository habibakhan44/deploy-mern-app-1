import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from '../utils';

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError('All fields are required');
    }
     if (password.length < 5) {
            return handleError("Password should be more than 4 characters");
        }

    try {
      const url = "https://deploy-mern-app-1-api.vercel.app/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
      });
      const result = await response.json();
      const { success, message, name, jwtToken, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedUser', name);
        setTimeout(() => {
          navigate('/home');
        }, 1000);
        
      } else if (error) {
        const details = error?.details?.[0]?.message || error;
        handleError(details);
      }

    } catch (err) {
      handleError(err.message || "Something went wrong.");
    }
  };

  return (
    <div className='container'>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Enter your email..."
            value={loginInfo.email}
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter your password..."
            value={loginInfo.password}
          />
        </div>

        <button type="submit">Login</button>
        <span>Don't have an account?</span>
        <Link to="/signup">Signup</Link>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
