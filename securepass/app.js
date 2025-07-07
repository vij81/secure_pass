// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const credRoutes = require('./routes/credentials');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/credentials', credRoutes);

app.get('/', (req, res) => {
  res.send('SecurePass API is running');
});

module.exports = app;
