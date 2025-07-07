import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/auth/login`, {
        email,
        password
      });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>🔐 Login to SecurePass</h2>
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={styles.footer}>
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  heading: {
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.3s'
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  footer: {
    marginTop: '1rem',
    textAlign: 'center'
  }
};

export default Login;
