// models/Credential.js
const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  site: String,
  username: String,
  password: String, // Encrypted string
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Credential', credentialSchema);
