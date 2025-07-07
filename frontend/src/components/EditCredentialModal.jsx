import React, { useState } from 'react';

function EditCredentialModal({ credential, onClose, onSave }) {
  const [site, setSite] = useState(credential.site);
  const [username, setUsername] = useState(credential.username);
  const [password, setPassword] = useState(credential.password);
  const [tags, setTags] = useState(credential.tags.join(', '));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...credential,
      site,
      username,
      password,
      tags: tags.split(',').map(t => t.trim())
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Edit Credential</h3>
        <form onSubmit={handleSubmit}>
          <input style={styles.input} value={site} onChange={e => setSite(e.target.value)} />
          <input style={styles.input} value={username} onChange={e => setUsername(e.target.value)} />
          <input style={styles.input} value={password} onChange={e => setPassword(e.target.value)} />
          <input style={styles.input} value={tags} onChange={e => setTags(e.target.value)} />
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <button type="button" onClick={onClose} style={styles.cancel}>Cancel</button>
            <button type="submit" style={styles.save}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  modal: {
    background: '#fff', padding: '1.5rem', borderRadius: '10px', width: '90%', maxWidth: '400px'
  },
  input: {
    width: '100%', marginBottom: '1rem', padding: '10px', borderRadius: '6px', border: '1px solid #ccc'
  },
  cancel: {
    marginRight: '1rem', padding: '8px 12px', backgroundColor: '#ccc', border: 'none', borderRadius: '5px'
  },
  save: {
    padding: '8px 12px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '5px'
  }
};

export default EditCredentialModal;
