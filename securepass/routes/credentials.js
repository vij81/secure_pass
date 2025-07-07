// routes/credentials.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  addCredential,
  getCredentials,
  deleteCredential,
  searchCredential,
  updateCredential
} = require('../controllers/credentialController');

// Search route
router.get('/search', auth, searchCredential);

// Update route
router.put('/:id', auth, updateCredential);

// Protected routes
router.post('/', auth, addCredential);
router.get('/', auth, getCredentials);
router.delete('/:id', auth, deleteCredential);

module.exports = router;
