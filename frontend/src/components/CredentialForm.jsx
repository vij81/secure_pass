import React, { useState } from 'react';
import axios from 'axios';

function CredentialForm({ token, onAdd, darkMode }) {
  const [site, setSite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API}/credentials`, {
        site,
        username,
        password,
        tags: tags.split(',').map(tag => tag.trim())
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onAdd(); // refresh credentials in parent
      setSite('');
      setUsername('');
      setPassword('');
      setTags('');
    } catch (err) {
      alert('Failed to add credential');
    }
  };

  const commonInputStyle = {
    padding: '0.5rem',
    marginBottom: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    width: '100%',
    backgroundColor: darkMode ? '#333' : '#fff',
    color: darkMode ? '#fff' : '#000'
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: darkMode ? '#222' : '#fff',
      color: darkMode ? '#fff' : '#000',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '2rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginBottom: '1rem' }}>Add New Credential</h3>

      <input
        style={commonInputStyle}
        placeholder="Site"
        value={site}
        onChange={e => setSite(e.target.value)}
        required
      />
      <input
        style={commonInputStyle}
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        style={commonInputStyle}
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <input
        style={commonInputStyle}
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={e => setTags(e.target.value)}
      />
      <button type="submit" style={{
        backgroundColor: darkMode ? '#1abc9c' : '#3498db',
        color: '#fff',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
      }}>
        Save
      </button>
    </form>
  );
}

export default CredentialForm;
