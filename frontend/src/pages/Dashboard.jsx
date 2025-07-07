import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CredentialForm from '../components/CredentialForm';
import EditCredentialModal from '../components/EditCredentialModal';

function Dashboard() {
  const token = localStorage.getItem('token');
  const [credentials, setCredentials] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const fetchCredentials = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/credentials`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCredentials(res.data);
    } catch (err) {
      console.error('Failed to fetch credentials:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API}/credentials/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCredentials();
    } catch {
      alert('Failed to delete');
    }
  };

  const handleUpdate = async (updatedCred) => {
    try {
      await axios.put(`${process.env.REACT_APP_API}/credentials/${updatedCred._id}`, updatedCred, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditing(null);
      fetchCredentials();
    } catch {
      alert('Failed to update');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  const filtered = credentials.filter(c =>
    c.site.toLowerCase().includes(search.toLowerCase()) ||
    c.tags.join(',').toLowerCase().includes(search.toLowerCase())
  );

  const containerStyle = {
    padding: '2rem',
    minHeight: '100vh',
    backgroundColor: darkMode ? '#1e1e1e' : '#f4f4f4',
    color: darkMode ? '#fff' : '#000'
  };

  const cardStyle = {
    backgroundColor: darkMode ? '#333' : '#fff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  };

  return (
    <div style={containerStyle}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2>🔐 Your Stored Credentials</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              backgroundColor: '#6c5ce7',
              color: '#fff',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button
            onClick={logout}
            style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search by site or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '0.5rem',
            width: '100%',
            maxWidth: '400px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={() => setSearch('')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#bdc3c7',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          🧼 Clear
        </button>
      </div>

      {/* ➕ Add credential form */}
<CredentialForm token={token} onAdd={fetchCredentials} darkMode={darkMode} />


      {filtered.length === 0 ? (
        <p>No matching credentials.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          {filtered.map(cred => (
            <div key={cred._id} style={cardStyle}>
              <h3>{cred.site}</h3>
              <p><strong>Username:</strong> {cred.username}</p>
              <p><strong>Password:</strong> {cred.password}</p>
              {cred.tags?.length > 0 && (
                <p><strong>Tags:</strong> {cred.tags.join(', ')}</p>
              )}
              <p style={{ fontSize: '0.8rem', color: darkMode ? '#aaa' : '#888' }}>
                🕒 {new Date(cred.createdAt).toLocaleString()}
              </p>

              {/* Buttons */}
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(cred.password);
                    setCopiedId(cred._id);
                    setTimeout(() => setCopiedId(null), 1500);
                  }}
                  style={{
                    backgroundColor: '#ecf0f1',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {copiedId === cred._id ? '✅ Copied!' : '📋 Copy'}
                </button>

                <button
                  onClick={() => setEditing(cred)}
                  style={{
                    backgroundColor: '#2980b9',
                    color: 'white',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => handleDelete(cred._id)}
                  style={{
                    backgroundColor: '#ff4d4d',
                    color: 'white',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <EditCredentialModal
          credential={editing}
          onClose={() => setEditing(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}

export default Dashboard;
