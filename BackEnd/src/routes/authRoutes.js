const express = require('express');
const { googleAuth, getCurrentUser, logout, getGoogleClientId, getAllUsers } = require('../controller/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/google-client-id', getGoogleClientId);
router.post('/google', googleAuth);
router.get('/me', authMiddleware, getCurrentUser);
router.post('/logout', logout);
router.get('/admin/all-users', authMiddleware.isAdmin, getAllUsers);

module.exports = router;
