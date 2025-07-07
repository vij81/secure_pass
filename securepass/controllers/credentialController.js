// controllers/credentialController.js
const Credential = require('../models/Credential');
const { encrypt, decrypt } = require('../utils/encrypt');

// 🔐 Add a new credential
const addCredential = async (req, res) => {
  try {
    const { site, username, password, tags } = req.body;

    const encryptedPassword = encrypt(password);

    const newCred = await Credential.create({
      user: req.user.id,
      site,
      username,
      password: encryptedPassword,
      tags
    });

    res.status(201).json({ message: 'Credential saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add credential' });
  }
};

// // 📄 Get all credentials (decrypted)
// const getCredentials = async (req, res) => {
//   try {
//     const credentials = await Credential.find({ user: req.user.id });

//     const decryptedCredentials = credentials.map((cred) => ({
//       _id: cred._id,
//       site: cred.site,
//       username: cred.username,
//       password: decrypt(cred.password),
//       tags: cred.tags,
//       createdAt: cred.createdAt
//     }));

//     res.json(decryptedCredentials);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch credentials' });
//   }
// };
// 📄 Get all credentials (with optional sort)
const getCredentials = async (req, res) => {
  try {
    const sort = req.query.sort === 'latest' ? -1 : 1;

    const credentials = await Credential.find({ user: req.user.id }).sort({ createdAt: sort });

    const decryptedCredentials = credentials.map((cred) => ({
      _id: cred._id,
      site: cred.site,
      username: cred.username,
      password: decrypt(cred.password),
      tags: cred.tags,
      createdAt: cred.createdAt
    }));

    res.json(decryptedCredentials);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
};


// ❌ Delete a credential
const deleteCredential = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Credential.findOneAndDelete({
      _id: id,
      user: req.user.id
    });

    if (!deleted) return res.status(404).json({ message: 'Credential not found' });

    res.json({ message: 'Credential deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
};
// 🔍 Search credentials
const searchCredential = async (req, res) => {
  const { query } = req.query;

  try {
    const credentials = await Credential.find({
      user: req.user.id,
      $or: [
        { site: new RegExp(query, 'i') },
        { username: new RegExp(query, 'i') },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    });

    const decrypted = credentials.map((cred) => ({
      _id: cred._id,
      site: cred.site,
      username: cred.username,
      password: decrypt(cred.password),
      tags: cred.tags,
      createdAt: cred.createdAt
    }));

    res.json(decrypted);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
};
// ✏️ Update a credential
const updateCredential = async (req, res) => {
  try {
    const { site, username, password, tags } = req.body;
    const encryptedPassword = encrypt(password);

    const updated = await Credential.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { site, username, password: encryptedPassword, tags },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Credential not found' });

    res.json({ message: 'Updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update' });
  }
};

module.exports = {
  addCredential,
  getCredentials,
  deleteCredential,
  searchCredential,
  updateCredential
};

